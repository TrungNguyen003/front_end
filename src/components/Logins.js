import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS cho toastify
import "./styles/login.css";

const Login = ({ setIsAuthenticated, setUser }) => {
  const [gmail, setGmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false); // State cho Remember Me
  const [isLoading, setIsLoading] = useState(false); // State cho Loaders
  const navigate = useNavigate();

  useEffect(() => {
    // Tự động điền thông tin đăng nhập nếu có trong localStorage
    const savedGmail = localStorage.getItem("rememberedGmail");
    const savedPassword = localStorage.getItem("rememberedPassword");
    if (savedGmail && savedPassword) {
      setGmail(savedGmail);
      setPassword(savedPassword);
      setRememberMe(true);
    }
  }, []);

  const handleLogin = async (gmail, password) => {
    setIsLoading(true); // Bắt đầu loader khi bắt đầu quá trình đăng nhập
    try {
      const res = await axios.post(
        "https://back-end-42ja.onrender.com/users/login",
        { gmail, password },
        { withCredentials: true }
      );
      const { userId, token, role, user } = res.data;
      localStorage.setItem("userId", userId);
      localStorage.setItem("authToken", token);
      localStorage.setItem("role", role);

      if (res.data.msg === "Đăng nhập thành công") {
        setIsAuthenticated(true);
        setUser(user); // Set the user state
        if (
          user.role === "sales_staff_1" &&
          user.role === "sales_staff_2" &&
          user.role === "manager"
        ) {
          toast.error("Tài khoản không được phép truy cập");
        } else {
          toast.success("Đăng nhập thành công. Đang chuyển hướng...");
        }
        if (rememberMe) {
          localStorage.setItem("rememberedGmail", gmail);
          localStorage.setItem("rememberedPassword", password);
        } else {
          localStorage.removeItem("rememberedGmail");
          localStorage.removeItem("rememberedPassword");
        }

        if (role === "admin") {
          setTimeout(() => navigate("/"), 1000);
        } else if (role === "sales_staff_1") {
          setTimeout(() => navigate("/login"), 1000);
          toast.error("Tài khoản không được phép truy cập");
        } else if (role === "sales_staff_2") {
          setTimeout(() => navigate("/login"), 1000);
          toast.error("Tài khoản không được phép truy cập");
        } else if (role === "manager") {
          setTimeout(() => navigate("/login"), 1000);
          toast.error("Tài khoản không được phép truy cập");
        }
      } else {
        toast.error("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Error during login:", err);
      if (err.response) {
        toast.error(err.response.data.msg);
      } else if (err.request) {
        toast.error("Không có phản hồi từ máy chủ. Vui lòng thử lại sau.");
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    } finally {
      setIsLoading(false); // Dừng loader sau khi hoàn thành
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin(gmail, password);
  };

  return (
    <>
      <div className="main-container-5">
        <div className="image-5" />
        <span className="welcome-back-5">Chào mừng trở lại</span>
        <div className="inner-plugin-iframe-5">
          <div className="vector-5-1" />
        </div>
        <button className="rectangle-5" />
        <Link to="/">
          <span className="back-to-website-5">quay lại trang</span>
        </Link>
        <Link to="/register">
          <span className="register-5">Đăng ký</span>
        </Link>
        <span className="no-account-5">Bạn chưa có tài khoản?</span>
        <form onSubmit={handleSubmit}>
          <div className="rectangle-1-5" />
          <input
            className="group-input-5"
            type="email"
            placeholder="Gmail"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            required
          />
          <div className="rectangle-2-5" />
          <input
            className="group-input-3-5"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <label className="remember-me-5">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Remember
          </label>
          <button className="rectangle-button-5" disabled={isLoading}>
            {isLoading ? (
              <span className="loader"></span> // Add a loader component or text
            ) : (
              <span className="login-span-5">Đăng nhập</span>
            )}
          </button>
        </form>
        <span className="or-login-span-5">Hoặc đăng nhập bằng</span>
        <div className="line-div-5" />
        <div className="line-div-6-5" />
        <button className="rectangle-button-7-5" />
        <button className="rectangle-button-8-5" />
        <div className="vector-9-5" />
        <div className="facebook-5">
          <div className="vector-a-5" />
        </div>
        <span className="facebook-text-5">Facebook</span>
        <span className="google-text-5">Google</span>
      </div>
      <ToastContainer />
    </>
  );
};

export default Login;
