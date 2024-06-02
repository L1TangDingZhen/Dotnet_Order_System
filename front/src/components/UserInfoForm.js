import React, { useState, useEffect } from 'react';

const UserInfoForm = ({ onSubmit, onBack, selectedTableId, setSelectedTableId }) => {
  const [name, setName] = useState('');
  const [tableId, setTableId] = useState(selectedTableId.toString());

  useEffect(() => {
    setTableId(selectedTableId.toString());
  }, [selectedTableId]);

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
        <label>Table ID:</label>
        <input
          type="text"
          value={tableId}
          onChange={(e) => {
            setTableId(e.target.value);
            setSelectedTableId(parseInt(e.target.value));
          }}
          required
        />
      </div>
        <button type="submit" name='subb'>Place Order & Pay at Counter</button>
      </form>
    </div>
  );
};

export default UserInfoForm;
