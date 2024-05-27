import React from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register'; 
import OrderForm from './components/OrderForm'; // 导入 OrderForm 组件
import Tables from './components/Tables'; // 导入 Tables 组件
import EditMenu from './components/MerchantEditMenu';
import OrderPage from './components/OrderPage';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Router>
          <nav>
          </nav>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/order" element={<OrderForm />} /> {/* 新增 Order 路由 */}
            <Route path="/tables" element={<Tables />} /> {/* 新增 Tables 路由 */}
            <Route path="/editmenu" element={<EditMenu />} /> {/* 新增 Tables 路由 */}
            <Route path="/orderpage" element={<OrderPage />} />
          </Routes>
        </Router>
      </header>
    </div>
  );
}

export default App;
