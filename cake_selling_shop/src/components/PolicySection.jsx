import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const PolicySection = () => {
    return (
        <Container className="py-5" style={{marginTop: '120px'}}>
            <h1 className="display-6 mb-4 text-center">Chính Sách Của Chúng Tôi</h1>
            <Row>
                <Col md={12} className="mb-4">
                    <Card className="policy-card">
                        <Card.Header className="policy-header">
                            <h2>Chính Sách Bảo Mật</h2>
                        </Card.Header>
                        <Card.Body>
                            <p>
                                Tại ZuyCake, chúng tôi cam kết bảo vệ quyền riêng tư của bạn. Chính Sách Bảo Mật này giải thích cách chúng tôi thu thập, sử dụng và tiết lộ thông tin cá nhân của bạn.
                            </p>
                            <h5>Thu Thập Thông Tin</h5>
                            <p>
                                Chúng tôi thu thập thông tin từ bạn khi bạn đăng ký trên trang web của chúng tôi, đặt hàng, đăng ký nhận bản tin hoặc điền vào một biểu mẫu. Thông tin thu thập có thể bao gồm tên, địa chỉ email, địa chỉ gửi thư, số điện thoại và thông tin thanh toán của bạn.
                            </p>
                            <h5>Sử Dụng Thông Tin</h5>
                            <p>
                                Thông tin chúng tôi thu thập từ bạn có thể được sử dụng theo các cách sau:
                                <ul>
                                    <li>Để cá nhân hóa trải nghiệm của bạn</li>
                                    <li>Để cải thiện trang web của chúng tôi</li>
                                    <li>Để xử lý giao dịch</li>
                                    <li>Để gửi email định kỳ</li>
                                </ul>
                            </p>
                            <h5>Bảo Vệ Thông Tin</h5>
                            <p>
                                Chúng tôi thực hiện nhiều biện pháp bảo mật để duy trì sự an toàn của thông tin cá nhân của bạn khi bạn đặt hàng hoặc nhập, gửi hoặc truy cập thông tin cá nhân của bạn.
                            </p>
                            <h5>Tiết Lộ Thông Tin</h5>
                            <p>
                                Chúng tôi không bán, trao đổi hoặc chuyển giao thông tin cá nhân của bạn cho các bên ngoài. Điều này không bao gồm các bên thứ ba đáng tin cậy giúp chúng tôi vận hành trang web của mình, tiến hành kinh doanh hoặc phục vụ bạn, miễn là các bên đó đồng ý giữ bí mật thông tin này.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12} className="mb-4">
                    <Card className="policy-card">
                        <Card.Header className="policy-header">
                            <h2>Điều Khoản Dịch Vụ</h2>
                        </Card.Header>
                        <Card.Body>
                            <p>
                                Chào mừng đến với ZuyCake. Bằng cách sử dụng trang web của chúng tôi, bạn đồng ý tuân thủ và bị ràng buộc bởi các điều khoản và điều kiện sử dụng sau đây.
                            </p>
                            <h5>Sử Dụng Trang Web</h5>
                            <p>
                                Bạn đồng ý sử dụng trang web của chúng tôi chỉ cho các mục đích hợp pháp và theo cách không vi phạm quyền, hạn chế hoặc cản trở việc sử dụng và hưởng thụ trang web của bất kỳ ai khác.
                            </p>
                            <h5>Sở Hữu Trí Tuệ</h5>
                            <p>
                                Tất cả nội dung bao gồm trên trang web này, chẳng hạn như văn bản, đồ họa, logo, hình ảnh và phần mềm, là tài sản của ZuyCake hoặc các nhà cung cấp nội dung của nó và được bảo vệ bởi luật bản quyền quốc tế.
                            </p>
                            <h5>Chấp Nhận Đơn Hàng</h5>
                            <p>
                                Chúng tôi có quyền từ chối hoặc hủy bỏ bất kỳ đơn hàng nào vì bất kỳ lý do gì. Nếu đơn hàng của bạn bị hủy, chúng tôi sẽ thông báo cho bạn và hoàn trả toàn bộ số tiền.
                            </p>
                            <h5>Giới Hạn Trách Nhiệm</h5>
                            <p>
                                ZuyCake sẽ không chịu trách nhiệm cho bất kỳ thiệt hại nào phát sinh từ việc sử dụng hoặc không thể sử dụng các tài liệu trên trang web này hoặc hiệu suất của các sản phẩm, ngay cả khi ZuyCake đã được thông báo về khả năng xảy ra các thiệt hại đó.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
                <Col md={12} className="mb-4">
                    <Card className="policy-card">
                        <Card.Header className="policy-header">
                            <h2>Chính Sách Hoàn Trả</h2>
                        </Card.Header>
                        <Card.Body>
                            <p>
                                Tại ZuyCake, chúng tôi cố gắng cung cấp những chiếc bánh chất lượng tốt nhất và dịch vụ khách hàng tốt nhất. Nếu bạn không hoàn toàn hài lòng với mua hàng của mình, vui lòng xem lại chính sách hoàn trả của chúng tôi dưới đây.
                            </p>
                            <h5>Hoàn Trả</h5>
                            <p>
                                Do tính chất dễ hỏng của sản phẩm của chúng tôi, chúng tôi không chấp nhận hoàn trả. Tuy nhiên, nếu có vấn đề với đơn hàng của bạn, vui lòng liên hệ với chúng tôi trong vòng 24 giờ kể từ khi nhận được đơn hàng của bạn, và chúng tôi sẽ cố gắng hết sức để giải quyết vấn đề.
                            </p>
                            <h5>Hoàn Tiền</h5>
                            <p>
                                Nếu bạn đủ điều kiện để được hoàn tiền, nó sẽ được xử lý và một khoản tín dụng sẽ tự động được áp dụng vào thẻ tín dụng của bạn hoặc phương thức thanh toán ban đầu trong một số ngày nhất định.
                            </p>
                            <h5>Đổi Hàng</h5>
                            <p>
                                Chúng tôi chỉ thay thế các mặt hàng nếu chúng bị lỗi hoặc hư hỏng. Nếu bạn cần đổi nó lấy cùng một mặt hàng, vui lòng liên hệ với chúng tôi.
                            </p>
                            <h5>Vận Chuyển</h5>
                            <p>
                                Để trả lại sản phẩm của bạn, bạn nên gửi sản phẩm của mình đến: [Địa Chỉ Của Bạn]. Bạn sẽ chịu trách nhiệm thanh toán chi phí vận chuyển của riêng bạn để trả lại mặt hàng của bạn. Chi phí vận chuyển là không hoàn lại.
                            </p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default PolicySection;
