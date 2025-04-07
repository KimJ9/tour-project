import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";

import Home from "./pages/Home";
import Search from "./pages/Search";
import Recommend from "./pages/Recommend";
import NotFound from "./pages/NotFound";
import ChartPage from "./pages/Chart";
// ✅ Login/Register 페이지 import 추가!
import LoginScreen from "./pages/Login/LoginScreen";
import Register from "./pages/Login/Register"; // Register.jsx 파일을 src/pages에 두었을 경우

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<Search />} />
        <Route path="/recommend" element={<Recommend />} />
        <Route path="/login" element={<LoginScreen />} />
        {/* ✅ 회원가입 경로 추가 */}
        <Route path="/register" element={<Register />} />
        <Route path="/chart" element={<ChartPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}

export default App;