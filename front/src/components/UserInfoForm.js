// src/components/UserInfoForm.js
import React, { useState } from 'react';

const UserInfoForm = ({ onSubmit, onBack }) => {
  const [name, setName] = useState('');
  const [tableId, setTableId] = useState(''); // 新增桌子 ID 状态


  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ name, tableId });
  };

  return (
    <div className="user-info-form">
      <button className="back-button" onClick={onBack}>Back</button>
      <form onSubmit={handleSubmit}>
        <div className='nameb'>
          <label>Name (Required)</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className='idb'>
          <label>Table ID:</label> {/* 新增桌子 ID 输入框 */}
            <input type="text" value={tableId} onChange={(e) => {
            setTableId(e.target.value);
            setSelectedTableId(e.target.value); // 更新父组件中的桌子 ID
          }} required />
          </div>
        <button type="submit" name='subb'>Place Order & Pay at Counter</button>
      </form>
    </div>
  );
};

export default UserInfoForm;
