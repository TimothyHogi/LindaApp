import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { 
  MessageCircle, 
  AlertTriangle, 
  GraduationCap, 
  Shield, 
  Users, 
  MapPin, 
  WifiOff,
  Globe
} from "lucide-react";
import { APP_TITLE } from "@/const";

interface NavButton {
  emoji: string;
  titleEn: string;
  titleSw: string;
  path: string;
  icon: React.ReactNode;
  color: string;
}

export default function Home() {
  const { language, setLanguage, t } = useLanguage();

  const navButtons: NavButton[] = [
    {
      emoji: "🧠",
      titleEn: "AI Chat Assistant",
      titleSw: "Msaidizi wa AI",
      path: "/chat",
      icon: <MessageCircle className="w-8 h-8" />,
      color: "bg-primary hover:bg-primary/90",
    },
    {
      emoji: "📱",
      titleEn: "Report Abuse",
      titleSw: "Ripoti Unyanyasaji",
      path: "/report",
      icon: <AlertTriangle className="w-8 h-8" />,
      color: "bg-destructive hover:bg-destructive/90",
    },
    {
      emoji: "🎓",
      titleEn: "Learning Corner",
      titleSw: "Kona ya Kujifunza",
      path: "/lessons",
      icon: <GraduationCap className="w-8 h-8" />,
      color: "bg-accent hover:bg-accent/90",
    },
    {
      emoji: "🔒",
      titleEn: "Privacy Tips",
      titleSw: "Vidokezo vya Faragha",
      path: "/tips",
      icon: <Shield className="w-8 h-8" />,
      color: "bg-primary hover:bg-primary/90",
    },
    {
      emoji: "🗣",
      titleEn: "Community Stories",
      titleSw: "Hadithi za Jamii",
      path: "/stories",
      icon: <Users className="w-8 h-8" />,
      color: "bg-secondary hover:bg-secondary/90 text-secondary-foreground",
    },
    {
      emoji: "🧭",
      titleEn: "Help Centers Map",
      titleSw: "Ramani ya Vituo vya Msaada",
      path: "/help-centers",
      icon: <MapPin className="w-8 h-8" />,
      color: "bg-accent hover:bg-accent/90",
    },
    {
      emoji: "🌍",
      titleEn: "Offline Mode",
      titleSw: "Hali ya Nje ya Mtandao",
      path: "/offline",
      icon: <WifiOff className="w-8 h-8" />,
      color: "bg-muted hover:bg-muted/90 text-muted-foreground",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b-2 border-border shadow-sm">
        <div className="mobile-container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{APP_TITLE}</h1>
              <p className="text-sm text-muted-foreground">
                {t("Digital Safety for Women & Girls", "Usalama wa Kidijitali kwa Wanawake na Wasichana")}
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setLanguage(language === "en" ? "sw" : "en")}
              className="gap-2"
            >
              <Globe className="w-4 h-4" />
              {language === "en" ? "Kiswahili" : "English"}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mobile-container py-8">
        {/* Welcome Message */}
        <Card className="friendly-card mb-8 bg-gradient-to-br from-primary/10 to-accent/10">
          <h2 className="text-xl font-bold mb-2 text-card-foreground">
            {t("Welcome to Linda! 👋", "Karibu Linda! 👋")}
          </h2>
          <p className="text-card-foreground/80">
            {t(
              "Your trusted companion for digital safety and support. Choose a feature below to get started.",
              "Mwenzako wa kuaminika kwa usalama wa kidijitali na msaada. Chagua kipengele hapa chini kuanza."
            )}
          </p>
        </Card>

        {/* Navigation Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {navButtons.map((button, index) => (
            <Link key={index} href={button.path}>
              <Card
                className={`${button.color} text-white cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 active:translate-y-0 p-6 rounded-2xl border-0`}
              >
                <div className="flex flex-col items-center text-center gap-3">
                  <div className="text-5xl">{button.emoji}</div>
                  <div className="hidden">{button.icon}</div>
                  <h3 className="text-lg font-bold">
                    {language === "sw" ? button.titleSw : button.titleEn}
                  </h3>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* Emergency Contact */}
        <Card className="friendly-card mt-8 bg-destructive/10 border-destructive/30">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🚨</div>
            <div>
              <h3 className="font-bold text-destructive mb-1">
                {t("Emergency?", "Dharura?")}
              </h3>
              <p className="text-sm text-foreground/80 mb-2">
                {t(
                  "If you are in immediate danger, call emergency services:",
                  "Ikiwa uko hatarini ya haraka, piga simu huduma za dharura:"
                )}
              </p>
              <div className="flex gap-2 flex-wrap">
                <a href="tel:999" className="inline-block">
                  <Button variant="destructive" size="sm">
                    📞 999 (Police)
                  </Button>
                </a>
                <a href="tel:116" className="inline-block">
                  <Button variant="destructive" size="sm">
                    📞 116 (Childline)
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </Card>
      </main>

      {/* Footer */}
      <footer className="mobile-container py-6 text-center text-sm text-muted-foreground">
        <p>
          {t(
            "Linda App - Empowering digital safety in Kenya",
            "Linda App - Kuimarisha usalama wa kidijitali nchini Kenya"
          )}
        </p>
      </footer>
    </div>
  );
}
