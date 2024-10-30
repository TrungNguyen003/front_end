import React, { useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Nhập toast từ react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Nhập stylesheet cho Toastify

const CancelOrder = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const orderId = queryParams.get('order_id');

  useEffect(() => {
    const cancelOrder = async () => {
      if (orderId) {
        try {
          const response = await axios.get(`http://localhost:10000/orders/checkout/cancel?order_id=${orderId}`, {
            headers: {
              'Content-Type': 'application/json',
            },
            withCredentials: true, // Ensure credentials (cookies) are sent with the request
          });

          toast.success(response.data.message || 'Order cancelled successfully!');
        } catch (error) {
          console.error('Error canceling order:', error);
          toast.error('An error occurred while canceling the order.');
        }
      } else {
        toast.error('Order ID is missing.');
      }
    };

    cancelOrder();
  }, [orderId]);

  const handleGoBack = () => {
    navigate('/cart'); // Navigate to the cart page or another relevant page
  };

  return (
    <div>
      <h1>Hủy đơn hàng</h1>
      <button onClick={handleGoBack}>Đi đến giỏ hàng</button>
      <ToastContainer /> {/* Thêm ToastContainer để hiển thị thông báo */}
    </div>
  );
};

export default CancelOrder;
