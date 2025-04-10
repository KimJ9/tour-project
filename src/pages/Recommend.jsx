import React, { useEffect, useState } from "react";

// ✅ 공공데이터 API 호출 함수
const fetchTourData = async (mapX, mapY, radius = 20000) => {
  const serviceKey = 'xY4pKk5mb5896ndM1b%2FIidt47%2Bq5y5vTZGhsjz4xgC09Vjyuhl8qXiYgIX9m4TaFvuz8uXR6oiExgPFyzJsdpA%3D%3D';
  const url = `http://apis.data.go.kr/B551011/KorService1/locationBasedList1?serviceKey=${serviceKey}&mapX=${mapX}&mapY=${mapY}&radius=${radius}&numOfRows=30&MobileOS=ETC&MobileApp=tour-project&_type=json`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    const items = data?.response?.body?.items?.item || [];

    console.log("📦 API 응답 1건 확인:", items[0]);

    return items;
  } catch (error) {
    console.error("❌ 관광지 API 호출 에러:", error);
    return [];
  }
};

function Recommend() {
  const [top3, setTop3] = useState([]);
  const [userLatLng, setUserLatLng] = useState(null);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    const userLat = currentUser?.lat;
    const userLng = currentUser?.lng;

    if (!userLat || !userLng) {
      alert("❌ 사용자 위치 정보가 없습니다.");
      return;
    }

    setUserLatLng({ lat: userLat, lng: userLng });

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

    const loadPlaces = async () => {
      const apiPlaces = await fetchTourData(userLng, userLat);

      const filtered = apiPlaces
      .filter((place) => Number(place.areacode) === 32)
      .map((place) => ({
        id: place.contentid,
        name: place.title,
        category: place.cat2 || "관광지",
        lat: Number(place.mapy),
        lng: Number(place.mapx),
        distance: calcDistance(userLat, userLng, Number(place.mapy), Number(place.mapx)),
        }));

      const sorted = filtered
        .sort((a, b) => a.distance - b.distance)
        .slice(0, 3);

      console.log("🧭 최종 추천 top3:", sorted);

      setTop3(sorted);
    };

    loadPlaces();
  }, []);

  // ✅ 지도 및 마커 렌더링
  useEffect(() => {
    if (userLatLng && window.google) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: userLatLng,
        zoom: 11,
        scrollwheel: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
      });

      new window.google.maps.Marker({
        position: userLatLng,
        map,
        title: "나의 위치",
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png",
          scaledSize: new window.google.maps.Size(32, 32),
        },
      });

      if (top3.length > 0) {
        const iconMap = {
          관광지: "/icons/tour.png",
          맛집: "/icons/food.png",
          숙박: "/icons/hotel.png",
        };

        top3.forEach((place) => {
          console.log("📍 마커 찍는 장소:", place);

          const marker = new window.google.maps.Marker({
            position: { lat: place.lat, lng: place.lng },
            map,
            title: place.name,
            icon: {
              url: iconMap[place.category] || "/icons/tour.png",
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
    }
  }, [userLatLng, top3]);

  return (
    <div style={{ padding: "20px" }}>
      <h2>강원도 여행지 추천</h2>
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