import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Link } from "wouter";
import { ArrowLeft, Mic, MicOff, Loader2, Heart, ThumbsUp, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Stories() {
  const { language, t } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [showForm, setShowForm] = useState(false);
  const [content, setContent] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const { data: stories, isLoading, refetch } = trpc.stories.getAll.useQuery();
  const createStoryMutation = trpc.stories.create.useMutation({
    onSuccess: () => {
      refetch();
      setShowForm(false);
      setContent("");
      setAudioBlob(null);
      setIsAnonymous(false);
    },
  });
  const addReactionMutation = trpc.stories.addReaction.useMutation({
    onSuccess: () => {
      refetch();
    },
  });
  const uploadMutation = trpc.upload.uploadFile.useMutation();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: Blob[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/webm" });
        setAudioBlob(blob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      toast.error(t("Microphone access denied", "Ufikiaji wa maikrofoni umekataliwa"));
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!content.trim() && !audioBlob) {
      toast.error(t("Please write or record your story", "Tafadhali andika au rekodi hadithi yako"));
      return;
    }

    try {
      let audioUrl: string | undefined;

      if (audioBlob) {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        await new Promise((resolve) => {
          reader.onloadend = resolve;
        });
        const base64 = (reader.result as string).split(",")[1];
        
        const uploadResult = await uploadMutation.mutateAsync({
          fileName: `story-audio-${Date.now()}.webm`,
          fileData: base64,
          mimeType: "audio/webm",
        });
        audioUrl = uploadResult.url;
      }

      await createStoryMutation.mutateAsync({
        content: content.trim() || t("Audio story", "Hadithi ya sauti"),
        audioUrl,
        language,
        isAnonymous,
      });

      toast.success(t("Story shared successfully", "Hadithi imeshirikiwa"));
    } catch (error) {
      toast.error(t("Failed to share story", "Imeshindwa kushiriki hadithi"));
    }
  };

  const handleReaction = async (storyId: number, emoji: string) => {
    try {
      await addReactionMutation.mutateAsync({ storyId, emoji });
    } catch (error) {
      toast.error(t("Failed to add reaction", "Imeshindwa kuongeza mwitikio"));
    }
  };

  const emojiReactions = ["❤️", "👍", "✨", "💪", "🙏"];

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b-2 border-border shadow-sm">
          <div className="mobile-container py-4">
            <Link href="/">
              <Button variant="ghost" size="sm" className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                {t("Back", "Rudi")}
              </Button>
            </Link>
          </div>
        </header>
        <main className="mobile-container py-8">
          <Card className="friendly-card text-center">
            <h2 className="text-xl font-bold mb-4">
              {t("Login Required", "Inabidi Uingie")}
            </h2>
            <p className="mb-4 text-muted-foreground">
              {t(
                "Please log in to read and share community stories",
                "Tafadhali ingia kusoma na kushiriki hadithi za jamii"
              )}
            </p>
            <a href={getLoginUrl()}>
              <Button>{t("Log In", "Ingia")}</Button>
            </a>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b-2 border-border shadow-sm">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4" />
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold">🗣 {t("Community Stories", "Hadithi za Jamii")}</h1>
                <p className="text-xs text-muted-foreground">
                  {t("Share and inspire", "Shiriki na hamasisha")}
                </p>
              </div>
            </div>
            <Button onClick={() => setShowForm(!showForm)} size="sm">
              {showForm ? t("Cancel", "Ghairi") : t("Share Story", "Shiriki Hadithi")}
            </Button>
          </div>
        </div>
      </header>

      <main className="mobile-container py-8">
        {/* Share Story Form */}
        {showForm && (
          <Card className="friendly-card mb-6 bg-gradient-to-br from-accent/10 to-primary/10">
            <h3 className="text-lg font-bold mb-4">
              {t("Share Your Story", "Shiriki Hadithi Yako")}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="content">
                  {t("Your Story", "Hadithi Yako")}
                </Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={t(
                    "Share your experience, what you learned, or how you overcame a challenge...",
                    "Shiriki uzoefu wako, ulichojifunza, au jinsi ulivyoshinda changamoto..."
                  )}
                  rows={5}
                />
              </div>

              {/* Audio Recording */}
              <div>
                <Label>{t("Or Record Audio Story", "Au Rekodi Hadithi ya Sauti")}</Label>
                <div className="flex gap-2 mt-2">
                  <Button
                    type="button"
                    variant={isRecording ? "destructive" : "secondary"}
                    onClick={isRecording ? stopRecording : startRecording}
                    className="gap-2"
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                    {isRecording
                      ? t("Stop Recording", "Acha Kurekodi")
                      : t("Record Audio", "Rekodi Sauti")}
                  </Button>
                  {audioBlob && (
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setAudioBlob(null)}
                    >
                      {t("Clear", "Futa")}
                    </Button>
                  )}
                </div>
                {audioBlob && (
                  <audio controls className="mt-2 w-full">
                    <source src={URL.createObjectURL(audioBlob)} type="audio/webm" />
                  </audio>
                )}
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={isAnonymous}
                  onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
                />
                <Label htmlFor="anonymous" className="cursor-pointer">
                  {t("Share anonymously", "Shiriki bila kutambulika")}
                </Label>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={createStoryMutation.isPending || uploadMutation.isPending}
              >
                {createStoryMutation.isPending || uploadMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {t("Sharing...", "Inashiriki...")}
                  </>
                ) : (
                  t("Share Story", "Shiriki Hadithi")
                )}
              </Button>
            </form>
          </Card>
        )}

        {/* Stories Feed */}
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : stories && stories.length > 0 ? (
          <div className="space-y-4">
            {stories.map((story) => {
              const reactions = story.reactions ? JSON.parse(story.reactions) : {};
              return (
                <Card key={story.id} className="p-5">
                  <div className="mb-3">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                        <span className="text-xl">👤</span>
                      </div>
                      <div>
                        <p className="font-semibold text-sm">
                          {story.isAnonymous
                            ? t("Anonymous", "Asiyejulikana")
                            : t("Community Member", "Mwanachama wa Jamii")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(story.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm leading-relaxed mb-3 whitespace-pre-wrap">
                    {story.content}
                  </p>

                  {story.audioUrl && (
                    <audio controls className="w-full mb-3">
                      <source src={story.audioUrl} type="audio/webm" />
                    </audio>
                  )}

                  {/* Emoji Reactions */}
                  <div className="flex gap-2 flex-wrap">
                    {emojiReactions.map((emoji) => (
                      <Button
                        key={emoji}
                        variant="outline"
                        size="sm"
                        onClick={() => handleReaction(story.id, emoji)}
                        className="gap-1"
                      >
                        <span className="text-lg">{emoji}</span>
                        {reactions[emoji] && (
                          <span className="text-xs">{reactions[emoji]}</span>
                        )}
                      </Button>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="friendly-card text-center py-12">
            <div className="text-6xl mb-4">📖</div>
            <h3 className="text-xl font-bold mb-2">
              {t("No Stories Yet", "Hakuna Hadithi Bado")}
            </h3>
            <p className="text-muted-foreground mb-4">
              {t(
                "Be the first to share your story and inspire others!",
                "Kuwa wa kwanza kushiriki hadithi yako na kuhamasisha wengine!"
              )}
            </p>
            <Button onClick={() => setShowForm(true)}>
              {t("Share Your Story", "Shiriki Hadithi Yako")}
            </Button>
          </Card>
        )}
      </main>
    </div>
  );
}
