import React, { useState } from 'react';

const customersList = [
  { id: 1, name: 'Walk-in Customer' },
  { id: 2, name: 'John Doe' },
  { id: 3, name: 'Jane Smith' }
];

const categories = [
  { id: 1, name: 'Beverages', subcategories: ['Soda', 'Juice'] },
  { id: 2, name: 'Snacks', subcategories: ['Chips', 'Cookies'] }
];

const allProducts = [
  { id: 1, name: 'Coke', category: 'Beverages', subcategory: 'Soda', price: 20 },
  { id: 2, name: 'Pepsi', category: 'Beverages', subcategory: 'Soda', price: 18 },
  { id: 3, name: 'Orange Juice', category: 'Beverages', subcategory: 'Juice', price: 25 },
  { id: 4, name: 'Lays', category: 'Snacks', subcategory: 'Chips', price: 15 },
  { id: 5, name: 'Oreo', category: 'Snacks', subcategory: 'Cookies', price: 30 }
];

const POSComponent = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(customersList[0].id);
  const [discount, setDiscount] = useState(0);
  const [paid, setPaid] = useState(0);

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat.name);
    setSelectedSubcategory(null);
    setProducts([]);
  };

  const handleSubcategoryClick = (sub) => {
    setSelectedSubcategory(sub);
    const filtered = allProducts.filter(
      p => p.category === selectedCategory && p.subcategory === sub
    );
    setProducts(filtered);
  };

  const addToCart = (product) => {
    setCart(prev => {
      const existing = prev.find(p => p.id === product.id);
      if (existing) {
        return prev.map(p => p.id === product.id ? { ...p, qty: p.qty + 1 } : p);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev
      .map(p => p.id === id ? { ...p, qty: Math.max(p.qty + delta, 1) } : p)
    );
  };

  const updateRate = (id, rate) => {
    setCart(prev => prev.map(p => p.id === id ? { ...p, price: Number(rate) } : p));
  };

  const deleteCartItem = (id) => {
    setCart(prev => prev.filter(p => p.id !== id));
  };

  const deleteCustomer = (id) => {
    if (id === 1) return;
    const idx = customersList.findIndex(c => c.id === id);
    if (idx !== -1) {
      customersList.splice(idx, 1);
    }
    if (selectedCustomer === id) {
      setSelectedCustomer(1);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const grandTotal = total - discount;
  const balance = grandTotal - paid;

  const saveTransaction = () => {
    console.log({
      customer: customersList.find(c => c.id === selectedCustomer),
      cart,
      discount,
      paid,
      grandTotal,
      balance
    });
  };

  return (
    <div id="pos-wrapper" className="p-3">
      <div className="category-wrapper">
        {categories.map(cat => (
          <button key={cat.id} className={`category-btn ${selectedCategory === cat.name ? 'active' : ''}`} onClick={() => handleCategoryClick(cat)}>
            {cat.name}
          </button>
        ))}
      </div>

      {selectedCategory && (
        <div className="subcategory-wrapper">
          {categories.find(c => c.name === selectedCategory)?.subcategories.map((sub, i) => (
            <button key={i} className={`subcategory-btn ${selectedSubcategory === sub ? 'active' : ''}`} onClick={() => handleSubcategoryClick(sub)}>
              {sub}
            </button>
          ))}
        </div>
      )}

      <div className="product-scroll product-grid mt-3">
        {products.map(product => (
          <div className="product-card" key={product.id} onClick={() => addToCart(product)}>
            <img src="https://via.placeholder.com/90" alt={product.name} />
            <div>{product.name}</div>
            <small>{product.subcategory}</small>
          </div>
        ))}
      </div>

      <div className="order-box mt-3">
        <div className="mb-2">
          Customer:
          <select value={selectedCustomer} onChange={(e) => setSelectedCustomer(Number(e.target.value))}>
            {customersList.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button className="btn btn-sm btn-danger ms-2" onClick={() => deleteCustomer(selectedCustomer)}>Delete Customer</button>
        </div>

        <div className="cart-scroll">
          <table className="table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Qty</th>
                <th>Rate</th>
                <th>Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => updateQty(item.id, -1)}>-</button>
                      <span>{item.qty}</span>
                      <button className="qty-btn" onClick={() => updateQty(item.id, 1)}>+</button>
                    </div>
                  </td>
                  <td>
                    <input
                      className="rate-input"
                      type="number"
                      value={item.price}
                      onChange={(e) => updateRate(item.id, e.target.value)}
                    />
                  </td>
                  <td>{item.price * item.qty}</td>
                  <td><i className="fas fa-trash-alt delete-icon" onClick={() => deleteCartItem(item.id)}></i></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-2">
          <div>Discount: <input type="number" value={discount} onChange={(e) => setDiscount(Number(e.target.value))} /></div>
          <div>Paid: <input type="number" value={paid} onChange={(e) => setPaid(Number(e.target.value))} /></div>
          <div className="total-section">Total: ₹{total}</div>
          <div className="total-section">Grand Total: ₹{grandTotal}</div>
          <div className="total-section">Balance: ₹{balance}</div>
        </div>

        <div className="sticky-footer mt-3">
          <button className="btn btn-checkout" onClick={saveTransaction}>Save</button>
        </div>
      </div>
    </div>
  );
};

export default POSComponent;