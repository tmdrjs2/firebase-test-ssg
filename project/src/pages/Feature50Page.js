import React from 'react';
import { useNavigate } from 'react-router-dom';

function Feature50Page() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>유료 기능 50$ 사용하기</h1>
      <p>이제 AI 맞춤 알림, 집중 분석 추천 기능 등을 사용할 수 있습니다.</p>
      <button onClick={() => navigate('/shop')} style={{ marginTop: '20px' }}>
        상점으로 돌아가기
      </button>
    </div>
  );
}

export default Feature50Page;
