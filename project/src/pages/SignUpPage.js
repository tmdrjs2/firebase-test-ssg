// SignUpPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './SignUpPage.css';
import { auth } from '../firebase'; // Firebase import
import { createUserWithEmailAndPassword } from 'firebase/auth';

function SignUpPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Firebase 회원가입
      await createUserWithEmailAndPassword(auth, email, password);
      alert('회원가입이 완료되었습니다!');
      navigate('/signin'); // 회원가입 후 로그인 페이지로 이동
    } catch (err) {
      setError('회원가입 실패: ' + err.message); // 오류 처리
    }
  };

  return (
    <div className="signup-page">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h2>회원가입</h2>
        
        <label htmlFor="email">이메일</label>
        <input 
        type="email" 
        id="email" 
        value={email}
        placeholder="이메일을 입력하세요" 
        onChange={(e) => setEmail(e.target.value)}
        required />

        <label htmlFor="password">비밀번호</label>
        <input
          type="password"
          id="password"
          placeholder="비밀번호를 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p style={{ color: 'red' }}>{error}</p>}
        <button type="submit">회원가입</button>
      </form>
    </div>
  );
}

export default SignUpPage;
