import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Để chuyển hướng
import '../../assets/css/trangchu.css';
import logo from '../../assets/images/logo.png';  // Import hình ảnh logo
import illustration from '../../assets/images/illustration.png';  // Import hình ảnh illustration

function TrangChu() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();  // Hook để chuyển hướng trang

    // Hàm xử lý đăng nhập
    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://localhost:8083/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });
    
            const data = await response.json();
    
            if (data.status === 'success') {
                const { token, refreshToken } = data;
    
                // Lưu accessToken và refreshToken vào localStorage
                localStorage.setItem('accessToken', token);
                localStorage.setItem('refreshToken', refreshToken);
    
                // Kiểm tra ngay sau khi lưu
                if (localStorage.getItem('accessToken')) {
                    console.log('Token đã được lưu thành công');
                } else {
                    console.error('Error: No token found');
                    alert('Lỗi lưu token!');
                    return;
                }
    
                // Giải mã token JWT để lấy role
                try {
                    const decodedToken = JSON.parse(atob(token.split('.')[1]));
                    if (decodedToken.role === 'ROLE_ADMIN') {
                        navigate('/quan-ly-nguoi-dung');  // Chuyển hướng đến trang quản lý người dùng
                    } else {
                        alert('Bạn không có quyền truy cập vào trang này!');
                    }
                } catch (error) {
                    console.error('Lỗi giải mã token:', error);
                    alert('Lỗi xác thực người dùng!');
                }
            } else {
                alert('Đăng nhập không thành công!');
            }
        } catch (error) {
            console.error('Lỗi kết nối đến API:', error);
            alert('Không thể kết nối đến máy chủ.');
        }
    };
    
    
    

    return (
        <div className="trang-chu-body">
            <div className="container">
                <div className="left-panel">
                    <img src={logo} alt="Logo" className="logo" />
                    <h2>Welcome to</h2>
                    <h3>Sign in</h3>
                    <form onSubmit={handleLogin}>
                        <div className="input-group">
                            <label>Email*</label>
                            <input 
                                type="email" 
                                placeholder="Admin@gmail.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)} 
                            />
                            <span className="icon">👤</span>
                        </div>

                        <div className="input-group">
                            <label>Password*</label>
                            <input 
                                type="password" 
                                placeholder="Password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)} 
                            />
                            <span className="icon">🔒</span>
                        </div>

                        <button type="submit">SIGN IN</button>
                    </form>
                    <p>Rimberbookstore@gmail.com</p>
                </div>
                <div className="right-panel">
                    <img src={illustration} alt="Illustration" />
                </div>
            </div>
        </div>
    );
}

export default TrangChu;
