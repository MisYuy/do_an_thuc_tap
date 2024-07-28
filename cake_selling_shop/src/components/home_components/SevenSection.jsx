import React, { useEffect, useState } from "react";
import axios from 'axios';
import { URL } from '../../utils/constant.js';

const SevenSection = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProductsAndOrders = async () => {
            try {
                const productsResponse = await axios.get(`${URL}/api/product/get-all`);
                const ordersResponse = await axios.get(`${URL}/api/order/get-all`);
                setProducts(productsResponse.data);
                setOrders(ordersResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products and orders:', error);
                setLoading(false);
            }
        };

        fetchProductsAndOrders();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    // Calculate the sales count for each product
    const productSalesCount = products.map(product => {
        const salesCount = orders.reduce((count, order) => {
            return count + order.OrderItems.filter(item => item.product_id === product.product_id).reduce((sum, item) => sum + item.quantity, 0);
        }, 0);
        return { ...product, salesCount };
    });

    // Sort products by sales count in descending order and take the top 6
    const topSellingProducts = productSalesCount.sort((a, b) => b.salesCount - a.salesCount).slice(0, 6);

    return (
        <div className="container-fluid py-5">
            <div className="container py-5">
                <div className="text-center mx-auto mb-5" style={{ maxWidth: '700px' }}>
                    <h1 className="display-4">Các sản phẩm bán chạy nhất</h1>
                    <p>Các loại bánh tuyệt hảo nhận được sự tin dùng và yêu thích của đông đảo thực khách.</p>
                </div>
                <div className="row g-4">
                    {topSellingProducts.map((product, index) => (
                        <div className="col-lg-6 col-xl-4" key={index}>
                            <div className="p-4 rounded bg-light">
                                <div className="row align-items-center">
                                    <div className="col-6">
                                        <img src={`/images/product/${product.image}`} className="img-fluid rounded-circle w-100" alt={product.name} />
                                    </div>
                                    <div className="col-6">
                                        <a href="#" className="h5">{product.name}</a>
                                        <div className="d-flex my-3">
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star"></i>
                                        </div>
                                        <h4 className="mb-3">{product.price} $</h4>
                                        <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary">
                                            <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SevenSection;
