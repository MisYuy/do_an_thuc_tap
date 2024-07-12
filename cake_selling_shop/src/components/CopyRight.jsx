import React  from "react";

const CopyRight = () => {
    return (
    <div className="container-fluid copyright bg-dark py-4">
        <div className="container">
            <div className="row">
                <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
                    <span className="text-light"><a href="#"><i className="fas fa-copyright text-light me-2"></i>Your Site Name</a>, All right reserved.</span>
                </div>
                <div className="col-md-6 my-auto text-center text-md-end text-white">
                    Designed By <span className="border-bottom" href="">Nguyễn Duy</span> At <span className="border-bottom" href="https://themewagon.com">PTIT</span>
                </div>
            </div>
        </div>
    </div>
    )
};

export default CopyRight;