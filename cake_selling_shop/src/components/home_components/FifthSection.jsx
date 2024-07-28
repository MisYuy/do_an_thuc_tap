import React, { useEffect, useState } from 'react';
import axios from 'axios';
import OwlCarousel from 'react-owl-carousel';  
import 'owl.carousel/dist/assets/owl.carousel.css';  
import 'owl.carousel/dist/assets/owl.theme.default.css';  
import { URL } from '../../utils/constant.js';

const FifthSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const productsResponse = await axios.get(`${URL}/api/product/get-all`);
                setProducts(productsResponse.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const truncateDescription = (description, maxLength) => {
        if (description.length > maxLength) {
            return description.substring(0, maxLength) + '...';
        }
        return description;
    };

    const options = {
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 2
            },
            1200: {
                items: 2
            }
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container-fluid vesitable py-5">
            <div className="container py-5">
                <h1 className="mb-0">Các sản phẩm nổi bật</h1>
                <div style={{ width: '70%', margin: '0 auto' }}>
                    <OwlCarousel className="owl-carousel vegetable-carousel justify-content-center" {...options}>
                        {products.map(product => (
                            <div className="border border-primary rounded position-relative vesitable-item" key={product.product_id}>
                                <div className="vesitable-img">
                                    <img src={product.image ? `/images/product/${product.image}` : "/img/none_image.png"} className="img-fluid w-100 rounded-top" alt="" />
                                </div>
                                <div className="text-white bg-primary px-3 py-1 rounded position-absolute" style={{ top: '10px', right: '10px'}}>{product.category_name}</div>
                                <div className="p-4 rounded-bottom">
                                    <h4>{product.name}</h4>
                                    <p>{truncateDescription(product.description, 200)}</p>
                                    <div className="d-flex justify-content-between flex-lg-wrap">
                                        <p className="text-dark fs-5 fw-bold mb-0">{product.price} ₫</p>
                                        <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary"><i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart</a>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </OwlCarousel>
                </div>
            </div>
        </div>
    );
};

export default FifthSection;
