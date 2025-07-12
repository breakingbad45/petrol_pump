import React from 'react';

function Menu({ categories, setSelectedCategory,selectedCategory }) {
  return (
    <div className="col-md-1 col-xs-3 menu">
      {categories.map((category, index) => (
        <div key={index} onClick={() => setSelectedCategory(category)}  className={` ${selectedCategory === category ? 'selected' : ''}`}>
          {category}
        </div>
      ))}
    </div>
  );
}

export default Menu;
