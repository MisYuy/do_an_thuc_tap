import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';

const M_AddProductSection = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        image: null
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            setFormData({ ...formData, [name]: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('price', formData.price);
        data.append('stock_quantity', formData.stock);
        data.append('image', formData.image);

        try {
            const response = await axios.post(`${URL}/api/product/add-new`, data, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
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
                                            <input type="text" id="name" name="name" placeholder="Enter name" className="form-control" value={formData.name} onChange={handleChange} />
                                            <small className="form-text text-muted">This is a help text</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3">
                                            <label htmlFor="description" className="form-control-label">Mô tả</label>
                                        </div>
                                        <div className="col-12 col-md-9">
                                            <textarea name="description" id="description" rows="9" placeholder="Content..." className="form-control" value={formData.description} onChange={handleChange}></textarea>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="category" className="form-control-label">Loại</label></div>
                                        <div className="col-12 col-md-9">
                                            <select name="category" id="category" className="form-control" value={formData.category} onChange={handleChange}>
                                                <option value="">Please select</option>
                                                <option value="1">Option #1</option>
                                                <option value="2">Option #2</option>
                                                <option value="3">Option #3</option>
                                            </select>
                                            <small className="form-text text-muted">This is a help text</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="price" className="form-control-label">Giá</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="number" id="price" name="price" placeholder="Enter price" className="form-control" value={formData.price} onChange={handleChange} />
                                            <small className="help-block form-text">Please enter your email</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="stock" className="form-control-label">Tồn kho</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="number" id="stock" name="stock" placeholder="Enter stock" className="form-control" value={formData.stock} onChange={handleChange} />
                                            <small className="help-block form-text">Please enter your email</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="image" className="form-control-label">Hình ảnh</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="file" id="image" name="image" className="form-control-file" onChange={handleChange} />
                                            <small className="form-text text-muted">This is a help text</small>
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
