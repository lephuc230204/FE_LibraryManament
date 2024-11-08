import React from 'react';
import '../../assets/css/trangchu.css';
import logo from '../../assets/images/logo.png';  // Import hình ảnh logo
import illustration from '../../assets/images/illustration.png';  // Import hình ảnh illustration

function TrangChu() {
    return (
        <div className="trang-chu-body">
        <div className="container">
            <div className="left-panel">
                <img src={logo} alt="Logo" className="logo" />  {/* Sử dụng biến logo */}
                <h2>Welcome to</h2>
                <h3>Sign in</h3>
                <form>
                    <div className="input-group">
                        <label>Email*</label>
                        <input type="email" placeholder="Admin@gmail.com" />
                        <span className="icon">👤</span>
                    </div>

                    <div className="input-group">
                        <label>Password*</label>
                        <input type="password" placeholder="Password" />
                        <span className="icon">🔒</span>
                    </div>

                    <button type="submit">SIGN IN</button>
                </form>
                <p>Rimberbookstore@gmail.com</p>
            </div>
            <div className="right-panel">
                <img src={illustration} alt="Illustration" />  {/* Sử dụng biến illustration */}
            </div>
        </div>
        </div>
    );
}

export default TrangChu;
