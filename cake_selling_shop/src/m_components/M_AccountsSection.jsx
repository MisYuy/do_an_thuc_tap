// AccountsSection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';

const AccountsSection = ({ role }) => {
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [sortCriteria, setSortCriteria] = useState('user_id');
    const [sortOrder, setSortOrder] = useState('asc');
    const [visibleUserId, setVisibleUserId] = useState(null); // Track which user's dropdown is visible

    const token = sessionStorage.getItem("token");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = role === "customer" 
                    ? await axios.get(`${URL}/api/user/get-all-customers`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    }) 
                    : await axios.get(`${URL}/api/user/get-all-staffs`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                setUsers(response.data);
            } catch (error) {
                setError(error);
            }
        };

        fetchData();
    }, [role, token]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleToggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'deactive' : 'active'; // Toggle status
        try {
            await axios.put(`${URL}/api/user/change-status?id=${userId}`, { status: newStatus }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(users.map(user => user.user_id === userId ? { ...user, status: newStatus } : user));
        } catch (error) {
            console.error('Error toggling user status:', error);
            setError(error);
        }
    };

    const handleButtonClick = (userId) => {
        setVisibleUserId(visibleUserId === userId ? null : userId); // Toggle visibility for the specific user
    };

    // Filter users based on search term and selected status
    const filteredUsers = users.filter(user => {
        const matchesSearchTerm = 
            user.user_id.toString().includes(searchTerm) ||
            user.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone_number.includes(searchTerm);

        const matchesStatus = filterStatus === 'all' || user.status === filterStatus;

        return matchesSearchTerm && matchesStatus;
    });

    // Sort users based on selected criteria and order
    const sortedUsers = filteredUsers.sort((a, b) => {
        const aValue = sortCriteria === 'user_id' ? a.user_id :
                        sortCriteria === 'full_name' ? a.full_name :
                        sortCriteria === 'email' ? a.email :
                        new Date(a.created_at).getTime();

        const bValue = sortCriteria === 'user_id' ? b.user_id :
                        sortCriteria === 'full_name' ? b.full_name :
                        sortCriteria === 'email' ? b.email :
                        new Date(b.created_at).getTime();

        return sortOrder === 'asc' ? (aValue > bValue ? 1 : -1) : (aValue < bValue ? 1 : -1);
    });

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="content">
            <div className="animated fadeIn">
                <div className="clearfix"></div>
                <div className="orders">
                    <div className="row">
                        <div className="col-md-12">
                            <div className="card">
                                <div className="card-header">
                                    <strong className="card-title">Thao tác</strong>
                                </div>
                                <div className="card-body">
                                    <a href="/m/add-account" type="button" className="btn btn-primary" style={{ marginRight: '20px' }}>
                                        <i className="fa fa-plus-circle"></i>&nbsp; Thêm
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="box-title">Danh sách tài khoản</h4>
                                    <div style={{ marginBottom: '20px' }}>
                                        <input 
                                            type="text" 
                                            placeholder="Tìm kiếm theo ID, tên, email, số điện thoại..." 
                                            value={searchTerm} 
                                            onChange={(e) => setSearchTerm(e.target.value)} 
                                            style={{ marginRight: '20px', padding: '5px', minWidth: '500px' }} 
                                        />
                                        <select 
                                            value={filterStatus} 
                                            onChange={(e) => setFilterStatus(e.target.value)} 
                                            style={{ marginRight: '20px', padding: '5px' }}
                                        >
                                            <option value="all">Tất cả</option>
                                            <option value="active">Kích hoạt</option>
                                            <option value="deactive">Vô hiệu hóa</option>
                                        </select>
                                        <select 
                                            value={sortCriteria} 
                                            onChange={(e) => setSortCriteria(e.target.value)} 
                                            style={{ marginRight: '20px', padding: '5px' }}
                                        >
                                            <option value="user_id">Sắp xếp theo ID</option>
                                            <option value="full_name">Sắp xếp theo Tên</option>
                                            <option value="email">Sắp xếp theo Email</option>
                                            <option value="created_at">Sắp xếp theo Ngày tạo</option>
                                        </select>
                                        <select 
                                            value={sortOrder} 
                                            onChange={(e) => setSortOrder(e.target.value)} 
                                            style={{ marginRight: '20px', padding: '5px' }}
                                        >
                                            <option value="asc">Tăng dần</option>
                                            <option value="desc">Giảm dần</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="card-body--">
                                    <div className="table-stats order-table ov-h" style={{ paddingBottom: '150px' }}>
                                        <table className="table">
                                            <thead>
                                                <tr>
                                                    <th className="serial">ID</th>
                                                    <th className="avatar">Hình đại diện</th>
                                                    <th>Tên</th>
                                                    <th>Email</th>
                                                    <th>SDT</th>
                                                    <th>Vai trò</th>
                                                    <th>Trạng thái</th>
                                                    <th>Ngày tạo</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {sortedUsers.map((user, index) => (
                                                    <tr key={user.user_id}>
                                                        <td className="serial">{user.user_id}</td>
                                                        <td className="avatar">
                                                            <div className="round-img">
                                                            <a href={`/m/operation-account/${user.user_id}`}>
    <img 
        className="rounded-circle" 
        src={user.image ? `/images/avatar/${user.image}` : "/img/avatar.jpg"} 
        alt="avatar" 
    />
</a>

                                                            </div>
                                                        </td>
                                                        <td>{user.full_name}</td>
                                                        <td><span className="name">{user.email}</span></td>
                                                        <td><span>{user.phone_number}</span></td>
                                                        <td><span>{user.role}</span></td>
                                                        <td>
                                                            <div className="dropdown-container">
                                                                <button onClick={() => handleButtonClick(user.user_id)} className="badge badge-complete" style={{backgroundColor: user.status === 'active' ? '#1ecc02' : '#ff0000'}}>
                                                                    {user.status}
                                                                </button>
                                                                {visibleUserId === user.user_id && (
                                                                    <div className="dropdown-content">
                                                                        <a href="#" onClick={() => handleToggleStatus(user.user_id, user.status)}>
                                                                            {user.status === 'active' ? 'Khóa' : 'Mở khóa'}
                                                                        </a>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td><span>{new Date(user.created_at).toLocaleString()}</span></td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div> {/* /.table-stats */}
                                </div>
                            </div> {/* /.card */}
                        </div>  {/* /.col-lg-8 */}
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

export default AccountsSection;
