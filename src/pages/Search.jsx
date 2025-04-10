// ✅ 상단 import
import React, { useEffect, useState } from "react";

// ✅ 인증키
const serviceKey = 'xY4pKk5mb5896ndM1b%2FIidt47%2Bq5y5vTZGhsjz4xgC09Vjyuhl8qXiYgIX9m4TaFvuz8uXR6oiExgPFyzJsdpA%3D%3D';

const Search = () => {
  const [places, setPlaces] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectedPlaces, setSelectedPlaces] = useState([]);
  const [nearHotels, setNearHotels] = useState([]);

  const toRad = (value) => (value * Math.PI) / 180;
  const calcDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  const fetchPlaces = async () => {
    const url = `http://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${serviceKey}&mapX=127.7298&mapY=37.8813&radius=20000&contentTypeId=12&numOfRows=30&MobileOS=ETC&MobileApp=tour-project&_type=json`;

    try {
      const res = await fetch(url);
      const data = await res.json();
      const items = data?.response?.body?.items?.item || [];

      const filtered = items.filter((item) => item.addr1?.includes("강원"));
      setPlaces(filtered);
    } catch (error) {
      console.error("❌ 관광지 API 호출 실패:", error);
    }
  };

  const fetchNearbyHotels = async (tourList) => {
    const allHotels = [];

    for (const place of tourList) {
      const hotelUrl = `http://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${serviceKey}&mapX=${place.mapx}&mapY=${place.mapy}&radius=3000&contentTypeId=32&numOfRows=5&MobileOS=ETC&MobileApp=tour-project&_type=json`;

      try {
        const res = await fetch(hotelUrl);
        const data = await res.json();
        const items = data?.response?.body?.items?.item || [];

        const nearest = items
          .map((hotel) => ({
            id: hotel.contentid,
            title: hotel.title,
            addr: hotel.addr1,
            lat: parseFloat(hotel.mapy),
            lng: parseFloat(hotel.mapx),
            distance: calcDistance(place.mapy, place.mapx, hotel.mapy, hotel.mapx),
          }))
          .sort((a, b) => a.distance - b.distance)[0];

        if (nearest) allHotels.push(nearest);
      } catch (err) {
        console.error("❌ 숙소 API 오류:", err);
      }
    }

    setNearHotels(allHotels);

    const saveData = {
      selectedPlaces: tourList.map((p) => ({ id: p.contentid, title: p.title })),
      nearHotels: allHotels.map((h) => ({ id: h.id, title: h.title })),
    };
    localStorage.setItem("selectedSpots", JSON.stringify(saveData));
  };

  const toggleSelect = (id) => {
    const updated = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds.slice(0, 2), id];

    setSelectedIds(updated);

    const selected = places.filter((place) => updated.includes(place.contentid));
    setSelectedPlaces(selected);

    fetchNearbyHotels(selected);

    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const searchLogs = JSON.parse(localStorage.getItem("searchLogs") || "[]");

    selected.forEach((place) => {
      searchLogs.push({
        ageGroup: currentUser?.ageGroup || "기타",
        category: "관광지",
        name: place.title,
        timestamp: new Date().toISOString(),
      });
    });

    localStorage.setItem("searchLogs", JSON.stringify(searchLogs));
  };

  const resetSelections = () => {
    setSelectedIds([]);
    setSelectedPlaces([]);
    setNearHotels([]);
    localStorage.removeItem("selectedSpots");
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    if (window.google && selectedPlaces.length > 0) {
      const center = {
        lat: parseFloat(selectedPlaces[0].mapy),
        lng: parseFloat(selectedPlaces[0].mapx),
      };

      const map = new window.google.maps.Map(document.getElementById("map"), {
        center,
        zoom: 11,
        scrollwheel: true,
      });

      selectedPlaces.forEach((place) => {
        const marker = new window.google.maps.Marker({
          position: { lat: parseFloat(place.mapy), lng: parseFloat(place.mapx) },
          map,
          title: place.title,
          icon: {
            url: "/icons/tour.png",
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        const info = new window.google.maps.InfoWindow({
          content: `<strong>${place.title}</strong><br/>${place.addr1}`,
        });

        marker.addListener("click", () => {
          info.open(map, marker);
        });
      });

      nearHotels.forEach((hotel) => {
        const marker = new window.google.maps.Marker({
          position: { lat: hotel.lat, lng: hotel.lng },
          map,
          title: hotel.title,
          icon: {
            url: "/icons/hotel.png",
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        const info = new window.google.maps.InfoWindow({
          content: `<strong>${hotel.title}</strong><br/>${hotel.addr}<br/>거리: ${hotel.distance.toFixed(2)} km`,
        });

        marker.addListener("click", () => {
          info.open(map, marker);
        });
      });
    }
  }, [selectedPlaces, nearHotels]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔍 강원도 관광지 선택 (최대 3개)</h2>
      <button onClick={resetSelections} style={{ marginBottom: "10px" }}>
        선택 초기화
      </button>
      <ul>
        {places.map((place, index) => (
          <li key={`${place.contentid}-${index}`} style={{ marginBottom: "10px" }}>
            <input
              type="checkbox"
              checked={selectedIds.includes(place.contentid)}
              onChange={() => toggleSelect(place.contentid)}
              disabled={!selectedIds.includes(place.contentid) && selectedIds.length >= 3}
            />
            <strong>{place.title}</strong> - {place.addr1}
          </li>
        ))}
      </ul>

      {/* ✅ 선택된 관광지/숙소 텍스트 출력 */}
      <div style={{ marginTop: "20px" }}>
        <h4>📍 선택된 관광지</h4>
        <ul>
          {selectedPlaces.map((p) => (
            <li key={p.contentid}>{p.title}</li>
          ))}
        </ul>

        <h4>🏨 추천 숙소</h4>
        <ul>
          {nearHotels.map((h) => (
            <li key={h.id}>{h.title} (거리: {h.distance.toFixed(2)}km)</li>
          ))}
        </ul>
      </div>

      <div id="map" style={{ height: "500px", marginTop: "20px" }}></div>
    </div>
  );
};

export default Search;