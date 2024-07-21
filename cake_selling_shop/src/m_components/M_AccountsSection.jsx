// AccountsSection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';

const AccountsSection = ({ role }) => {
    const [users, setUsers] = useState(null);
    const [error, setError] = useState(null);
    const [visibleUserId, setVisibleUserId] = useState(null); // Track which user's dropdown is visible

    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (role === "customer") {
                    const response = await axios.get(`${URL}/api/user/get-all-customers`);
                    setUsers(response.data);
                } else if (role === "staff") {
                    const response = await axios.get(`${URL}/api/user/get-all-staffs`);
                    setUsers(response.data);
                }
            } catch (error) {
                setError(error);
            }
        };

        fetchData();
    }, [role]);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    const handleToggleStatus = async (userId, currentStatus) => {
        const newStatus = currentStatus === 'active' ? 'inactive' : 'active'; // Toggle status
        try {
            await axios.put(`${URL}/api/user/change-status?id=${userId}`, { status: newStatus });
            // Update the local state to reflect the change
            setUsers(users.map(user => user.user_id === userId ? { ...user, status: newStatus } : user));
        } catch (error) {
            console.error('Error toggling user status:', error);
            setError(error);
        }
    };

    const handleButtonClick = (userId) => {
        setVisibleUserId(visibleUserId === userId ? null : userId); // Toggle visibility for the specific user
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
                                                {users && users.map((user, index) => (
                                                    <tr key={user.user_id}>
                                                        <td className="serial">{index + 1}.</td>
                                                        <td className="avatar">
                                                            <div className="round-img">
                                                                <a href={`/m/operation-account/${user.user_id}`}>
                                                                    <img className="rounded-circle" src={user.avatarUrl || "/img/avatar.jpg"} alt="avatar" />
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
            </div>
        </div>
    );
};

export default AccountsSection;
