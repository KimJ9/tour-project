import * as React from "react";
import { ActionButton } from "./ActionButton";
import { GuestLink } from "./GuestLink";
import LoginForm from "./LoginForm"; // ✅ 로그인 폼 import
import "./LoginScreen.css"; // CSS는 나중에 더 입히자

const LoginScreen: React.FC = () => {
  return (
    <main className="login-main">
      <section className="login-section">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/2775e44b0b88c94472bbf16b557cb836ff03734a?placeholderIfAbsent=true&apiKey=171b50a461794277b8c6b240697269f5"
          alt="Login background"
          className="login-bg-img"
        />

        {/* ✅ 로그인 입력 폼 추가 */}
        <LoginForm />

        <nav className="login-nav">
          <div className="login-button login-filled">
            <ActionButton href="/login">Login</ActionButton>
          </div>

          <div className="login-button login-outlined">
            <ActionButton href="/register">Register</ActionButton>
          </div>
        </nav>

        <GuestLink />
      </section>
    </main>
  );
};

export default LoginScreen;