import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';

const M_CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('category_id');
    const [sortOrder, setSortOrder] = useState('asc');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await axios.get(`${URL}/api/category/get-all`);
                setCategories(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchCategories();
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Filter categories based on search term
    const filteredCategories = categories.filter(category => {
        const matchesId = category.category_id.toString().includes(searchTerm);
        const matchesName = category.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesId || matchesName;
    });

    // Sort categories based on selected criteria and order
    const sortedCategories = filteredCategories.sort((a, b) => {
        const aValue = sortCriteria === 'category_id' ? a.category_id :
                       sortCriteria === 'name' ? a.name :
                       sortCriteria === 'description' ? a.description :
                       sortCriteria === 'created_at' ? new Date(a.created_at) :
                       sortCriteria === 'updated_at' ? new Date(a.updated_at) :
                       0;

        const bValue = sortCriteria === 'category_id' ? b.category_id :
                       sortCriteria === 'name' ? b.name :
                       sortCriteria === 'description' ? b.description :
                       sortCriteria === 'created_at' ? new Date(b.created_at) :
                       sortCriteria === 'updated_at' ? new Date(b.updated_at) :
                       0;

        return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle category click to navigate to detail page
    const handleCategoryClick = (categoryId) => {
        navigate(`/m/operation-category/${categoryId}`);
    };

    // Utility function to format date
    const formatDate = (dateString) => {
        const options = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
        };
        return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card" style={{ paddingBottom: '150px' }}>
                            <div className="card-header">
                                <strong className="card-title">Danh sách danh mục</strong>
                                <a href="add-category" type="button" className="btn btn-primary" style={{ marginLeft: '20px' }}>
                                    <i className="fa fa-plus-circle"></i>&nbsp; Thêm Danh mục
                                </a>
                            </div>
                            <div className="card-body">
                                <div style={{ marginBottom: '20px' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Tìm kiếm theo ID hoặc Tên..." 
                                        value={searchTerm} 
                                        onChange={(e) => setSearchTerm(e.target.value)} 
                                        style={{ marginRight: '20px', padding: '5px', minWidth: '300px' }} 
                                    />
                                    <select 
                                        value={sortCriteria} 
                                        onChange={(e) => setSortCriteria(e.target.value)} 
                                        style={{ marginRight: '20px', padding: '5px'}}
                                    >
                                        <option value="category_id">Sắp xếp theo ID</option>
                                        <option value="name">Sắp xếp theo Tên</option>
                                        <option value="description">Sắp xếp theo Mô tả</option>
                                        <option value="created_at">Sắp xếp theo Ngày tạo</option>
                                        <option value="updated_at">Sắp xếp theo Ngày cập nhật</option>
                                    </select>
                                    <select 
                                        value={sortOrder} 
                                        onChange={(e) => setSortOrder(e.target.value)} 
                                        style={{ padding: '5px'}}
                                    >
                                        <option value="asc">Tăng dần</option>
                                        <option value="desc">Giảm dần</option>
                                    </select>
                                </div>
                                <table id="bootstrap-data-table" className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'center' }}>ID Danh mục</th>
                                            <th style={{ textAlign: 'center' }}>Tên Danh mục</th>
                                            <th style={{ textAlign: 'center' }}>Mô tả</th>
                                            <th style={{ textAlign: 'center' }}>Ngày tạo</th>
                                            <th style={{ textAlign: 'center' }}>Ngày cập nhật</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedCategories.map(category => (
                                            <tr key={category.category_id} onClick={() => handleCategoryClick(category.category_id)} style={{ cursor: 'pointer' }}>
                                                <td style={{ textAlign: 'center' }}>{category.category_id}</td>
                                                <td style={{ textAlign: 'center' }}>{category.name}</td>
                                                <td style={{ textAlign: 'center' }}>{category.description}</td>
                                                <td style={{ textAlign: 'center' }}>{formatDate(category.created_at)}</td>
                                                <td style={{ textAlign: 'center' }}>{formatDate(category.updated_at)}</td>
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

export default M_CategorySection;
