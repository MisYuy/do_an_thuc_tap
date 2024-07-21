import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';

const M_ProductSection = () => {
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);

    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        axios.get(`${URL}/api/product/get-all`)
            .then(response => {
                setProducts(response.data);
            })
            .catch(error => {
                setError(error);
            });
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
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
                                <a href="add-product" type="button" className="btn btn-primary" style={{marginRight: '20px'}}><i className="fa fa-plus-circle"></i>&nbsp; Thêm</a>
                            </div>
                            </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-12">
                        <div className="card">
                            <div className="card-header">
                                <strong className="card-title">Danh sách sản phẩm</strong>
                            </div>
                            <div className="card-body">
                                <table id="bootstrap-data-table" className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{textAlign: 'center'}}>ID</th>
                                            <th style={{textAlign: 'center'}}>Ảnh</th>
                                            <th style={{textAlign: 'center'}}>Tên</th>
                                            <th style={{textAlign: 'center'}}>Giá gốc</th>
                                            <th style={{textAlign: 'center'}}>Mã Khuyến mãi</th>
                                            <th style={{textAlign: 'center'}}>Giá thực</th>
                                            <th style={{textAlign: 'center'}}>Tồn kho</th>
                                            <th style={{textAlign: 'center'}}>Trạng thái</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {products.map(product => (
                                            <tr key={product.product_id}>
                                                <td style={{alignContent: 'center', textAlign: 'center'}}>{product.product_id}</td>
                                                <td style={{alignContent: 'center', textAlign: 'center'}}>
                                                    <a href={`/m/operation-product/${product.product_id}`}>
                                                    <img className="rounded-circle" src={product.image ? `/images/product/${product.image}` : "/img/none_image.png"} style={{ minWidth: '100px', minHeight: "100px", maxWidth: '100px', maxHeight: "100px"}} alt="avatar" />
                                                    </a>
                                                </td>
                                                <td style={{alignContent: 'center', textAlign: 'center'}}>{product.name}</td>
                                                <td style={{alignContent: 'center', textAlign: 'center'}}>{product.price}</td>
                                                <td style={{alignContent: 'center', textAlign: 'center'}}>
                                                    {product.promotions.map(promotion => (
                                                        <div key={promotion.promotion_id}>
                                                            {promotion.promotion_id} - {promotion.name} ({promotion.discount_percentage}%)
                                                        </div>
                                                    ))}
                                                </td>
                                                <td style={{alignContent: 'center', textAlign: 'center'}}>
    {(() => {
        let discountedPrice = product.price;
        product.promotions.forEach(promotion => {
            discountedPrice -= discountedPrice * (promotion.discount_percentage / 100);
        });
        return discountedPrice.toFixed(2); // Format to 2 decimal places
    })()}
</td>

                                                <td style={{alignContent: 'center', textAlign: 'center'}}>{product.stock_quantity}</td>
                                                <td style={{alignContent: 'center', textAlign: 'center'}}>
                                                    <button className="badge badge-complete" style={{backgroundColor: product.status === 'available' ? '#1ecc02' : product.status === 'low of stock' ? '#ebb134' : '#ff0000'}}>
                                                        {product.status === 'available' ? 'Còn hàng' : product.status === 'low of stock' ? 'Sắp hết' : 'Hết hàng'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default M_ProductSection;
