import React, { useState, useEffect } from 'react';
import '../OrderPage.css';
import UserInfoForm from './UserInfoForm'; // 确保导入路径正确

const OrderPage = () => {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [comment, setComment] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isUserInfoFormOpen, setIsUserInfoFormOpen] = useState(false); // 控制用户信息表单显示
  const [selectedTableId, setSelectedTableId] = useState(1);

  const handleAddToCart = () => {
    const newItem = {
      menu: selectedMenu,
      quantity: quantity,
      comment: comment,
      price: selectedMenu.price, // 添加价格信息
    };

    const existingItemIndex = cartItems.findIndex(item => item.menu.id === newItem.menu.id);
    if (existingItemIndex > -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += newItem.quantity;
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, newItem]);
    }

    setSelectedMenu(null);
    setQuantity(1);
    setComment('');
  };

  const handleUserInfoSubmit = async (userInfo) => {
    const orderData = {
        name: userInfo.name,
        tableid: parseInt(userInfo.tableId), // 将 tableNumber 转换为整数并传递给后端
        items: cartItems.map(item => ({
            quantity: item.quantity,
            comment: item.comment,
            price: item.price,
            id: item.menu.id
        })),
        total: cartItems.reduce((total, item) => total + item.price * item.quantity, 0),
        orderTime: new Date().toISOString(),
        isPaid: false
    };

    console.log('Submitting order:', orderData); // 记录提交的数据

    try {
        const response = await fetch('http://localhost:5000/api/customer/order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(orderData),
        });

        if (response.ok) {
            const responseData = await response.json();
            console.log('Order submitted successfully:', responseData); // 记录服务器的响应
            setCartItems([]);
            setIsUserInfoFormOpen(false); // 关闭用户信息表单
            alert('Order submitted successfully!');

            // 更新桌子的状态为不可用
            const tableResponse = await fetch(`http://localhost:5000/api/tables/${userInfo.tableId}/status`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ isAvailable: false }),
            });

            if (!tableResponse.ok) {
                console.error('Failed to update table status');
                alert('Failed to update table status. Please try again.');
            }
        } else {
            const errorData = await response.json();
            console.error('Failed to submit order:', errorData);
            alert('Failed to submit order. Please try again.');
        }
    } catch (error) {
        console.error('Error submitting order:', error);
        alert('Error submitting order. Please try again.');
    }
};



  const handleContinue = () => {
    setIsUserInfoFormOpen(true); // 打开用户信息表单
  };

  const handleBackFromUserInfo = () => {
    setIsUserInfoFormOpen(false); // 返回购物车页面
  };

  useEffect(() => {
    fetchMenus();
    fetchCategories();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/customer/order/menu');
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
          <div className="cart-icon" onClick={() => setIsCartOpen(!isCartOpen)}>🛒 {cartItems.reduce((total, item) => total + item.quantity, 0)} </div>
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
            onClick={() => {
              setSelectedCategory(category);
              const categoryElement = document.getElementById(category);
              if (categoryElement) {
                categoryElement.scrollIntoView({ behavior: 'smooth' });
              }
            }}
          >
            {category || 'Uncategorized'}
          </button>
        ))}
      </div>
      <div className="menu-list">
        {categories.map((category) => (
          <div key={category} id={category} className="category-section">
            <h2 className="category-title">{category || 'Uncategorized'}</h2>
            {menus
              .filter((menu) => menu.category === category)
              .map((menu) => (
                <div key={menu.id} className="menu-item" onClick={() => handleMenuClick(menu)}>
                  <img className="menu-item-img" src={menu.imagePath} alt={menu.name} />
                  <div className="menu-info">
                    <h3>{menu.name}</h3>
                    <p>${menu.price}</p>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
      {selectedMenu && (
        <div className="menu-detail-overlay">
          <div className="menu-detail">
            <button className="close-button" onClick={handleClose}>✖</button>
            <img src={selectedMenu.imagePath} alt={selectedMenu.name} />
            <h2 className='detnamed'>{selectedMenu.name}</h2>
            <p className='detnamed'>{selectedMenu.description}</p>
            <div className="comment-section">
              <textarea
                placeholder="Special Instruction"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              ></textarea>
            </div>
            <div className="bottom-container">
              <div className="quantity-selector">
                <button className="quantity-btn" onClick={() => setQuantity(quantity - 1)} disabled={quantity === 1}>-</button>
                <span className="quantity">{quantity}</span>
                <button className="quantity-btn" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
              <p className='detprice'>Total: ${(selectedMenu.price * quantity).toFixed(2)}</p>
              <button className="add-to-cart-button" onClick={handleAddToCart}>ADD TO CART</button>
            </div>
          </div>
        </div>
      )}
      {isCartOpen && !isUserInfoFormOpen && (
        <div className="cart-overlay">
          <CartDetail cartItems={cartItems} setCartItems={setCartItems} handleContinue={handleContinue} setIsCartOpen={setIsCartOpen} />
        </div>
      )}
      {isUserInfoFormOpen && (
      <div className="user-info-overlay">
        <UserInfoForm
          onSubmit={handleUserInfoSubmit}
          onBack={handleBackFromUserInfo}
          selectedTableId={selectedTableId}
          setSelectedTableId={setSelectedTableId}
        />
      </div>
      )}
    </div>
  );
};

const CartDetail = ({ cartItems, setCartItems, handleContinue, setIsCartOpen }) => {
  const handleQuantityChange = (index, newQuantity) => {
    if (newQuantity === 0 || newQuantity < 1) {
      handleRemoveItem(index);
    } else {
      const updatedCartItems = [...cartItems];
      updatedCartItems[index].quantity = newQuantity;
      setCartItems(updatedCartItems);
    }
  };

  const handleRemoveItem = (index) => {
    const updatedCartItems = [...cartItems];
    updatedCartItems.splice(index, 1);
    setCartItems(updatedCartItems);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.menu.price * item.quantity, 0).toFixed(2);
  };

  return (
    <div className="cart-detail">
      <div className="cart-detail-header">
        <button className="back-button" onClick={() => setIsCartOpen(false)}>Back</button>
        <h4>Cart Details</h4>
        <button className="continue-button" onClick={handleContinue}>CONTINUE</button>
      </div>
      <div className="cart-header">
        <span className="cart-column">QTY</span>
        <span className="cart-column">ITEM</span>
        <span className="cart-column">Price</span>
      </div>
      {cartItems.map((item, index) => (
        <div key={index} className="cart-item">
          <span className="cart-column">
            <button onClick={() => handleQuantityChange(index, item.quantity - 1)}>-</button>
            {item.quantity}
            <button onClick={() => handleQuantityChange(index, item.quantity + 1)}>+</button>
          </span>
          <span className="cart-column">{item.menu.name}</span>
          <span className="cart-column">${(item.price * item.quantity).toFixed(2)}</span>
        </div>
      ))}
      <div className="subtotal">
        <span>Subtotal</span>
        <span>${getTotalPrice()}</span>
      </div>
      <p className="additional-charges">Additional charges may apply.</p>
    </div>
  );
};

export default OrderPage;