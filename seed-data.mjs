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
    contentEn: "Be careful of messages asking for money or promising easy money. Common scams include fake job offers, lottery wins, and investment schemes. Always verify before sending money. If someone claims to be from a bank or government, call them directly using official numbers.",
    contentSw: "Kuwa mwangalifu na ujumbe unaoitisha fedha au kuahidi fedha rahisi. Ulaghai wa kawaida ni pamoja na ajira za uwongo, ushindi wa bahati nasibu, na mipango ya uwekezaji. Daima thibitisha kabla ya kutuma fedha. Kama mtu anadai kutoka benki au serikali, wapigie moja kwa moja kwa kutumia nambari rasmi.",
    illustrationUrl: null,
    audioUrlEn: null,
    audioUrlSw: null,
    videoUrl: null,
    orderIndex: 2,
  },
  {
    titleEn: "Safe Social Media Use",
    titleSw: "Matumizi Salama ya Mitandao ya Kijamii",
    contentEn: "Think before you post. Don't share your location, home address, or daily routine. Set your accounts to private and only accept friend requests from people you know. Be careful about what photos you share - once posted, you lose control over them.",
    contentSw: "Fikiria kabla ya kuchapisha. Usitoe eneo lako, anwani ya nyumbani, au ratiba yako ya kila siku. Weka akaunti zako kuwa za faragha na ukubali maombi ya urafiki kutoka kwa watu unaowajua tu. Kuwa mwangalifu kuhusu picha unazoshiriki - mara tu ukichapisha, unapoteza udhibiti juu yao.",
    illustrationUrl: null,
    audioUrlEn: null,
    audioUrlSw: null,
    videoUrl: null,
    orderIndex: 3,
  },
  {
    titleEn: "Cyberbullying and Harassment",
    titleSw: "Uonevu na Unyanyasaji Mtandaoni",
    contentEn: "If someone is bullying or harassing you online, don't respond. Block them, save evidence (screenshots), and report to trusted adults or authorities. Remember: it's not your fault, and you deserve to feel safe online.",
    contentSw: "Kama mtu anakuonea au kukusumbua mtandaoni, usijibu. Mzuie, hifadhi ushahidi (picha za skrini), na ripoti kwa watu wazima unaoamini au mamlaka. Kumbuka: si kosa lako, na unastahili kujisikia salama mtandaoni.",
    illustrationUrl: null,
    audioUrlEn: null,
    audioUrlSw: null,
    videoUrl: null,
    orderIndex: 4,
  },
  {
    titleEn: "Creating Strong Passwords",
    titleSw: "Kuunda Nywila Imara",
    contentEn: "Use long passwords with letters, numbers, and symbols. Don't use the same password everywhere. Consider using a password manager. Never share your passwords, even with friends or family.",
    contentSw: "Tumia nywila ndefu zenye herufi, nambari, na alama. Usitumie nywila moja kila mahali. Fikiria kutumia kidhibiti cha nywila. Usitoe nywila zako, hata kwa marafiki au familia.",
    illustrationUrl: null,
    audioUrlEn: null,
    audioUrlSw: null,
    videoUrl: null,
    orderIndex: 5,
  },
  {
    titleEn: "Protecting Children on Social Media",
    titleSw: "Kulinda Watoto kwenye Mitandao ya Kijamii",
    contentEn: "Parents and guardians: monitor your children's online activity. Teach them not to talk to strangers online or share personal information. Set parental controls on devices. Have open conversations about what they see online and encourage them to tell you if something makes them uncomfortable.",
    contentSw: "Wazazi na walezi: fuatilia shughuli za watoto wako mtandaoni. Wafundishe wasizungumze na wageni mtandaoni au kutoa taarifa binafsi. Weka udhibiti wa wazazi kwenye vifaa. Kuwa na mazungumzo wazi kuhusu wanachokiona mtandaoni na kuwahimiza wakuambie kama kitu kinawafanya wasijisikie vizuri.",
    illustrationUrl: null,
    audioUrlEn: null,
    audioUrlSw: null,
    videoUrl: null,
    orderIndex: 6,
  },
  {
    titleEn: "Safe Online Dating",
    titleSw: "Kupatana Mtandaoni kwa Usalama",
    contentEn: "If using dating apps: never send money to someone you haven't met. Meet in public places for first dates. Tell a friend where you're going. Don't share intimate photos - they can be used for blackmail. Trust your instincts - if something feels wrong, it probably is.",
    contentSw: "Ikiwa unatumia programu za kupatana: usitume fedha kwa mtu ambaye hujamkutana. Kutana mahali pa umma kwa tarehe za kwanza. Mwambie rafiki unakwenda wapi. Usitoe picha za karibu - zinaweza kutumika kwa ulanguzi. Amini silika zako - kama kitu kinahisi vibaya, labda ni hivyo.",
    illustrationUrl: null,
    audioUrlEn: null,
    audioUrlSw: null,
    videoUrl: null,
    orderIndex: 7,
  },
  {
    titleEn: "Revenge Porn and Image-Based Abuse",
    titleSw: "Picha za Kulipiza Kisasi na Unyanyasaji wa Picha",
    contentEn: "Sharing intimate images without consent is illegal and harmful. If someone threatens to share your photos, don't give in to demands. Report to police immediately. Organizations like FIDA Kenya can help. Remember: the person sharing is committing a crime, not you.",
    contentSw: "Kushiriki picha za karibu bila idhini ni kinyume cha sheria na kudhuru. Kama mtu anatishia kushiriki picha zako, usikubali madai. Ripoti kwa polisi mara moja. Mashirika kama FIDA Kenya yanaweza kusaidia. Kumbuka: mtu anayeshiriki anafanya uhalifu, si wewe.",
    illustrationUrl: null,
    audioUrlEn: null,
    audioUrlSw: null,
    videoUrl: null,
    orderIndex: 8,
  },
  {
    titleEn: "Rights of Domestic Workers",
    titleSw: "Haki za Wafanyakazi wa Nyumbani",
    contentEn: "Domestic and care workers have rights! You deserve: fair wages paid on time, days off, safe working conditions, and respect. Your employer should not: take your phone, prevent you from leaving, physically or verbally abuse you, or withhold wages. If you're being mistreated, you can get help from organizations like KUDHEIHA or contact the Ministry of Labour.",
    contentSw: "Wafanyakazi wa nyumbani na wa huduma wana haki! Unastahili: mshahara wa haki uliopewa kwa wakati, siku za mapumziko, mazingira salama ya kufanyia kazi, na heshima. Mwajiri wako hapaswi: kuchukua simu yako, kukuzuia kutoka, kukudhuru kimwili au kwa maneno, au kuzuia mshahara. Kama unafanyiwa vibaya, unaweza kupata msaada kutoka mashirika kama KUDHEIHA au wasiliana na Wizara ya Kazi.",
    illustrationUrl: null,
    audioUrlEn: null,
    audioUrlSw: null,
    videoUrl: null,
    orderIndex: 9,
  },
  {
    titleEn: "Getting Help as a Domestic Worker",
    titleSw: "Kupata Msaada kama Mfanyakazi wa Nyumbani",
    contentEn: "If you're a domestic worker facing abuse or unfair treatment: Keep evidence (messages, photos of injuries, wage records). Contact KUDHEIHA (Kenya Union of Domestic, Hotels, Educational Institutions, Hospitals and Allied Workers) for support. You can also reach out to FIDA Kenya for legal aid. Remember your employer's full name and address. You have the right to leave an abusive situation - your safety comes first.",
    contentSw: "Kama wewe ni mfanyakazi wa nyumbani unakabiliwa na unyanyasaji au mfanyiwa vibaya: Hifadhi ushahidi (ujumbe, picha za majeraha, rekodi za mshahara). Wasiliana na KUDHEIHA (Muungano wa Wafanyakazi wa Nyumbani, Hoteli, Taasisi za Elimu, Hospitali na Wafanyakazi Wengine) kwa msaada. Unaweza pia kuwasiliana na FIDA Kenya kwa msaada wa kisheria. Kumbuka jina kamili la mwajiri wako na anwani. Una haki ya kuondoka hali ya unyanyasaji - usalama wako ni wa kwanza.",
    illustrationUrl: null,
    audioUrlEn: null,
    audioUrlSw: null,
    videoUrl: null,
    orderIndex: 10,
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
