import { drizzle } from "drizzle-orm/mysql2";
import { lessons, privacyTips, helpCenters } from "./drizzle/schema.js";

const db = drizzle(process.env.DATABASE_URL);

const seedLessons = [
  {
    titleEn: "Protecting Your Personal Information",
    titleSw: "Kulinda Taarifa Zako Binafsi",
    contentEn: "Never share your passwords, ID numbers, or bank details with strangers online. Keep your personal information private to stay safe.",
    contentSw: "Usitoe nywila zako, nambari za kitambulisho, au maelezo ya benki kwa wageni mtandaoni. Weka taarifa zako binafsi kuwa za faragha ili ukae salama.",
    illustrationUrl: null,
    audioUrlEn: null,
    audioUrlSw: null,
    videoUrl: null,
    orderIndex: 1,
  },
  {
    titleEn: "Recognizing Online Scams",
    titleSw: "Kutambua Ulaghai Mtandaoni",
    contentEn: "Be careful of messages asking for money or promising easy money. If something sounds too good to be true, it probably is a scam.",
    contentSw: "Kuwa mwangalifu na ujumbe unaoitisha fedha au kuahidi fedha rahisi. Kama kitu kinaonekana kizuri sana, labda ni ulaghai.",
    illustrationUrl: null,
    audioUrlEn: null,
    audioUrlSw: null,
    videoUrl: null,
    orderIndex: 2,
  },
  {
    titleEn: "Safe Social Media Use",
    titleSw: "Matumizi Salama ya Mitandao ya Kijamii",
    contentEn: "Think before you post. Don't share your location, home address, or daily routine. Set your accounts to private and only accept friend requests from people you know.",
    contentSw: "Fikiria kabla ya kuchapisha. Usitoe eneo lako, anwani ya nyumbani, au ratiba yako ya kila siku. Weka akaunti zako kuwa za faragha na ukubali maombi ya urafiki kutoka kwa watu unaowajua tu.",
    illustrationUrl: null,
    audioUrlEn: null,
    audioUrlSw: null,
    videoUrl: null,
    orderIndex: 3,
  },
  {
    titleEn: "Cyberbullying and Harassment",
    titleSw: "Uonevu na Unyanyasaji Mtandaoni",
    contentEn: "If someone is bullying or harassing you online, don't respond. Block them, save evidence (screenshots), and report to trusted adults or authorities.",
    contentSw: "Kama mtu anakuonea au kukusumbua mtandaoni, usijibu. Mzuie, hifadhi ushahidi (picha za skrini), na ripoti kwa watu wazima unaoamini au mamlaka.",
    illustrationUrl: null,
    audioUrlEn: null,
    audioUrlSw: null,
    videoUrl: null,
    orderIndex: 4,
  },
  {
    titleEn: "Creating Strong Passwords",
    titleSw: "Kuunda Nywila Imara",
    contentEn: "Use long passwords with letters, numbers, and symbols. Don't use the same password everywhere. Consider using a password manager.",
    contentSw: "Tumia nywila ndefu zenye herufi, nambari, na alama. Usitumie nywila moja kila mahali. Fikiria kutumia kidhibiti cha nywila.",
    illustrationUrl: null,
    audioUrlEn: null,
    audioUrlSw: null,
    videoUrl: null,
    orderIndex: 5,
  },
];

const seedPrivacyTips = [
  {
    titleEn: "Lock Your Phone",
    titleSw: "Funga Simu Yako",
    contentEn: "Always use a PIN, pattern, or fingerprint to lock your phone. This protects your information if your phone is lost or stolen.",
    contentSw: "Daima tumia PIN, mchoro, au alama ya kidole kufunga simu yako. Hii inalinda taarifa zako ikiwa simu yako imepotea au kuibiwa.",
    icon: "🔒",
    orderIndex: 1,
  },
  {
    titleEn: "Update Your Apps",
    titleSw: "Sasisha Programu Zako",
    contentEn: "Keep your apps and phone software updated. Updates often include important security fixes.",
    contentSw: "Weka programu zako na programu ya simu kuwa za kisasa. Masasisho mara nyingi yanajumuisha marekebisho muhimu ya usalama.",
    icon: "🔄",
    orderIndex: 2,
  },
  {
    titleEn: "Check App Permissions",
    titleSw: "Angalia Ruhusa za Programu",
    contentEn: "Review what information apps can access. Don't give apps access to your camera, microphone, or location unless necessary.",
    contentSw: "Kagua taarifa gani programu zinaweza kufikia. Usipe programu ufikiaji wa kamera, maikrofoni, au eneo lako isipokuwa ni lazima.",
    icon: "⚙️",
    orderIndex: 3,
  },
  {
    titleEn: "Be Careful with Public WiFi",
    titleSw: "Kuwa Mwangalifu na WiFi ya Umma",
    contentEn: "Avoid accessing sensitive information (banking, passwords) when using public WiFi. Use mobile data for important tasks.",
    contentSw: "Epuka kufikia taarifa nyeti (benki, nywila) unapotumia WiFi ya umma. Tumia data ya simu kwa kazi muhimu.",
    icon: "📶",
    orderIndex: 4,
  },
  {
    titleEn: "Think Before You Click",
    titleSw: "Fikiria Kabla Ya Kubofya",
    contentEn: "Don't click on suspicious links in messages or emails. They might be phishing attempts to steal your information.",
    contentSw: "Usibofye viungo vya mashaka katika ujumbe au barua pepe. Vinaweza kuwa majaribio ya uvuvi wa kuiba taarifa zako.",
    icon: "⚠️",
    orderIndex: 5,
  },
  {
    titleEn: "Use Two-Factor Authentication",
    titleSw: "Tumia Uthibitishaji wa Hatua Mbili",
    contentEn: "Enable two-factor authentication on important accounts. This adds an extra layer of security.",
    contentSw: "Wezesha uthibitishaji wa hatua mbili kwenye akaunti muhimu. Hii inaongeza safu ya ziada ya usalama.",
    icon: "🛡️",
    orderIndex: 6,
  },
  {
    titleEn: "Backup Your Data",
    titleSw: "Hifadhi Nakala ya Data Yako",
    contentEn: "Regularly backup important photos and files. Use cloud storage or external drives.",
    contentSw: "Hifadhi nakala ya picha na faili muhimu mara kwa mara. Tumia hifadhi ya wingu au diski za nje.",
    icon: "💾",
    orderIndex: 7,
  },
];

