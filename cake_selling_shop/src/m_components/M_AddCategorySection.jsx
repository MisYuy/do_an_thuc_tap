import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';

const M_AddCategorySection = () => {
    const [formData, setFormData] = useState({
        name: '',
        description: ''
    });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${URL}/api/category/add-new`, formData);
            console.log('Category added successfully:', response.data);
            setError(null); // Clear any previous errors
        } catch (error) {
            setError(error.response ? error.response.data : 'Error adding category');
        }
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12"> 
                        <div className="card">
                            <div className="card-header">
                                <strong>Form thêm danh mục</strong>
                            </div>
                            <div className="card-body card-block">
                                <form onSubmit={handleSubmit} className="form-horizontal">
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="name" className="form-control-label">Tên danh mục</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="text" id="name" name="name" placeholder="Enter category name" className="form-control" value={formData.name} onChange={handleChange} />
                                            <small className="form-text text-muted">Please enter the category name</small>
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

export default M_AddCategorySection;
