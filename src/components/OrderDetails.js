import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const OrderDetail = () => {
  const { orderId } = useParams(); //: Hook này lấy tham số orderId từ URL. Đây là ID của đơn hàng mà bạn muốn xem chi tiết.
  const navigate = useNavigate();
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refundReason, setRefundReason] = useState("");
  const [refundRequestSuccess, setRefundRequestSuccess] = useState(null);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(`https://back-end-42ja.onrender.com/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setOrderDetails(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching order details");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]);

  const handleRefundRequest = async () => {
    try {
      const response = await axios.post(
        `https://back-end-42ja.onrender.com/orders/request-refund`,
        { orderId, refundReason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setRefundRequestSuccess(response.data.msg);
    } catch (err) {
      setError("Failed to submit refund request");
    }
  };

  // Calculate total based on product quantity and price
  const calculateTotal = () => {
    //Hàm này tính tổng số tiền của đơn hàng dựa trên số lượng và giá của từng sản phẩm trong đơn hàng.
    return orderDetails.orderDetails.reduce((acc, item) => acc + item.quantity * item.price, 0);
  };

  if (loading) {
    return <div>Loading order details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Order Details</h2>
      <p>Total: ${calculateTotal().toFixed(0)}</p>
      <p>Status: {orderDetails.order.status}</p>
      <p>Email: {orderDetails.order.email}</p>
      <p>Address: {orderDetails.order.address}</p>
      <ul>
        {orderDetails.orderDetails.map((item) => (
          <li key={item._id}>
            <p>Product: {item.product.name}</p>
            <p>Quantity: {item.quantity}</p>
            <p>Price: ${item.price}</p>
          </li>
        ))}
      </ul>
      <button onClick={() => navigate("/orders")}>Close</button>

      {/* Refund Section */}
      <h3>Request a Refund</h3>
      <label>
        Select a reason for refund:
        <select value={refundReason} onChange={(e) => setRefundReason(e.target.value)}>
          <option value="">-- Select a reason --</option>
          <option value="Khác với mô tả">Khác với mô tả</option>
          <option value="Muốn mua sản phẩm khác">Muốn mua sản phẩm khác</option>
          <option value="Chất lượng sản phẩm không tốt">Chất lượng sản phẩm không tốt</option>
          <option value="Khác">Khác</option>
        </select>
      </label>
      <button onClick={handleRefundRequest}>Request Refund</button>

      {refundRequestSuccess && <p>{refundRequestSuccess}</p>}
    </div>
  );
};

export default OrderDetail;
