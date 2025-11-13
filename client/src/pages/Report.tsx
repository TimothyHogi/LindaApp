import { useState, useRef } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/_core/hooks/useAuth";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Camera, Mic, MicOff, MapPin, Loader2, CheckCircle, Phone } from "lucide-react";
import { toast } from "sonner";
import { getLoginUrl } from "@/const";

export default function Report() {
  const { language, t } = useLanguage();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [, setLocation] = useLocation();
  
  const [abuseType, setAbuseType] = useState("");
  const [description, setDescription] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [location, setLocationData] = useState<{ latitude: string; longitude: string } | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createReportMutation = trpc.reports.create.useMutation();
  const uploadMutation = trpc.upload.uploadFile.useMutation();

  const abuseTypes = [
    { en: "Cyberbullying", sw: "Uonevu Mtandaoni" },
    { en: "Online Harassment", sw: "Unyanyasaji Mtandaoni" },
    { en: "Sexual Harassment", sw: "Unyanyasaji wa Kingono" },
    { en: "Threats", sw: "Vitisho" },
    { en: "Stalking", sw: "Ufuatiliaji" },
    { en: "Revenge Porn", sw: "Picha za Kulipiza Kisasi" },
    { en: "Financial Scam", sw: "Ulaghai wa Kifedha" },
    { en: "Other", sw: "Nyingine" },
  ];

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            latitude: position.coords.latitude.toString(),
            longitude: position.coords.longitude.toString(),
          });
          toast.success(t("Location captured", "Eneo limerekodiwa"));
        },
        (error) => {
          toast.error(t("Unable to get location", "Haiwezi kupata eneo"));
        }
      );
    } else {
      toast.error(t("Geolocation not supported", "Geolocation haitegemezwi"));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!abuseType || !description.trim()) {
      toast.error(t("Please fill in all required fields", "Tafadhali jaza sehemu zote zinazohitajika"));
      return;
    }

    try {
      let photoUrl: string | undefined;
      let audioUrl: string | undefined;

      // Upload photo if exists
      if (photoFile) {
        const reader = new FileReader();
        reader.readAsDataURL(photoFile);
        await new Promise((resolve) => {
          reader.onloadend = resolve;
        });
        const base64 = (reader.result as string).split(",")[1];
        
        const uploadResult = await uploadMutation.mutateAsync({
          fileName: `report-photo-${Date.now()}.jpg`,
          fileData: base64,
          mimeType: photoFile.type,
        });
        photoUrl = uploadResult.url;
      }

      // Upload audio if exists
      if (audioBlob) {
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        await new Promise((resolve) => {
          reader.onloadend = resolve;
        });
        const base64 = (reader.result as string).split(",")[1];
        
        const uploadResult = await uploadMutation.mutateAsync({
          fileName: `report-audio-${Date.now()}.webm`,
          fileData: base64,
          mimeType: "audio/webm",
        });
        audioUrl = uploadResult.url;
      }

      await createReportMutation.mutateAsync({
        abuseType,
        description,
        photoUrl,
        audioUrl,
        latitude: location?.latitude,
        longitude: location?.longitude,
        isAnonymous,
      });

      setIsSubmitted(true);
      toast.success(t("Report submitted successfully", "Ripoti imewasilishwa"));
    } catch (error) {
      toast.error(t("Failed to submit report", "Imeshindwa kuwasilisha ripoti"));
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
                "Please log in to report abuse",
                "Tafadhali ingia kuripoti unyanyasaji"
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

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <header className="bg-card border-b-2 border-border shadow-sm">
          <div className="mobile-container py-4">
            <h1 className="text-xl font-bold">📱 {t("Report Abuse", "Ripoti Unyanyasaji")}</h1>
          </div>
        </header>
        <main className="mobile-container py-8">
          <Card className="friendly-card text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">
              {t("Report Submitted", "Ripoti Imewasilishwa")}
            </h2>
            <p className="mb-6 text-muted-foreground">
              {t(
                "Your report has been received. Our team will review it and take appropriate action. You are not alone.",
                "Ripoti yako imepokelewa. Timu yetu itaikagua na kuchukua hatua zinazofaa. Huko peke yako."
              )}
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/">
                <Button>{t("Go Home", "Rudi Nyumbani")}</Button>
              </Link>
              <Button
                variant="outline"
                onClick={() => {
                  setIsSubmitted(false);
                  setAbuseType("");
                  setDescription("");
                  setPhotoFile(null);
                  setPhotoPreview(null);
                  setAudioBlob(null);
                  setLocationData(null);
                  setIsAnonymous(false);
                }}
              >
                {t("Submit Another", "Wasilisha Nyingine")}
              </Button>
            </div>
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
          <div className="flex items-center gap-3">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-xl font-bold">📱 {t("Report Abuse", "Ripoti Unyanyasaji")}</h1>
              <p className="text-xs text-muted-foreground">
                {t("Your safety is our priority", "Usalama wako ni kipaumbele chetu")}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Form */}
      <main className="mobile-container py-8">
        <Card className="friendly-card mb-4 bg-amber-50 border-amber-200">
          <p className="text-sm">
            {t(
              "This form is confidential. You can choose to remain anonymous. If you are in immediate danger, please call emergency services (999 or 116).",
              "Fomu hii ni ya siri. Unaweza kuchagua kubaki bila kutambulika. Ikiwa uko hatarini ya haraka, tafadhali piga simu huduma za dharura (999 au 116)."
            )}
          </p>
        </Card>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Abuse Type */}
          <div>
            <Label htmlFor="abuseType">
              {t("Type of Abuse", "Aina ya Unyanyasaji")} *
            </Label>
            <Select value={abuseType} onValueChange={setAbuseType}>
              <SelectTrigger>
                <SelectValue placeholder={t("Select type", "Chagua aina")} />
              </SelectTrigger>
              <SelectContent>
                {abuseTypes.map((type, index) => (
                  <SelectItem key={index} value={language === "sw" ? type.sw : type.en}>
                    {language === "sw" ? type.sw : type.en}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">
              {t("Description", "Maelezo")} *
            </Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t(
                "Describe what happened...",
                "Eleza kilichotokea..."
              )}
              rows={5}
            />
          </div>

          {/* Audio Description */}
          <div>
            <Label>{t("Audio Description (Optional)", "Maelezo ya Sauti (Si Lazima)")}</Label>
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

          {/* Photo Upload */}
          <div>
            <Label>{t("Photo Evidence (Optional)", "Ushahidi wa Picha (Si Lazima)")}</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
            <Button
              type="button"
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              className="gap-2 mt-2"
            >
              <Camera className="w-4 h-4" />
              {t("Upload Photo", "Pakia Picha")}
            </Button>
            {photoPreview && (
              <div className="mt-2 relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full max-w-xs rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    setPhotoFile(null);
                    setPhotoPreview(null);
                  }}
                  className="absolute top-2 right-2"
                >
                  {t("Remove", "Ondoa")}
                </Button>
              </div>
            )}
          </div>

          {/* GPS Location */}
          <div>
            <Label>{t("Location (Optional)", "Eneo (Si Lazima)")}</Label>
            <Button
              type="button"
              variant="secondary"
              onClick={getLocation}
              className="gap-2 mt-2"
            >
              <MapPin className="w-4 h-4" />
              {location
                ? t("Location Captured", "Eneo Limerekodiwa")
                : t("Capture Location", "Rekodi Eneo")}
            </Button>
            {location && (
              <p className="text-xs text-muted-foreground mt-1">
                {t("Coordinates:", "Kuratibu:")} {location.latitude}, {location.longitude}
              </p>
            )}
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center space-x-2">
            <Checkbox
              id="anonymous"
              checked={isAnonymous}
              onCheckedChange={(checked) => setIsAnonymous(checked as boolean)}
            />
            <Label htmlFor="anonymous" className="cursor-pointer">
              {t("Submit anonymously", "Wasilisha bila kutambulika")}
            </Label>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            disabled={createReportMutation.isPending || uploadMutation.isPending}
          >
            {createReportMutation.isPending || uploadMutation.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {t("Submitting...", "Inawasilisha...")}
              </>
            ) : (
              t("Submit Report", "Wasilisha Ripoti")
            )}
          </Button>
        </form>
      </main>

      {/* Emergency Call Floating Button */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2">
        <a href="tel:999">
          <Button
            size="lg"
            className="rounded-full h-16 w-16 shadow-lg bg-red-600 hover:bg-red-700 text-white"
            title={t("Call Police (999)", "Piga Polisi (999)")}
          >
            <div className="flex flex-col items-center">
              <Phone className="w-6 h-6" />
              <span className="text-xs font-bold">999</span>
            </div>
          </Button>
        </a>
        <a href="tel:116">
          <Button
            size="lg"
            className="rounded-full h-16 w-16 shadow-lg bg-orange-600 hover:bg-orange-700 text-white"
            title={t("Call Childline (116)", "Piga Childline (116)")}
          >
            <div className="flex flex-col items-center">
              <Phone className="w-6 h-6" />
              <span className="text-xs font-bold">116</span>
            </div>
          </Button>
        </a>
      </div>
    </div>
  );
}
