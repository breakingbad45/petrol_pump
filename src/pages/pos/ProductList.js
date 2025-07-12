import React from 'react';

function ProductList({ products, handleAddToCart }) {
  return (
    <div className="row products">
      {products.map((product) => (
        <div key={product.id} className="col-xs-6 col-sm-3 product-item" onClick={() => handleAddToCart(product)}>
          <img
            src={product.img}
            className='product-img'
            onError={(e) => e.target.src = 'https://petrolpump.fahimtraders.com/backend/restaurent/image/maxicansaucepasta.jpg'}
            alt={product.name}
          />
        <div className="description">
  <span className="name">{product.name} </span>
  <span className="price">{product.rate} </span>
</div>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
