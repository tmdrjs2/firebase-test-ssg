// InquiryPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InquiryPage.css';
import { db } from '../firebase'; // ⭐️ 1. db import
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'; // ⭐️ 2. Firestore 함수 import

function InquiryPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });

  // handleSubmit을 async 함수로 변경
  const handleSubmit = async (e) => { // ⭐️ 3. async로 변경
    e.preventDefault();
    
    // 1. 필수 값 확인
    if (!formData.name || !formData.email || !formData.message) {
        alert('모든 필수 항목을 입력해주세요.');
        return;
    }
    
    // 2. Firestore에 저장할 새 문의 객체 생성
    const newInquiry = {
      name: formData.name,
      email: formData.email,
      message: formData.message,
      createdAt: serverTimestamp(), // ⭐️ 4. 서버 시간 기준으로 저장
      status: 'pending',
    };

    try {
      // ⭐️ 5. Firestore 'inquiries' 컬렉션에 데이터 추가
      await addDoc(collection(db, 'inquiries'), newInquiry);
      
      // 6. 폼 데이터 초기화
      setFormData({ name: '', email: '', message: '' });
      
      // 7. 제출 완료 후 관리자 페이지로 리디렉션
      navigate('/admin/inquiries');

    } catch (error) {
      console.error("문의 제출 오류:", error);
      alert('문의 제출에 실패했습니다. 다시 시도해주세요.');
    }
  };
  
  const handleChange = (e) => {
    // ⭐️ (참고) submitted 상태가 제거되었으므로 관련 로직 삭제
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 기본 문의 폼
  return (
    <div className="inquiry-page">
      <header className="header">
        <h1 className="logo">AI Focus Tracker</h1>
        <div className="header-buttons">
          <button onClick={() => navigate('/signin')}>로그인</button>
          <button onClick={() => navigate('/signup')}>회원가입</button>
        </div>
      </header>
      <main className="inquiry-main">
        <h1>고객문의</h1>
        <p>문의 사항을 작성해주시면 최대한 빠르게 답변드리겠습니다.</p>
        <form className="inquiry-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="이름"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="이메일"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="문의 내용"
            value={formData.message}
            onChange={handleChange}
            required
          />
          <button type="submit">문의 보내기</button>
        </form>
        <button className="back-home-btn" onClick={() => navigate('/')}>
          랜딩페이지로 돌아가기
        </button>
      </main>
    </div>
  );
}

export default InquiryPage;