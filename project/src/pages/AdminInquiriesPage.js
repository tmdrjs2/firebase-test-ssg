import React, { useState, useEffect } from 'react';
import './AdminInquiriesPage.css'; 
import { useNavigate } from 'react-router-dom';

function AdminInquiriesPage() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);

  // 1. 문의 데이터 불러오기
  useEffect(() => {
    const savedInquiries = localStorage.getItem('inquiries');
    if (savedInquiries) {
      setInquiries(JSON.parse(savedInquiries));
    }
  }, []);

  // 2. 개별 문의 삭제 기능
  const handleDelete = (id) => {
    if (!window.confirm('정말 이 문의를 삭제하시겠습니까?')) {
      return;
    }
    const updatedInquiries = inquiries.filter(item => item.id !== id);
    setInquiries(updatedInquiries);
    localStorage.setItem('inquiries', JSON.stringify(updatedInquiries));
  };
  
  // ⭐️ 3. 전체 문의 삭제 기능 ⭐️
  const handleDeleteAll = () => {
    if (inquiries.length === 0) {
      alert('삭제할 문의가 없습니다.');
      return;
    }
    
    // 전체 삭제 확인
    if (!window.confirm(`총 ${inquiries.length}개의 문의를 모두 영구 삭제하시겠습니까?`)) {
      return;
    }
    
    // 상태 및 localStorage 초기화
    setInquiries([]);
    localStorage.removeItem('inquiries');
    alert('모든 문의가 성공적으로 삭제되었습니다.');
  };


  return (
    <div className="admin-page">
      <div className="admin-container">
        
        {/* ⭐️ 헤더 영역: 버튼 배치를 위해 수정 ⭐️ */}
        <div className="admin-header-flex">
            <h1>접수된 문의 목록 📋</h1>
            <div className="admin-actions">
                {/* 전체 삭제 버튼 (문의가 있을 때만 보이도록 조건 추가) */}
                {inquiries.length > 0 && (
                    <button 
                        onClick={handleDeleteAll} 
                        className="delete-all"
                    >
                        전체 삭제
                    </button>
                )}
                
                {/* 홈으로 돌아가기 버튼 */}
                <button 
                    onClick={() => navigate('/')} 
                    className="back-home"
                >
                    홈으로 돌아가기
                </button>
            </div>
        </div>
        
        <p>총 {inquiries.length}개의 문의가 있습니다.</p>

        {inquiries.length === 0 ? (
          <p>아직 접수된 문의가 없습니다.</p>
        ) : (
          <div className="inquiry-list">
            {inquiries.map((item) => (
              <div key={item.id} className="inquiry-card">
                <div className="card-header">
                  <strong>{item.name}</strong> ({item.email})
                  <span className="inquiry-date">{item.date}</span>
                </div>
                <div className="card-body">
                  <p>{item.message}</p>
                </div>
                <div className="card-footer">
                  <button onClick={() => handleDelete(item.id)} className="delete-btn">
                    삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminInquiriesPage;