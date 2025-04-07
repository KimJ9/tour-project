import React, { useEffect, useState } from "react";

const mockPlaces = [
  { id: 1, name: "남이섬", category: "관광지", lat: 37.790841, lng: 127.525142 },
  { id: 2, name: "춘천막국수", category: "맛집", lat: 37.881187, lng: 127.735389 },
  { id: 3, name: "엘리시안 강촌", category: "숙박", lat: 37.821583, lng: 127.589391 },
  { id: 4, name: "소양강 스카이워크", category: "관광지", lat: 37.899759, lng: 127.736078 },
  { id: 5, name: "강촌유스호스텔", category: "숙박", lat: 37.818459, lng: 127.604106 },
  { id: 6, name: "강원한우마을", category: "맛집", lat: 37.86421, lng: 127.723543 },
];

function Recommend() {
  const [top3, setTop3] = useState([]);
  const [userLatLng, setUserLatLng] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

    if (currentUser && currentUser.address) {
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        currentUser.address
      )}&key=AIzaSyBCNU1HVPJTgQ-LTecEFIky17p74VxA8b0`;

      fetch(geocodeUrl)
        .then((res) => res.json())
        .then((data) => {
          const location = data.results[0]?.geometry?.location;
          if (location) {
            const userLocation = {
              lat: location.lat,
              lng: location.lng,
            };
            setUserLatLng(userLocation);

            const placesWithDistance = mockPlaces.map((place) => {
              const distance = getDistance(userLocation, {
                lat: place.lat,
                lng: place.lng,
              });
              return { ...place, distance };
            });

            const sorted = placesWithDistance
              .sort((a, b) => a.distance - b.distance)
              .slice(0, 3);
            setTop3(sorted);
          } else {
            alert("❌ 주소를 변환하지 못했습니다.");
          }
        })
        .catch((err) => {
          console.error("Geocoding 오류:", err);
          alert("❌ 주소를 변환하지 못했습니다.");
        });
    }
  }, []);

  useEffect(() => {
    if (userLatLng && window.google) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: userLatLng,
        zoom: 11,
      });

      // ✅ 내 위치 마커
      new window.google.maps.Marker({
        position: userLatLng,
        map,
        title: "나의 위치",
        icon: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
      });

      // ✅ 추천 장소 마커 + InfoWindow
      top3.forEach((place) => {
        const marker = new window.google.maps.Marker({
          position: { lat: place.lat, lng: place.lng },
          map,
          title: place.name,
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

  function getDistance(p1, p2) {
    const R = 6371; // 지구 반지름 (km)
    const dLat = ((p2.lat - p1.lat) * Math.PI) / 180;
    const dLng = ((p2.lng - p1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((p1.lat * Math.PI) / 180) *
        Math.cos((p2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h2>📍 거리 기반 추천</h2>
      <div
        id="map"
        style={{
          width: "100%",
          height: "400px",
          marginBottom: "20px",
          borderRadius: "10px",
        }}
      ></div>

      <ul>
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