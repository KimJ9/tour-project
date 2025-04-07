import React, { useEffect, useState } from "react";

function Recommend() {
  const [top3, setTop3] = useState([]);
  const [userLatLng, setUserLatLng] = useState(null);

  // ✅ 사용자 위치 받아오기 및 거리 계산
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const userLat = currentUser?.lat;
    const userLng = currentUser?.lng;

    if (!userLat || !userLng) {
      alert("❌ 사용자 위치 정보가 없습니다.");
      return;
    }

    setUserLatLng({ lat: userLat, lng: userLng });

    const places = [
      { id: 1, name: "남이섬", category: "관광지", lat: 37.790277, lng: 127.525833 },
      { id: 2, name: "엘리시안 강촌", category: "숙박", lat: 37.823921, lng: 127.623795 },
      { id: 3, name: "강촌유스호스텔", category: "숙박", lat: 37.8189, lng: 127.6381 },
    ];

    const toRad = (value) => (value * Math.PI) / 180;
    const calcDistance = (lat1, lng1, lat2, lng2) => {
      const R = 6371;
      const dLat = toRad(lat2 - lat1);
      const dLng = toRad(lng2 - lng1);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) ** 2;
      return R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
    };

    const placesWithDistance = places.map((place) => ({
      ...place,
      distance: calcDistance(userLat, userLng, place.lat, place.lng),
    }));

    const sorted = placesWithDistance
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 3);

    setTop3(sorted);
  }, []);

  // ✅ 지도 렌더링 + 마커 표시
  useEffect(() => {
    if (userLatLng && window.google) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: userLatLng,
        zoom: 11,
        scrollwheel: true, // ✅ 휠 확대 허용
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      // ✅ 내 위치 마커
      new window.google.maps.Marker({
        position: userLatLng,
        map,
        title: "나의 위치",
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });

      // ✅ 카테고리별 아이콘 경로 지정
      const iconMap = {
        관광지: "/icons/tour.png",
        맛집: "/icons/food.png",
        숙박: "/icons/hotel.png",
      };

      // ✅ 추천 마커 + InfoWindow
      top3.forEach((place) => {
        const marker = new window.google.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map,
          title: place.name,
          icon: {
            url: iconMap[place.category] || "/icons/tour.png", // fallback
            scaledSize: new window.google.maps.Size(32, 32),
          },
        });

        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="font-size:14px;">
              <strong>${place.name}</strong><br/>
              카테고리: ${place.category}<br/>
              거리: ${place.distance.toFixed(2)} km
            </div>
          `,
        });

        marker.addListener("click", () => {
          infoWindow.open(map, marker);
        });
      });
    }
  }, [userLatLng, top3]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>📍 거리 기반 추천</h2>
      <div id="map" style={{ width: "100%", height: "400px", marginTop: "20px" }}></div>
      <ul style={{ marginTop: "20px" }}>
        {top3.map((place) => (
          <li key={place.id}>
            📌 {place.name} ({place.category}) - {place.distance.toFixed(2)} km
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Recommend;