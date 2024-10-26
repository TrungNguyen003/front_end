import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "./layout/Header";
import Modal from "react-modal";
import { toast, ToastContainer } from "react-toastify"; // Nhập toast từ react-toastify
import "react-toastify/dist/ReactToastify.css"; // Nhập stylesheet cho Toastify

Modal.setAppElement("#root");

const CancelPayment = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalIsOpen, setModalIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get("orderId");

  useEffect(() => {
    const cancelOrder = async () => {
      try {
        const response = await axios.get(
          `https://back-end-42ja.onrender.com/orders/${orderId}`
        );
        console.log("Dữ liệu trả về từ API:", response.data);

        if (
          response.data &&
          response.data.order &&
          Array.isArray(response.data.orderDetails)
        ) {
          setOrderDetails({
            order: response.data.order,
            orderDetails: response.data.orderDetails,
          });
          toast.success("Đơn hàng đã được hủy thành công.");
        } else {
          console.error("Dữ liệu không hợp lệ:", response.data);
          toast.error("Dữ liệu đơn hàng không hợp lệ.");
          setOrderDetails(null);
        }
        setLoading(false);
      } catch (error) {
        console.error("Lỗi khi hủy đơn hàng:", error);
        toast.error(
          "Lỗi khi hủy đơn hàng: " +
            (error.response ? error.response.data : error.message)
        );
        setLoading(false);
      }
    };

    if (orderId) {
      cancelOrder();
    }
  }, [orderId]);

  const handleCloseModal = () => {
    setModalIsOpen(false);
  };

  if (loading) {
    return <div>Đang xử lý hủy đơn hàng...</div>;
  }

  if (
    !orderDetails ||
    !orderDetails.order ||
    !orderDetails.orderDetails ||
    orderDetails.orderDetails.length === 0
  ) {
    return <div>Không có thông tin đơn hàng để hủy.</div>;
  }

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h1>Đơn hàng đã hủy</h1>
        <p>Đơn hàng của bạn đã được hủy thành công.</p>
        <button onClick={() => navigate("/cart")}>Quay lại giỏ hàng</button>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={handleCloseModal}
        contentLabel="Order Details"
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.75)", // Màu nền khi modal mở
          },
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
            padding: "20px",
            borderRadius: "10px",
            backgroundColor: "#fff",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            width: "80%",
            maxWidth: "800px", // Tăng kích thước tối đa của modal
          },
        }}
      >
        <h2 style={{ color: "#FF0000" }}>Chi tiết hủy đơn hàng</h2>
        <button
          onClick={handleCloseModal}
          style={{
            float: "right",
            background: "none",
            border: "none",
            fontSize: "24px",
            cursor: "pointer",
            color: "#FF0000",
          }}
        >
          &#10005;
        </button>
        <div>
          <h3>Mã đơn hàng: {orderDetails.order._id}</h3>
          <h4>
            Ngày đặt hàng:{" "}
            {new Date(orderDetails.order.orderDate).toLocaleString()}
          </h4>
          <h4>Trạng thái:{orderDetails.order.status}</h4>
          <h4>Phương thức thanh toán: {orderDetails.order.paymentMethod}</h4>
          <h4>Trạng thái thanh toán: {orderDetails.order.paymentStatus}</h4>
          <h4>Địa chỉ: {orderDetails.order.address}</h4>
          <h4>Email: {orderDetails.order.email}</h4>
          <h4>Mặt hàng:</h4>
          <ul>
            {orderDetails.orderDetails.map((item) => (
              <li key={item._id} style={{ marginBottom: "20px" }}>
                {item.product.name} - Số lượng: {item.quantity} - Giá:
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
                  .format(item.price)
                  .replace("₫", "VND")}
                <div>
                  {item.product.image && (
                    <div>
                      <img
                        src={`https://back-end-42ja.onrender.com/product_images/${item.product._id}/${item.product.image}`}
                        alt={item.product.name}
                        style={{
                          width: "100px",
                          height: "100px",
                          margin: "5px",
                        }}
                      />
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
          <h4>
            Tổng cộng:{" "}
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(orderDetails.order.total)}
          </h4>
        </div>
      </Modal>
      <ToastContainer /> {/* Thêm ToastContainer để hiển thị thông báo */}
    </>
  );
};

export default CancelPayment;
