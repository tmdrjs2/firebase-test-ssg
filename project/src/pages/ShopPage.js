// ShopPage.js
import React, { useState } from 'react';
import './ShopPage.css';

function ShopPage() {
  const [purchasedFeatures, setPurchasedFeatures] = useState({
    feature25: false,
    feature50: false,
  });

  // 구매 버튼 클릭 시 알림만 표시
  const handlePurchase = (feature) => {
    alert('향후 업데이트 예정입니다.');
    // navigate 호출 제거 -> 페이지 이동 없음
  };

  return (
    <div className="shop-page">
      <header className="shop-header">
        <h1>[상점]</h1>
      </header>

      <section className="shop-content">
        {/* 무료 기능 */}
        <div className="shop-card">
          <h2>무료 기능 체험</h2>
          <ol>
            <li>집중 시간 측정</li>
            <li>목표 설정</li>
            <li>맞춤 알림</li>
          </ol>
          <button onClick={() => alert('무료 기능 체험 시작!')}>체험 시작</button>
        </div>

        {/* 유료 기능 25$ */}
        <div className="shop-card">
          <h2>유료 기능 - 25$</h2>
          <ol>
            <li>무료 기능 모두 포함</li>
            <li>상세 목표 통계 제공 – 주간/월간 달성률 그래프와 통계 확인</li>
            <li>주간 리포트 – AI가 추천하는 집중 패턴 분석 및 요약 리포트 제공</li>
            <li>추가 목표 설정 – 하루/주간 목표를 더 세부적으로 설정 가능</li>
            <li>집중 시간 히스토리 기록 – 지난 공부 기록과 패턴을 한눈에 확인</li>
          </ol>
          <button onClick={() => handlePurchase('feature25')}>구매</button>
        </div>

        {/* 유료 기능 50$ */}
        <div className="shop-card">
          <h2>유료 기능 - 50$</h2>
          <ol>
            <li>25$ 유료 기능 모두 포함</li>
            <li>AI 맞춤 알림 – 개인 집중 패턴에 맞춘 알림과 학습 추천</li>
            <li>집중 분석 추천 기능 – 집중 시간과 패턴을 기반으로 맞춤 학습 전략 제공</li>
            <li>추가 목표 설정 – 하루/주간 목표를 더 세부적으로 설정 가능</li>
            <li>집중 시간 히스토리 기록 – 지난 공부 기록과 패턴을 한눈에 확인</li>
            <li>테마/커스터마이징 기능 – 앱 UI 테마 변경, 알림 스타일 커스터마이징</li>
            <li>보너스 콘텐츠 제공 – 집중력 향상 팁, AI 추천 학습 자료 등</li>
          </ol>
          <button onClick={() => handlePurchase('feature50')}>구매</button>
        </div>
      </section>
    </div>
  );
}

export default ShopPage;
