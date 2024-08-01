import React, { useState, useEffect } from 'react';
import OwlCarousel from 'react-owl-carousel'; // Make sure you have installed react-owl-carousel
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Spinner from '../../components/Spinner.jsx';
import PopupSuccess from '../../components/PopupSuccess.jsx';
import { URL } from '../../utils/constant.js';

const ContentSection = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [newComment, setNewComment] = useState('');
    const [newRating, setNewRating] = useState(0);
    const [ratingError, setRatingError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${URL}/api/product/get-by-id?id=${productId}`);
                setProduct(response.data);
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        const fetchReviews = async () => {
            try {
                const response = await axios.get(`${URL}/api/reviews/get-all`);
                const filteredReviews = response.data.filter(review => 
                    parseInt(review.product_id) === parseInt(productId)
                );
                setReviews(filteredReviews);
            } catch (error) {
                console.error('Error fetching reviews:', error);
            }
        };

        fetchProduct();
        fetchReviews();
    }, [productId]);

    const renderStars = (rating) => {
        const fullStars = Math.floor(rating);
        const halfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);
    
        return (
            <>
                {[...Array(fullStars)].map((_, index) => (
                    <i key={`full-${index}`} className="fa fa-star text-secondary"></i>
                ))}
                {halfStar && <i className="fa fa-star-half-alt text-secondary"></i>}
                {[...Array(emptyStars)].map((_, index) => (
                    <i key={`empty-${index}`} className="fa fa-star text-muted"></i>
                ))}
            </>
        );
    };

    const handleAddToCart = async (productId, quantity) => {
        try {
            const token = sessionStorage.getItem("token");

            if (token) {
                const user = JSON.parse(sessionStorage.getItem('user'));

                const response = await axios.put(`${URL}/api/cart/add-product`, {
                    userId: user.user_id,
                    productId: productId,
                    quantity: quantity,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response) {
                    setShowSuccessPopup(true); // Show Popup Success

                    // Automatically hide Popup after 3 seconds
                    setTimeout(() => {
                        setShowSuccessPopup(false);
                    }, 3000);
                }
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error('Error adding product to cart:', error);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (newRating === 0) {
            setRatingError('Please select at least one star.');
            return;
        }
        setRatingError('');
        try {
            const token = sessionStorage.getItem("token");

            if (token) {
                const user = JSON.parse(sessionStorage.getItem('user'));

                const response = await axios.post(`${URL}/api/reviews/create-new`, {
                    user_id: user.user_id,
                    product_id: productId,
                    rating: newRating,
                    comment: newComment,
                }, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (response) {
                    setReviews([...reviews, response.data]);
                    setNewComment('');
                    setNewRating(0);
                }
            } else {
                navigate('/login');
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        }
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
            '<i className="bi bi-arrow-left"></i>',
            '<i className="bi bi-arrow-right"></i>'
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

    if (!product) {
        return <Spinner />;
    }

    const hasPromotion = product.promotions && product.promotions.length > 0;
    const originalPrice = parseFloat(product.price);
    const totalDiscountPercentage = hasPromotion
        ? product.promotions.reduce((total, promo) => total + parseFloat(promo.discount_percentage), 0)
        : 0;
    const discount = (originalPrice * totalDiscountPercentage) / 100;
    const discountedPrice = originalPrice - discount;

    // Calculate average rating
    const averageRating = reviews.length > 0
        ? reviews.reduce((total, review) => total + review.rating, 0) / reviews.length
        : 0;

    return (
        <div className="container-fluid py-5 mt-5">
            {showSuccessPopup && <PopupSuccess onClose={() => setShowSuccessPopup(false)} message={"Bạn đã thêm vào giỏ hàng thành công"} />}
            <div className="container py-5">
                <div className="row g-4 mb-5">
                    <div className="col-lg-8 col-xl-9">
                        <div className="row g-4">
                            <div className="col-lg-6">
                                <div className="border rounded">
                                    <a href="#">
                                        <img src={product.image ? `/images/product/${product.image}` : "/img/none_image.png"} className="img-fluid rounded" alt="Image" />
                                    </a>
                                </div>
                            </div>
                            <div className="col-lg-6">
                                <h4 className="fw-bold mb-3">{product.name}</h4>
                                <p className="mb-3">Category: Vegetables</p>
                                <h5 className="fw-bold me-2">{discountedPrice.toFixed(2)} $</h5>
                                {hasPromotion && (
                                    <h5 className="text-danger text-decoration-line-through">{originalPrice.toFixed(2)} $</h5>
                                )}
                                <div className="d-flex mb-4">
                                    {renderStars(averageRating)}
                                </div>
                                <p className="mb-4">{product.description}</p>
                                <div className="input-group quantity mb-5" style={{ width: '100px' }}>
                                    <div className="input-group-btn">
                                        <button className="btn btn-sm btn-minus rounded-circle bg-light border" onClick={() => setQuantity(quantity > 1 ? quantity - 1 : 1)}>
                                            <i className="fa fa-minus"></i>
                                        </button>
                                    </div>
                                    <input type="text" className="form-control form-control-sm text-center border-0" value={quantity} readOnly />
                                    <div className="input-group-btn">
                                        <button className="btn btn-sm btn-plus rounded-circle bg-light border" onClick={() => setQuantity(quantity + 1)}>
                                            <i className="fa fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                                <a href="#" className="btn border border-secondary rounded-pill px-4 py-2 mb-4 text-primary" onClick={(e) => {
                                    e.preventDefault();
                                    handleAddToCart(product.product_id, quantity);
                                }}>
                                    <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                </a>
                            </div>
                            <div className="col-lg-12">
                                <nav>
                                    <div className="nav nav-tabs mb-3">
                                        <button className="nav-link active border-white border-bottom-0" type="button" role="tab"
                                            id="nav-about-tab" data-bs-toggle="tab" data-bs-target="#nav-about"
                                            aria-controls="nav-about" aria-selected="true">Description</button>
                                        <button className="nav-link border-white border-bottom-0" type="button" role="tab"
                                            id="nav-mission-tab" data-bs-toggle="tab" data-bs-target="#nav-mission"
                                            aria-controls="nav-mission" aria-selected="false">Reviews</button>
                                    </div>
                                </nav>
                                <div className="tab-content mb-5">
                                    <div className="tab-pane active" id="nav-about" role="tabpanel" aria-labelledby="nav-about-tab">
                                        <p>{product.description}</p>

                                    </div>
                                    <div className="tab-pane" id="nav-mission" role="tabpanel" aria-labelledby="nav-mission-tab">
                                        {reviews.map((review) => (
                                            <div className="d-flex" key={review.id}>
                                                <img 
                                                    src={review.User && review.User.image ? `/images/avatar/${review.User.image}` : "/img/avatar.jpg"} 
                                                    className="img-fluid rounded-circle p-3" 
                                                    style={{ width: '100px', height: '100px' }} 
                                                    alt="" 
                                                />
                                                <div>
                                                    <p className="mb-2" style={{ fontSize: '14px' }}>{new Date(review.created_at).toLocaleDateString()}</p>
                                                    <div className="d-flex justify-content-between">
                                                        <h5>{review.User ? review.User.full_name : 'Anonymous'}</h5>
                                                        <div className="d-flex mb-3">
                                                            {renderStars(review.rating)}
                                                        </div>
                                                    </div>
                                                    <p>{review.comment}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="tab-pane" id="nav-vision" role="tabpanel">
                                        <p className="text-dark">Tempor erat elitr rebum at clita. Diam dolor diam ipsum et tempor sit. Aliqu diam
                                            amet diam et eos labore. 3</p>
                                        <p className="mb-0">Diam dolor diam ipsum et tempor sit. Aliqu diam amet diam et eos labore.
                                            Clita erat ipsum et lorem et sit</p>
                                    </div>
                                </div>
                            </div>
                            <form onSubmit={handleCommentSubmit}>
                                <h4 className="mb-5 fw-bold">Leave a Reply</h4>
                                <div className="row g-4">
                                    <div className="col-lg-12">
                                        <div className="border-bottom rounded my-4">
                                            <textarea 
                                                name="comment" 
                                                id="comment" 
                                                className="form-control border-0" 
                                                cols="30" 
                                                rows="8" 
                                                placeholder="Your Review *" 
                                                spellCheck="false"
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                            ></textarea>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="d-flex justify-content-between py-3 mb-5">
                                            <div className="d-flex align-items-center">
                                                <p className="mb-0 me-3">Please rate:</p>
                                                <div className="d-flex align-items-center" style={{ fontSize: '12px' }}>
                                                    {[...Array(5)].map((_, index) => (
                                                        <i 
                                                            key={index} 
                                                            className={`fa fa-star ${newRating > index ? 'text-secondary' : 'text-muted'}`} 
                                                            onClick={() => setNewRating(index + 1)}
                                                        ></i>
                                                    ))}
                                                </div>
                                            </div>
                                            <button type="submit" className="btn border border-secondary text-primary rounded-pill px-4 py-3">Post Comment</button>
                                        </div>
                                        {ratingError && <p className="text-danger">{ratingError}</p>}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentSection;
