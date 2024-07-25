import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import Select from 'react-select'; // Import react-select
import { useNavigate } from 'react-router-dom';

const M_AddProductSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '', // This will hold the category ID
        price: '',
        stock: '',
        image: null,
        promotions: [] // Add promotions to formData
    });
    const [promotions, setPromotions] = useState([]);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
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

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await axios.get(`${URL}/api/promotion/get-all`);
                setPromotions(response.data.map(promo => ({
                    value: promo.promotion_id,
                    label: `${promo.name} (${promo.discount_percentage}%)`
                })));
            } catch (error) {
                setError(error);
            }
        };

        fetchPromotions();
    }, []);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handlePromotionChange = (selectedOptions) => {
        setFormData({ ...formData, promotions: selectedOptions });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Custom validation logic
        if (!formData.name) {
            setError('Product name is required');
            return;
        }
        if (!formData.category) {
            setError('Category is required');
            return;
        }
        if (!formData.price || formData.price <= 0) {
            setError('Price must be a positive number');
            return;
        }
        if (!formData.stock || formData.stock < 0) {
            setError('Stock must be a non-negative number');
            return;
        }

        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('category_id', formData.category); // Ensure category_id is sent
        data.append('price', formData.price);
        data.append('stock_quantity', formData.stock);
        data.append('image', formData.image);
        data.append('promotions', JSON.stringify(formData.promotions.map(promo => promo.value))); // Add promotions to form data

        try {
            const response = await axios.post(`${URL}/api/product/add-new`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            navigate(`/m/product`);
            console.log('Product added successfully:', response.data);
            setError(null); // Clear any previous errors
        } catch (error) {
            setError(error.response ? error.response.data : 'Error adding product');
        }
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12"> 
                        <div className="card">
                            <div className="card-header">
                                <strong>Form thêm sản phẩm</strong>
                            </div>
                            <div className="card-body card-block">
                                <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-horizontal">
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="name" className="form-control-label">Tên sản phẩm</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="text" id="name" name="name" placeholder="Enter name" className="form-control" value={formData.name} onChange={handleChange} required />
                                            <small className="form-text text-muted">Please enter the product name</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3">
                                            <label htmlFor="description" className="form-control-label">Mô tả</label>
                                        </div>
                                        <div className="col-12 col-md-9">
                                            <textarea name="description" id="description" rows="9" placeholder="Content..." className="form-control" value={formData.description} onChange={handleChange} required></textarea>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="category" className="form-control-label">Loại</label></div>
                                        <div className="col-12 col-md-9">
                                            <select name="category" id="category" className="form-control" value={formData.category} onChange={handleChange} required>
                                                <option value="">Please select</option>
                                                {categories.map(category => (
                                                    <option key={category.category_id} value={category.category_id}>{category.name}</option>
                                                ))}
                                            </select>
                                            <small className="form-text text-muted">Please select the category</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="price" className="form-control-label">Giá</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="number" id="price" name="price" placeholder="Enter price" className="form-control" value={formData.price} onChange={handleChange} required min="0.01" step="0.01" />
                                            <small className="help-block form-text">Please enter the price</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label className=" form-control-label">Áp dụng mã khuyến mãi</label></div>
                                        <div className="col-12 col-md-9">
                                            <Select
                                                isMulti
                                                name="promotions"
                                                options={promotions}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                                value={formData.promotions}
                                                onChange={handlePromotionChange}
                                            />
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="stock" className="form-control-label">Tồn kho</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="number" id="stock" name="stock" placeholder="Enter stock" className="form-control" value={formData.stock} onChange={handleChange} required min="0" />
                                            <small className="help-block form-text">Please enter the stock</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="image" className="form-control-label">Hình ảnh</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="file" id="image" name="image" className="form-control-file" onChange={handleChange} required />
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="alert alert-danger">
                                            {typeof error === 'string' ? error : JSON.stringify(error)}
                                        </div>
                                    )}
                                    <div className="card-footer" style={{textAlign: 'center'}}>
                                        <input className="btn btn-success" type="submit" value="Xác nhận"/>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default M_AddProductSection;
