import { drizzle } from "drizzle-orm/mysql2";
import { stories } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const seedStories = [
  // Story 1 - English
  {
    userId: null,
    content: "I was being harassed by someone online who kept sending me threatening messages. I didn't know what to do until I found this app. I reported it and got connected with FIDA Kenya. They helped me file a police report and the harassment stopped. Thank you Linda App!",
    audioUrl: null,
    language: "en",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 15, "💪": 8, "🙏": 12 }),
  },
  // Story 1 - Kiswahili
  {
    userId: null,
    content: "Nilikuwa nikisumbuliwa na mtu mtandaoni ambaye aliendelea kunitumia ujumbe wa vitisho. Sikujua la kufanya hadi nikaona programu hii. Niliripoti na nikapata msaada kutoka FIDA Kenya. Walinisaidia kufungua ripoti ya polisi na usumbufu ukaisha. Asante Linda App!",
    audioUrl: null,
    language: "sw",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 15, "💪": 8, "🙏": 12 }),
  },
  // Story 2 - English
  {
    userId: null,
    content: "As a domestic worker, I didn't know I had rights. My employer took my phone and wouldn't let me leave the house on my days off. Through the Learning Corner, I learned about KUDHEIHA and contacted them. They helped me get my wages and find a better employer who respects me.",
    audioUrl: null,
    language: "en",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 22, "💪": 18, "🙏": 15 }),
  },
  // Story 2 - Kiswahili
  {
    userId: null,
    content: "Kama mfanyakazi wa nyumbani, sikujua nina haki. Mwajiri wangu alichukua simu yangu na hangeruhusu niondoke nyumbani siku zangu za mapumziko. Kupitia Kona ya Kujifunza, nilijifunza kuhusu KUDHEIHA na nikawasiliana nao. Walinisaidia kupata mshahara wangu na kupata mwajiri mzuri anayeniheshimu.",
    audioUrl: null,
    language: "sw",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 22, "💪": 18, "🙏": 15 }),
  },
  // Story 3 - English
  {
    userId: null,
    content: "Someone I met on a dating app was pressuring me to send intimate photos. I felt scared and confused. The lesson on safe online dating helped me understand this was wrong. I blocked him and reported his account. Now I know the warning signs to watch for.",
    audioUrl: null,
    language: "en",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 19, "💪": 14, "🙏": 10 }),
  },
  // Story 3 - Kiswahili
  {
    userId: null,
    content: "Mtu niliyemkutana naye kwenye programu ya kupatana alinilazimisha nitume picha za karibu. Nilihisi hofu na kuchanganyikiwa. Somo la kupatana mtandaoni kwa usalama lilinisaidia kuelewa hili lilikuwa vibaya. Nilimzuia na kuripoti akaunti yake. Sasa ninajua dalili za tahadhari za kuangalia.",
    audioUrl: null,
    language: "sw",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 19, "💪": 14, "🙏": 10 }),
  },
  // Story 4 - English
  {
    userId: null,
    content: "I almost fell for a job scam that promised me easy money working from home. They asked for my ID and bank details upfront. Thanks to the lesson on recognizing scams, I realized it was fake and didn't lose my money. This app saved me!",
    audioUrl: null,
    language: "en",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 17, "💪": 11, "🙏": 13 }),
  },
  // Story 4 - Kiswahili
  {
    userId: null,
    content: "Nilikaribia kuangukia ulaghai wa kazi ulioahidi fedha rahisi kufanya kazi kutoka nyumbani. Waliomba kitambulisho changu na maelezo ya benki mapema. Shukrani kwa somo la kutambua ulaghai, niligundua ilikuwa uwongo na sikupoteza fedha zangu. Programu hii iliniokolea!",
    audioUrl: null,
    language: "sw",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 17, "💪": 11, "🙏": 13 }),
  },
  // Story 5 - English
  {
    userId: null,
    content: "My ex-boyfriend threatened to share my private photos online after we broke up. I was terrified and didn't know where to turn. The app taught me this is illegal and helped me contact the police. They took action and he was arrested. I'm sharing my story so others know they're not alone.",
    audioUrl: null,
    language: "en",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 28, "💪": 24, "🙏": 20 }),
  },
  // Story 5 - Kiswahili
  {
    userId: null,
    content: "Mpenzi wangu wa zamani alitishia kushiriki picha zangu za faragha mtandaoni baada ya kuachana. Niliogopa sana na sikujua pa kwenda. Programu ilinifundisha hii ni kinyume cha sheria na ilinisaidia kuwasiliana na polisi. Walichukua hatua na alikamatwa. Ninashiriki hadithi yangu ili wengine wajue hawako peke yao.",
    audioUrl: null,
    language: "sw",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 28, "💪": 24, "🙏": 20 }),
  },
  // Story 6 - English
  {
    userId: null,
    content: "I'm a mother of two girls. I was worried about their safety online but didn't know how to protect them. The lesson on protecting children on social media gave me practical steps. I set up parental controls and now we talk openly about what they see online. Thank you for this resource!",
    audioUrl: null,
    language: "en",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 25, "💪": 16, "🙏": 19 }),
  },
  // Story 6 - Kiswahili
  {
    userId: null,
    content: "Mimi ni mama wa wasichana wawili. Niliwa na wasiwasi kuhusu usalama wao mtandaoni lakini sikujua jinsi ya kuwalinda. Somo la kulinda watoto kwenye mitandao ya kijamii lilinipa hatua za vitendo. Niliweka udhibiti wa wazazi na sasa tunazungumza wazi kuhusu wanachokiona mtandaoni. Asante kwa rasilimali hii!",
    audioUrl: null,
    language: "sw",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 25, "💪": 16, "🙏": 19 }),
  },
  // Story 7 - English
  {
    userId: null,
    content: "I was being cyberbullied by people from my school. They created fake accounts to harass me and spread rumors. I felt so alone until I found the Community Stories here. Reading others' experiences gave me courage to report it. The bullying stopped and I'm healing now.",
    audioUrl: null,
    language: "en",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 21, "💪": 17, "🙏": 14 }),
  },
  // Story 7 - Kiswahili
  {
    userId: null,
    content: "Nilikuwa nikionywa mtandaoni na watu kutoka shule yangu. Waliunda akaunti za uwongo kunisumbua na kueneza uvumi. Nilihisi peke yangu sana hadi nikaona Hadithi za Jamii hapa. Kusoma uzoefu wa wengine kulinipa ujasiri wa kuripoti. Uonevu ukaisha na sasa ninaporejea.",
    audioUrl: null,
    language: "sw",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 21, "💪": 17, "🙏": 14 }),
  },
  // Story 8 - English
  {
    userId: null,
    content: "Working as a house help, my employer monitored all my messages and accused me of stealing when I asked for my salary. I felt trapped. The app connected me with help centers nearby. I got legal support and my unpaid wages. Now I work for a family that treats me with dignity.",
    audioUrl: null,
    language: "en",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 23, "💪": 20, "🙏": 17 }),
  },
  // Story 8 - Kiswahili
  {
    userId: null,
    content: "Kufanya kazi kama msaidizi wa nyumbani, mwajiri wangu alifuatilia ujumbe wangu wote na kunishitaki kuiba nilipomuuliza mshahara wangu. Nilihisi nimekwama. Programu iliniunganisha na vituo vya msaada karibu. Nilipata msaada wa kisheria na mishahara yangu isiyolipwa. Sasa ninafanyia kazi familia inayoniheshimu.",
    audioUrl: null,
    language: "sw",
    isAnonymous: true,
    reactions: JSON.stringify({ "❤️": 23, "💪": 20, "🙏": 17 }),
  },
];

async function seedDatabase() {
  try {
    console.log("Seeding community stories...");
    
    await db.insert(stories).values(seedStories);
    
    console.log(`✓ Inserted ${seedStories.length} community stories`);
    console.log("✓ Story seeding complete!");
    
    process.exit(0);
  } catch (error) {
    console.error("Error seeding stories:", error);
    process.exit(1);
  }
}

seedDatabase();
