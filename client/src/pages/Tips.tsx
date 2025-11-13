import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function Tips() {
  const { language, t } = useLanguage();

  const { data: tips, isLoading } = trpc.tips.getAll.useQuery();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

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
              <h1 className="text-xl font-bold">🔒 {t("Privacy Tips", "Vidokezo vya Faragha")}</h1>
              <p className="text-xs text-muted-foreground">
                {t("Stay safe online", "Kaa salama mtandaoni")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mobile-container py-8">
        {/* Daily Tip Highlight */}
        {tips && tips.length > 0 && (
          <Card className="friendly-card mb-6 bg-gradient-to-br from-primary/20 to-accent/20 border-primary/30">
            <div className="flex items-start gap-4">
              <div className="text-5xl">{tips[0].icon}</div>
              <div className="flex-1">
                <div className="text-xs font-semibold text-primary mb-1">
                  {t("TIP OF THE DAY", "KIDOKEZO CHA LEO")}
                </div>
                <h2 className="text-xl font-bold mb-2">
                  {language === "sw" ? tips[0].titleSw : tips[0].titleEn}
                </h2>
                <p className="text-sm leading-relaxed">
                  {language === "sw" ? tips[0].contentSw : tips[0].contentEn}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* All Tips Grid */}
        <h3 className="text-lg font-bold mb-4">
          {t("All Privacy Tips", "Vidokezo Vyote vya Faragha")}
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {tips?.map((tip, index) => (
            <Card
              key={tip.id}
              className={`p-5 transition-all hover:shadow-lg hover:-translate-y-1 ${
                index === 0 ? "bg-muted/30" : ""
              }`}
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl flex-shrink-0">{tip.icon}</div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg mb-2">
                    {language === "sw" ? tip.titleSw : tip.titleEn}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {language === "sw" ? tip.contentSw : tip.contentEn}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Notification Info */}
        <Card className="friendly-card mt-6 bg-accent/10 border-accent/30">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🔔</div>
            <div>
              <h3 className="font-bold mb-1">
                {t("Daily Notifications", "Arifa za Kila Siku")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t(
                  "Enable notifications to receive a new privacy tip every day in your preferred language.",
                  "Wezesha arifa kupokea kidokezo kipya cha faragha kila siku katika lugha unayopendelea."
                )}
              </p>
              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={() => {
                  if ("Notification" in window) {
                    Notification.requestPermission().then((permission) => {
                      if (permission === "granted") {
                        new Notification(
                          t("Notifications Enabled!", "Arifa Zimewezeshwa!"),
                          {
                            body: t(
                              "You'll receive daily privacy tips",
                              "Utapokea vidokezo vya faragha kila siku"
                            ),
                            icon: "/logo.png",
                          }
                        );
                      }
                    });
                  }
                }}
              >
                {t("Enable Notifications", "Wezesha Arifa")}
              </Button>
            </div>
          </div>
        </Card>

        {/* Offline Notice */}
        <Card className="friendly-card mt-6 bg-muted/30">
          <p className="text-sm text-center">
            💾 {t(
              "Tips are cached for offline access",
              "Vidokezo vimehifadhiwa kwa ufikiaji nje ya mtandao"
            )}
          </p>
        </Card>
      </main>
    </div>
  );
}
