import React from "react";
import { Link } from "react-router-dom";
import "./styles/usermenu.css";

const UserMenu = ({ toggleDropdown, isDropdownOpen }) => {
  return (
    <div className="frame-6">
      <div className="flex-row-6">
        <div className="rectangle-7-6" />
        <span className="home-6">Trang chủ /</span>
        {/* <span className="customer-page-6">customer page</span> */}
      </div>
      <div className="flex-row-af-6" onClick={toggleDropdown}>
        <div className="vector-8-6" />
        <Link to="/account">
          <span className="my-account-6">tài khoản của tôi</span>
        </Link>
        <div className={`arrow ${isDropdownOpen ? "up" : "down"}`} />
      </div>
      {isDropdownOpen && (
        <div className="dropdown-menu-6">
          <span className="file-6">tài liệu</span>
          <span className="address-6">Địa chỉ</span>
          <Link to="/changepassword"><span className="change-password-6">Đổi mật khẩu</span></Link>
          
        </div>
      )}
      <div className="flex-row-ad-6">
        <div className="group-6" />
        <Link to="/orders">
          {" "}
          <span className="purchase-order-6">đơn đặt hàng</span>
        </Link>
      </div>
      <div className="flex-row-aab-6">
        <div className="vector-9-6" />
        <span className="notification-6">Thông báo</span>
      </div>
    </div>
  );
};

export default UserMenu;
