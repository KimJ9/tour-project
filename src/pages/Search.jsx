// src/pages/Search.jsx
import React, { useState, useEffect } from "react";

function Search() {
  const [category, setCategory] = useState("");
  const [ageGroup, setAgeGroup] = useState("");
  const [filteredList, setFilteredList] = useState([]);

  // ✅ 로그인된 사용자 연령대 자동 설정
  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser && currentUser.ageGroup) {
      setAgeGroup(currentUser.ageGroup);
    }
  }, []);

  // ✅ mock 데이터
  const mockData = [
    { id: 1, name: "남이섬", category: "관광지", age: "20대" },
    { id: 2, name: "춘천막국수", category: "맛집", age: "30대" },
    { id: 3, name: "엘리시안 강촌", category: "숙박", age: "20대" },
    { id: 4, name: "소양강 스카이워크", category: "관광지", age: "40대" },
    { id: 5, name: "강촌유스호스텔", category: "숙박", age: "50대" },
    { id: 6, name: "강원한우마을", category: "맛집", age: "60대 이상" },
  ];

  // ✅ 필터링 함수
  const handleSearch = () => {
    const result = mockData.filter((item) => {
      const matchCategory = category === "" || item.category === category;
      const matchAge = ageGroup === "" || item.age === ageGroup;
      return matchCategory && matchAge;
    });

    setFilteredList(result);

    // ✅ 검색 로그 기록 (관광지 이름까지 저장)
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser) {
      const searchLogs = JSON.parse(localStorage.getItem("searchLogs") || "[]");

      result.forEach((item) => {
        searchLogs.push({
          ageGroup: currentUser.ageGroup,
          category: item.category,
          name: item.name, // ✅ 관광지/맛집/숙소 이름 저장
          timestamp: new Date().toISOString()
        });
      });

      localStorage.setItem("searchLogs", JSON.stringify(searchLogs));
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>🔍 관광지 검색</h2>

      {/* 카테고리 선택 */}
      <div style={{ marginBottom: "10px" }}>
        <label>카테고리: </label>
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="">전체</option>
          <option value="관광지">관광지</option>
          <option value="숙박">숙박</option>
          <option value="맛집">맛집</option>
        </select>
      </div>

      {/* 연령대 선택 */}
      <div style={{ marginBottom: "10px" }}>
        <label>연령대: </label>
        <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
          <option value="">전체</option>
          <option value="10대">10대</option>
          <option value="20대">20대</option>
          <option value="30대">30대</option>
          <option value="40대">40대</option>
          <option value="50대">50대</option>
          <option value="60대 이상">60대 이상</option>
        </select>
      </div>

      {/* 검색 버튼 */}
      <button onClick={handleSearch}>검색</button>

      {/* 결과 리스트 */}
      <div style={{ marginTop: "20px" }}>
        <ul>
          {filteredList.map((item) => (
            <li key={item.id}>
              📌 {item.name} ({item.category}, {item.age})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Search;