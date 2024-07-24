import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const M_OperationCategorySection = () => {
    const { categoryId } = useParams();
    const [category, setCategory] = useState(null);
    const [formData, setFormData] = useState({
        category_id: categoryId, // Include category_id in formData
        name: '',
        description: ''
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
            const response = await axios.put(`${URL}/api/category/update`, formData);
            console.log('Category updated successfully:', response.data);
            setError(null); // Clear any previous errors
        } catch (error) {
            setError(error.response ? error.response.data : 'Error updating category');
        }
    };

    const handleDelete = async () => {
        try {
            await axios.delete(`${URL}/api/category/delete?id=${categoryId}`);
            console.log('Category deleted successfully');
            setShowModal(false); // Close the modal
            // Optionally redirect or update the state to reflect deletion
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    useEffect(() => {
        const fetchCategory = async () => {
            try {
                const response = await axios.get(`${URL}/api/category/get-by-id?id=${categoryId}`);
                setCategory(response.data);
                setFormData({
                    category_id: response.data.category_id, // Set category_id from fetched data
                    name: response.data.name,
                    description: response.data.description
                });
            } catch (error) {
                console.error('Error fetching category:', error);
            }
        };

        fetchCategory();
    }, [categoryId]);

    if (!category) {
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
                                <strong>Form chỉnh sửa danh mục</strong>
                            </div>
                            <div className="card-body card-block">
                                <form onSubmit={handleSubmit} className="form-horizontal">
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="name" className="form-control-label">Tên danh mục</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="text" id="name" name="name" placeholder="Enter category name" className="form-control" value={formData.name} onChange={handleChange} />
                                            <small className="form-text text-muted">Please enter the category name</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="description" className="form-control-label">Mô tả</label></div>
                                        <div className="col-12 col-md-9">
                                            <textarea name="description" id="description" rows="9" placeholder="Content..." className="form-control" value={formData.description} onChange={handleChange}></textarea>
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
                <Modal.Body>Bạn chắc chắn muốn xóa danh mục này?</Modal.Body>
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

export default M_OperationCategorySection;
