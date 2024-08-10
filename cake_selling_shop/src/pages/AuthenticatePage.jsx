import React, { useState } from 'react';
import axios from 'axios';
import { URL } from '../utils/constant.js';
import { useNavigate } from 'react-router-dom';
import VerificationCode from '../components/authenticate_components/VerificationCode.jsx';
import ForgotPassword from '../components/authenticate_components/ForgotPassword.jsx';

const AuthenticatePage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [showVerificationCode, setShowVerificationCode] = useState(false);

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const switchToSignup = () => {
        setIsLogin(false);
    };

    const switchToLogin = () => {
        setIsLogin(true);
    };

    const openForgotPassword = () => {
        setShowForgotPassword(true);
    };

    const closeForgotPassword = () => {
        setShowForgotPassword(false);
    };

    const openVerificationCode = () => {
        setShowVerificationCode(true);
    };

    const closeVerificationCode = () => {
        setShowVerificationCode(false);
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            console.log(email);
            const response = await axios.post(`${URL}/api/user/login`, {
                email,
                password
            });

            if(response){      
                const { user, token }  = response.data;      
                sessionStorage.setItem('user', JSON.stringify(user));
                sessionStorage.setItem('token', token);
                
                if(user.role === 'customer')
                    navigate(`../home`);
                else if(user.role === 'admin')
                    navigate(`../m/statistic-revenue`)
                else if(user.role === 'sale staff')
                    navigate(`../m/order`)
                else if(user.role === 'warehouse staff')
                    navigate(`../m/statistic-material`)
                setError(null);
            }

            setLoading(false);
        } catch (error) {
            console.log(error);
            setError(error.response ? error.response.data : "Đăng nhập thất bại");
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (password !== confirmPassword) {
                setError("Mật khẩu không khớp");
                setLoading(false);
                return;
            }
    
            // Kiểm tra email tồn tại
            const emailCheckResponse = await axios.get(`${URL}/api/user/check-exists`, { params: { email } });
            if (emailCheckResponse.data.exists) {
                setError("Email đã tồn tại");
                setLoading(false);
                return;
            }
    
            // Gửi mã xác thực
            await axios.post(`${URL}/api/email/send-verification-code`, { email });
            openVerificationCode();
        } catch (error) {
            console.log(error);
            setError(error.response ? error.response.data : "Đăng ký thất bại");
            setLoading(false);
        }
    };
    

    const handleVerifySuccess = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${URL}/api/user/signup`, {
                email,
                password
            });

            if(response){          
                switchToLogin();
                setError(null);
            }
    
            setLoading(false);
        } catch (error) {
            console.log(error);
            setError(error.response ? error.response.data : "Đăng ký thất bại");
            setLoading(false);
        }
    }
    

    return (
        <div style={{
            margin: 0,
            padding: 0,
            boxSizing: 'border-box',
            fontFamily: 'Poppins, sans-serif',
            backgroundColor: '#81c408',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'fixed',
            top: 0,
            bottom: 0,
            right: 0,
            left: 0
        }}>
            <div className="container forms" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                {isLogin ? (
                    <div className="form login" style={{ position: 'absolute', maxWidth: '430px', width: '100%', padding: '30px', borderRadius: '6px', background: '#FFF' }}>
                        <div className="form-content">
                            <header style={{ fontSize: '28px', fontWeight: '600', color: '#232836', textAlign: 'center' }}>Login</header>
                            <form onSubmit={handleLogin} style={{ marginTop: '30px' }}>
                                <div className="field input-field" style={{ position: 'relative', height: '50px', width: '100%', marginTop: '20px', borderRadius: '6px' }}>
                                    <input 
                                        type="email" 
                                        placeholder="Email" 
                                        className="input" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ height: '100%', width: '100%', border: 'none', fontSize: '16px', fontWeight: '400', borderRadius: '6px', outline: 'none', padding: '0 15px', border: '1px solid #CACACA' }} 
                                    />
                                </div>
                                <div className="field input-field" style={{ position: 'relative', height: '50px', width: '100%', marginTop: '20px', borderRadius: '6px' }}>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="Password" 
                                        className="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ height: '100%', width: '100%', border: 'none', fontSize: '16px', fontWeight: '400', borderRadius: '6px', outline: 'none', padding: '0 15px', border: '1px solid #CACACA' }} 
                                    />
                                    <i className={showPassword ? 'bx bx-show eye-icon' : 'bx bx-hide eye-icon'} 
                                       onClick={togglePasswordVisibility}
                                       style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', fontSize: '18px', color: '#8b8b8b', cursor: 'pointer', padding: '5px' }}>
                                    </i>
                                </div>
                                <div className="form-link" style={{ textAlign: 'center', marginTop: '10px' }}>
                                    <a href="#" className="forgot-pass" style={{ fontSize: '14px', fontWeight: '400', color: '#0171d3', textDecoration: 'none' }} onClick={openForgotPassword}>Forgot password?</a>
                                </div>
                                <div className="field button-field" style={{ position: 'relative', height: '50px', width: '100%', marginTop: '20px', borderRadius: '6px' }}>
                                    <button type="submit" style={{ height: '100%', width: '100%', color: '#fff', backgroundColor: '#0171d3', transition: 'all 0.3s ease', cursor: 'pointer', border: 'none', fontSize: '16px', fontWeight: '400', borderRadius: '6px' }}>
                                        {loading ? 'Logging in...' : 'Login'}
                                    </button>
                                </div>
                            </form>
                            {error && (
                                <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                                    {typeof error === 'object' ? "Đăng nhập thất bại" : error}
                                </div>
                            )}
                            <div className="form-link" style={{ textAlign: 'center', marginTop: '10px' }}>
                                <span style={{ fontSize: '14px', fontWeight: '400', color: '#232836' }}>Don't have an account? <a href="#" className="link signup-link" style={{ color: '#0171d3', textDecoration: 'none' }} onClick={switchToSignup}>Signup</a></span>
                            </div>
                        </div>
                        <div className="line" style={{ position: 'relative', height: '1px', width: '100%', margin: '36px 0', backgroundColor: '#d4d4d4' }}>
                            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#FFF', color: '#8b8b8b', padding: '0 15px' }}>Or</span>
                        </div>
                    </div>
                ) : (
                    <div className="form signup" style={{ position: 'absolute', maxWidth: '430px', width: '100%', padding: '30px', borderRadius: '6px', background: '#FFF' }}>
                        <div className="form-content">
                            <header style={{ fontSize: '28px', fontWeight: '600', color: '#232836', textAlign: 'center' }}>Signup</header>
                            <form onSubmit={handleSignup} style={{ marginTop: '30px' }}>
                                <div className="field input-field" style={{ position: 'relative', height: '50px', width: '100%', marginTop: '20px', borderRadius: '6px' }}>
                                    <input 
                                        type="email" 
                                        placeholder="Email" 
                                        className="input" 
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        required
                                        style={{ height: '100%', width: '100%', border: 'none', fontSize: '16px', fontWeight: '400', borderRadius: '6px', outline: 'none', padding: '0 15px', border: '1px solid #CACACA' }} 
                                    />
                                </div>
                                <div className="field input-field" style={{ position: 'relative', height: '50px', width: '100%', marginTop: '20px', borderRadius: '6px' }}>
                                    <input 
                                        type={showPassword ? "text" : "password"} 
                                        placeholder="Password" 
                                        className="password" 
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        style={{ height: '100%', width: '100%', border: 'none', fontSize: '16px', fontWeight: '400', borderRadius: '6px', outline: 'none', padding: '0 15px', border: '1px solid #CACACA' }} 
                                    />
                                    <i className={showPassword ? 'bx bx-show eye-icon' : 'bx bx-hide eye-icon'} 
                                       onClick={togglePasswordVisibility}
                                       style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', fontSize: '18px', color: '#8b8b8b', cursor: 'pointer', padding: '5px' }}>
                                    </i>
                                </div>
                                <div className="field input-field" style={{ position: 'relative', height: '50px', width: '100%', marginTop: '20px', borderRadius: '6px' }}>
                                    <input 
                                        type={showConfirmPassword ? "text" : "password"} 
                                        placeholder="Confirm password" 
                                        className="password" 
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        required
                                        style={{ height: '100%', width: '100%', border: 'none', fontSize: '16px', fontWeight: '400', borderRadius: '6px', outline: 'none', padding: '0 15px', border: '1px solid #CACACA' }} 
                                    />
                                    <i className={showConfirmPassword ? 'bx bx-show eye-icon' : 'bx bx-hide eye-icon'} 
                                       onClick={toggleConfirmPasswordVisibility}
                                       style={{ position: 'absolute', top: '50%', right: '10px', transform: 'translateY(-50%)', fontSize: '18px', color: '#8b8b8b', cursor: 'pointer', padding: '5px' }}>
                                    </i>
                                </div>
                                <div className="field button-field" style={{ position: 'relative', height: '50px', width: '100%', marginTop: '20px', borderRadius: '6px' }}>
                                    <button type="submit" style={{ height: '100%', width: '100%', color: '#fff', backgroundColor: '#0171d3', transition: 'all 0.3s ease', cursor: 'pointer', border: 'none', fontSize: '16px', fontWeight: '400', borderRadius: '6px' }}>Signup</button>
                                </div>
                            </form>
                            {error && (
                                <div style={{ color: 'red', marginTop: '10px', textAlign: 'center' }}>
                                    {typeof error === 'object' ? "Đăng ký thất bại" : error}
                                </div>
                            )}
                            <div className="form-link" style={{ textAlign: 'center', marginTop: '10px' }}>
                                <span style={{ fontSize: '14px', fontWeight: '400', color: '#232836' }}>Already have an account? <a href="#" className="link login-link" style={{ color: '#0171d3', textDecoration: 'none' }} onClick={switchToLogin}>Login</a></span>
                            </div>
                        </div>
                        <div className="line" style={{ position: 'relative', height: '1px', width: '100%', margin: '36px 0', backgroundColor: '#d4d4d4' }}>
                            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#FFF', color: '#8b8b8b', padding: '0 15px' }}>Or</span>
                        </div>
                    </div>
                )}
                {showForgotPassword && (
                    <ForgotPassword close={closeForgotPassword} />
                )}
                {showVerificationCode && (
                    <VerificationCode closeVerificationCode={ closeVerificationCode} handleVerifySuccess = {handleVerifySuccess}/>
                )}
            </div>
        </div>
    );
};

export default AuthenticatePage;
