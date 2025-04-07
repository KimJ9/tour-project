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
    <header className="header">
      <h1>강원도 여행지 추천</h1>
      <nav>
        <Link to="/">홈</Link>
        <Link to="/search">검색</Link>
        <Link to="/recommend">추천</Link>
        {!userName && <Link to="/login">로그인</Link>}
        {!userName && <Link to="/register">회원가입</Link>}
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