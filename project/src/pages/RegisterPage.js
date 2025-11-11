// RegisterPage.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase'; // ⭐️ 1. db와 auth import
import { doc, setDoc, getDoc } from 'firebase/firestore'; // ⭐️ 2. Firestore 함수 import
import { onAuthStateChanged } from 'firebase/auth'; // ⭐️ 3. auth 상태 import

function RegisterPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state || {};
  
  const [goalHours, setGoalHours] = useState(data.goalHours || 1);
  const [user, setUser] = useState(null); // ⭐️ 4. user 상태 추가

  // ⭐️ 5. 로그인 상태 확인 및 기존 목표 시간 불러오기
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        // Firestore에서 기존 목표 시간 불러오기
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists() && docSnap.data().goalHours) {
          setGoalHours(docSnap.data().goalHours);
        }
      } else {
        // 로그인되지 않은 경우 로그인 페이지로 리디렉션
        navigate('/signin');
      }
    });
    return () => unsubscribe(); // 클린업
  }, [navigate]);

  const handleGoalHoursChange = (e) => {
    setGoalHours(e.target.value);
  };

  // ⭐️ 6. Firestore에 목표 시간 저장
  const handleSaveGoal = async () => {
    if (!user) {
      alert('로그인이 필요합니다.');
      return;
    }

    try {
      // 'users' 컬렉션에 사용자 UID를 문서 ID로 하여 데이터 저장
      const userDocRef = doc(db, 'users', user.uid);
      // merge: true는 기존 문서를 덮어쓰지 않고 병합합니다.
      await setDoc(userDocRef, { goalHours: Number(goalHours) }, { merge: true });
      alert(`${goalHours}시간 목표가 저장되었습니다!`);
    } catch (error) {
      console.error("목표 저장 오류:", error);
      alert('목표 저장에 실패했습니다.');
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        padding: '40px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
        color: '#333',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}
    >
      <h1 style={{ marginBottom: '30px' }}>등록된 집중 목표</h1>

      <div
        style={{
          margin: '20px 0',
          padding: '20px',
          borderRadius: '10px',
          width: '60%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          color: '#222',
        }}
      >
        <h2>목표 설정 & 추적</h2>
        <label htmlFor="goalHours" style={{ fontSize: '18px', marginBottom: '10px', display: 'block' }}>
          목표 시간 (시간 단위):
        </label>
        <input
          type="number"
          id="goalHours"
          value={goalHours}
          onChange={handleGoalHoursChange}
          style={{
            padding: '10px',
            fontSize: '16px',
            width: '60%',
            borderRadius: '5px',
            border: '1px solid #ccc',
            marginBottom: '15px',
          }}
        />
        <button
          onClick={handleSaveGoal}
          style={{
            padding: '10px 20px',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
            transition: 'background-color 0.3s',
          }}
        >
          목표 시간 저장
        </button>
        {/*
          'savedGoalHours' 상태는 Firestore에서 실시간으로 불러오므로 
          별도로 표시할 필요가 없거나, goalHours를 그대로 사용해도 됩니다.
        */}
        <p>현재 설정된 목표 시간: {goalHours}시간</p>
      </div>

      <button
        onClick={() => navigate('/home')} // 'MainPage'의 경로가 '/home'이라고 가정합니다.
        style={{
          marginTop: '30px',
          padding: '12px 24px',
          backgroundColor: '#4caf50',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: '600',
          boxShadow: '0 3px 6px rgba(0,0,0,0.1)',
          transition: 'background-color 0.3s',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#43a047')}
        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#4caf50')}
      >
        홈으로 돌아가기
      </button>
    </div>
  );
}

export default RegisterPage;