import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify"; // Nhập ToastContainer và toast
import "react-toastify/dist/ReactToastify.css"; // Nhập stylesheet cho Toastify
import "./styles/register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    gmail: "",
    password: "",
    password2: "",
    role: "customer", // Vai trò mặc định là "customer"
  });

  const [loading, setLoading] = useState(false); // Thêm state loading
  const navigate = useNavigate();

  const { username, gmail, password, password2, role } = formData;

  const onChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // Hàm kiểm tra tính hợp lệ của email
  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  // Hàm kiểm tra mật khẩu theo yêu cầu
  const validatePassword = (password) => {
    const re = /^(?=.*[A-Z])(?=.*\W)[A-Za-z\d\W]{8,}$/;
    return re.test(password);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra phía client
    if (!validateEmail(gmail)) {
      toast.error("Địa chỉ email không hợp lệ");
    } else if (!validatePassword(password)) {
      toast.error(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa và 1 ký tự đặc biệt"
      );
    } else if (password !== password2) {
      toast.error("Mật khẩu không khớp");
    } else {
      setLoading(true);
      const newUser = { username, gmail, password, password2, role };

      try {
        const res = await axios.post(
          "https://back-end-42ja.onrender.com/users/register",
          newUser
        );
        toast.success(
          "Đăng ký thành công! Vui lòng kiểm tra email để xác nhận tài khoản."
        );

        setTimeout(() => {
          setLoading(false);
          navigate("/login");
        }, 2000);
      } catch (err) {
        setLoading(false);
        if (err.response && err.response.data) {
          const { errors, msg } = err.response.data;
          if (errors && errors.length > 0) {
            errors.forEach((error) => {
              toast.error(error.msg);
            });
          } else if (msg) {
            toast.error(msg);
          } else {
            toast.error("Đã xảy ra lỗi trong quá trình đăng ký");
          }
        } else {
          toast.error("Đã xảy ra lỗi trong quá trình đăng ký");
        }
      }
    }
  };

  return (
    <>
      <div className="main-container-4">
        <span className="create-account-4">Tạo một tài khoản</span>
        <div className="image-4">
          <div className="inner-plugin-iframe-4">
          </div>
          <Link to="/">
            <span className="back-to-website-4">Quay lại trang &nbsp; <i class="fa-solid fa-arrow-right"></i></span>
          </Link>
        </div>
        <div className="rectangle-4" />
        <Link to="/login">
          <span className="login-4">Đăng nhập</span>
        </Link>
        <span className="already-have-account-4">Bạn đã có tài khoản?</span>

        <form onSubmit={onSubmit}>
          <input
            className="rectangle-1-4"
            type="text"
            placeholder="Tên tài khoản"
            name="username"
            value={username}
            onChange={onChange}
            required
          />
          <input
            className="rectangle-2-4"
            type="email"
            placeholder="Gmail"
            name="gmail"
            value={gmail}
            onChange={onChange}
            required
          />
          <input
            className="rectangle-3-4"
            type="password"
            placeholder="Mật khẩu"
            name="password"
            value={password}
            onChange={onChange}
            required
          />

          <input
            className="rectangle-4-4"
            type="password"
            placeholder="Nhập lại mật khẩu"
            name="password2"
            value={password2}
            onChange={onChange}
            required
          />
          <span className="terms-conditions-4">Điều khoản & Điều kiện</span>
          <span className="agree-terms-4">Tôi đồng ý với</span>
          <div className="rectangle-5-4">
            <div className="vector-6-4" />
          </div>
          <button className="rectangle-7-4" type="submit" disabled={loading}>
            {loading ? (
              <span className="loading-spinner"></span>
            ) : (
              <span className="create-account-8-4">Tạo tài khoản</span>
            )}
          </button>
        </form>
        <span className="register-with-4">Hoặc đăng ký với</span>
        <div className="line-4" />
        <div className="line-9-4" />
        <button className="rectangle-a-4" />
        <button className="rectangle-b-4" />
        <div className="facebook-4">
          <div className="vector-c-4" />
        </div>
        <div className="vector-d-4" />
        <span className="google-4">Google</span>
        <span className="facebook-e-4">Facebook</span>
      </div>
      <ToastContainer /> {/* Thêm ToastContainer vào cuối component */}
    </>
  );
};

export default Register;
