import React, { useState } from 'react';

const OrderForm = () => {
  const [menuId, setMenuId] = useState('');
  const [quantity, setQuantity] = useState('');
  const [tableNumber, setTableNumber] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 处理点餐逻辑
    const order = { menuId, quantity, tableNumber, notes };

    const response = await fetch('http://localhost:5000/api/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(order),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Order placed successfully', data);
      // 可以在这里处理下单成功的逻辑，比如显示提示信息，清空表单等
    } else {
      console.error('Order placement failed');
      // 可以在这里处理下单失败的逻辑，比如显示错误信息
    }
  };

  return (
    <div className="order-form">
      <h2>Place an Order</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Menu ID:</label>
          <input
            type="text"
            value={menuId}
            onChange={(e) => setMenuId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Table Number:</label>
          <input
            type="text"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Notes:</label>
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit">Place Order</button>
      </form>
    </div>
  );
};

export default OrderForm;
