import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Wifi, WifiOff, Download, CheckCircle } from "lucide-react";

export default function Offline() {
  const { t } = useLanguage();

  const offlineFeatures = [
    {
      icon: "🎓",
      titleEn: "Learning Lessons",
      titleSw: "Masomo ya Kujifunza",
      descEn: "All lessons are cached and available offline",
      descSw: "Masomo yote yamehifadhiwa na yanapatikana nje ya mtandao",
    },
    {
      icon: "🔒",
      titleEn: "Privacy Tips",
      titleSw: "Vidokezo vya Faragha",
      descEn: "Access all privacy tips without internet",
      descSw: "Fikia vidokezo vyote vya faragha bila mtandao",
    },
    {
      icon: "🧭",
      titleEn: "Help Centers Info",
      titleSw: "Taarifa za Vituo vya Msaada",
      descEn: "Contact information saved for offline access",
      descSw: "Taarifa za mawasiliano zimehifadhiwa kwa ufikiaji nje ya mtandao",
    },
  ];

  const onlineOnlyFeatures = [
    {
      icon: "🧠",
      titleEn: "AI Chat Assistant",
      titleSw: "Msaidizi wa AI",
      descEn: "Requires internet connection",
      descSw: "Inahitaji muunganisho wa mtandao",
    },
    {
      icon: "📱",
      titleEn: "Report Abuse",
      titleSw: "Ripoti Unyanyasaji",
      descEn: "Submissions require internet",
      descSw: "Kuwasilisha kunahitaji mtandao",
    },
    {
      icon: "🗣",
      titleEn: "Community Stories",
      titleSw: "Hadithi za Jamii",
      descEn: "Reading and sharing require internet",
      descSw: "Kusoma na kushiriki kunahitaji mtandao",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b-2 border-border shadow-sm">
        <div className="mobile-container py-4">
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">🌍 {t("Offline Mode", "Hali ya Nje ya Mtandao")}</h1>
              <p className="text-xs text-muted-foreground">
                {t("Access content without internet", "Fikia maudhui bila mtandao")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mobile-container py-8">
        {/* Connection Status */}
        <Card className="friendly-card mb-6 bg-gradient-to-br from-primary/10 to-accent/10">
          <div className="flex items-center gap-4">
            {navigator.onLine ? (
              <>
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                  <Wifi className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-bold text-green-700">
                    {t("You're Online", "Uko Mtandaoni")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("All features are available", "Vipengele vyote vinapatikana")}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <WifiOff className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-amber-700">
                    {t("You're Offline", "Uko Nje ya Mtandao")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {t("Some features are limited", "Baadhi ya vipengele vimepunguzwa")}
                  </p>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Offline Available Features */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <h3 className="text-lg font-bold">
              {t("Available Offline", "Inapatikana Nje ya Mtandao")}
            </h3>
          </div>
          <div className="space-y-3">
            {offlineFeatures.map((feature, index) => (
              <Card key={index} className="p-4 bg-green-50 border-green-200">
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{feature.icon}</div>
                  <div>
                    <h4 className="font-bold mb-1">
                      {t(feature.titleEn, feature.titleSw)}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t(feature.descEn, feature.descSw)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Online Only Features */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Wifi className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold">
              {t("Requires Internet", "Inahitaji Mtandao")}
            </h3>
          </div>
          <div className="space-y-3">
            {onlineOnlyFeatures.map((feature, index) => (
              <Card key={index} className="p-4 bg-muted/30">
                <div className="flex items-start gap-3">
                  <div className="text-3xl opacity-50">{feature.icon}</div>
                  <div>
                    <h4 className="font-bold mb-1">
                      {t(feature.titleEn, feature.titleSw)}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {t(feature.descEn, feature.descSw)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <Card className="friendly-card bg-primary/5">
          <div className="flex items-start gap-3 mb-4">
            <Download className="w-6 h-6 text-primary" />
            <div>
              <h3 className="font-bold mb-2">
                {t("How Offline Mode Works", "Jinsi Hali ya Nje ya Mtandao Inavyofanya Kazi")}
              </h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  {t(
                    "• When you visit lessons, tips, and help centers while online, they are automatically saved to your device.",
                    "• Unapotembelea masomo, vidokezo, na vituo vya msaada ukiwa mtandaoni, vinahifadhiwa moja kwa moja kwenye kifaa chako."
                  )}
                </p>
                <p>
                  {t(
                    "• You can access this saved content anytime, even without internet.",
                    "• Unaweza kufikia maudhui haya yaliyohifadhiwa wakati wowote, hata bila mtandao."
                  )}
                </p>
                <p>
                  {t(
                    "• Content is updated automatically when you reconnect to the internet.",
                    "• Maudhui yanasasishwa moja kwa moja unapounganisha tena kwenye mtandao."
                  )}
                </p>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Usage Info */}
        <Card className="friendly-card mt-6 bg-accent/10 border-accent/30">
          <div className="flex items-start gap-3">
            <div className="text-3xl">💾</div>
            <div>
              <h3 className="font-bold mb-1">
                {t("Low Data Usage", "Matumizi Kidogo ya Data")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(
                  "Linda App is designed to use minimal data. Offline caching helps you save on data costs while staying informed about digital safety.",
                  "Linda App imeundwa kutumia data kidogo. Kuhifadhi nje ya mtandao kunakusaidia kuokoa gharama za data huku ukiendelea kupata taarifa kuhusu usalama wa kidijitali."
                )}
              </p>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
