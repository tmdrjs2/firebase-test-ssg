import React from 'react';
import { useNavigate } from 'react-router-dom';

function Feature25Page() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h1>유료 기능 25$ 사용하기</h1>
      <p>이제 주간 리포트, 목표 설정 등의 기능을 사용할 수 있습니다.</p>
      <button onClick={() => navigate('/shop')} style={{ marginTop: '20px' }}>
        상점으로 돌아가기
      </button>
    </div>
  );
}

export default Feature25Page;
