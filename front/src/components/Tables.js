import React, { useEffect, useState } from 'react';
import '../Tables.css'; // 根据需要自定义 CSS 样式

const Table = () => {
  const [tables, setTables] = useState([]);
  const [newTableName, setNewTableName] = useState('');
  const [isAvailable, setIsAvailable] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditFormVisible, setIsEditFormVisible] = useState(false);
  const [isOrderDetailsVisible, setIsOrderDetailsVisible] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);
  const [latestOrder, setLatestOrder] = useState(null);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [menuNames, setMenuNames] = useState({});
  const [loadingItems, setLoadingItems] = useState(true);
  const [isEditMode, setIsEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);


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

  const fetchMenuName = async (menuId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/merchant/menu/${menuId}`);
      if (response.ok) {
        const data = await response.json();
        setMenuNames((prevNames) => ({ ...prevNames, [menuId]: data.name }));
      } else {
        console.error('Failed to fetch menu name');
      }
    } catch (error) {
      console.error('Error fetching menu name:', error);
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
        fetchTables();
        setNewTableName('');
        setIsFormVisible(false);
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

  const handleSearch = async (event) => {
    const term = event.target.value;
    setSearchTerm(term);

    if (term.trim() !== '') {
      try {
        const response = await fetch(`http://localhost:5000/api/merchant/menu/search?term=${term}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
        } else {
          console.error('Failed to search menu items');
        }
      } catch (error) {
        console.error('Error searching menu items:', error);
      }
    } else {
      setSearchResults([]);
    }
  };

  const handleAddItem = (menuItem) => {
    const newItem = {
      menuId: menuItem.id,
      quantity: 1,
      price: menuItem.price,
    };
    setLatestOrder({ ...latestOrder, items: [...latestOrder.items, newItem] });
    setSearchTerm('');
    setSearchResults([]);
  };


  const handleUpdateItems = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/merchant/order/${latestOrder.id}/items`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(latestOrder.items),
      });

      if (response.ok) {
        setIsEditMode(false);
        fetchTables();
      } else {
        console.error('Failed to update items');
      }
    } catch (error) {
      console.error('Error updating items:', error);
    }
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
    } else {
      const updatedItems = latestOrder.items.map(item => {
        if (item.id === itemId) {
          return { ...item, quantity: newQuantity };
        }
        return item;
      });
      setLatestOrder({ ...latestOrder, items: updatedItems });
    }
  };

  const handleRemoveItem = (itemId) => {
    const updatedItems = latestOrder.items.filter(item => item.id !== itemId);
    setLatestOrder({ ...latestOrder, items: updatedItems });
  };

  const handlePayOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/merchant/order/${latestOrder.id}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...latestOrder, isPaid: true }),
      });
  
      if (response.ok) {
        setIsOrderDetailsVisible(false);
        fetchTables(); // 重新获取桌子列表
      } else {
        console.error('Failed to pay order');
      }
    } catch (error) {
      console.error('Error paying order:', error);
    }
  };

  const handleCancelOrder = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/merchant/order/${latestOrder.id}`, {
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
          setSelectedTable(table);
          setIsEditFormVisible(true);
        } else {
          if (data && !data.isPaid) {
            setSelectedTable(table);
            setLatestOrder(data);
            setIsOrderDetailsVisible(true);

            const menuPromises = data.items.map(item => {
              if (item.menuId !== 0 && !menuNames[item.menuId]) {
                return fetchMenuName(item.menuId);
              }
              return null;
            });

            await Promise.all(menuPromises);
            setLoadingItems(false);

          } else {
            setSelectedTable(table);
            setIsEditFormVisible(true);
          }
        }
      } else {
        if (response.status === 404) {
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

{isOrderDetailsVisible && latestOrder && (
      <div className="overlay">
        <div className="order-details animated">
        {isEditMode && (
            <div className="search-container">
              <input
                type="text"
                placeholder="Search menu items"
                value={searchTerm}
                onChange={handleSearch}
              />
              {searchResults.map(item => (
                <div key={item.id} className="search-result" onClick={() => handleAddItem(item)}>
                  {item.name} - ${item.price.toFixed(2)}
                </div>
              ))}
            </div>
          )}
          {latestOrder.items.map(item => (
            <div key={item.id} className="cart-item">
              <span className="cart-column">{menuNames[item.menuId] || 'Loading...'}</span>
              <span className="cart-column">
                {isEditMode ? (
                  <>
                    <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>-</button>
                    {item.quantity}
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                  </>
                ) : (
                  item.quantity
                )}
              </span>
              <span className="cart-column">${(item.price * item.quantity).toFixed(2)}</span>
              {isEditMode && (
                <span className="cart-column">
                  <button onClick={() => handleRemoveItem(item.id)}>Delete</button>
            </span>
          )}
        </div>
      ))}
      <div className="subtotal">
        <span>Subtotal</span>
        <span>${latestOrder.total.toFixed(2)}</span>
      </div>
      <div className="button-group">
        {!latestOrder.isPaid && (
          <>
            <button onClick={handlePayOrder}>Pay</button>
            {isEditMode ? (
              <>
                <button onClick={handleUpdateItems}>Save</button>
                <button onClick={() => setIsEditMode(false)}>Cancel</button>
              </>
            ) : (
              <button onClick={() => setIsEditMode(true)}>Edit</button>
            )}
          </>
        )}
        {latestOrder.isPaid && (
          <button onClick={confirmDeleteTable}>Delete Table</button>
        )}
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
