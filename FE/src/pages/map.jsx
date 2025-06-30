import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { useEffect, useRef, useState } from "react";

const GoongMapLibre = ({ address }) => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markers = useRef([]);
  const [mapLoaded, setMapLoaded] = useState(false);

  const apiKey = import.meta.env.VITE_GOONG_API_KEY;
  const mapKey = import.meta.env.VITE_GOONG_MAP_KEY;

  const mapUrl = "https://tiles.goong.io/assets";

  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: `${mapUrl}/goong_map_web.json?api_key=${mapKey}`,
      center: [105.8524, 21.0295],
      zoom: 13,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Geocode address when changed
  useEffect(() => {
    if (!address || !mapLoaded || !map.current) return;

    const fetchCoordinates = async () => {
      try {
        const res = await fetch(
          `https://rsapi.goong.io/Geocode?address=${encodeURIComponent(address)}&api_key=${apiKey}`,
        );
        const data = await res.json();
        const location = data?.results?.[0]?.geometry?.location;

        if (location) {
          const lngLat = [location.lng, location.lat];
          map.current.flyTo({ center: lngLat, zoom: 16 });

          markers.current.forEach((m) => m.remove());
          const marker = new maplibregl.Marker()
            .setLngLat(lngLat)
            .addTo(map.current);
          markers.current = [marker];
        }
      } catch (err) {
        console.error("Lỗi geocoding:", err);
      }
    };

    fetchCoordinates();
  }, [address, mapLoaded]);

  return (
    <div className="h-[400px] w-full overflow-hidden rounded">
      <div ref={mapContainer} className="h-full w-full" />
    </div>
  );
};

export default GoongMapLibre;
