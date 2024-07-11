import React from 'react';
import Spinner from '../components/Spinner.jsx';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar.jsx';
import CopyRight from '../components/CopyRight.jsx';
import BackToTop from '../components/BackToTop.jsx';
import Search from '../components/Search.jsx';

const ErrorPage = () => {
    return (
        <div>
            <Spinner />
            <Navbar />
            <Search />
            <div className="container-fluid page-header py-5">
                <h1 className="text-center text-white display-6">404 Error</h1>
                <ol className="breadcrumb justify-content-center mb-0">
                    <li className="breadcrumb-item"><a href="#">Home</a></li>
                    <li className="breadcrumb-item active text-white">404</li>
                </ol>
            </div>

            <div className="container-fluid py-5">
                <div className="container py-5 text-center">
                    <div className="row justify-content-center">
                        <div className="col-lg-6">
                            <i className="bi bi-exclamation-triangle display-1 text-secondary"></i>
                            <h1 className="display-1">404</h1>
                            <h1 className="mb-4">Page Not Found</h1>
                            <p className="mb-4">Rất tiếc, trang bạn tìm kiếm không tồn tại trên trang web của chúng tôi! Có thể truy cập trang chủ của chúng tôi hoặc thử sử dụng tìm kiếm?</p>
                            <a className="btn border-secondary rounded-pill py-3 px-5" href="index.html">Trở về trang chủ</a>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
            <CopyRight />
            <BackToTop />
        </div>
    );
};

export default ErrorPage;
