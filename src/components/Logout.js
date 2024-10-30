import React from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from 'react-toastify'; // Nhập toast từ react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Nhập stylesheet cho Toastify

const Logout = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to log out?")) { // Xác nhận trước khi đăng xuất
      try {
        const res = await axios.get("https://back-end-42ja.onrender.com/users/logout", { withCredentials: true });
        if (res.status === 200) {
          localStorage.removeItem("authToken"); // Xóa authToken từ localStorage
          setIsAuthenticated(false); // Cập nhật trạng thái xác thực
          toast.success("Đã đăng xuất"); // Hiển thị thông báo thành công
          navigate("/login"); // Điều hướng đến trang đăng nhập
        }
      } catch (err) {
        toast.error("Có lỗi khi đăng xuất. Vui lòng thử lại."); // Hiển thị thông báo lỗi
        console.error("Error during logout:", err);
      }
    }
  };

  return (
    <>
      <button onClick={handleLogout}>
        Logout
      </button>
      {/* Thêm ToastContainer để hiển thị thông báo */}
      <ToastContainer />
    </>
  );
};

export default Logout;
