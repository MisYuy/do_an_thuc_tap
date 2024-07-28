import React  from "react";

const SixSection = () => {
    return (
        <div className="container-fluid banner bg-secondary my-5">
            <div className="container py-5">
                <div className="row g-4 align-items-center">
                    <div className="col-lg-6">
                        <div className="py-4">
                            <h1 className="display-3 text-white">Nguyên liệu tự nhiên 100% được tuyển chọn gắt gao</h1>
                            <p className="fw-normal display-3 text-dark mb-4">tại các quốc gia trên thế giới</p>
                            <p className="mb-4 text-dark">Cam kết đem đến những chiếc bánh thơm ngon nhất, tuyệt hảo đến miếng cuối cùng.</p>
                            <a href="/products" className="banner-btn btn border-2 border-white rounded-pill text-dark py-3 px-5">Mua ngay</a>
                        </div>
                    </div>
                    <div className="col-lg-6">
                        <div className="position-relative">
                            <img src="img/baner-1.png" className="img-fluid w-100 rounded" alt=""/>
                            <div className="d-flex align-items-center justify-content-center bg-white rounded-circle position-absolute" style={{ width: '140px', height: '140px', top: '0px', left: '0px'}}>
                                <h1 style={{ fontSize: '50px'}}>No. 1</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};

export default SixSection;   