import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';

const M_ProductSection = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCriteria, setFilterCriteria] = useState('product_id');
    const [sortCriteria, setSortCriteria] = useState('product_id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [selectedStatuses, setSelectedStatuses] = useState({
        available: false,
        low_stock: false,
        out_of_stock: false,
    });
    const [categories, setCategories] = useState([]);

    const navigate = useNavigate();
    
    const user = JSON.parse(sessionStorage.getItem('user'));
    const token = sessionStorage.getItem('token');

    useEffect(() => {
        if (!user) {
            navigate('/login');
        }
    }, [user, navigate]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${URL}/api/category/get-all`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setCategories(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchCategories();
    }, [token]);

    useEffect(() => {
        axios.get(`${URL}/api/product/get-all`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                setError(error);
            });
    }, [token]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const calculateFinalPrice = (price, promotions) => {
        let finalPrice = price;
        let totalDiscount = 0;
        promotions.forEach(promotion => {
            totalDiscount += Number(promotion.discount_percentage);
        });
        finalPrice -= finalPrice * (totalDiscount / 100);
        return finalPrice;
    };

    // Filter products based on search term and selected statuses
    const filteredProducts = products.filter(product => {
        const valueToCheck = 
            filterCriteria === 'product_id' ? product.product_id.toString() :
            filterCriteria === 'name' ? product.name.toLowerCase() :
            '';

        const matchesSearchTerm = valueToCheck.includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatuses[product.status];

        return matchesSearchTerm && (Object.values(selectedStatuses).every(status => !status) || matchesStatus);
    });

    // Sort products based on selected criteria and order
    const sortedProducts = filteredProducts.sort((a, b) => {
        const aValue = sortCriteria === 'product_id' ? a.product_id :
                       sortCriteria === 'name' ? a.name :
                       sortCriteria === 'final_price' ? calculateFinalPrice(a.price, a.promotions) :
                       sortCriteria === 'original_price' ? a.price :
                       a.stock_quantity;

        const bValue = sortCriteria === 'product_id' ? b.product_id :
                       sortCriteria === 'name' ? b.name :
                       sortCriteria === 'final_price' ? calculateFinalPrice(b.price, b.promotions) :
                       sortCriteria === 'original_price' ? b.price :
                       b.stock_quantity;

        return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    const handleStatusChange = (status) => {
        setSelectedStatuses(prev => ({
            ...prev,
            [status]: !prev[status],
        }));
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.category_id === categoryId);
        return category ? category.name : 'Unknown';
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                {user && user.role !== 'sale staff' && (
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong className="card-title">Thao tác</strong>
                                </div>
                                <div className="card-body">
                                    <a href="add-product" type="button" className="btn btn-primary" style={{ marginRight: '20px' }}>
                                        <i className="fa fa-plus-circle"></i>&nbsp; Thêm
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <strong className="card-title">Danh sách sản phẩm</strong>
                            </div>
                            <div className="card-body">
                                <div style={{ marginBottom: '20px' }}>
                                    <select 
                                        value={filterCriteria} 
                                        onChange={(e) => setFilterCriteria(e.target.value)} 
                                        style={{ padding: '5px'}}
                                    >
                                        <option value="product_id">ID Sản phẩm</option>
                                        <option value="name">Tên Sản phẩm</option>
                                    </select>
                                    <input 
                                        type="text" 
                                        placeholder="Tìm kiếm..." 
                                        value={searchTerm} 
                                        onChange={(e) => setSearchTerm(e.target.value)} 
                                        style={{ marginLeft: '20px', padding: '5px', minWidth: '300px' }} 
                                    />
                                    <select 
                                        value={sortCriteria} 
                                        onChange={(e) => setSortCriteria(e.target.value)} 
                                        style={{ marginLeft: '20px', padding: '5px'}}
                                    >
                                        <option value="product_id">Sắp xếp theo ID</option>
                                        <option value="name">Sắp xếp theo Tên</option>
                                        <option value="final_price">Sắp xếp theo Giá thực</option>
                                        <option value="original_price">Sắp xếp theo Giá gốc</option>
                                        <option value="stock_quantity">Sắp xếp theo Tồn kho</option>
                                    </select>
                                    <select 
                                        value={sortOrder} 
                                        onChange={(e) => setSortOrder(e.target.value)} 
                                        style={{ marginLeft: '20px', padding: '5px'}}
                                    >
                                        <option value="asc">Tăng dần</option>
                                        <option value="desc">Giảm dần</option>
                                    </select>
                                    <div style={{ display: 'flex', marginTop: '20px' }}>
                                        {['available', 'low of stock', 'out of stock'].map(status => (
                                            <div key={status} style={{ marginRight: '20px' }}>
                                                <label>
                                                    <input 
                                                        type="checkbox" 
                                                        checked={selectedStatuses[status]} 
                                                        onChange={() => handleStatusChange(status)} 
                                                        style={{ marginRight: '5px' }}
                                                    />
                                                    <span>{getStatusText(status)}</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <table id="bootstrap-data-table" className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'center' }}>ID</th>
                                            <th style={{ textAlign: 'center' }}>Ảnh</th>
                                            <th style={{ textAlign: 'center' }}>Tên</th>
                                            <th style={{ textAlign: 'center' }}>Danh mục</th>
                                            <th style={{ textAlign: 'center' }}>Giá gốc</th>
                                            <th style={{ textAlign: 'center' }}>Mã Khuyến mãi</th>
                                            <th style={{ textAlign: 'center' }}>Giá thực</th>
                                            <th style={{ textAlign: 'center' }}>Tồn kho</th>
                                            <th style={{ textAlign: 'center' }}>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedProducts.map(product => (
                                            <tr key={product.product_id}>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{product.product_id}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>
                                                    {user && user.role !== 'sale staff' ? (
                                                        <a href={`/m/operation-product/${product.product_id}`}>
                                                            <img className="rounded-circle" src={product.image ? `/images/product/${product.image}` : "/img/none_image.png"} style={{ minWidth: '100px', minHeight: "100px", maxWidth: '100px', maxHeight: "100px" }} alt="avatar" />
                                                        </a>
                                                    ) : (
                                                        <img className="rounded-circle" src={product.image ? `/images/product/${product.image}` : "/img/none_image.png"} style={{ minWidth: '100px', minHeight: "100px", maxWidth: '100px', maxHeight: "100px" }} alt="avatar" />
                                                    )}
                                                </td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{product.name}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{getCategoryName(product.category_id)}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{product.price}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>
                                                    {product.promotions.map(promotion => (
                                                        <div key={promotion.promotion_id}>
                                                            {promotion.name} ({promotion.discount_percentage}%)
                                                        </div>
                                                    ))}
                                                </td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>
                                                    {calculateFinalPrice(product.price, product.promotions)}
                                                </td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>{product.stock_quantity}</td>
                                                <td style={{ alignContent: 'center', textAlign: 'center' }}>
                                                    <button className="badge badge-complete" style={{ backgroundColor: product.status === 'available' ? '#1ecc02' : product.status === 'low of stock' ? '#ebb134' : '#ff0000' }}>
                                                        {getStatusText(product.status)}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Back to Top Button */}
                <button 
                    onClick={scrollToTop} 
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: '#1ecc02',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '10px 15px',
                        cursor: 'pointer',
                        zIndex: 1000,
                    }}
                >
                    Back to Top
                </button>
            </div>
        </div>
    );
};

// Helper function to get status text
const getStatusText = (status) => {
    switch (status) {
        case 'available':
            return 'Còn hàng';
        case 'low of stock':
            return 'Sắp hết';
        case 'out of stock':
            return 'Hết hàng';
        default:
            return 'Không xác định';
    }
};

export default M_ProductSection;
