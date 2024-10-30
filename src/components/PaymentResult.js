import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const PaymentResult = () => {
  const location = useLocation();
  const [message, setMessage] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const responseCode = queryParams.get('vnp_ResponseCode');
    const orderId = queryParams.get('orderId');

    if (responseCode === '00') {
      setMessage('Thanh toán thành công!');

      // Fetch order details
      axios.get(`http://localhost:10000/orders/${orderId}`)
        .then(response => {
          setOrderDetails(response.data);
        })
        .catch(error => {
          console.error("Lỗi khi lấy thông tin đơn hàng:", error);
        });
    } else {
      setMessage('Thanh toán không thành công.');
    }
  }, [location.search]);

  return (
    <div className="payment-result">
      {message ? (
        <>
          <h1>{message}</h1>
          {orderDetails && (
            <div>
              <h2>Thông tin sản phẩm đã mua:</h2>
              <ul>
                {orderDetails.items.map(item => (
                  <li key={item.product._id}>
                    {item.product.name} - Số lượng: {item.quantity} - Giá: {item.price}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : (
        <h1 style={{ textAlign: "center", marginTop: "50px" }}>Đang kiểm tra kết quả thanh toán...</h1>
      )}
    </div>
  );
};

export default PaymentResult;
