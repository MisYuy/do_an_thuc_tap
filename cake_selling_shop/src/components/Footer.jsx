import React  from "react";

const Footer = () => {
    return (
    <div className="container-fluid bg-dark text-white-50 footer pt-5 mt-5">
            <div className="container py-5">
                <div className="pb-4 mb-4" style={{ borderBottom: '1px solid rgba(226, 175, 24, 0.5)' }}>
                    <div className="row g-4">
                        <div className="col-lg-3">
                            <a href="#">
                                <h1 className="text-primary mb-0">ZuyCake</h1>
                                <p className="text-secondary mb-0">Thương hiệu bánh kem số một PTIT</p>
                            </a>
                        </div>
                        <div className="col-lg-6">
                            <div className="position-relative mx-auto">
                                <input className="form-control border-0 w-100 py-3 px-4 rounded-pill" type="number" placeholder="Email của bạn" />
                                <button type="submit" className="btn btn-primary border-0 border-secondary py-3 px-4 position-absolute rounded-pill text-white" style={{ top: '0', right: '0' }}>Theo dõi ngay</button>
                            </div>
                        </div>
                        <div className="col-lg-3">
                            <div className="d-flex justify-content-end pt-3">
                                <a className="btn  btn-outline-secondary me-2 btn-md-square rounded-circle" href=""><i className="fab fa-twitter"></i></a>
                                <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href=""><i className="fab fa-facebook-f"></i></a>
                                <a className="btn btn-outline-secondary me-2 btn-md-square rounded-circle" href=""><i className="fab fa-youtube"></i></a>
                                <a className="btn btn-outline-secondary btn-md-square rounded-circle" href=""><i className="fab fa-linkedin-in"></i></a>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row g-5">
                    <div className="col-lg-3 col-md-6">
                        <div className="footer-item">
                            <h4 className="text-light mb-3">Tại sao lại là ZuyCake!</h4>
                            <p className="mb-4">Bánh ngọt thủ công với nguyên liệu tươi ngon, hương vị độc đáo. ZuyCake mang đến niềm vui ngọt ngào cho mọi khoảnh khắc đặc biệt.</p>
                            <a href="" className="btn border-secondary py-2 px-4 rounded-pill text-primary">Đọc thêm</a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="d-flex flex-column text-start footer-item">
                            <h4 className="text-light mb-3">Cửa hàng</h4>
                            <a className="btn-link" href="">Về chúng tôi</a>
                            <a className="btn-link" href="">Hợp tác</a>
                            <a className="btn-link" href="">Chính sách</a>
                            <a className="btn-link" href="">Điều khoản và điều kiện</a>
                            <a className="btn-link" href="">Chính sách hoàn trả</a>
                            <a className="btn-link" href="">Các câu hỏi thường gặp</a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="d-flex flex-column text-start footer-item">
                            <h4 className="text-light mb-3">Tài khoản</h4>
                            <a className="btn-link" href="">Tài khoản của tôi</a>
                            <a className="btn-link" href="">Chi tiết cửa hàng</a>
                            <a className="btn-link" href="">Giỏ hàng</a>
                            <a className="btn-link" href="">Danh sách yêu thích</a>
                            <a className="btn-link" href="">Lịch sử mua hàng</a>
                            <a className="btn-link" href="">Đơn đặt hàng quốc tế</a>
                        </div>
                    </div>
                    <div className="col-lg-3 col-md-6">
                        <div className="footer-item">
                            <h4 className="text-light mb-3">Thông tin liên hệ</h4>
                            <p>Address: 97 Man Thiện, Hiệp Phú, TPHCM</p>
                            <p>Email: zuycake@gmail.com</p>
                            <p>Phone: +84 356 756 964</p>
                            <p>Chấp nhận thanh toán</p>
                            <img src="img/payment.png" className="img-fluid" alt="" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        )
};

export default Footer;