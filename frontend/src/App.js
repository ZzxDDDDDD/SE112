import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './components/UserContext'; // 导入 UserProvider
import LoginPage from './routes/Login';
import RegisterPage from './routes/Register';

function App() {
  return (
    <UserProvider> {/* 使用 UserProvider 包裹应用 */}
      <Router>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* 其他路由 */}
        </Routes>
      </Router>
    </UserProvider>
  );
}

export default App;