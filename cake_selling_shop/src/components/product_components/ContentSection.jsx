import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { URL } from '../../utils/constant.js';
import axios from 'axios';
import PopupSuccess from '../../components/PopupSuccess.jsx';

const ContentSection = ({ products }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const productsPerPage = 9;
    const navigate = useNavigate();

    // Calculate the products to display on the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

    // Calculate the total number of pages
    const totalPages = Math.ceil(products.length / productsPerPage);

    // Handle page change
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Handle product click to navigate to detail page
    const handleProductClick = (productId) => {
        navigate(`/product-detail/${productId}`);
    };

    const handleAddToCart = async (productId) => {
        try {
                
            const user = JSON.parse(sessionStorage.getItem('user'));
            console.log(sessionStorage.getItem('user'));

            const response = await axios.put(`${URL}/api/cart/add-product`, {
                userId: user.user_id,
                productId: productId,
                quantity: 1,
            });

            if(response){
                setShowSuccessPopup(true); // Hiển thị Popup Success
            
                // Tự động ẩn Popup sau 2 giây
                setTimeout(() => {
                    setShowSuccessPopup(false);
                }, 3000);
            }
        } catch (error) {
            // Handle error (optional)
            console.error('Error adding product to cart:', error);
        }
    };
    
     // Xử lý đóng Popup Success
     const handleClosePopup = () => {
        setShowSuccessPopup(false);
    };

    return (
        <div className="container-fluid fruite py-5">
            {showSuccessPopup && <PopupSuccess onClose={handleClosePopup} message={"Bạn đã thêm vào giỏ hàng thành công"}/>}
            <div className="container py-5">
                <h1 className="mb-4">Fresh fruits shop</h1>
                <div className="row g-4">
                    <div className="col-lg-12">
                        <div className="row g-4">
                            <div className="col-xl-3">
                                <div className="input-group w-100 mx-auto d-flex">
                                    <input type="search" className="form-control p-3" placeholder="keywords" aria-describedby="search-icon-1" />
                                    <span id="search-icon-1" className="input-group-text p-3"><i className="fa fa-search"></i></span>
                                </div>
                            </div>
                            <div className="col-6"></div>
                            <div className="col-xl-3">
                                <div className="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">
                                    <label htmlFor="fruits">Default Sorting:</label>
                                    <select id="fruits" name="fruitlist" className="border-0 form-select-sm bg-light me-3" form="fruitform">
                                        <option value="volvo">Nothing</option>
                                        <option value="saab">Popularity</option>
                                        <option value="opel">Organic</option>
                                        <option value="audi">Fantastic</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="row g-4">
                            <div className="col-lg-3">
                                <div className="row g-4">
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <h4>Categories</h4>
                                            <ul className="list-unstyled fruite-categorie">
                                                <li>
                                                    <div className="d-flex justify-content-between fruite-name">
                                                        <a href="#"><i className="fas fa-apple-alt me-2"></i>Apples</a>
                                                        <span>(3)</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="d-flex justify-content-between fruite-name">
                                                        <a href="#"><i className="fas fa-apple-alt me-2"></i>Oranges</a>
                                                        <span>(5)</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="d-flex justify-content-between fruite-name">
                                                        <a href="#"><i className="fas fa-apple-alt me-2"></i>Strawberry</a>
                                                        <span>(2)</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="d-flex justify-content-between fruite-name">
                                                        <a href="#"><i className="fas fa-apple-alt me-2"></i>Banana</a>
                                                        <span>(8)</span>
                                                    </div>
                                                </li>
                                                <li>
                                                    <div className="d-flex justify-content-between fruite-name">
                                                        <a href="#"><i className="fas fa-apple-alt me-2"></i>Pumpkin</a>
                                                        <span>(5)</span>
                                                    </div>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <h4 className="mb-2">Price</h4>
                                            <input type="range" className="form-range w-100" id="rangeInput" name="rangeInput" min="0" max="500" defaultValue="0" onInput={(e) => document.getElementById('amount').value = e.target.value} />
                                            <output id="amount" name="amount" min-value="0" max-value="500" htmlFor="rangeInput">0</output>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <h4>Additional</h4>
                                            <div className="mb-2">
                                                <input type="radio" className="me-2" id="Categories-1" name="Categories-1" value="Beverages" />
                                                <label htmlFor="Categories-1"> Organic</label>
                                            </div>
                                            <div className="mb-2">
                                                <input type="radio" className="me-2" id="Categories-2" name="Categories-1" value="Beverages" />
                                                <label htmlFor="Categories-2"> Fresh</label>
                                            </div>
                                            <div className="mb-2">
                                                <input type="radio" className="me-2" id="Categories-3" name="Categories-1" value="Beverages" />
                                                <label htmlFor="Categories-3"> Sales</label>
                                            </div>
                                            <div className="mb-2">
                                                <input type="radio" className="me-2" id="Categories-4" name="Categories-1" value="Beverages" />
                                                <label htmlFor="Categories-4"> Discount</label>
                                            </div>
                                            <div className="mb-2">
                                                <input type="radio" className="me-2" id="Categories-5" name="Categories-1" value="Beverages" />
                                                <label htmlFor="Categories-5"> Expired</label>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <h4 className="mb-3">Featured products</h4>
                                        <div className="d-flex align-items-center justify-content-start">
                                            <div className="rounded me-4" style={{ width: '100px', height: '100px' }}>
                                                <img src="img/featur-1.jpg" className="img-fluid rounded" alt="" />
                                            </div>
                                            <div>
                                                <h6 className="mb-2">Big Banana</h6>
                                                <div className="d-flex mb-2">
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                                <div className="d-flex mb-2">
                                                    <h5 className="fw-bold me-2">2.99 $</h5>
                                                    <h5 className="text-danger text-decoration-line-through">4.11 $</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-start">
                                            <div className="rounded me-4" style={{ width: '100px', height: '100px' }}>
                                                <img src="img/featur-2.jpg" className="img-fluid rounded" alt="" />
                                            </div>
                                            <div>
                                                <h6 className="mb-2">Big Banana</h6>
                                                <div className="d-flex mb-2">
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                                <div className="d-flex mb-2">
                                                    <h5 className="fw-bold me-2">2.99 $</h5>
                                                    <h5 className="text-danger text-decoration-line-through">4.11 $</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-start">
                                            <div className="rounded me-4" style={{ width: '100px', height: '100px' }}>
                                                <img src="img/featur-3.jpg" className="img-fluid rounded" alt="" />
                                            </div>
                                            <div>
                                                <h6 className="mb-2">Big Banana</h6>
                                                <div className="d-flex mb-2">
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                                <div className="d-flex mb-2">
                                                    <h5 className="fw-bold me-2">2.99 $</h5>
                                                    <h5 className="text-danger text-decoration-line-through">4.11 $</h5>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="d-flex align-items-center justify-content-start">
                                            <div className="rounded me-4" style={{ width: '100px', height: '100px' }}>
                                                <img src="img/featur-4.jpg" className="img-fluid rounded" alt="" />
                                            </div>
                                            <div>
                                                <h6 className="mb-2">Big Banana</h6>
                                                <div className="d-flex mb-2">
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star text-secondary"></i>
                                                    <i className="fa fa-star"></i>
                                                </div>
                                                <div className="d-flex mb-2">
                                                    <h5 className="fw-bold me-2">2.99 $</h5>
                                                    <h5 className="text-danger text-decoration-line-through">4.11 $</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-9">
                                <div className="row g-4 justify-content-center">
                                    {currentProducts.map((product, index) => {
                                        const hasPromotion = product.promotions && product.promotions.length > 0;
                                        const originalPrice = parseFloat(product.price);
                                        const totalDiscountPercentage = hasPromotion
                                            ? product.promotions.reduce((total, promo) => total + parseFloat(promo.discount_percentage), 0)
                                            : 0;
                                        const discount = (originalPrice * totalDiscountPercentage) / 100;
                                        const discountedPrice = originalPrice - discount;

                                        return (
                                            <div
                                                className="col-md-6 col-lg-6 col-xl-4"
                                                key={index}
                                                // Handle product item click
                                                style={{ cursor: 'pointer' }} // Change cursor to pointer on hover
                                            >
                                                <div className="rounded position-relative fruite-item">
                                                    <div className="fruite-img">
                                                        <img onClick={() => handleProductClick(product.product_id)}   src={product.image ? `/images/product/${product.image}` : "/img/none_image.png"} className="img-fluid w-100 rounded-top" alt="" />
                                                    </div>
                                                    <div className="text-white bg-secondary px-3 py-1 rounded position-absolute" style={{ top: '10px', left: '10px' }}>Fruits</div>
                                                    <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                                                        <h4>{product.name}</h4>
                                                        <p>{product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}</p>
                                                        <div className="d-flex justify-content-between flex-lg-wrap">
                                                            <h5 className="fw-bold me-2">{discountedPrice.toFixed(2)} $</h5>
                                                            {hasPromotion && (
                                                                <h5 className="text-danger text-decoration-line-through">{originalPrice.toFixed(2)} $</h5>
                                                            )}
                                                            <a href="#" className="btn border border-secondary rounded-pill px-3 text-primary" onClick={(e) => {
                                                                e.preventDefault(); // Prevent the default behavior of the link
                                                                handleAddToCart(product.product_id); // Call your function to handle adding to cart
                                                            }}
                                                            >
                                                            <i className="fa fa-shopping-bag me-2 text-primary"></i> Add to cart
                                                            </a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div className="col-12">
                                        <div className="pagination d-flex justify-content-center mt-5">
                                            <a href="#" className="rounded" onClick={() => handlePageChange(currentPage - 1)}>&laquo;</a>
                                            {[...Array(totalPages)].map((_, pageNumber) => (
                                                <a href="#" key={pageNumber} className={`rounded ${currentPage === pageNumber + 1 ? 'active' : ''}`} onClick={() => handlePageChange(pageNumber + 1)}>{pageNumber + 1}</a>
                                            ))}
                                            <a href="#" className="rounded" onClick={() => handlePageChange(currentPage + 1)}>&raquo;</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContentSection;
