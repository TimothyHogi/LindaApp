import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "wouter";
import { ArrowLeft, Send, Mic, MicOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Streamdown } from "streamdown";
import { getLoginUrl } from "@/const";

export default function Chat() {
  const { language, t } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: chatHistory, isLoading: historyLoading } = trpc.chat.getHistory.useQuery(
    undefined,
    { enabled: isAuthenticated }
  );
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const transcribeMutation = trpc.chat.transcribeAudio.useMutation();
  const uploadMutation = trpc.upload.uploadFile.useMutation();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  const handleSendMessage = async () => {
    if (!message.trim() && !audioBlob) return;

    let audioUrl: string | undefined;

    // Upload audio if exists
    if (audioBlob) {
      try {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        await new Promise((resolve) => {
          reader.onloadend = resolve;
        });
        const base64 = (reader.result as string).split(",")[1];
        
        const uploadResult = await uploadMutation.mutateAsync({
          fileName: `voice-${Date.now()}.webm`,
          fileData: base64,
          mimeType: "audio/webm",
        });
        audioUrl = uploadResult.url;

        // Transcribe audio
        const transcription = await transcribeMutation.mutateAsync({
          audioUrl: uploadResult.url,
          language: language,
        });
        setMessage(transcription.text);
      } catch (error) {
        toast.error(t("Failed to process audio", "Imeshindwa kusindika sauti"));
        return;
      }
    }

    const messageText = message.trim();
    setMessage("");
    setAudioBlob(null);

    try {
      await sendMessageMutation.mutateAsync({
        content: messageText,
        language: language,
        audioUrl: audioUrl,
      });
    } catch (error) {
      toast.error(t("Failed to send message", "Imeshindwa kutuma ujumbe"));
    }
  };

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
                "Please log in to use the AI Chat Assistant",
                "Tafadhali ingia kutumia Msaidizi wa AI"
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
    <div className="min-h-screen bg-background flex flex-col">
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
              <h1 className="text-xl font-bold">🧠 {t("AI Chat Assistant", "Msaidizi wa AI")}</h1>
              <p className="text-xs text-muted-foreground">
                {t("Ask me about digital safety", "Niulize kuhusu usalama wa kidijitali")}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Chat Messages */}
      <main className="flex-1 overflow-y-auto mobile-container py-4">
        {historyLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : chatHistory && chatHistory.length > 0 ? (
          <div className="space-y-4">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-[80%] p-4 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-card text-card-foreground"
                  }`}
                >
                  {msg.role === "assistant" ? (
                    <Streamdown>{msg.content}</Streamdown>
                  ) : (
                    <p className="whitespace-pre-wrap">{msg.content}</p>
                  )}
                  {msg.audioUrl && (
                    <audio controls className="mt-2 w-full">
                      <source src={msg.audioUrl} type="audio/webm" />
                    </audio>
                  )}
                </Card>
              </div>
            ))}
            {sendMessageMutation.isPending && (
              <div className="flex justify-start">
                <Card className="bg-card text-card-foreground p-4">
                  <Loader2 className="w-5 h-5 animate-spin" />
                </Card>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <p className="text-muted-foreground">
              {t("Start a conversation with Linda!", "Anza mazungumzo na Linda!")}
            </p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </main>

      {/* Input Area */}
      <div className="bg-card border-t-2 border-border shadow-lg">
        <div className="mobile-container py-4">
          {audioBlob && (
            <div className="mb-2 p-2 bg-accent/20 rounded-lg flex items-center justify-between">
              <span className="text-sm">
                {t("Voice message recorded", "Ujumbe wa sauti umerekodiwa")}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setAudioBlob(null)}
              >
                {t("Clear", "Futa")}
              </Button>
            </div>
          )}
          <div className="flex gap-2">
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={t("Type your message...", "Andika ujumbe wako...")}
              className="resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <div className="flex flex-col gap-2">
              <Button
                size="icon"
                variant={isRecording ? "destructive" : "secondary"}
                onClick={isRecording ? stopRecording : startRecording}
              >
                {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </Button>
              <Button
                size="icon"
                onClick={handleSendMessage}
                disabled={!message.trim() && !audioBlob}
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
