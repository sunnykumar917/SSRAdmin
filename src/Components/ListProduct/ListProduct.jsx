import React, { useEffect, useState } from 'react';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allProducts, setAllProducts] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch('http://localhost:5001/products');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      setAllProducts(data);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };

  const removeProduct = async (id) => {
    try {
      const response = await fetch('http://localhost:5001/removeproduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id: id })
      });
  
      if (!response.ok) {
        throw new Error('Failed to remove product');
      }
  
      // Refetch the updated product list
      await fetchData();
    } catch (error) {
      console.error('Error removing product:', error.message);
    }
  };
  

  return (
    <div className='list-product'>
      <h2>All Products List</h2>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>

      <div className="listproduct-allproducts">
        <hr />
        {allProducts.map((product) => (
          <div key={product.id} className="listproduct-format-main listproduct-main">
            <img src={product.image} alt="" className='list-product-icon' />
            <p>{product.name}</p>
            <p>{product.category}</p>
            <p>{product.old_price}</p>
            <p>{product.new_price}</p>
            <p>{product.category}</p>
            <img onClick={() => removeProduct(product.id)} className="listproduct-remove-icon" src={cross_icon} alt="Remove" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
