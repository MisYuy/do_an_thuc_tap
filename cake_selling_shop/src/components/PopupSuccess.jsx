import React from "react";

const PopupSuccess = ({ onClose, message }) => {
    const handleClose = () => {
        if (onClose) {
            onClose(); // Gọi onClose nếu được cung cấp
        }
    };

    return (
        <div onClick={handleClose} style={{
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'rgba(0, 0, 0, 0.5)', // Màu xám với độ trong suốt
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: '1000' // Đảm bảo lớp phủ nằm trên các nội dung khác
        }}>
            <div className="card" style={{
                background: 'white',
                padding: '60px',
                borderRadius: '4px',
                boxShadow: '0 2px 3px #C8D0D8',
                display: 'inline-block',
                margin: '0 auto',
                position: 'relative', // Đặt vị trí tương đối để không ảnh hưởng đến lớp phủ
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
            }}>
                <div style={{
                    borderRadius: '200px',
                    height: '200px',
                    width: '200px',
                    background: '#F8FAF5',
                    margin: '0 auto'
                }}>
                    <i className="checkmark" style={{
                        color: '#9ABC66',
                        fontSize: '100px',
                        lineHeight: '200px',
                        marginLeft: '-15px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>✓</i>
                </div>
                <h1 style={{
                    color: '#88B04B',
                    fontFamily: '"Nunito Sans", "Helvetica Neue", sans-serif',
                    fontWeight: '900',
                    fontSize: '40px',
                    marginBottom: '10px',
                    textAlign: 'center'
                }}>Success</h1>
                <p style={{
                    color: '#404F5E',
                    fontFamily: '"Nunito Sans", "Helvetica Neue", sans-serif',
                    fontSize: '20px',
                    margin: '0',
                    textAlign: 'center'
                }}>{message}</p>
            </div>
        </div>
    );
};

export default PopupSuccess;
