import React, { useState, useEffect } from 'react';
import '../OrderPage.css';

const OrderPage = () => {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/merchant/menu');
      const data = await response.json();
      setMenus(data);
    } catch (error) {
      console.error('Error fetching menus:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/merchant/menu/categories');
      const data = await response.json();
      setCategories(data);
      setSelectedCategory(data[0] || ''); // 默认选择第一个类别，如果没有类别则设置为空
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const handleClose = () => {
    setSelectedMenu(null);
  };

  const filteredMenus = selectedCategory ? menus.filter(menu => menu.category === selectedCategory) : menus;

  return (
    <div className="order-page">
      <div className="header-container">
        <header className="header">
          <div className="menu-icon">☰</div>
          <h1 className="title">Restaurant Name</h1>
          <div className="cart-icon">🛒</div>
        </header>
        <div className="search-bar">
          <div className="search-icon">🔍</div>
          <input type="text" placeholder="Search..." />
        </div>
      </div>
      <div className="tabs">
        {categories.map((category, index) => (
          <button
            key={index}
            className={`tab ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category || 'Uncategorized'}
          </button>
        ))}
      </div>
      <div className="menu-list">
        {filteredMenus.map((menu) => (
          <div key={menu.id} className="menu-item" onClick={() => handleMenuClick(menu)}>
            <img src={menu.imagePath} alt={menu.name} />
            <div className="menu-info">
              <h2>{menu.name}</h2>
              <p>${menu.price}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedMenu && (
        <div className="menu-detail-overlay">
          <div className="menu-detail">
            <button className="close-button" onClick={handleClose}>✖</button>
            <img src={selectedMenu.imagePath} alt={selectedMenu.name} />
            <h2>{selectedMenu.name}</h2>
            <p>{selectedMenu.description}</p>
            <p>${selectedMenu.price}</p>
            <p>{selectedMenu.isAvailable ? 'Available' : 'Not Available'}</p>
            <button className="add-to-cart-button">Add to Cart</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
