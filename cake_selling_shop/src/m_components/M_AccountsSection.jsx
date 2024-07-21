// AccountsSection.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';

const AccountsSection = ({role}) => {
    const [users, setUsers] = useState(null);
    const [error, setError] = useState(null);
    const [isVisible, setIsVisible] = useState(false);

    const user = JSON.parse(sessionStorage.getItem("user"));

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (role === "customer") {
                    const response = await axios.get(`${URL}/api/user/get-all-customers`);
                    setUsers(response.data);
                } else if (role === "staff"){
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

    const handleButtonClick = () => {
        setIsVisible(!isVisible);
    };

    return (
        <div className="content">
            {/* Animated */}
            <div className="animated fadeIn">
                <div className="clearfix"></div>
                {/* Orders */}
                <div className="orders">
                    <div className="row">
                        <div className="col-xl-12">
                            <div className="card">
                                <div className="card-body">
                                    <h4 className="box-title">Danh sách tài khoản</h4>
                                </div>
                                <div className="card-body--">
                                    <div className="table-stats order-table ov-h" style={{paddingBottom: '150px'}}>
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
                                                                <a href="#"><img className="rounded-circle" src={user.avatarUrl || "/img/avatar.jpg"} alt="avatar" /></a>
                                                            </div>
                                                        </td>
                                                        <td>{user.full_name}</td>
                                                        <td><span className="name">{user.email}</span></td>
                                                        <td><span>{user.phone}</span></td>
                                                        <td><span>{user.role}</span></td>
                                                        <td>
                                                            <div className="dropdown-container">
                                                                <button onClick={handleButtonClick} className="badge badge-complete">
                                                                    {user.status}
                                                                </button>
                                                                {isVisible && (
                                                                    <div className="dropdown-content">
                                                                        <a href="#">Khóa</a>
                                                                        <a href="#">Mở khóa</a>
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
                {/* /.orders */}
                {/* /#add-category */}
            </div>
            {/* .animated */}
        </div>
    );
};

export default AccountsSection;
