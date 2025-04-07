// src/pages/Login/LoginForm.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // localStorage에서 사용자 목록 불러오기
    const users = JSON.parse(localStorage.getItem("users") || "[]");

    // 이메일 & 비밀번호 일치하는 사용자 찾기
    const user = users.find(
      (u: any) => u.email === email && u.password === password
    );

    if (user) {
      // 로그인 성공 → 현재 로그인한 사용자 정보 저장
      localStorage.setItem("currentUser", JSON.stringify(user));
      alert("✅ 로그인 성공!");
      navigate("/"); // 메인 페이지로 이동
    } else {
      alert("❌ 이메일 또는 비밀번호가 일치하지 않습니다.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form">
      <input
        type="email"
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">로그인</button>
    </form>
  );
};

export default LoginForm;