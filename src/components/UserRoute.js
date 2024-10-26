import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const UserRoute = ({ isAuthenticated, user }) => {
  // Kiểm tra nếu người dùng đã đăng nhập và không phải là admin
  if (isAuthenticated && user && user.role !== "admin") {
    return <Outlet />;
  } else {
    // Nếu là admin, chuyển hướng đến trang dashboard admin hoặc trang không được phép truy cập
    return <Navigate to="/admin/dashboard" />;
  }
};

export default UserRoute;
