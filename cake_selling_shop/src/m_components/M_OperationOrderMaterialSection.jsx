import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const M_OperationOrderMaterial = () => {
    const { orderId } = useParams();
    const [order, setOrder] = useState(null);
    const [formData, setFormData] = useState({
        material_order_id: orderId,
        material_id: '',
        quantity: '',
        status: ''
    });
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [materials, setMaterials] = useState([]);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.material_id) errors.material_id = 'Material ID is required';
        if (!formData.quantity || formData.quantity <= 0) errors.quantity = 'Quantity must be greater than 0';
        if (!formData.status) errors.status = 'Status is required';
        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setValidationErrors(errors);
            return;
        }
        try {
            const response = await axios.put(`${URL}/api/order-material/update`, formData);
            console.log('Material order updated successfully:', response.data);
            setError(null);
            window.location.reload();
        } catch (error) {
            setError(error.response ? error.response.data : 'Error updating material order');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${URL}/api/order-material/delete?id=${orderId}`);
            console.log('Material order deleted successfully');
            navigate('/m/order-material');
            setShowModal(false);
        } catch (error) {
            console.error('Error deleting material order:', error);
        }
    };

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(`${URL}/api/order-material/get-by-id?id=${orderId}`);
                setOrder(response.data);
                setFormData({
                    material_order_id: response.data.material_order_id,
                    material_id: response.data.material_id,
                    quantity: response.data.quantity,
                    status: response.data.status
                });
            } catch (error) {
                console.error('Error fetching material order:', error);
            }
        };

        const fetchMaterials = async () => {
            try {
                const response = await axios.get(`${URL}/api/material/get-all`);
                setMaterials(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchOrder();
        fetchMaterials();
    }, [orderId]);

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <strong className="card-title">Operations</strong>
                            </div>
                            <div className="card-body">
                                <button type="button" className="btn btn-danger" style={{ marginRight: '20px' }} onClick={() => setShowModal(true)}>
                                    <i className="fa fa-trash"></i>&nbsp; Delete
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <strong>Edit Material Order Form</strong>
                            </div>
                            <div className="card-body card-block">
                                <form onSubmit={handleSubmit} className="form-horizontal">
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
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
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="quantity" className="form-control-label">Quantity</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="number" id="quantity" name="quantity" placeholder="Enter quantity" className="form-control" value={formData.quantity} onChange={handleChange} />
                                            <small className="help-block form-text">Please enter the quantity</small>
                                            {validationErrors.quantity && <div className="text-danger">{validationErrors.quantity}</div>}
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="status" className="form-control-label">Status</label></div>
                                        <div className="col-12 col-md-9">
                                            <select id="status" name="status" className="form-control" value={formData.status} onChange={handleChange}>
                                                <option value="">Select Status</option>
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
                                    <div className="card-footer" style={{ textAlign: 'center' }}>
                                        <input className="btn btn-success" type="submit" value="Submit" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to delete this material order?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        No
                    </Button>
                    <Button variant="danger" onClick={handleDelete}>
                        Yes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default M_OperationOrderMaterial;
