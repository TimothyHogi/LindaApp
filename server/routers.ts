import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import * as db from "./db";
import { invokeLLM } from "./_core/llm";
import { transcribeAudio } from "./_core/voiceTranscription";
import { storagePut } from "./storage";

export const appRouter = router({
  system: systemRouter,
  
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    updateLanguage: protectedProcedure
      .input(z.object({ language: z.enum(["en", "sw"]) }))
      .mutation(async ({ ctx, input }) => {
        await db.updateUserLanguage(ctx.user.id, input.language);
        return { success: true };
      }),
  }),

  chat: router({
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      return db.getChatHistory(ctx.user.id);
    }),
    
    sendMessage: protectedProcedure
      .input(z.object({
        content: z.string(),
        language: z.enum(["en", "sw"]),
        audioUrl: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        // Save user message
        await db.addChatMessage({
          userId: ctx.user.id,
          role: "user",
          content: input.content,
          language: input.language,
          audioUrl: input.audioUrl,
        });

        // Get AI response
        const systemPrompt = input.language === "en" 
          ? "You are Linda, a helpful digital safety assistant for women and girls in Kenya. Provide clear, supportive advice on digital safety, online privacy, and cybersecurity. Keep responses concise and actionable. If someone reports abuse or danger, encourage them to use the Report Abuse feature or contact local authorities."
          : "Wewe ni Linda, msaidizi wa usalama wa kidijitali kwa wanawake na wasichana nchini Kenya. Toa ushauri wazi na wa kusaidia kuhusu usalama wa kidijitali, faragha mtandaoni, na usalama wa mtandao. Weka majibu kuwa mafupi na ya vitendo. Ikiwa mtu anaripoti unyanyasaji au hatari, wahimize kutumia kipengele cha Ripoti Unyanyasaji au kuwasiliana na mamlaka za ndani.";

        const response = await invokeLLM({
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: input.content },
          ],
        });

        const content = response.choices[0].message.content;
        const assistantMessage = typeof content === 'string' ? content : "I'm sorry, I couldn't process that.";

        // Save assistant response
        await db.addChatMessage({
          userId: ctx.user.id,
          role: "assistant",
          content: assistantMessage,
          language: input.language,
        });

        return { message: assistantMessage };
      }),
    
    transcribeAudio: protectedProcedure
      .input(z.object({
        audioUrl: z.string(),
        language: z.enum(["en", "sw"]),
      }))
      .mutation(async ({ input }) => {
        const result = await transcribeAudio({
          audioUrl: input.audioUrl,
          language: input.language,
        });
        if ('text' in result) {
          return { text: result.text };
        }
        throw new Error(result.error || 'Transcription failed');
      }),
  }),

  reports: router({
    create: protectedProcedure
      .input(z.object({
        abuseType: z.string(),
        description: z.string(),
        audioUrl: z.string().optional(),
        photoUrl: z.string().optional(),
        latitude: z.string().optional(),
        longitude: z.string().optional(),
        isAnonymous: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createReport({
          userId: input.isAnonymous ? null : ctx.user.id,
          abuseType: input.abuseType,
          description: input.description,
          audioUrl: input.audioUrl,
          photoUrl: input.photoUrl,
          latitude: input.latitude,
          longitude: input.longitude,
          isAnonymous: input.isAnonymous,
        });
        return { success: true };
      }),
    
    getMyReports: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserReports(ctx.user.id);
    }),
    
    getAll: protectedProcedure.query(async ({ ctx }) => {
      // Only admins can see all reports
      if (ctx.user.role !== "admin") {
        return db.getUserReports(ctx.user.id);
      }
      return db.getAllReports();
    }),
  }),

  lessons: router({
    getAll: publicProcedure.query(async () => {
      return db.getAllLessons();
    }),
    
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return db.getLessonById(input.id);
      }),
    
    getProgress: protectedProcedure.query(async ({ ctx }) => {
      return db.getUserProgress(ctx.user.id);
    }),
    
    markComplete: protectedProcedure
      .input(z.object({ lessonId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await db.markLessonComplete(ctx.user.id, input.lessonId);
        return { success: true };
      }),
  }),

  tips: router({
    getAll: publicProcedure.query(async () => {
      return db.getAllPrivacyTips();
    }),
  }),

  stories: router({
    getAll: publicProcedure.query(async () => {
      return db.getAllStories();
    }),
    
    create: protectedProcedure
      .input(z.object({
        content: z.string(),
        audioUrl: z.string().optional(),
        language: z.enum(["en", "sw"]),
        isAnonymous: z.boolean().default(false),
      }))
      .mutation(async ({ ctx, input }) => {
        await db.createStory({
          userId: input.isAnonymous ? null : ctx.user.id,
          content: input.content,
          audioUrl: input.audioUrl,
          language: input.language,
          isAnonymous: input.isAnonymous,
          reactions: JSON.stringify({}),
        });
        return { success: true };
      }),
    
    addReaction: protectedProcedure
      .input(z.object({
        storyId: z.number(),
        emoji: z.string(),
      }))
      .mutation(async ({ input }) => {
        const stories = await db.getAllStories();
        const story = stories.find(s => s.id === input.storyId);
        if (!story) throw new Error("Story not found");
        
        const reactions = story.reactions ? JSON.parse(story.reactions) : {};
        reactions[input.emoji] = (reactions[input.emoji] || 0) + 1;
        
        await db.updateStoryReactions(input.storyId, JSON.stringify(reactions));
        return { success: true };
      }),
  }),

  helpCenters: router({
    getAll: publicProcedure.query(async () => {
      return db.getAllHelpCenters();
    }),
  }),

  upload: router({
    uploadFile: protectedProcedure
      .input(z.object({
        fileName: z.string(),
        fileData: z.string(), // base64 encoded
        mimeType: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const buffer = Buffer.from(input.fileData, 'base64');
        const randomSuffix = Math.random().toString(36).substring(7);
        const fileKey = `${ctx.user.id}-uploads/${input.fileName}-${randomSuffix}`;
        
        const { url } = await storagePut(fileKey, buffer, input.mimeType);
        return { url };
      }),
  }),
});

export type AppRouter = typeof appRouter;
