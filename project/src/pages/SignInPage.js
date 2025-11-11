// SignInPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase'; // firebase.js 경로
import { signInWithEmailAndPassword } from 'firebase/auth'; // Firebase Authentication import
import './SignInPage.css';

function SignInPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Firebase 로그인
      await signInWithEmailAndPassword(auth, email, password);
      alert('로그인 성공!');
      navigate('/home'); // 로그인 후 홈 페이지로 이동
    } catch (err) {
      setError('로그인 실패: ' + err.message); // 오류 처리
    }
  };


  return (
    <div className="signin-container">
      <form className="signin-form" onSubmit={handleSubmit}>
        <h2>로그인</h2>
        <label htmlFor="email">아이디 (이메일)</label>
        <input
          type="email"
          id="email"
          placeholder="이메일을 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

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
        <button type="submit">로그인</button>
      </form>
    </div>
  );
}

export default SignInPage;

