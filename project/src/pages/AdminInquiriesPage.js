import React, { useState, useEffect } from 'react';
import './AdminInquiriesPage.css';
import { useNavigate } from 'react-router-dom';
import { db, collection, getDocs, deleteDoc, doc, query, orderBy } from '../firebase';

function AdminInquiriesPage() {
  const navigate = useNavigate();
  const [inquiries, setInquiries] = useState([]);
  
  // 1. Firestore에서 문의 데이터 불러오기
  useEffect(() => {
    const fetchInquiries = async () => {
      try {
        const q = query(collection(db, 'inquiries')); // orderBy 제거
        const querySnapshot = await getDocs(q);
        const inquiriesData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setInquiries(inquiriesData);
      } catch (error) {
        console.error("문의 데이터를 불러오는 데 실패했습니다.", error);
      }
    };

    fetchInquiries();
  }, []);

  // 2. 개별 문의 삭제 기능 (Firestore에서 삭제)
  const handleDelete = async (id) => {
    if (!window.confirm('정말 이 문의를 삭제하시겠습니까?')) {
      return;
    }
    try {
      const inquiryDoc = doc(db, 'inquiries', id);
      await deleteDoc(inquiryDoc);
      setInquiries(inquiries.filter(item => item.id !== id));
      alert('문의가 삭제되었습니다.');
    } catch (error) {
      console.error("문의 삭제 중 오류가 발생했습니다.", error);
      alert('삭제에 실패했습니다.');
    }
  };

  // 3. 전체 문의 삭제 기능 (Firestore에서 전체 삭제)
  const handleDeleteAll = async () => {
    if (inquiries.length === 0) {
      alert('삭제할 문의가 없습니다.');
      return;
    }
    
    // 전체 삭제 확인
    if (!window.confirm(`총 ${inquiries.length}개의 문의를 모두 영구 삭제하시겠습니까?`)) {
      return;
    }
    
    try {
      for (const inquiry of inquiries) {
        const inquiryDoc = doc(db, 'inquiries', inquiry.id);
        await deleteDoc(inquiryDoc);
      }
      setInquiries([]);
      alert('모든 문의가 성공적으로 삭제되었습니다.');
    } catch (error) {
      console.error("전체 삭제 중 오류가 발생했습니다.", error);
      alert('전체 삭제에 실패했습니다.');
    }
  };

  return (
    <div className="admin-page">
      <div className="admin-container">
        <div className="admin-header-flex">
            <h1>접수된 문의 목록 📋</h1>
            <div className="admin-actions">
                {inquiries.length > 0 && (
                    <button 
                        onClick={handleDeleteAll} 
                        className="delete-all"
                    >
                        전체 삭제
                    </button>
                )}
                
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
