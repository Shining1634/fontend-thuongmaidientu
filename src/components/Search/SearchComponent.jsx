import React, { useState } from 'react';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const products = [
    { id: 1, name: 'iPhone 15 Pro Max' },
    { id: 2, name: 'Samsung Galaxy S24 Ultra' },
    { id: 3, name: 'Xiaomi Redmi Note 13' },
    { id: 4, name: 'Oppo Find X6' },
  ];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
      <h2>Tìm kiếm sản phẩm</h2>
      <input
        type="text"
        placeholder="Nhập tên sản phẩm..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
        style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
      />
      <ul>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(product => (
            <li key={product.id}>{product.name}</li>
          ))
        ) : (
          <li>Không tìm thấy sản phẩm phù hợp.</li>
        )}
      </ul>
    </div>
  );
};

export default SearchComponent;
