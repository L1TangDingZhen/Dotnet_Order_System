import React, { useEffect, useState } from 'react';
import '../MerchantEditMenu.css'; // 根据需要自定义 CSS 样式

const MerchantEditMenu = () => {
  const [menus, setMenus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [newMenu, setNewMenu] = useState({
    name: '',
    price: '',
    description: '',
    imageFile: null,
    isAvailable: false,
    category: ''
  });
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editMenuId, setEditMenuId] = useState(null);
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
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const handleAddMenu = async () => {
    const formData = new FormData();
    formData.append('name', newMenu.name);
    formData.append('price', newMenu.price);
    formData.append('description', newMenu.description);
    formData.append('imageFile', newMenu.imageFile);
    formData.append('isAvailable', newMenu.isAvailable);
    formData.append('category', newMenu.category);

    try {
      const response = await fetch('http://localhost:5000/api/merchant/menu', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        fetchMenus(); // Refresh menu list after adding
        setNewMenu({ name: '', price: '', description: '', imageFile: null, isAvailable: false, category: '' });
        setIsFormVisible(false);
        alert('Menu created successfully!');
      } else {
        console.error('Failed to add menu');
      }
    } catch (error) {
      console.error('Error adding menu:', error);
    }
  };

  const handleEditMenu = async () => {
    const formData = new FormData();
    formData.append('name', newMenu.name);
    formData.append('price', newMenu.price);
    formData.append('description', newMenu.description);
    formData.append('imageFile', newMenu.imageFile);
    formData.append('isAvailable', newMenu.isAvailable);
    formData.append('category', newMenu.category);
  
    try {
      const response = await fetch(`http://localhost:5000/api/merchant/menu/${editMenuId}`, {
        method: 'PUT',
        body: formData,
      });
  
      if (response.ok) {
        fetchMenus(); // Refresh menu list after editing
        setNewMenu({ name: '', price: '', description: '', imageFile: null, isAvailable: false, category: '' });
        setIsFormVisible(false);
        setIsEditing(false);
        setEditMenuId(null);
        alert('Menu updated successfully!');
      } else {
        console.error('Failed to update menu');
      }
    } catch (error) {
      console.error('Error updating menu:', error);
    }
  };
  

  const handleDeleteMenu = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/merchant/menu/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchMenus(); // Refresh menu list after deleting
        alert('Menu deleted successfully!');
      } else {
        console.error('Failed to delete menu');
      }
    } catch (error) {
      console.error('Error deleting menu:', error);
    }
  };

  const handleEditClick = (menu) => {
    setSelectedMenu(null); // 关闭详情页
    setNewMenu({
      name: menu.name,
      price: menu.price,
      description: menu.description,
      imageFile: null,
      isAvailable: menu.isAvailable,
      category: menu.category
    });
    setIsFormVisible(true);
    setIsEditing(true);
    setEditMenuId(menu.id);
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setIsEditing(false);
    setNewMenu({ name: '', price: '', description: '', imageFile: null, isAvailable: false, category: '' });
  };

  const handleMenuClick = (menu) => {
    setSelectedMenu(menu);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMenu((prevMenu) => ({
      ...prevMenu,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setNewMenu((prevMenu) => ({
      ...prevMenu,
      imageFile: e.target.files[0]
    }));
  };

  return (
    <div className="merchant-edit-menu-container">
      <h2>Merchant Menu</h2>
      <div className="menu-list">
        {menus.map((menu) => (
          <div key={menu.id} className="menu-item" onClick={() => handleMenuClick(menu)}>
            <h3>{menu.name}</h3>
            <p>Price: ${menu.price}</p>
            <p>Available: {menu.isAvailable ? 'Yes' : 'No'}</p>
            <p>Category: {menu.category}</p>
          </div>
        ))}
        <div className="add-menu-button" onClick={() => setIsFormVisible(true)}>
          <p>+</p>
        </div>
      </div>
      {isFormVisible && (
        <div className="overlay">
          <div className="menu-form animated">
            <input
              type="text"
              name="name"
              value={newMenu.name}
              onChange={handleInputChange}
              placeholder="Enter menu name"
            />
            <input
              type="number"
              name="price"
              value={newMenu.price}
              onChange={handleInputChange}
              placeholder="Enter menu price"
            />
            <textarea
              name="description"
              value={newMenu.description}
              onChange={handleInputChange}
              placeholder="Enter menu description"
            />
            <input
              type="text"
              name="category"
              value={newMenu.category}
              onChange={handleInputChange}
              placeholder="Enter menu category"
            />
            <input
              type="file"
              name="imageFile"
              onChange={handleFileChange}
            />
            <div>
              <label>
                Available:
                <input
                  type="checkbox"
                  name="isAvailable"
                  checked={newMenu.isAvailable}
                  onChange={(e) => setNewMenu((prevMenu) => ({
                    ...prevMenu,
                    isAvailable: e.target.checked
                  }))}
                />
              </label>
            </div>
            <div className="button-group">
              <button onClick={isEditing ? handleEditMenu : handleAddMenu}>{isEditing ? 'Update' : 'Add'} Menu</button>
              <button onClick={handleCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {selectedMenu && (
        <div className="menu-detail-overlay">
          <div className="menu-detail">
            <h3>{selectedMenu.name}</h3>
            {selectedMenu.imagePath && <img src={selectedMenu.imagePath} alt={selectedMenu.name} />}
            <p>{selectedMenu.description}</p>
            <p>Price: ${selectedMenu.price}</p>
            <p>Available: {selectedMenu.isAvailable ? 'Yes' : 'No'}</p>
            <p>Category: {selectedMenu.category}</p>
            <div className="button-group">
              <button onClick={() => handleEditClick(selectedMenu)}>Edit</button>
              <button onClick={() => handleDeleteMenu(selectedMenu.id)}>Delete</button>
              <button onClick={() => setSelectedMenu(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantEditMenu;
