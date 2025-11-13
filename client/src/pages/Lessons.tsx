import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { ArrowLeft, CheckCircle, Circle, BookOpen, Loader2 } from "lucide-react";

export default function Lessons() {
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const [selectedLesson, setSelectedLesson] = useState<number | null>(null);

  const { data: lessons, isLoading: lessonsLoading } = trpc.lessons.getAll.useQuery();
  const { data: progress, refetch: refetchProgress } = trpc.lessons.getProgress.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const markCompleteMutation = trpc.lessons.markComplete.useMutation({
    onSuccess: () => {
      refetchProgress();
    },
  });

  const getProgressPercentage = () => {
    if (!lessons || !progress) return 0;
    const completed = progress.filter((p) => p.completed).length;
    return Math.round((completed / lessons.length) * 100);
  };

  const isLessonCompleted = (lessonId: number) => {
    return progress?.some((p) => p.lessonId === lessonId && p.completed) || false;
  };

  const handleMarkComplete = async (lessonId: number) => {
    await markCompleteMutation.mutateAsync({ lessonId });
  };

  const selectedLessonData = lessons?.find((l) => l.id === selectedLesson);

  if (lessonsLoading) {
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
            <div className="flex-1">
              <h1 className="text-xl font-bold">🎓 {t("Learning Corner", "Kona ya Kujifunza")}</h1>
              <p className="text-xs text-muted-foreground">
                {t("Learn digital safety skills", "Jifunze ujuzi wa usalama wa kidijitali")}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mobile-container py-8">
        {/* Progress Card */}
        {isAuthenticated && (
          <Card className="friendly-card mb-6 bg-gradient-to-br from-primary/10 to-accent/10">
            <div className="flex items-center gap-3 mb-3">
              <BookOpen className="w-6 h-6 text-primary" />
              <div className="flex-1">
                <h3 className="font-bold">
                  {t("Your Progress", "Maendeleo Yako")}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {progress?.filter((p) => p.completed).length || 0} / {lessons?.length || 0}{" "}
                  {t("lessons completed", "masomo yamekamilika")}
                </p>
              </div>
            </div>
            <Progress value={getProgressPercentage()} className="h-3" />
          </Card>
        )}

        {/* Lesson List View */}
        {!selectedLesson && (
          <div className="space-y-4">
            {lessons?.map((lesson, index) => {
              const completed = isLessonCompleted(lesson.id);
              return (
                <Card
                  key={lesson.id}
                  className={`cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 p-5 ${
                    completed ? "bg-green-50 border-green-200" : ""
                  }`}
                  onClick={() => setSelectedLesson(lesson.id)}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      {completed ? (
                        <CheckCircle className="w-8 h-8 text-green-600" />
                      ) : (
                        <Circle className="w-8 h-8 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold text-muted-foreground">
                          {t("Lesson", "Somo")} {index + 1}
                        </span>
                        {completed && (
                          <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full">
                            {t("Completed", "Imekamilika")}
                          </span>
                        )}
                      </div>
                      <h3 className="font-bold text-lg mb-1">
                        {language === "sw" ? lesson.titleSw : lesson.titleEn}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {language === "sw" ? lesson.contentSw : lesson.contentEn}
                      </p>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* Lesson Detail View */}
        {selectedLesson && selectedLessonData && (
          <div>
            <Button
              variant="ghost"
              onClick={() => setSelectedLesson(null)}
              className="mb-4 gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              {t("Back to Lessons", "Rudi kwa Masomo")}
            </Button>

            <Card className="friendly-card">
              <div className="mb-4">
                <span className="text-sm font-semibold text-primary">
                  {t("Lesson", "Somo")} {selectedLessonData.orderIndex}
                </span>
                <h2 className="text-2xl font-bold mt-1 mb-4">
                  {language === "sw" ? selectedLessonData.titleSw : selectedLessonData.titleEn}
                </h2>
              </div>

              {selectedLessonData.illustrationUrl && (
                <img
                  src={selectedLessonData.illustrationUrl}
                  alt="Illustration"
                  className="w-full rounded-lg mb-4"
                />
              )}

              <div className="prose max-w-none mb-6">
                <p className="text-base leading-relaxed whitespace-pre-wrap">
                  {language === "sw" ? selectedLessonData.contentSw : selectedLessonData.contentEn}
                </p>
              </div>

              {(selectedLessonData.audioUrlEn || selectedLessonData.audioUrlSw) && (
                <div className="mb-6">
                  <h3 className="font-bold mb-2">
                    {t("Listen to this lesson", "Sikiliza somo hili")}
                  </h3>
                  <audio controls className="w-full">
                    <source
                      src={
                        (language === "sw"
                          ? selectedLessonData.audioUrlSw || selectedLessonData.audioUrlEn
                          : selectedLessonData.audioUrlEn || selectedLessonData.audioUrlSw) || ""
                      }
                      type="audio/mpeg"
                    />
                  </audio>
                </div>
              )}

              {selectedLessonData.videoUrl && (
                <div className="mb-6">
                  <h3 className="font-bold mb-2">
                    {t("Watch video", "Tazama video")}
                  </h3>
                  <video controls className="w-full rounded-lg">
                    <source src={selectedLessonData.videoUrl} type="video/mp4" />
                  </video>
                </div>
              )}

              {isAuthenticated && !isLessonCompleted(selectedLessonData.id) && (
                <Button
                  onClick={() => handleMarkComplete(selectedLessonData.id)}
                  disabled={markCompleteMutation.isPending}
                  className="w-full"
                >
                  {markCompleteMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      {t("Marking...", "Inaweka alama...")}
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {t("Mark as Complete", "Weka alama kuwa Imekamilika")}
                    </>
                  )}
                </Button>
              )}

              {isLessonCompleted(selectedLessonData.id) && (
                <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4 text-center">
                  <CheckCircle className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <p className="font-bold text-green-700">
                    {t("Lesson Completed!", "Somo Limekamilika!")}
                  </p>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* Offline Notice */}
        <Card className="friendly-card mt-6 bg-muted/30">
          <p className="text-sm text-center">
            💾 {t(
              "Lessons are cached for offline access",
              "Masomo yamehifadhiwa kwa ufikiaji nje ya mtandao"
            )}
          </p>
        </Card>
      </main>
    </div>
  );
}