const seedHelpCenters = [
  {
    nameEn: "Gender Violence Recovery Centre",
    nameSw: "Kituo cha Uponyaji wa Unyanyasaji wa Kijinsia",
    descriptionEn: "24/7 support for survivors of gender-based violence. Free counseling and medical services.",
    descriptionSw: "Msaada wa masaa 24/7 kwa walionusurika na unyanyasaji wa kijinsia. Ushauri na huduma za matibabu bila malipo.",
    latitude: "-1.2921",
    longitude: "36.8219",
    address: "Nairobi, Kenya",
    phone: "+254 709 400 200",
    email: "info@gvrc.or.ke",
    website: "https://gvrc.or.ke",
    type: "support_center",
  },
  {
    nameEn: "Coalition on Violence Against Women (COVAW)",
    nameSw: "Muungano wa Kupambana na Unyanyasaji wa Wanawake",
    descriptionEn: "Legal aid, counseling, and shelter for women and girls affected by violence.",
    descriptionSw: "Msaada wa kisheria, ushauri, na makazi kwa wanawake na wasichana walioathiriwa na unyanyasaji.",
    latitude: "-1.2864",
    longitude: "36.8172",
    address: "Nairobi, Kenya",
    phone: "+254 20 271 6690",
    email: "info@covaw.or.ke",
    website: "https://covaw.or.ke",
    type: "ngo",
  },
  {
    nameEn: "Childline Kenya",
    nameSw: "Childline Kenya",
    descriptionEn: "Free 24-hour helpline for children in distress. Call 116 for immediate help.",
    descriptionSw: "Simu ya msaada bila malipo ya masaa 24 kwa watoto walio hatarini. Piga 116 kwa msaada wa haraka.",
    latitude: "-1.2921",
    longitude: "36.8219",
    address: "Nairobi, Kenya",
    phone: "116",
    email: "info@childlinekenya.co.ke",
    website: "https://childlinekenya.co.ke",
    type: "hotline",
  },
  {
    nameEn: "FIDA Kenya (Federation of Women Lawyers)",
    nameSw: "FIDA Kenya (Shirikisho la Wanawake Wanasheria)",
    descriptionEn: "Free legal aid for women and children. Advocacy for women's rights.",
    descriptionSw: "Msaada wa kisheria bila malipo kwa wanawake na watoto. Utetezi wa haki za wanawake.",
    latitude: "-1.2864",
    longitude: "36.8172",
    address: "Nairobi, Kenya",
    phone: "+254 20 387 2194",
    email: "fida@fidakenya.org",
    website: "https://fidakenya.org",
    type: "ngo",
  },
  {
    nameEn: "Safe House for Women and Children",
    nameSw: "Nyumba Salama kwa Wanawake na Watoto",
    descriptionEn: "Emergency shelter for women and children escaping violence. Confidential location.",
    descriptionSw: "Makazi ya dharura kwa wanawake na watoto wanaokimbia unyanyasaji. Eneo la siri.",
    latitude: "-1.3028",
    longitude: "36.7073",
    address: "Nairobi, Kenya (Confidential)",
    phone: "+254 722 000 000",
    email: "safehouse@example.org",
    website: null,
    type: "shelter",
  },
];

async function seed() {
  console.log("Seeding lessons...");
  await db.insert(lessons).values(seedLessons);
  console.log(`✓ Inserted ${seedLessons.length} lessons`);

  console.log("Seeding privacy tips...");
  await db.insert(privacyTips).values(seedPrivacyTips);
  console.log(`✓ Inserted ${seedPrivacyTips.length} privacy tips`);

  console.log("Seeding help centers...");
  await db.insert(helpCenters).values(seedHelpCenters);
  console.log(`✓ Inserted ${seedHelpCenters.length} help centers`);

  console.log("✓ Seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
