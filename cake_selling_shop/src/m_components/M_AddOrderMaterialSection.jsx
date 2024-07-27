import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';

const M_AddOrderMaterialSection = () => {
    const [formData, setFormData] = useState({
        material_id: '',
        quantity: '',
        status: 'pending'
    });
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        console.log(value);
    };

    const navigate = useNavigate();

    const validateInputs = () => {
        const errors = {};
        if (!formData.material_id) errors.material_id = 'Material ID is required';
        if (!formData.quantity) {
            errors.quantity = 'Quantity is required';
        } else if (formData.quantity <= 0) {
            errors.quantity = 'Quantity must be greater than 0';
        }
        if (!formData.status) errors.status = 'Status is required';
        return errors;
    };

    const [materials, setMaterials] = useState([]);

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axios.get(`${URL}/api/material/get-all`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setMaterials(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchMaterials();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateInputs();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        try {
            const response = await axios.post(`${URL}/api/order-material/add-new`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            navigate('/m/order-material');
            console.log('Material order added successfully:', response.data);
            setError(null); // Clear any previous errors
        } catch (error) {
            setError(error.response ? error.response.data : 'Error adding material order');
        }
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12"> 
                        <div className="card">
                            <div className="card-header">
                                <strong>Form thêm đơn hàng vật liệu</strong>
                            </div>
                            <div className="card-body card-block">
                                <form onSubmit={handleSubmit} className="form-horizontal">
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="material_id" className="form-control-label">Material ID</label></div>
                                        <div className="col-12 col-md-9">
                                            <select id="material_id" name="material_id" className="form-control" value={formData.material_id} onChange={handleChange}>
                                                <option value="">Select Material ID</option>
                                                {materials.map(material => (
                                                    <option key={material.material_id} value={material.material_id}>{material.name}</option>
                                                ))}
                                            </select>
                                            <small className="form-text text-muted">Please select the material ID</small>
                                            {validationErrors.material_id && <div className="text-danger">{validationErrors.material_id}</div>}
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="quantity" className="form-control-label">Quantity</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="number" id="quantity" name="quantity" placeholder="Enter quantity" className="form-control" value={formData.quantity} onChange={handleChange} />
                                            <small className="help-block form-text">Please enter the quantity</small>
                                            {validationErrors.quantity && <div className="text-danger">{validationErrors.quantity}</div>}
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{paddingBottom: '25px'}}>
                                        <div className="col col-md-3"><label htmlFor="status" className="form-control-label">Status</label></div>
                                        <div className="col-12 col-md-9">
                                            <select id="status" name="status" className="form-control" value={formData.status} onChange={handleChange}>
                                                <option value="pending">Chờ xác nhận</option>
                                                <option value="completed">Hoàn thành</option>
                                            </select>
                                            <small className="help-block form-text">Please select the status</small>
                                            {validationErrors.status && <div className="text-danger">{validationErrors.status}</div>}
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

export default M_AddOrderMaterialSection;
