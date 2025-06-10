import { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

const GoongMapLibre = () => {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [mapLoaded, setMapLoaded] = useState(false); // Track map load status
  const markers = useRef([]);

  const apiUrl = "https://rsapi.goong.io";
  const mapUrl = "https://tiles.goong.io/assets";
  // const apiKey = 'OMBgXMarkOykG8l5TxoWWVl2zQ5lALFkddBW1sPK';
  // const mapKey = '6QzAj4BFs62RHFZICvbQImXof7yBYX6XksAfLSH4';

  const center = [105.85242472181584, 21.029579719995272];
  const zoom = 15;

  // Debounce function
  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => func.apply(null, args), delay);
    };
  };

  useEffect(() => {
    if (!mapContainer.current) return; // Đam bảo mapContainer đã được khởi tạo
    if (map.current) {
      map.current.remove(); // Xóa bản đồ cũ nếu đã tồn tại
      map.current = null;
    }

    try {
      map.current = new maplibregl.Map({
        container: mapContainer.current,
        style: `${mapUrl}/goong_map_web.json?api_key=${mapKey}`,
        center: center,
        zoom: zoom,
      });

      map.current.on("load", () => {
        markers.current.forEach((marker) => marker.remove());
        markers.current = [];
        const initialMarker = new maplibregl.Marker()
          .setLngLat(center)
          .addTo(map.current);
        markers.current.push(initialMarker);
        setMapLoaded(true); // Bản đồ đã được tải thành công
        console.log("Map loaded successfully");
      });

      map.current.on("error", (e) => {
        console.error("Map load error:", e.error);
        setMapLoaded(false); // Đánh dấu bản đồ không tải được
      });
    } catch (error) {
      console.error("Map initialization error:", error);
      setMapLoaded(false);
    }

    // Dọn bản đồ khi component unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []); // Chỉ chạy một lần khi component mount

  const fetchAutoComplete = async (query) => {
    if (query.length < 2 || !mapLoaded) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const response = await fetch(
        `${apiUrl}/Place/AutoComplete?api_key=${apiKey}&input=${encodeURIComponent(query)}`,
      );
      if (!response.ok) {
        if (response.status === 429) {
          console.log("Rate limit exceeded. Please try again later.");
          setSearchResults([]);
          setShowResults(false);
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.predictions) {
        setSearchResults(data.predictions);
        setShowResults(true);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    } catch (error) {
      console.error("Error fetching autocomplete:", error);
      setSearchResults([]);
      setShowResults(false);
    }
  };

  const fetchPlaceDetails = async (placeId) => {
    if (!map.current || !mapLoaded) return;
    try {
      const response = await fetch(
        `${apiUrl}/Place/Detail?api_key=${apiKey}&place_id=${placeId}`,
      );
      if (!response.ok) {
        if (response.status === 429) {
          console.log("Rate limit exceeded. Please try again later.");
          return;
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      if (data.result) {
        const { location } = data.result.geometry;
        const lngLat = [location.lng, location.lat];
        map.current.flyTo({ center: lngLat, zoom: 17 });

        markers.current.forEach((marker) => marker.remove());
        markers.current = [];

        const newMarker = new maplibregl.Marker()
          .setLngLat(lngLat)
          .addTo(map.current);
        markers.current.push(newMarker);
      }
    } catch (error) {
      console.error("Error fetching place details:", error);
    }
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    debounce((query) => fetchAutoComplete(query), 500)(value);
  };

  const handleSearchResultClick = (item) => {
    setSearchQuery(item.description);
    setShowResults(false);
    fetchPlaceDetails(item.place_id);
  };

  return (
    <div className="relative h-screen w-full">
      <div ref={mapContainer} className="h-full w-full" />
      {!mapLoaded && (
        <div className="absolute top-8 left-16 text-red-500">
          Failed to load map. Check console for details.
        </div>
      )}
      <div className="absolute top-8 left-16 flex items-center">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="Tìm kiếm địa điểm"
          className="h-10 w-80 rounded border border-gray-300 bg-white px-2 shadow-sm outline-none"
          disabled={!mapLoaded}
        />
        <div
          className="flex h-10 w-10 cursor-pointer items-center justify-center border border-l-0 border-gray-300 bg-white"
          onClick={() => {
            if (mapLoaded)
              handleSearchChange({ target: { value: searchQuery } });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 50 50"
          >
            <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z" />
          </svg>
        </div>
        {showResults && searchResults.length > 0 && (
          <div className="absolute top-11 z-10 w-96 rounded border border-gray-300 bg-white p-2 shadow-lg">
            {searchResults.map((item, index) => (
              <div
                key={index}
                onClick={() => handleSearchResultClick(item)}
                className="w-full cursor-pointer rounded p-2 hover:bg-gray-200"
              >
                {item.description}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// // Error Boundary Component
// class ErrorBoundary extends React.Component {
//   state = { hasError: false };

//   static getDerivedStateFromError(error) {
//     return { hasError: true };
//   }

//   render() {
//     if (this.state.hasError) {
//       return <h1>Something went wrong. Please refresh the page.</h1>;
//     }
//     return this.props.children;
//   }
// }

// export default () => (
//   <ErrorBoundary>
//     <GoongMapLibre />
//   </ErrorBoundary>
// );

export default GoongMapLibre;
