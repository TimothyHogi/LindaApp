import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Loader2, Navigation } from "lucide-react";
import { MapView } from "@/components/Map";

export default function HelpCenters() {
  const { language, t } = useLanguage();
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);

  const { data: centers, isLoading } = trpc.helpCenters.getAll.useQuery();

  const handleMapReady = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    setMapReady(true);
  };

  // Add markers when map is ready and centers are loaded
  useState(() => {
    if (mapReady && map && centers && markers.length === 0) {
      const newMarkers: google.maps.Marker[] = [];
      
      centers.forEach((center) => {
        const marker = new google.maps.Marker({
          position: {
            lat: parseFloat(center.latitude),
            lng: parseFloat(center.longitude),
          },
          map: map,
          title: language === "sw" ? center.nameSw : center.nameEn,
        });

        marker.addListener("click", () => {
          setSelectedCenter(center.id);
          map.panTo(marker.getPosition()!);
        });

        newMarkers.push(marker);
      });

      setMarkers(newMarkers);

      // Fit bounds to show all markers
      if (newMarkers.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        newMarkers.forEach((marker) => {
          bounds.extend(marker.getPosition()!);
        });
        map.fitBounds(bounds);
      }
    }
  });

  const openDirections = (lat: string, lng: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const selectedCenterData = centers?.find((c) => c.id === selectedCenter);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
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
              <h1 className="text-xl font-bold">🧭 {t("Help Centers Map", "Ramani ya Vituo vya Msaada")}</h1>
              <p className="text-xs text-muted-foreground">
                {t("Find support near you", "Pata msaada karibu nawe")}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Map */}
      <div className="h-[400px] w-full">
        <MapView
          onMapReady={handleMapReady}
          className="w-full h-full"
          initialCenter={{ lat: -1.2921, lng: 36.8219 }}
          initialZoom={11}
        />
      </div>

      {/* Centers List */}
      <main className="flex-1 overflow-y-auto mobile-container py-6">
        <h3 className="text-lg font-bold mb-4">
          {t("All Help Centers", "Vituo Vyote vya Msaada")}
        </h3>

        {selectedCenterData && (
          <Card className="friendly-card mb-4 bg-primary/10 border-primary/30">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold">
                {language === "sw" ? selectedCenterData.nameSw : selectedCenterData.nameEn}
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedCenter(null)}
              >
                ✕
              </Button>
            </div>
            <p className="text-sm mb-3">
              {language === "sw" ? selectedCenterData.descriptionSw : selectedCenterData.descriptionEn}
            </p>
            <div className="space-y-2 text-sm">
              {selectedCenterData.address && (
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>{selectedCenterData.address}</span>
                </div>
              )}
              {selectedCenterData.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 flex-shrink-0" />
                  <a href={`tel:${selectedCenterData.phone}`} className="text-primary hover:underline">
                    {selectedCenterData.phone}
                  </a>
                </div>
              )}
              {selectedCenterData.email && (
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 flex-shrink-0" />
                  <a href={`mailto:${selectedCenterData.email}`} className="text-primary hover:underline">
                    {selectedCenterData.email}
                  </a>
                </div>
              )}
              {selectedCenterData.website && (
                <div className="flex items-center gap-2">
                  <Globe className="w-4 h-4 flex-shrink-0" />
                  <a
                    href={selectedCenterData.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {t("Visit Website", "Tembelea Tovuti")}
                  </a>
                </div>
              )}
            </div>
            <Button
              onClick={() => openDirections(selectedCenterData.latitude, selectedCenterData.longitude)}
              className="w-full mt-4 gap-2"
            >
              <Navigation className="w-4 h-4" />
              {t("Get Directions", "Pata Maelekezo")}
            </Button>
          </Card>
        )}

        <div className="space-y-3">
          {centers?.map((center) => (
            <Card
              key={center.id}
              className={`cursor-pointer transition-all hover:shadow-lg p-4 ${
                selectedCenter === center.id ? "border-primary border-2" : ""
              }`}
              onClick={() => setSelectedCenter(center.id)}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold mb-1">
                    {language === "sw" ? center.nameSw : center.nameEn}
                  </h3>
                  <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                    {language === "sw" ? center.descriptionSw : center.descriptionEn}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                      {center.type.replace("_", " ").toUpperCase()}
                    </span>
                    {center.phone && (
                      <a
                        href={`tel:${center.phone}`}
                        className="text-primary hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        📞 {center.phone}
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Emergency Notice */}
        <Card className="friendly-card mt-6 bg-destructive/10 border-destructive/30">
          <div className="flex items-start gap-3">
            <div className="text-3xl">🚨</div>
            <div>
              <h3 className="font-bold text-destructive mb-1">
                {t("Emergency?", "Dharura?")}
              </h3>
              <p className="text-sm mb-2">
                {t(
                  "If you are in immediate danger, call emergency services:",
                  "Ikiwa uko hatarini ya haraka, piga simu huduma za dharura:"
                )}
              </p>
              <div className="flex gap-2">
                <a href="tel:999">
                  <Button variant="destructive" size="sm">
                    📞 999
                  </Button>
                </a>
                <a href="tel:116">
                  <Button variant="destructive" size="sm">
                    📞 116
                  </Button>
                </a>
              </div>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}
