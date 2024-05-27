import React, { useEffect, useState } from 'react';
import '../Tables.css'; // 根据需要自定义 CSS 样式

const Table = () => {
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchTables();
  }, []);

  const fetchTables = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/tables');
      const data = await response.json();
      setTables(data);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  };

  const handleAddTable = async () => {
    if (newTableName.trim() === '') {
      alert('Table name cannot be empty');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/tables', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableName: newTableName, isAvailable }),
      });

      if (response.ok) {
        fetchTables(); // Refresh table list after adding
        setNewTableName(''); // Clear the input field
        setIsFormVisible(false); // Hide the form after adding
        alert('Table created successfully!');
      } else {
        console.error('Failed to add table');
      }
    } catch (error) {
      console.error('Error adding table:', error);
    }
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setNewTableName('');
    setIsAvailable(false);
  };

  return (
    <div className="table-container">
      <h2>Tables</h2>
      <div className="tables">
        {tables.map((table) => (
          <div key={table.id} className={`table ${table.isAvailable ? 'available' : 'unavailable'}`}>
            <p>{table.tableName}</p>
          </div>
        ))}
        <div className="table add-table" onClick={() => setIsFormVisible(true)}>
          <p>+</p>
        </div>
      </div>
      {isFormVisible && (
        <div className="overlay">
          <div className="add-table-form animated">
            <input
              type="text"
              value={newTableName}
              onChange={(e) => setNewTableName(e.target.value)}
              placeholder="Enter table name"
            />
            <div>
              <label>
                Available:
                <input
                  type="checkbox"
                  checked={isAvailable}
                  onChange={(e) => setIsAvailable(e.target.checked)}
                />
              </label>
            </div>
            <div className="button-group">
              <button onClick={handleAddTable}>Confirm</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
