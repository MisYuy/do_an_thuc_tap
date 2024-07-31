import React from 'react';

function ForgotPassword({ close }) {
  return (
    <div>
      <div
        className="overlay"
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 1,
        }}
      ></div>
      <div
        className="form verification-code"
        style={{
          position: 'absolute',
          maxWidth: '430px',
          width: '100%',
          padding: '30px',
          borderRadius: '6px',
          background: '#FFF',
          zIndex: 2,
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <div className="form-content">
          <header
            style={{
              fontSize: '28px',
              fontWeight: '600',
              color: '#232836',
              textAlign: 'center',
            }}
          >
            Quên mật khẩu
          </header>
          <form action="#" style={{ marginTop: '30px' }}>
            <div
              className="field input-field"
              style={{
                position: 'relative',
                height: '50px',
                width: '100%',
                marginTop: '20px',
                borderRadius: '6px',
              }}
            >
              <input
                type="text"
                placeholder="Enter email"
                className="input"
                required
                style={{
                  height: '100%',
                  width: '100%',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '400',
                  borderRadius: '6px',
                  outline: 'none',
                  padding: '0 15px',
                  border: '1px solid #CACACA',
                }}
              />
            </div>
            <div
              className="field button-field"
              style={{
                position: 'relative',
                height: '50px',
                width: '100%',
                marginTop: '20px',
                borderRadius: '6px',
              }}
            >
              <button
                type="submit"
                style={{
                  height: '100%',
                  width: '100%',
                  color: '#fff',
                  backgroundColor: '#0171d3',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '400',
                  borderRadius: '6px',
                }}
              >
                Lấy lại mật khẩu
              </button>
            </div>
          </form>
          <div
            className="form-link"
            style={{ textAlign: 'center', marginTop: '10px' }}
          >
            <a
              href="#"
              className="back-to-login"
              style={{
                fontSize: '14px',
                fontWeight: '400',
                color: '#0171d3',
                textDecoration: 'none',
              }}
              onClick={close}
            >
              Quay lại
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
