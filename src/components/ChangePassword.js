import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import "./styles/changerpassword.css";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify"; // Nhập toast từ react-toastify
import "react-toastify/dist/ReactToastify.css"; // Nhập stylesheet cho Toastify
import UserMenu from "./UserMenu";
import { ClipLoader } from "react-spinners";
const ChangerPassword = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const [username, setUsername] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState("");
  const [address, setAddress] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Token not found");
      return;
    }

    axios
      .get("http://localhost:10000/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setAvatar(response.data.avatar || "");
        setAddress(response.data.address || "");
        setUsername(response.data.username || "");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Failed to fetch user data");
      });
  }, [setUser]);

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    if (name === "oldPassword") setOldPassword(value);
    if (name === "newPassword") setNewPassword(value);
    if (name === "confirmPassword") setConfirmPassword(value);
  };

  const handleUpdatePassword = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Không tìm thấy mã thông báo");
      return;
    }
  
    // Regex kiểm tra độ mạnh của mật khẩu
    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/;
    if (!passwordRegex.test(newPassword)) {
      toast.error(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm 1 chữ hoa và 1 ký tự đặc biệt"
      );
      return;
    }
  
    if (newPassword !== confirmPassword) {
      toast.error("Mật khẩu mới và xác nhận mật khẩu không khớp");
      return;
    }
  
    axios
      .post(
        "http://localhost:10000/users/change-password",
        { oldPassword, newPassword, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.success("Mật khẩu đã được thay đổi thành công");
        setOldPassword("");
        setNewPassword("");
        setConfirmPassword("");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Không thể thay đổi mật khẩu");
      });
  };
  

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  if (error) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Lỗi: {error}</div>;
  }

  if (!user) {
    return <div>Đang tải...</div>;
  }

  return (
    <>
      <div className="main-container-8">
        <Header
          isAuthenticated={isAuthenticated}
          user={user}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
        />

        <div className="flex-row-e-8">
          <UserMenu
            toggleDropdown={toggleDropdown}
            isDropdownOpen={isDropdownOpen}
          />
          <div className="rectangle-8-8" />
          <div className="rectangle-9-8" />
          <span className="change-password-8">Thay đổi mật khẩu</span>

          <span className="current-password-8">Mật khẩu hiện tại</span>

          <div className="active-8">
            <input
              className="blalala-8"
              type="password"
              name="oldPassword"
              value={oldPassword}
              onChange={handlePasswordChange}
              placeholder="Mật khẩu hiện tại"
            />
          </div>
          <span className="new-password-8">Mật khẩu mới</span>
          <div className="rectangle-f-8" />
          <input
            className="group-input-10-8"
            type={showPassword ? "text" : "password"}
            name="newPassword"
            value={newPassword}
            onChange={handlePasswordChange}
            placeholder="Mật khẩu mới"
          />
          <span className="repeat-new-password-8">Lặp lại mật khẩu mới</span>
          <div className="rectangle-12-8" />
          <input
            className="group-input-13-8"
            type={showPassword ? "text" : "password"}
            name="confirmPassword"
            value={confirmPassword}
            onChange={handlePasswordChange}
            placeholder="Xác nhận mật khẩu mới"
          />
          <div className="rectangle-17-8">
            <button
              className="edit-profile-18-8"
              onClick={handleUpdatePassword}
            >
              Chỉnh sửa hồ sơ
            </button>
          </div>
          <label className="show-password-8">
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword(!showPassword)}
            />
            Hiển thị mật khẩu
          </label>
        </div>
        <Footer />
      </div>
      <ToastContainer /> {/* Thêm ToastContainer để hiển thị thông báo */}
    </>
  );
};

export default ChangerPassword;
