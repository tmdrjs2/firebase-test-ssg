import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

function LandingPage() {
  const navigate = useNavigate();

  // 리뷰 데이터
  const reviews = [
    { name: '여자', comment: '무료 기능만으로도 오늘의 집중 상태를 한눈에 확인할 수 있어 편리합니다!' },
    { name: '남자', comment: '유료 기능 체험 후 목표 달성률 그래프 덕분에 공부 계획을 효율적으로 짤 수 있었어요.' },
    { name: '리재우', comment: '맞춤 알림 기능 덕분에 집중 시간을 놓치지 않고 학습할 수 있어 좋아요.' },
    { name: '퐁퐁쓰', comment: '25달러 유료 기능으로 집중 분석이 더 상세해져서 목표 관리가 훨씬 수월해졌습니다.' },
    { name: '이게 좋아', comment: '무료와 유료 기능을 함께 사용하니 하루 공부 계획과 통계 확인이 한눈에 가능해졌어요.' },
    { name: '이거지', comment: '50달러 유료기능을 사용하니 더 좋은 기능이 많아서 좋아요!' },
  ];

  // 리뷰 토글 상태
  const [showReviews, setShowReviews] = useState(false);

  return (
    <div className="landing-page">
      {/* 헤더 */}
      <header className="header">
        <h1 className="logo">AI Focus Tracker</h1>
        <div className="header-buttons">
          <button onClick={() => navigate('/signin')}>로그인</button>
          <button onClick={() => navigate('/signup')}>회원가입</button>
          <button onClick={() => navigate('/inquiry')}>고객문의</button> {/* 추가된 링크 */}
        </div>
      </header>


      {/* 히어로 섹션 */}
      <section className="hero">
        <h2>AI로 집중력 관리 & 목표 달성</h2>
        <p>오늘의 집중 시간을 기록하고, 목표를 스마트하게 추적하세요.</p>
        <div className="cta-buttons">
          <button onClick={() => navigate('/signup')}>회원가입</button>
          <button onClick={() => navigate('/signin')}>로그인</button>
        </div>
      </section>

      {/* 리뷰 섹션 */}
      <section className="reviews-section">
        <div className="reviews-box">
          <h2>사용자 리뷰</h2>

          {/* 리뷰 보기/숨기기 버튼 */}
          <button
            className="toggle-reviews-btn"
            onClick={() => setShowReviews((prev) => !prev)}
          >
            {showReviews ? '리뷰 닫기' : '리뷰 보기'}
          </button>

          {/* 리뷰 리스트 (토글 + 애니메이션) */}
          <div className={`review-list-container ${showReviews ? 'open' : ''}`}>
            <div className="review-list">
              {reviews.map((review, index) => (
                <div key={index} className="review-card">
                  <strong>{review.name}</strong>
                  <p>{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
