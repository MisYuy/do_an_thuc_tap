import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { URL } from '../../utils/constant.js';
import axios from 'axios';
import PopupSuccess from '../../components/PopupSuccess.jsx';

const ContentSection = ({ products }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(10000000);
    const [additionalFilter, setAdditionalFilter] = useState('all');
    const [sortOption, setSortOption] = useState('default');
    const [searchQuery, setSearchQuery] = useState('');
    const productsPerPage = 9;
    const navigate = useNavigate();

    // Fetch categories from backend when component mounts
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${URL}/api/category/get-all`);
                const categoriesWithCount = response.data.map(category => {
                    const productCount = products.filter(product => product.category_id === category.category_id).length;
                    return { ...category, product_count: productCount };
                });
                setCategories([{ category_id: 'all', name: 'All', product_count: products.length }, ...categoriesWithCount]);
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, [products]);

    // Function to get category name by category_id
    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.category_id === categoryId);
        return category ? category.name : 'Unknown';
    };

    // Filter products based on selected category, price range, additional filter, and search query
    const filteredProducts = products.filter(product => {
        const isInCategory = selectedCategory === 'all' || product.category_id === selectedCategory;
        const isInPriceRange = product.price >= minPrice && product.price <= maxPrice;
        const isOnSale = additionalFilter === 'all' || (additionalFilter === 'onSale' && product.promotions && product.promotions.length > 0);
        const matchesSearchQuery = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        return isInCategory && isInPriceRange && isOnSale && matchesSearchQuery;
    });

    // Sort products based on the selected sort option
    const sortedProducts = filteredProducts.sort((a, b) => {
        if (sortOption === 'priceAsc') {
            return a.price - b.price;
        } else if (sortOption === 'priceDesc') {
            return b.price - a.price;
        }
        return 0; // Default sorting (no sorting)
    });

    // Calculate the products to display on the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Calculate the total number of pages
    const totalPages = Math.ceil(sortedProducts.length / productsPerPage);

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
            const token = sessionStorage.getItem("token");

            if (token) {
                const user = JSON.parse(sessionStorage.getItem('user'));

                const response = await axios.put(`${URL}/api/cart/add-product`, {
                    userId: user.user_id,
                    productId: productId,
                    quantity: 1,
                },{
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

    // Handle category selection
    const handleCategorySelect = (categoryId) => {
        setSelectedCategory(categoryId);
        setCurrentPage(1); // Reset to the first page when category changes
    };

    // Handle closing Popup Success
    const handleClosePopup = () => {
        setShowSuccessPopup(false);
    };

    // Handle price range change
    const handlePriceChange = (e) => {
        const { name, value } = e.target;
        if (name === 'minPrice') {
            setMinPrice(Number(value));
        } else if (name === 'maxPrice') {
            setMaxPrice(Number(value));
        }
    };

    // Handle additional filter change
    const handleAdditionalFilterChange = (e) => {
        setAdditionalFilter(e.target.value);
    };

    // Handle sort option change
    const handleSortOptionChange = (e) => {
        setSortOption(e.target.value);
    };

    // Handle search query change
    const handleSearchQueryChange = (e) => {
        setSearchQuery(e.target.value);
    };

    return (
        <div className="container-fluid fruite py-5">
            {showSuccessPopup && <PopupSuccess onClose={handleClosePopup} message={"Bạn đã thêm vào giỏ hàng thành công"} />}
            <div className="container py-5">
                <h1 className="mb-4">Tiệm bánh ZuyCake</h1>
                <div className="row g-4">
                    <div className="col-lg-12">
                        <div className="row g-4">
                            <div className="col-xl-3">
                                <div className="input-group w-100 mx-auto d-flex">
                                    <input type="search" className="form-control p-3" placeholder="Tìm kiếm theo tên " aria-describedby="search-icon-1" value={searchQuery} onChange={handleSearchQueryChange} />
                                    <span id="search-icon-1" className="input-group-text p-3"><i className="fa fa-search"></i></span>
                                </div>
                            </div>
                            <div className="col-6"></div>
                            <div className="col-xl-3">
                                <div className="bg-light ps-3 py-3 rounded d-flex justify-content-between mb-4">
                                    <label htmlFor="fruits">Default Sorting:</label>
                                    <select id="fruits" name="fruitlist" className="border-0 form-select-sm bg-light me-3" form="fruitform" onChange={handleSortOptionChange}>
                                        <option value="default">Default</option>
                                        <option value="priceAsc">Giá: Thấp tới cao</option>
                                        <option value="priceDesc">Giá: Cao tới thấp</option>
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
                                                {categories.map(category => (
                                                    <li key={category.category_id}>
                                                        <div className="d-flex justify-content-between fruite-name">
                                                            <a href="#" onClick={(e) => {
                                                                e.preventDefault();
                                                                handleCategorySelect(category.category_id);
                                                            }}>
                                                                <i className="fas fa-apple-alt me-2"></i>{category.name}
                                                            </a>
                                                            <span>({category.product_count})</span>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <h4 className="mb-2">Price</h4>
                                            <input type="range" className="form-range w-100" id="minPrice" name="minPrice" min="0" max="10000000" value={minPrice} onChange={handlePriceChange} />
                                            <output id="minAmount" name="minAmount" htmlFor="minPrice">{minPrice}</output>
                                            <input type="range" className="form-range w-100" id="maxPrice" name="maxPrice" min="0" max="10000000" value={maxPrice} onChange={handlePriceChange} />
                                            <output id="maxAmount" name="maxAmount" htmlFor="maxPrice">{maxPrice}</output>
                                        </div>
                                    </div>
                                    <div className="col-lg-12">
                                        <div className="mb-3">
                                            <h4>Additional</h4>
                                            <div className="mb-2">
                                                <input type="radio" className="me-2" id="additional-all" name="additionalFilter" value="all" checked={additionalFilter === 'all'} onChange={handleAdditionalFilterChange} />
                                                <label htmlFor="additional-all"> All</label>
                                            </div>
                                            <div className="mb-2">
                                                <input type="radio" className="me-2" id="additional-onSale" name="additionalFilter" value="onSale" checked={additionalFilter === 'onSale'} onChange={handleAdditionalFilterChange} />
                                                <label htmlFor="additional-onSale"> Đang giảm giá</label>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="col-lg-12">
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
                                                    <h5 className="fw-bold me-2">2.99 ₫</h5>
                                                    <h5 className="text-danger text-decoration-line-through">4.11 ₫</h5>
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
                                                    <h5 className="text-danger text-decoration-line-through">4.11 ₫</h5>
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
                                                    <h5 className="fw-bold me-2">2.99 ₫</h5>
                                                    <h5 className="text-danger text-decoration-line-through">4.11 ₫</h5>
                                                </div>
                                            </div>
                                        </div>
                                    </div> */}
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
                                                        <img onClick={() => handleProductClick(product.product_id)} src={product.image ? `/images/product/${product.image}` : "/img/none_image.png"} className="img-fluid w-100 rounded-top" alt="" />
                                                    </div>
                                                    <div className="text-white bg-secondary px-3 py-1 rounded position-absolute" style={{ top: '10px', left: '10px' }}>{getCategoryName(product.category_id)}</div>
                                                    <div className="p-4 border border-secondary border-top-0 rounded-bottom">
                                                        <h4>{product.name}</h4>
                                                        <p>{product.description.length > 100 ? `${product.description.substring(0, 100)}...` : product.description}</p>
                                                        <div className="d-flex justify-content-between flex-lg-wrap">
                                                            <h5 className="fw-bold me-2">{discountedPrice.toFixed(2)} ₫</h5>
                                                            {hasPromotion && (
                                                                <h5 className="text-danger text-decoration-line-through">{originalPrice.toFixed(2)} ₫</h5>
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
