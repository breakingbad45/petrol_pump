import React, { useState } from 'react';

const categories = [
  { name: "Beverages", subcategories: ["Tea", "Coffee", "Juice"] },
  { name: "Snacks", subcategories: ["Chips", "Biscuits"] }
];

const products = [
  { id: 1, name: "Green Tea", category: "Beverages", subcategory: "Tea" },
  { id: 2, name: "Black Coffee", category: "Beverages", subcategory: "Coffee" },
  { id: 3, name: "Orange Juice", category: "Beverages", subcategory: "Juice" },
  { id: 4, name: "Potato Chips", category: "Snacks", subcategory: "Chips" },
  { id: 5, name: "Oreo", category: "Snacks", subcategory: "Biscuits" }
];

const POS = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [cart, setCart] = useState([]);

  const handleAddToCart = (product) => {
    const exists = cart.find(item => item.id === product.id);
    if (exists) {
      const updated = cart.map(item =>
        item.id === product.id ? { ...item, qty: item.qty + 1 } : item
      );
      setCart(updated);
    } else {
      setCart([...cart, { ...product, qty: 1, rate: 0 }]);
    }
  };

  const updateCart = (id, key, value) => {
    setCart(cart.map(item =>
      item.id === id ? { ...item, [key]: value } : item
    ));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getFilteredProducts = () => {
    return products.filter(
      p => p.category === selectedCategory && p.subcategory === selectedSubcategory
    );
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.rate, 0);

  return (
    <div className="p-4 font-sans">
      <h2 className="text-2xl font-bold mb-4">POS Interface</h2>

      {/* Category Selection */}
      <div className="mb-4">
        <h3 className="font-semibold">Select Category</h3>
        <div className="flex gap-3">
          {categories.map(cat => (
            <button
              key={cat.name}
              className={`px-4 py-2 border rounded ${selectedCategory === cat.name ? 'bg-blue-500 text-white' : ''}`}
              onClick={() => {
                setSelectedCategory(cat.name);
                setSelectedSubcategory(null);
              }}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Subcategory Selection */}
      {selectedCategory && (
        <div className="mb-4">
          <h3 className="font-semibold">Select Subcategory</h3>
          <div className="flex gap-3">
            {categories
              .find(cat => cat.name === selectedCategory)
              .subcategories.map(sub => (
                <button
                  key={sub}
                  className={`px-4 py-2 border rounded ${selectedSubcategory === sub ? 'bg-green-500 text-white' : ''}`}
                  onClick={() => setSelectedSubcategory(sub)}
                >
                  {sub}
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Products List */}
      {selectedCategory && selectedSubcategory && (
        <div className="mb-4">
          <h3 className="font-semibold">Products</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {getFilteredProducts().map(product => (
              <div key={product.id} className="border p-2 rounded shadow-sm">
                <p>{product.name}</p>
                <button
                  className="mt-2 px-3 py-1 bg-blue-500 text-white rounded"
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cart */}
      <div className="mt-6">
        <h3 className="font-semibold text-lg mb-2">Cart</h3>
        <table className="w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Name</th>
              <th className="border px-2 py-1">Qty</th>
              <th className="border px-2 py-1">Rate</th>
              <th className="border px-2 py-1">Total</th>
              <th className="border px-2 py-1">Action</th>
            </tr>
          </thead>
          <tbody>
            {cart.map(item => (
              <tr key={item.id}>
                <td className="border px-2 py-1">{item.name}</td>
                <td className="border px-2 py-1">
                  <button onClick={() => updateCart(item.id, 'qty', Math.max(1, item.qty - 1))}>-</button>
                  <span className="mx-2">{item.qty}</span>
                  <button onClick={() => updateCart(item.id, 'qty', item.qty + 1)}>+</button>
                </td>
                <td className="border px-2 py-1">
                  <input
                    type="number"
                    value={item.rate}
                    onChange={(e) => updateCart(item.id, 'rate', parseFloat(e.target.value))}
                    className="w-16 border px-1"
                  />
                </td>
                <td className="border px-2 py-1">{(item.qty * item.rate).toFixed(2)}</td>
                <td className="border px-2 py-1">
                  <button onClick={() => removeFromCart(item.id)} className="text-red-600">Delete</button>
                </td>
              </tr>
            ))}
            {cart.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-2">Cart is empty</td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="text-right mt-2 font-semibold">
          Grand Total: ₹ {cartTotal.toFixed(2)}
        </div>
      </div>
    </div>
  );
};

export default POS;
