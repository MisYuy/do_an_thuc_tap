import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const M_OperationMaterialSection = () => {
    const { materialId } = useParams();
    const [material, setMaterial] = useState(null);
    const [formData, setFormData] = useState({
        material_id: materialId,
        name: '',
        description: '',
        quantity: ''
    });
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const token = sessionStorage.getItem("token");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const validateForm = () => {
        const errors = {};
        if (!formData.name) errors.name = 'Tên vật liệu là bắt buộc';
        if (!formData.description) errors.description = 'Mô tả là bắt buộc';
        if (!formData.quantity || formData.quantity < 0) errors.quantity = 'Số lượng phải lớn hơn hoặc bằng 0';
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
            const response = await axios.put(`${URL}/api/material/update`, formData, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Material updated successfully:', response.data);
            setError(null);
            window.location.reload();
        } catch (error) {
            setError(error.response ? error.response.data : 'Error updating material');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${URL}/api/material/delete?id=${materialId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            console.log('Material deleted successfully');
            navigate('/m/material');
            setShowModal(false);
        } catch (error) {
            console.error('Error deleting material:', error);
        }
    };

    useEffect(() => {
        const fetchMaterial = async () => {
            try {
                const response = await axios.get(`${URL}/api/material/get-by-id?id=${materialId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                setMaterial(response.data);
                setFormData({
                    material_id: response.data.material_id,
                    name: response.data.name,
                    description: response.data.description,
                    quantity: response.data.quantity
                });
            } catch (error) {
                console.error('Error fetching material:', error);
            }
        };

        fetchMaterial();
    }, [materialId, token]);

    if (!material) {
        return <div>Loading...</div>;
    }

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <strong className="card-title">Thao tác</strong>
                            </div>
                            <div className="card-body">
                                <button type="button" className="btn btn-danger" style={{ marginRight: '20px' }} onClick={() => setShowModal(true)}>
                                    <i className="fa fa-trash"></i>&nbsp; Xóa
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <strong>Form chỉnh sửa vật liệu</strong>
                            </div>
                            <div className="card-body card-block">
                                <form onSubmit={handleSubmit} className="form-horizontal">
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="name" className="form-control-label">Tên vật liệu</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="text" id="name" name="name" placeholder="Enter material name" className="form-control" value={formData.name} onChange={handleChange} />
                                            <small className="form-text text-muted">Please enter the material name</small>
                                            {validationErrors.name && <div className="text-danger">{validationErrors.name}</div>}
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="description" className="form-control-label">Mô tả</label></div>
                                        <div className="col-12 col-md-9">
                                            <textarea name="description" id="description" rows="9" placeholder="Content..." className="form-control" value={formData.description} onChange={handleChange}></textarea>
                                            {validationErrors.description && <div className="text-danger">{validationErrors.description}</div>}
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="quantity" className="form-control-label">Số lượng</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="number" id="quantity" name="quantity" placeholder="Enter quantity" className="form-control" value={formData.quantity} onChange={handleChange} />
                                            <small className="help-block form-text">Please enter the quantity</small>
                                            {validationErrors.quantity && <div className="text-danger">{validationErrors.quantity}</div>}
                                        </div>
                                    </div>
                                    {error && (
                                        <div className="alert alert-danger">
                                            {typeof error === 'string' ? error : JSON.stringify(error)}
                                        </div>
                                    )}
                                    <div className="card-footer" style={{ textAlign: 'center' }}>
                                        <input className="btn btn-success" type="submit" value="Xác nhận" />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn chắc chắn muốn xóa vật liệu này?</Modal.Body>
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

export default M_OperationMaterialSection;
