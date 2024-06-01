import React, { useEffect, useState } from 'react';
import '../Tables.css'; // 根据需要自定义 CSS 样式

const Table = () => {
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false); // 添加这一行
  const [isOrderDetailsVisible, setIsOrderDetailsVisible] = useState(false); // 添加这一行
  const [selectedTable, setSelectedTable] = useState(null); // 添加这一行
  const [latestOrder, setLatestOrder] = useState(null); // 添加这一行
  const [isConfirmVisible, setIsConfirmVisible] = useState(false); // 添加确认对话框状态

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

  const handlePayOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${latestOrder.id}/pay`, {
        method: 'PUT',
      });

      if (response.ok) {
        setIsOrderDetailsVisible(false);
        fetchTables();
      } else {
        console.error('Failed to pay order');
      }
    } catch (error) {
      console.error('Error paying order:', error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/orders/${latestOrder.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsOrderDetailsVisible(false);
        fetchTables();
      } else {
        console.error('Failed to cancel order');
      }
    } catch (error) {
      console.error('Error canceling order:', error);
    }
  };

  const handleDeleteTable = async () => {
    try {
      if (latestOrder && !latestOrder.isPaid) {
        alert('Cannot delete table with unpaid order.');
        return;
      }

      const response = await fetch(`http://localhost:5000/api/tables/${selectedTable.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsEditFormVisible(false);
        setIsOrderDetailsVisible(false);
        fetchTables();
      } else {
        console.error('Failed to delete table');
      }
    } catch (error) {
      console.error('Error deleting table:', error);
    }
  };

  const confirmDeleteTable = () => {
    setIsConfirmVisible(true);
  };

  const handleUpdateTable = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/tables/${selectedTable.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(selectedTable),
      });
  
      if (response.ok) {
        setIsEditFormVisible(false);
        fetchTables();
      } else {
        console.error('Failed to update table');
      }
    } catch (error) {
      console.error('Error updating table:', error);
    }
  };

  const handleTableClick = async (table) => {
    try {
      const response = await fetch(`http://localhost:5000/api/tables/${table.id}/latest-order`);
      
      if (response.ok) {
        const data = await response.json();
  
        if (table.isAvailable) {
          // 如果桌子可用,显示修改桌子属性的表单
          setSelectedTable(table);
          setIsEditFormVisible(true);
        } else {
          if (data && !data.isPaid) {
            // 如果有未支付的订单,显示订单信息
            setSelectedTable(table);
            setLatestOrder(data);
            setIsOrderDetailsVisible(true);
          } else {
            // 如果没有未支付的订单或订单数据为空,显示修改桌子属性的表单
            setSelectedTable(table);
            setIsEditFormVisible(true);
          }
        }
      } else {
        if (response.status === 404) {
          // 如果没有找到订单,显示修改桌子属性的表单
          setSelectedTable(table);
          setIsEditFormVisible(true);
        } else {
          console.error('Error fetching latest order:', response.statusText);
          alert('Failed to fetch latest order. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error fetching latest order:', error);
      alert('Failed to fetch latest order. Please try again.');
    }
  };

  return (
    <div className="table-container">
      <h2>Tables</h2>
      <div className="tables">
        {tables.map((table) => (
          <div key={table.id} className={`table ${table.isAvailable ? 'available' : 'unavailable'}`} onClick={() => handleTableClick(table)}>
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

      {isEditFormVisible && (
        <div className="overlay">
          <div className="edit-table-form animated">
            <input
              type="text"
              value={selectedTable.tableName}
              onChange={(e) => setSelectedTable({ ...selectedTable, tableName: e.target.value })}
              placeholder="Enter table name"
            />
            <div>
              <label>
                Available:
                <input
                  type="checkbox"
                  checked={selectedTable.isAvailable}
                  onChange={(e) => setSelectedTable({ ...selectedTable, isAvailable: e.target.checked })}
                />
              </label>
            </div>
            <div className="button-group">
              <button onClick={handleUpdateTable}>Update</button>
              <button onClick={confirmDeleteTable}>Delete</button>
              <button onClick={() => setIsEditFormVisible(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {isOrderDetailsVisible && (
        <div className="overlay">
          <div className="order-details animated">
            <h3>Latest Order Details</h3>
            <p>Menu Item: {latestOrder.menu.name}</p>
            <p>Quantity: {latestOrder.quantity}</p>
            <p>Order Time: {new Date(latestOrder.orderTime).toLocaleString()}</p>
            <p>Paid: {latestOrder.isPaid ? 'Yes' : 'No'}</p>
            <div className="button-group">
              {!latestOrder.isPaid && (
                <>
                  <button onClick={handlePayOrder}>Pay</button>
                  <button onClick={handleCancelOrder}>Cancel</button>
                </>
              )}
              <button onClick={confirmDeleteTable}>Delete Table</button>
              <button onClick={() => setIsOrderDetailsVisible(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {isConfirmVisible && (
        <div className="overlay">
          <div className="confirm-dialog animated">
            <p>Are you sure you want to delete this table?</p>
            <div className="button-group">
              <button onClick={handleDeleteTable}>Yes</button>
              <button onClick={() => setIsConfirmVisible(false)}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Table;
