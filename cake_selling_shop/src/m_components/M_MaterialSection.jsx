import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';

const M_MaterialSection = () => {
    const [materials, setMaterials] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('material_id');
    const [sortOrder, setSortOrder] = useState('asc');
    const navigate = useNavigate();

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

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    // Filter materials based on search term
    const filteredMaterials = materials.filter(material => {
        const matchesId = material.material_id.toString().includes(searchTerm);
        const matchesName = material.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesId || matchesName;
    });

    // Sort materials based on selected criteria and order
    const sortedMaterials = filteredMaterials.sort((a, b) => {
        const aValue = sortCriteria === 'material_id' ? a.material_id :
                       sortCriteria === 'name' ? a.name :
                       sortCriteria === 'quantity' ? a.quantity :
                       sortCriteria === 'created_at' ? new Date(a.created_at) :
                       sortCriteria === 'updated_at' ? new Date(a.updated_at) :
                       0;

        const bValue = sortCriteria === 'material_id' ? b.material_id :
                       sortCriteria === 'name' ? b.name :
                       sortCriteria === 'quantity' ? b.quantity :
                       sortCriteria === 'created_at' ? new Date(b.created_at) :
                       sortCriteria === 'updated_at' ? new Date(b.updated_at) :
                       0;

        return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    // Handle material click to navigate to detail page
    const handleMaterialClick = (materialId) => {
        navigate(`/m/operation-material/${materialId}`);
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="row">
                    <div className="col-md-12">
                        <div className="card" style={{ paddingBottom: '150px' }}>
                            <div className="card-header">
                                <strong className="card-title">Danh sách vật liệu</strong>
                                <a href="add-material" type="button" className="btn btn-primary" style={{ marginLeft: '20px' }}>
                                    <i className="fa fa-plus-circle"></i>&nbsp; Thêm Vật liệu
                                </a>
                                <a href="material-usage" type="button" className="btn btn-primary" style={{ marginLeft: '20px' }}>
                                    <i className="fa fa-minus-circle"></i>&nbsp; Xuất Vật liệu
                                </a>
                            </div>
                            <div className="card-body">
                                <div style={{ marginBottom: '20px' }}>
                                    <input 
                                        type="text" 
                                        placeholder="Tìm kiếm theo ID hoặc Tên..." 
                                        value={searchTerm} 
                                        onChange={(e) => setSearchTerm(e.target.value)} 
                                        style={{ marginRight: '20px', padding: '5px', minWidth: '300px' }} 
                                    />
                                    <select 
                                        value={sortCriteria} 
                                        onChange={(e) => setSortCriteria(e.target.value)} 
                                        style={{ marginRight: '20px', padding: '5px'}}
                                    >
                                        <option value="material_id">Sắp xếp theo ID</option>
                                        <option value="name">Sắp xếp theo Tên</option>
                                        <option value="quantity">Sắp xếp theo Số lượng</option>
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
                                            <th style={{ textAlign: 'center' }}>ID Vật liệu</th>
                                            <th style={{ textAlign: 'center' }}>Tên Vật liệu</th>
                                            <th style={{ textAlign: 'center' }}>Mô tả</th>
                                            <th style={{ textAlign: 'center' }}>Số lượng</th>
                                            <th style={{ textAlign: 'center' }}>Ngày tạo</th>
                                            <th style={{ textAlign: 'center' }}>Ngày cập nhật</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sortedMaterials.map(material => (
                                            <tr key={material.material_id} onClick={() => handleMaterialClick(material.material_id)} style={{ cursor: 'pointer' }}>
                                                <td style={{ textAlign: 'center' }}>{material.material_id}</td>
                                                <td style={{ textAlign: 'center' }}>{material.name}</td>
                                                <td style={{ textAlign: 'center' }}>{material.description}</td>
                                                <td style={{ textAlign: 'center' }}>{material.quantity}</td>
                                                <td style={{ textAlign: 'center' }}>{material.created_at}</td>
                                                <td style={{ textAlign: 'center' }}>{material.updated_at}</td>
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

export default M_MaterialSection;
