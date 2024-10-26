import React from "react";
import { Navigate, Outlet } from "react-router-dom";

// Component bảo vệ các route yêu cầu phải đăng nhập
const ProtectedRoute = () => {
  // Kiểm tra xem người dùng đã được xác thực hay chưa bằng cách kiểm tra sự tồn tại của token trong localStorage
  const isAuthenticated = localStorage.getItem("authToken") !== null;
  console.log(`ProtectedRoute: isAuthenticated=${isAuthenticated}`);

  // Nếu người dùng không được xác thực, điều hướng đến trang đăng nhập
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Nếu người dùng đã được xác thực, cho phép truy cập vào các route con của route hiện tại
  return <Outlet />;
};

export default ProtectedRoute;