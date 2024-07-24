import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const M_OperationPromotionSection = () => {
    const { promotionId } = useParams();
    const [promotion, setPromotion] = useState(null);
    const [formData, setFormData] = useState({
        promotion_id: promotionId, // Include promotion_id in formData
        name: '',
        description: '',
        discount_percentage: '',
        start_date: '',
        end_date: ''
    });
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); // State for modal visibility

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`${URL}/api/promotion/update`, formData);
            console.log('Promotion updated successfully:', response.data);
            setError(null); // Clear any previous errors
            window.location.reload();
        } catch (error) {
            setError(error.response ? error.response.data : 'Error updating promotion');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${URL}/api/promotion/delete?id=${promotionId}`);
            console.log('Promotion deleted successfully');
            setShowModal(false); // Close the modal
            // Optionally redirect or update the state to reflect deletion
        } catch (error) {
            console.error('Error deleting promotion:', error);
        }
    };

    useEffect(() => {
        const fetchPromotion = async () => {
            try {
                const response = await axios.get(`${URL}/api/promotion/get-by-id?id=${promotionId}`);
                setPromotion(response.data);
                setFormData({
                    promotion_id: response.data.promotion_id, // Set promotion_id from fetched data
                    name: response.data.name,
                    description: response.data.description,
                    discount_percentage: response.data.discount_percentage,
                    start_date: response.data.start_date,
                    end_date: response.data.end_date
                });
            } catch (error) {
                console.error('Error fetching promotion:', error);
            }
        };

        fetchPromotion();
    }, [promotionId]);

    console.log("@@@" + promotion);
    if (!promotion) {
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
                                <strong>Form chỉnh sửa khuyến mãi</strong>
                            </div>
                            <div className="card-body card-block">
                                <form onSubmit={handleSubmit} className="form-horizontal">
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="name" className="form-control-label">Tên khuyến mãi</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="text" id="name" name="name" placeholder="Enter promotion name" className="form-control" value={formData.name} onChange={handleChange} />
                                            <small className="form-text text-muted">Please enter the promotion name</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="description" className="form-control-label">Mô tả</label></div>
                                        <div className="col-12 col-md-9">
                                            <textarea name="description" id="description" rows="9" placeholder="Content..." className="form-control" value={formData.description} onChange={handleChange}></textarea>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="discount_percentage" className="form-control-label">Giảm giá (%)</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="number" id="discount_percentage" name="discount_percentage" placeholder="Enter discount percentage" className="form-control" value={formData.discount_percentage} onChange={handleChange} />
                                            <small className="help-block form-text">Please enter the discount percentage</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="start_date" className="form-control-label">Ngày bắt đầu</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="date" id="start_date" name="start_date" className="form-control" value={formData.start_date} onChange={handleChange} />
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="end_date" className="form-control-label">Ngày kết thúc</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="date" id="end_date" name="end_date" className="form-control" value={formData.end_date} onChange={handleChange} />
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

            {/* Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header>
                    <Modal.Title>Xác nhận xóa</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn chắc chắn muốn xóa khuyến mãi này?</Modal.Body>
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

export default M_OperationPromotionSection;
