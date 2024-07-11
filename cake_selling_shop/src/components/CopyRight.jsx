import React  from "react";

const CopyRight = () => {
    return (
    <div class="container-fluid copyright bg-dark py-4">
        <div class="container">
            <div class="row">
                <div class="col-md-6 text-center text-md-start mb-3 mb-md-0">
                    <span class="text-light"><a href="#"><i class="fas fa-copyright text-light me-2"></i>Your Site Name</a>, All right reserved.</span>
                </div>
                <div class="col-md-6 my-auto text-center text-md-end text-white">
                    Designed By <span class="border-bottom" href="">Nguyễn Duy</span> At <span class="border-bottom" href="https://themewagon.com">PTIT</span>
                </div>
            </div>
        </div>
    </div>
    )
};

export default CopyRight;