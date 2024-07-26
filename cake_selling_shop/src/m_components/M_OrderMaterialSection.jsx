import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';

const M_OrderMaterialSection = () => {
    const [materialOrders, setMaterialOrders] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('material_order_id');
    const [sortOrder, setSortOrder] = useState('asc');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMaterialOrders = async () => {
            try {
                const response = await axios.get(`${URL}/api/order-material/get-all`);
                setMaterialOrders(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchMaterialOrders();
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Filter material orders based on search term
    const filteredMaterialOrders = materialOrders.filter(order => {
        const matchesId = order.material_order_id.toString().includes(searchTerm);
        const matchesMaterialName = order.Material.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesId || matchesMaterialName;
    });

    // Sort material orders based on selected criteria and order
    const sortedMaterialOrders = filteredMaterialOrders.sort((a, b) => {
        const aValue = sortCriteria === 'material_order_id' ? a.material_order_id :
                       sortCriteria === 'material_name' ? a.Material.name :
                       sortCriteria === 'quantity' ? a.quantity :
                       sortCriteria === 'status' ? a.status :
                       sortCriteria === 'created_at' ? new Date(a.created_at) :
                       sortCriteria === 'updated_at' ? new Date(a.updated_at) :
                       0;

        const bValue = sortCriteria === 'material_order_id' ? b.material_order_id :
                       sortCriteria === 'material_name' ? b.Material.name :
                       sortCriteria === 'quantity' ? b.quantity :
                       sortCriteria === 'status' ? b.status :
                       sortCriteria === 'created_at' ? new Date(b.created_at) :
                       sortCriteria === 'updated_at' ? new Date(b.updated_at) :
                       0;

        return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle material order click to navigate to detail page
    const handleMaterialOrderClick = (materialOrderId) => {
        navigate(`/m/operation-order-material/${materialOrderId}`);
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card" style={{ paddingBottom: '150px' }}>
                            <div className="card-header">
                                <strong className="card-title">Danh sách đơn hàng vật liệu</strong>
                                <a href="add-order-material" type="button" className="btn btn-primary" style={{ marginLeft: '20px' }}>
                                    <i className="fa fa-plus-circle"></i>&nbsp; Thêm Đơn hàng vật liệu
                                </a>
                            </div>
                            <div className="card-body">
                                <div style={{ marginBottom: '20px' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Tìm kiếm theo ID hoặc Tên vật liệu..." 
                                        value={searchTerm} 
                                        onChange={(e) => setSearchTerm(e.target.value)} 
                                        style={{ marginRight: '20px', padding: '5px', minWidth: '300px' }} 
                                    />
                                    <select 
                                        value={sortCriteria} 
                                        onChange={(e) => setSortCriteria(e.target.value)} 
                                        style={{ marginRight: '20px', padding: '5px'}}
                                    >
                                        <option value="material_order_id">Sắp xếp theo ID</option>
                                        <option value="material_name">Sắp xếp theo Tên vật liệu</option>
                                        <option value="quantity">Sắp xếp theo Số lượng</option>
                                        <option value="status">Sắp xếp theo Trạng thái</option>
                                        <option value="created_at">Sắp xếp theo Ngày tạo</option>
                                        <option value="updated_at">Sắp xếp theo Ngày cập nhật</option>
                                    </select>
                                    <select 
                                        value={sortOrder} 
                                        onChange={(e) => setSortOrder(e.target.value)} 
                                        style={{ padding: '5px'}}
                                    >
                                        <option value="asc">Tăng dần</option>
                                        <option value="desc">Giảm dần</option>
                                    </select>
                                </div>
                                <table id="bootstrap-data-table" className="table table-striped table-bordered">
                                    <thead>
                                        <tr>
                                            <th style={{ textAlign: 'center' }}>ID Đơn hàng</th>
                                            <th style={{ textAlign: 'center' }}>Tên vật liệu</th>
                                            <th style={{ textAlign: 'center' }}>Số lượng</th>
                                            <th style={{ textAlign: 'center' }}>Trạng thái</th>
                                            <th style={{ textAlign: 'center' }}>Ngày tạo</th>
                                            <th style={{ textAlign: 'center' }}>Ngày cập nhật</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedMaterialOrders.map(order => (
                                            <tr key={order.material_order_id} onClick={() => handleMaterialOrderClick(order.material_order_id)} style={{ cursor: 'pointer' }}>
                                                <td style={{ textAlign: 'center' }}>{order.material_order_id}</td>
                                                <td style={{ textAlign: 'center' }}>{order.Material.name}</td>
                                                <td style={{ textAlign: 'center' }}>{order.quantity}</td>
                                                <td style={{ textAlign: 'center' }}>{order.status}</td>
                                                <td style={{ textAlign: 'center' }}>{order.created_at}</td>
                                                <td style={{ textAlign: 'center' }}>{order.updated_at}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Back to Top Button */}
                <button 
                    onClick={scrollToTop} 
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        backgroundColor: '#1ecc02',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        padding: '10px 15px',
                        cursor: 'pointer',
                        zIndex: 1000,
                    }}
                >
                    Back to Top
                </button>
            </div>
        </div>
    );
};

export default M_OrderMaterialSection;
