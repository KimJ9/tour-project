import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [userName, setUserName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");
    if (currentUser && currentUser.name) {
      setUserName(currentUser.name);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // 로그인 정보 제거
    alert("로그아웃 되었습니다.");
    setUserName(""); // 상태 초기화
    navigate("/");   // 홈으로 이동
  };

  return (
    <header className="header" style={{ padding: "20px", textAlign: "center", backgroundColor: "#f0f0f0" }}>
      <h1>강원도 여행지 추천</h1>
      <nav style={{ marginTop: "10px" }}>
        <Link to="/" style={{ margin: "0 10px" }}>홈</Link>
        <Link to="/search" style={{ margin: "0 10px" }}>검색</Link>
        <Link to="/recommend" style={{ margin: "0 10px" }}>거리기반추천</Link>
        <Link to="/chart" style={{ margin: "0 10px"}}>연령대별 추천</Link>
        {!userName && <Link to="/login" style={{ margin: "0 10px" }}>로그인</Link>}
        {!userName && <Link to="/register" style={{ margin: "0 10px" }}>회원가입</Link>}
      </nav>

      {/* 로그인 상태일 때만 환영 메시지 + 로그아웃 버튼 */}
      {userName && (
        <div style={{ marginTop: "8px" }}>
          <p style={{ display: "inline-block", marginRight: "10px" }}>
            {userName}님, 환영합니다!
          </p>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      )}
    </header>
  );
};

export default Header;