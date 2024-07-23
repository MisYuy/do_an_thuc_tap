import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';

const M_PromotionSection = () => {
    const [promotions, setPromotions] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const response = await axios.get(`${URL}/api/promotion/get-all`);
                setPromotions(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchPromotions();
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card" style={{ paddingBottom: '150px' }}>
                            <div className="card-header">
                                <strong className="card-title">Danh sách khuyến mãi</strong>
                            </div>
                            <div className="card-body">
                                <table id="bootstrap-data-table" className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'center' }}>ID Khuyến mãi</th>
                                            <th style={{ textAlign: 'center' }}>Tên Khuyến mãi</th>
                                            <th style={{ textAlign: 'center' }}>Giảm giá (%)</th>
                                            <th style={{ textAlign: 'center' }}>Sản phẩm đang áp dụng</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {promotions.map(promotion => (
                                            <tr key={promotion.promotion_id}>
                                                <td style={{ textAlign: 'center' }}>{promotion.promotion_id}</td>
                                                <td style={{ textAlign: 'center' }}>{promotion.name}</td>
                                                <td style={{ textAlign: 'center' }}>{promotion.discount_percentage}</td>
                                                <td style={{ textAlign: 'center' }}>
                                                    {promotion.products.map(product => (
                                                        <div key={product.product_id}>
                                                            {product.product_id} - {product.name}
                                                        </div>
                                                    ))}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Back to Top Button remains the same... */}
            </div>
        </div>
    );
};

export default M_PromotionSection;
