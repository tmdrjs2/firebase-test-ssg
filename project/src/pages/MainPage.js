// MainPage.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';
import { auth, db } from '../firebase'; // ⭐️ 1. db, auth import
import { onAuthStateChanged, signOut } from 'firebase/auth'; // ⭐️ 2. auth 함수 import
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  doc, 
  updateDoc, 
  deleteDoc,
  serverTimestamp,
  getDoc // ⭐️ 3. Firestore 함수 import
} from 'firebase/firestore';

function MainPage() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null); // ⭐️ 4. user 상태 추가
  const [focusTime, setFocusTime] = useState(0); // ⭐️ 집중 시간 (초 단위)
  const [goalHours, setGoalHours] = useState(1);
  const [alertMessage, setAlertMessage] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const [tasks, setTasks] = useState({});
  const [newTask, setNewTask] = useState('');

  // ⭐️ 5. 로그인 상태 확인 및 데이터 로드 (실시간)
  useEffect(() => {
    // 인증 상태 리스너
    const unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // 1. 목표 시간 불러오기
        const userDocRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(userDocRef);
        if (docSnap.exists() && docSnap.data().goalHours) {
          setGoalHours(docSnap.data().goalHours);
        }

        // 2. 할 일 목록 실시간 구독 (onSnapshot)
        const tasksQuery = query(collection(db, 'users', currentUser.uid, 'tasks'));
        
        const unsubscribeTasks = onSnapshot(tasksQuery, (querySnapshot) => {
          const userTasks = {};
          querySnapshot.forEach((doc) => {
            const task = { ...doc.data(), id: doc.id }; // Firestore 문서 ID를 task 객체에 포함
            const date = task.date; // task에 저장된 날짜
            
            if (!userTasks[date]) {
              userTasks[date] = [];
            }
            userTasks[date].push(task);
          });
          setTasks(userTasks);
        });

        // 컴포넌트 언마운트 시 할 일 구독 취소
        return () => unsubscribeTasks();

      } else {
        // 로그아웃 상태
        setUser(null);
        setTasks({});
        navigate('/signin'); // 로그인 페이지로 리디렉션
      }
    });

    // 컴포넌트 언마운트 시 인증 구독 취소
    return () => unsubscribeAuth();
  }, [navigate]);

  // ⭐️ 11. 집중 시간 타이머 추가
  useEffect(() => {
    // 1초마다 focusTime을 1씩 증가시키는 타이머 설정
    const timer = setInterval(() => {
      setFocusTime(prevTime => prevTime + 1);
    }, 1000);

    // 컴포넌트 언마운트 시 타이머 정리
    return () => clearInterval(timer);
  }, []); // 빈 배열: 최초 1회만 실행

  // ⭐️ 6. (제거) localStorage 관련 useEffect 2개 모두 삭제
  // ... (Firestore 연동 코드로 대체되었으므로 해당 주석 유지)

  // ⭐️ 7. 할 일 추가 (Firestore)
  const handleAddTask = async () => {
    if (!newTask.trim() || !user) return;

    const now = new Date();
    const timestamp = `${now.getMonth() + 1}월 ${now.getDate()}일 ${now.getHours()}시 ${now.getMinutes()}분`;

    const taskData = {
      text: newTask,
      done: false,
      time: timestamp,
      date: selectedDate, // ⭐️ 선택된 날짜를 task 객체에 저장
      createdAt: serverTimestamp() // 정렬을 위한 서버 시간
    };

    try {
      // 'users' -> (사용자ID) -> 'tasks' 컬렉션에 새 할 일 추가
      await addDoc(collection(db, 'users', user.uid, 'tasks'), taskData);
      setNewTask(''); // 입력창 비우기 (onSnapshot이 자동으로 UI를 업데이트합니다)
    } catch (error) {
      console.error("할 일 추가 오류:", error);
    }
  };

  // ⭐️ 8. 완료 체크 (Firestore)
  const toggleTaskDone = async (date, index) => {
    if (!user) return;
    
    try {
      // 1. task 객체에서 Firestore 문서 ID 가져오기
      const taskToToggle = tasks[date][index];
      if (!taskToToggle.id) {
        console.error("Task ID가 없습니다.");
        return;
      }

      // 2. Firestore 문서 참조 생성
      const taskRef = doc(db, 'users', user.uid, 'tasks', taskToToggle.id);

      // 3. 'done' 필드 업데이트
      await updateDoc(taskRef, {
        done: !taskToToggle.done
      });
      // (onSnapshot이 자동으로 UI를 업데이트합니다)
    } catch (error) {
      console.error("할 일 완료/취소 오류:", error);
    }
  };

  // ⭐️ 9. 삭제 (Firestore)
  const deleteTask = async (date, index) => {
    if (!user) return;

    try {
      const taskToDelete = tasks[date][index];
      if (!taskToDelete.id) {
        console.error("Task ID가 없습니다.");
        return;
      }
      
      const taskRef = doc(db, 'users', user.uid, 'tasks', taskToDelete.id);
      await deleteDoc(taskRef);
      // (onSnapshot이 자동으로 UI를 업데이트합니다)
    } catch (error) {
      console.error("할 일 삭제 오류:", error);
    }
  };

  // 네비게이션 함수들
  const goToShop = () => navigate('/shop');
  const goToRegister = () => navigate('/register', { state: { focusTime, goalHours, alertMessage } });
  
  // ⭐️ 10. 로그아웃 (Firebase)
  const goToLogout = async () => {
    try {
      await signOut(auth); // Firebase 로그아웃
      // (onAuthStateChanged 리스너가 자동으로 /signin으로 리디렉션합니다)
      navigate('/'); // 랜딩 페이지로 이동
    } catch (error) {
      console.error("로그아웃 오류:", error);
    }
  };

  // 목표 달성률 계산 (goalHours는 시간 단위, focusTime은 초 단위)
  const progressPercent = Math.min((focusTime / (goalHours * 3600)) * 100, 100);

  // 카드 스타일 (기존 코드 유지)
  const cardStyle = {
    flex: 1,
    minWidth: '300px',
    padding: '20px',
    borderRadius: '10px',
    border: '1px solid #ccc',
    backgroundColor: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    fontSize: '16px',
  };

  return (
    <div className="main-page">
      <header
        className="main-header"
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <h1>AI 기반 집중 관리 & 목표 추적</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={goToShop}
            style={{ padding: '5px 15px', borderRadius: '5px', cursor: 'pointer' }}
          >
            상점
          </button>
          <button
            onClick={goToRegister}
            style={{
              padding: '5px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              backgroundColor: '#4caf50',
              color: 'white',
              fontWeight: 600,
              transition: '0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#43a047')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#4caf50')}
          >
            등록하기
          </button>
          <button
            onClick={goToLogout}
            style={{
              padding: '5px 15px',
              borderRadius: '5px',
              cursor: 'pointer',
              backgroundColor: '#f44336', 
              color: 'white',
              fontWeight: 600,
              transition: '0.3s',
            }}
            onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#d32f2f')}
            onMouseOut={(e) => (e.currentTarget.style.backgroundColor = '#f44336')}
          >
            로그아웃
          </button>
        </div>
      </header>

      <section className="content" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
        {/* 왼쪽 카드: 집중 상태 / 알림 / 목표 달성률 */}
        <div className="card" style={cardStyle}>
           <div style={{ marginBottom: '20px' }}>
             <h2>오늘 집중 상태 분석</h2>
             <p>
               집중 시간: {Math.floor(focusTime / 3600)}시간 {Math.floor((focusTime % 3600) / 60)}분{' '}
               {focusTime % 60}초
             </p>
           </div>

           <div style={{ marginBottom: '20px' }}>
             <h2>맞춤 알림</h2>
             <p>{alertMessage || '알림이 표시됩니다.'}</p>
           </div>

           <div>
             <h2>오늘 목표 달성률</h2>
             <div className="progress-bar" style={{ height: '20px', margin: '10px 0' }}>
               {/* ⭐️ 달성률에 따라 배경을 채웁니다. (progressPercent 사용) */}
               <div className="progress" style={{ 
                 width: `${progressPercent}%`, 
                 backgroundColor: '#4caf50', // 예시 색상
                 height: '100%',
                 borderRadius: 'inherit'
               }} />
             </div>
             <p>
               오늘 목표: {goalHours}시간 / 현재 집중:{' '}
               {Math.floor(focusTime / 3600)}h {Math.floor((focusTime % 3600) / 60)}m {focusTime % 60}
               s
             </p>
             <p>진행률: {progressPercent.toFixed(1)}%</p>
           </div>
         </div>


        {/* 오른쪽: 달력 + 할 일 리스트 (기존 코드 유지) */}
        <div className="card" style={cardStyle}>
          <h2>달력</h2>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{
              padding: '10px',
              fontSize: '16px',
              borderRadius: '5px',
              border: '1px solid #ccc',
              width: '50%',
            }}
          />
          <p>선택된 날짜: {selectedDate}</p>

          <div style={{ marginTop: '20px' }}>
            <h3>오늘의 할 일</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
              <input
                type="text"
                placeholder="할 일을 입력하세요"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '5px',
                  border: '1px solid #ccc',
                }}
              />
              <button
                onClick={handleAddTask}
                style={{
                  padding: '10px 15px',
                  borderRadius: '5px',
                  backgroundColor: '#4caf50',
                  color: 'white',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                추가
              </button>
            </div>

            {tasks[selectedDate] && tasks[selectedDate].length > 0 ? (
              <ul style={{ paddingLeft: '20px' }}>
                {tasks[selectedDate].map((task, index) => (
                  <li key={task.id} style={{ marginBottom: '8px' }}> 
                    <input
                      type="checkbox"
                      checked={task.done}
                      onChange={() => toggleTaskDone(selectedDate, index)}
                      style={{ marginRight: '8px' }}
                    />
                    <span
                      style={{
                        textDecoration: task.done ? 'line-through' : 'none',
                        color: task.done ? '#888' : 'black',
                      }}
                    >
                      {task.text}
                    </span>
                    <small style={{ marginLeft: '8px', color: '#666' }}>({task.time})</small>
                    <button
                      onClick={() => deleteTask(selectedDate, index)}
                      style={{
                        marginLeft: '10px',
                        backgroundColor: '#f44336',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '3px 7px',
                        cursor: 'pointer',
                      }}
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p>등록된 할 일이 없습니다.</p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default MainPage;