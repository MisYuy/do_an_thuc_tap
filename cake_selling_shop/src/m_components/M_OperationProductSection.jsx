import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useParams } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';

const M_OperationProductSection = () => {
    const { productId } = useParams();
    const [product, setProduct] = useState(null);
    const [previewImage, setPreviewImage] = useState(null); // State for preview image
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        category: '',
        price: '',
        stock: '',
        image: null
    });
    const [discountPercentage, setDiscountPercentage] = useState(0); // State for discount percentage
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false); // State for modal visibility

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'image') {
            const file = files[0];
            setFormData({ ...formData, [name]: file });
            setPreviewImage(window.URL.createObjectURL(file)); // Use the global URL object
        } else {
            setFormData({ ...formData, [name]: value });
            if (name === 'price') {
                recalculateDiscount(value);
            }
        }
    };

    const recalculateDiscount = (newPrice) => {
        if (product && product.promotions && product.promotions.length > 0) {
            const originalPrice = parseFloat(newPrice);
            const totalDiscountPercentage = product.promotions.reduce((total, promo) => total + parseFloat(promo.discount_percentage), 0);
            const discount = (originalPrice * totalDiscountPercentage) / 100;
            const discountedPrice = originalPrice - discount;
            setDiscountPercentage(totalDiscountPercentage);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('product_id', product.product_id);
        data.append('name', formData.name);
        data.append('description', formData.description);
        data.append('category', formData.category);
        data.append('price', formData.price);
        data.append('stock_quantity', formData.stock);
        data.append('image', formData.image);

        console.log("Data " + formData.name);

        try {
            const response = await axios.put(`${URL}/api/product/update`, data, {
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

    const handleDelete = async () => {
        try {
            await axios.put(`${URL}/api/product/delete?id=${productId}`);
            console.log('Product deleted successfully');
            setShowModal(false); // Close the modal
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`${URL}/api/product/get-by-id?id=${productId}`);
                setProduct(response.data);
                setFormData({
                    name: response.data.name,
                    description: response.data.description,
                    category: response.data.category,
                    price: response.data.price,
                    stock: response.data.stock_quantity,
                    image: null
                });
                recalculateDiscount(response.data.price); // Recalculate discount when product is fetched
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
    }

    const hasPromotion = product.promotions && product.promotions.length > 0;
    const originalPrice = parseFloat(formData.price !== "" ? formData.price : product.price);
    const totalDiscountPercentage = hasPromotion
        ? product.promotions.reduce((total, promo) => total + parseFloat(promo.discount_percentage), 0)
        : 0;
    const discount = (originalPrice * totalDiscountPercentage) / 100;
    const discountedPrice = originalPrice - discount;
    console.log("Image: " + product.image);

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
                                <strong>Form chỉnh sửa</strong>
                            </div>
                            <div className="card-body card-block">
                                <form onSubmit={handleSubmit} encType="multipart/form-data" className="form-horizontal">
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"></div>
                                        <div className="col-12 col-md-9" style={{ textAlign: 'center' }}>
                                            <img
                                                src={previewImage || (product.image ? `/images/product/${product.image}` : "/img/none_image.png")}
                                                className="img-fluid rounded"
                                                alt=""
                                                style={{ minWidth: '200px', minHeight: "200px", textAlign: 'center', maxWidth: '200px', maxHeight: "200px" }}
                                            />
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label className=" form-control-label">ID</label></div>
                                        <div className="col-12 col-md-9">
                                            <p className="form-control-static">{product.product_id}</p>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="name" className="form-control-label">Tên sản phẩm</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="text" id="name" name="name" placeholder="Enter name" className="form-control" value={formData.name} onChange={handleChange} />
                                            <small className="form-text text-muted">Please enter the product name</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3">
                                            <label htmlFor="description" className="form-control-label">Mô tả</label>
                                        </div>
                                        <div className="col-12 col-md-9">
                                            <textarea name="description" id="description" rows="9" placeholder="Content..." className="form-control" value={formData.description} onChange={handleChange}></textarea>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="category" className="form-control-label">Loại</label></div>
                                        <div className="col-12 col-md-9">
                                            <select name="category" id="category" className="form-control" value={formData.category} onChange={handleChange}>
                                                <option value="">Please select</option>
                                                <option value="1">Option #1</option>
                                                <option value="2">Option #2</option>
                                                <option value="3">Option #3</option>
                                            </select>
                                            <small className="form-text text-muted">Please select the category</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="price" className="form-control-label">Giá</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="number" id="price" name="price" placeholder="Enter price" className="form-control" value={formData.price} onChange={handleChange} />
                                            <small className="help-block form-text">Please enter the price</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label className=" form-control-label">Mã khuyến mãi đang áp dụng</label></div>
                                        <div className="col-12 col-md-9">
                                            <p className="form-control-static">
                                                {product.promotions.map(promotion => (
                                                    <div key={promotion.promotion_id}>
                                                        {promotion.promotion_id} {promotion.name} ({promotion.discount_percentage}%),
                                                    </div>
                                                ))}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label className=" form-control-label">Giá thực</label></div>
                                        <div className="col-12 col-md-9">
                                            <p className="form-control-static">{discountedPrice}</p>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="stock" className="form-control-label">Tồn kho</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="number" id="stock" name="stock" placeholder="Enter stock" className="form-control" value={formData.stock} onChange={handleChange} />
                                            <small className="help-block form-text">Please enter the stock</small>
                                        </div>
                                    </div>
                                    <div className="row form-group" style={{ paddingBottom: '25px' }}>
                                        <div className="col col-md-3"><label htmlFor="image" className="form-control-label">Hình ảnh</label></div>
                                        <div className="col-12 col-md-9">
                                            <input type="file" id="image" name="image" className="form-control-file" onChange={handleChange} />
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
                <Modal.Body>Bạn chắc chắn muốn xóa sản phẩm này?</Modal.Body>
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

export default M_OperationProductSection;
