import React from "react";
import OwlCarousel from 'react-owl-carousel';  
import 'owl.carousel/dist/assets/owl.carousel.css';  
import 'owl.carousel/dist/assets/owl.theme.default.css';  

const NinthSection = () => {
    const options = {
        autoplay: true,
        smartSpeed: 2000,
        center: false,
        dots: true,
        loop: true,
        margin: 25,
        nav: true,
        navText: [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0: {
                items: 1
            },
            576: {
                items: 1
            },
            768: {
                items: 1
            },
            992: {
                items: 2
            },
            1200: {
                items: 2
            }
        }
    };

    return (
        <div className="container-fluid testimonial py-5">
            <div className="container py-5">
                <div className="testimonial-header text-center">
                    <h4 className="text-primary">Những sự thật</h4>
                    <h1 className="display-5 mb-5 text-dark">Khách hàng của chúng tôi đã nhận xét!</h1>
                </div>
                <div style={{ width: '70%', margin: '0 auto' }}>
                    <OwlCarousel className="owl-carousel testimonial-carousel" {...options}>
                        <div className="testimonial-item img-border-radius bg-light rounded p-4">
                            <div className="position-relative">
                                <i className="fa fa-quote-right fa-2x text-secondary position-absolute" style={{ bottom: '30px', right: '0px'}}></i>
                                <div className="mb-4 pb-4 border-bottom border-secondary">
                                    <p className="mb-0">Đây là một trong những cửa tiệm làm bánh ngon nhất tôi từng ăn, mặc dù tôi đã thưởng thực kha khá loại bánh đến từ các thương hiệu nổi tiếng trên thế giới
                                    </p>
                                </div>
                                <div className="d-flex align-items-center flex-nowrap">
                                    <div className="bg-secondary rounded">
                                        <img src="img/testimonial-1.jpg" className="img-fluid rounded" style={{ width: '100px', height: '100px'}} alt="" />
                                    </div>
                                    <div className="ms-4 d-block">
                                        <h4 className="text-dark">Madam Azukara</h4>
                                        <p className="m-0 pb-3">Khách hàng thân thiết 10 năm</p>
                                        <div className="d-flex pe-5">
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                            <i className="fas fa-star text-primary"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* Repeat the above block for other testimonial items */}
                    </OwlCarousel>
                </div>
            </div>
        </div>
    );
};

export default NinthSection;
