// src/pages/Register.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    ageGroup: '',
    address: '',
    lat: '',   // ✅ 위도
    lng: ''    // ✅ 경도
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ 주소 → 위도/경도 변환
  const fetchCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=AIzaSyBCNU1HVPJTgQ-LTecEFIky17p74VxA8b0`
      );
      const data = await response.json();
      if (data.status === "OK") {
        const location = data.results[0].geometry.location;
        return { lat: location.lat, lng: location.lng };
      } else {
        alert("❌ 주소를 변환하지 못했습니다.");
        return null;
      }
    } catch (error) {
      alert("❌ API 호출 중 오류 발생");
      return null;
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const coordinates = await fetchCoordinates(form.address);
    if (!coordinates) return;

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((u) => u.email === form.email)) {
      alert('이미 가입된 이메일입니다.');
      return;
    }

    const newUser = {
      ...form,
      lat: coordinates.lat,
      lng: coordinates.lng
    };

    const newUsers = [...users, newUser];
    localStorage.setItem('users', JSON.stringify(newUsers));
    alert('회원가입이 완료되었습니다!');
    navigate('/login');
  };

  return (
    <div className="register-page">
      <h2>회원가입</h2>
      <form onSubmit={handleRegister}>
        <input name="name" placeholder="이름" value={form.name} onChange={handleChange} required />
        <input name="email" type="email" placeholder="이메일" value={form.email} onChange={handleChange} required />
        <input name="password" type="password" placeholder="비밀번호" value={form.password} onChange={handleChange} required />
        <select name="ageGroup" value={form.ageGroup} onChange={handleChange} required>
          <option value="">연령대 선택</option>
          <option value="10대">10대</option>
          <option value="20대">20대</option>
          <option value="30대">30대</option>
          <option value="40대">40대</option>
          <option value="50대">50대</option>
          <option value="60대 이상">60대 이상</option>
        </select>
        <input name="address" placeholder="주소 (예: 서울시 강남구)" value={form.address} onChange={handleChange} required />
        <button type="submit">가입하기</button>
      </form>
    </div>
  );
};

export default Register;