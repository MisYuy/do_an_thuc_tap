import React, { useEffect, useState } from 'react';
import axios from 'axios';

const DiscountedProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchDiscountedProducts = async () => {
            try {
                const response = await axios.get('/api/discounted-products');
                setProducts(response.data);
            } catch (error) {
                console.error("There was an error fetching the discounted products!", error);
            }
        };

        fetchDiscountedProducts();
    }, []);

    return (
        <div>
            <h2>Discounted Products</h2>
            <ul>
                {products.map(product => (
                    <li key={product.product_id}>
                        <h3>{product.name}</h3>
                        <p>{product.description}</p>
                        <p>Original Price: ${product.price}</p>
                        <p>Discount: {product.Promotions[0].discount_percentage}%</p>
                        <p>Discounted Price: ${product.price - (product.price * (product.Promotions[0].discount_percentage / 100))}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default DiscountedProducts;
