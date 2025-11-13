import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link } from "wouter";
import { ArrowLeft, MapPin, Phone, Mail, Globe, Loader2, Navigation, Crosshair, Search, Filter } from "lucide-react";
import { MapView } from "@/components/Map";
import { toast } from "sonner";

export default function HelpCenters() {
  const { language, t } = useLanguage();
  const [selectedCenter, setSelectedCenter] = useState<number | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [markers, setMarkers] = useState<google.maps.Marker[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<string>("all");

  const { data: centers, isLoading } = trpc.helpCenters.getAll.useQuery();

  // Get marker color based on center type
  const getMarkerIcon = (type: string) => {
    const colors = {
      ngo: "#3B82F6", // Blue
      shelter: "#EF4444", // Red
      legal_aid: "#10B981", // Green
    };
    
    const color = colors[type as keyof typeof colors] || "#6B7280";
    
    return {
      path: google.maps.SymbolPath.CIRCLE,
      fillColor: color,
      fillOpacity: 1,
      strokeColor: "#FFFFFF",
      strokeWeight: 2,
      scale: 10,
    };
  };

  const handleMapReady = (mapInstance: google.maps.Map) => {
    setMap(mapInstance);
    setMapReady(true);
  };

  // Filter centers based on search and type
  const filteredCenters = centers?.filter((center) => {
    const matchesType = filterType === "all" || center.type === filterType;
    const matchesSearch =
      searchQuery === "" ||
      (language === "sw" ? center.nameSw : center.nameEn)
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  // Add markers when map is ready and centers are loaded
  useEffect(() => {
    if (mapReady && map && filteredCenters) {
      // Clear existing markers
      markers.forEach((marker) => marker.setMap(null));

      const newMarkers: google.maps.Marker[] = [];

      filteredCenters.forEach((center) => {
        const marker = new google.maps.Marker({
          position: {
            lat: parseFloat(center.latitude),
            lng: parseFloat(center.longitude),
          },
          map: map,
          title: language === "sw" ? center.nameSw : center.nameEn,
          icon: getMarkerIcon(center.type),
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
        
        // Include user location in bounds if available
        if (userLocation) {
          bounds.extend(new google.maps.LatLng(userLocation.lat, userLocation.lng));
        }
        
        map.fitBounds(bounds);
      }
    }
  }, [mapReady, map, filteredCenters, language]);

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          
          if (map) {
            map.panTo(location);
            map.setZoom(13);
            
            // Add user location marker
            new google.maps.Marker({
              position: location,
              map: map,
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                fillColor: "#F59E0B",
                fillOpacity: 1,
                strokeColor: "#FFFFFF",
                strokeWeight: 3,
                scale: 8,
              },
              title: t("Your Location", "Eneo Lako"),
            });
          }
          
          toast.success(t("Location found", "Eneo limepatikana"));
          
          // Find nearest center
          if (filteredCenters && filteredCenters.length > 0) {
            let nearestCenter = filteredCenters[0];
            let minDistance = calculateDistance(
              location.lat,
              location.lng,
              parseFloat(nearestCenter.latitude),
              parseFloat(nearestCenter.longitude)
            );
            
            filteredCenters.forEach((center) => {
              const distance = calculateDistance(
                location.lat,
                location.lng,
                parseFloat(center.latitude),
                parseFloat(center.longitude)
              );
              if (distance < minDistance) {
                minDistance = distance;
                nearestCenter = center;
              }
            });
            
            setSelectedCenter(nearestCenter.id);
          }
        },
        (error) => {
          toast.error(t("Unable to get location", "Haiwezi kupata eneo"));
        }
      );
    } else {
      toast.error(t("Geolocation not supported", "Geolocation haitegemezwi"));
    }
  };

  // Calculate distance between two points (Haversine formula)
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const openDirections = (lat: string, lng: string) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const selectedCenterData = filteredCenters?.find((c) => c.id === selectedCenter);

  const getTypeLabel = (type: string) => {
    const labels = {
      ngo: { en: "NGO", sw: "Shirika" },
      shelter: { en: "Shelter", sw: "Hifadhi" },
      legal_aid: { en: "Legal Aid", sw: "Msaada wa Kisheria" },
    };
    const label = labels[type as keyof typeof labels];
    return label ? (language === "sw" ? label.sw : label.en) : type;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      ngo: "bg-blue-100 text-blue-700 border-blue-300",
      shelter: "bg-red-100 text-red-700 border-red-300",
      legal_aid: "bg-green-100 text-green-700 border-green-300",
    };
    return colors[type as keyof typeof colors] || "bg-gray-100 text-gray-700 border-gray-300";
  };

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
            <div className="flex-1">
              <h1 className="text-xl font-bold">🧭 {t("Help Centers Map", "Ramani ya Vituo vya Msaada")}</h1>
              <p className="text-xs text-muted-foreground">
                {t("Find support near you", "Pata msaada karibu nawe")}
              </p>
            </div>
            <Button onClick={getUserLocation} size="sm" variant="outline" className="gap-2">
              <Crosshair className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Search and Filter */}
      <div className="bg-card border-b border-border">
        <div className="mobile-container py-3 space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder={t("Search help centers...", "Tafuta vituo vya msaada...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-muted-foreground flex-shrink-0" />
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="flex-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("All Types", "Aina Zote")}</SelectItem>
                <SelectItem value="ngo">{getTypeLabel("ngo")}</SelectItem>
                <SelectItem value="shelter">{getTypeLabel("shelter")}</SelectItem>
                <SelectItem value="legal_aid">{getTypeLabel("legal_aid")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Map */}
      <div className="h-[400px] w-full relative">
        <MapView
          onMapReady={handleMapReady}
          className="w-full h-full"
          initialCenter={{ lat: -1.2921, lng: 36.8219 }}
          initialZoom={11}
        />
        
        {/* Legend */}
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 text-xs">
          <div className="font-bold mb-2">{t("Legend", "Ufafanuzi")}</div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500"></div>
              <span>{getTypeLabel("ngo")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>{getTypeLabel("shelter")}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>{getTypeLabel("legal_aid")}</span>
            </div>
            {userLocation && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                <span>{t("Your Location", "Eneo Lako")}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Centers List */}
      <main className="flex-1 overflow-y-auto mobile-container py-6">
        <h3 className="text-lg font-bold mb-4">
          {t("All Help Centers", "Vituo Vyote vya Msaada")} ({filteredCenters?.length || 0})
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
          {filteredCenters && filteredCenters.length > 0 ? (
            filteredCenters.map((center) => (
              <Card
                key={center.id}
                className={`cursor-pointer transition-all hover:shadow-lg p-4 ${
                  selectedCenter === center.id ? "border-primary border-2" : ""
                }`}
                onClick={() => setSelectedCenter(center.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                      center.type === "ngo"
                        ? "bg-blue-100"
                        : center.type === "shelter"
                        ? "bg-red-100"
                        : "bg-green-100"
                    }`}
                  >
                    <MapPin
                      className={`w-5 h-5 ${
                        center.type === "ngo"
                          ? "text-blue-600"
                          : center.type === "shelter"
                          ? "text-red-600"
                          : "text-green-600"
                      }`}
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold mb-1">
                      {language === "sw" ? center.nameSw : center.nameEn}
                    </h3>
                    <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                      {language === "sw" ? center.descriptionSw : center.descriptionEn}
                    </p>
                    <div className="flex items-center gap-2 text-xs flex-wrap">
                      <span className={`px-2 py-0.5 rounded-full border ${getTypeColor(center.type)}`}>
                        {getTypeLabel(center.type)}
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
            ))
          ) : (
            <Card className="friendly-card text-center py-8">
              <div className="text-4xl mb-2">🔍</div>
              <p className="text-muted-foreground">
                {t("No help centers found", "Hakuna vituo vya msaada vilivyopatikana")}
              </p>
            </Card>
          )}
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
