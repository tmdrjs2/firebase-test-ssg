import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
import LandingPage from './pages/LandingPage';
import SignInPage from './pages/SignInPage';
import SignUpPage from './pages/SignUpPage';
import MainPage from './pages/MainPage';
import ShopPage from './pages/ShopPage';
import RegisterPage from './pages/RegisterPage';
import Feature25Page from './pages/Feature25Page';
import Feature50Page from './pages/Feature50Page';
import InquiryPage from './pages/InquiryPage';
import AdminInquiriesPage from './pages/AdminInquiriesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path="/inquiry" element={<InquiryPage />} />
        <Route path='/signin' element={<SignInPage />} />
        <Route path='/signup' element={<SignUpPage />} />
        <Route path='/home' element={<MainPage />} />
        <Route path='/shop' element={<ShopPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/feature25' element={<Feature25Page />} />
        <Route path='/feature50' element={<Feature50Page />} />
        
        {/* 1. 기존의 잘못된 경로를 주석 처리합니다. (기존 코드를 '건드리지 않고' 보존) */}
        {/* <Route path='/AdminInquiriesPage.css' element={<AdminInquiriesPage />} /> */}
        
        {/* 2. 올바른 URL 경로에 대한 라우트를 새로 추가합니다. */}
        <Route path='/admin/inquiries' element={<AdminInquiriesPage />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;