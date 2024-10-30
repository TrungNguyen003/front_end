import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Header from "./layout/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { Modal, Button } from "react-bootstrap";
import { ClipLoader } from "react-spinners";
const Success = ({ isAuthenticated, user, setIsAuthenticated, setUser }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(true); // Dùng Bootstrap Modal
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get("orderId");

  useEffect(() => {
    const fetchOrderDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:10000/orders/${orderId}`
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
          toast.success("Thông tin đơn hàng đã được tải thành công.");
        } else {
          console.error("Dữ liệu không hợp lệ:", response.data);
          setOrderDetails(null);
          toast.error("Không có thông tin đơn hàng.");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order details:", error);
        setLoading(false);
        toast.error("Đã xảy ra lỗi khi lấy thông tin đơn hàng.");
      }
    };

    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const handleCloseModal = () => {
    setShowModal(false);
    navigate("/"); // Điều hướng về trang chính sau khi đóng modal
  };

  if (loading) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>
    <ClipLoader size={50} color={"#3498db"} loading={loading} />
  </div>;
  }

  if (
    !orderDetails ||
    !orderDetails.order ||
    !orderDetails.orderDetails ||
    orderDetails.orderDetails.length === 0
  ) {
    return  <div style={{ textAlign: "center", marginTop: "50px" }}></div>;
  }

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />

      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title> Hóa đơn đặt hàng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="invoice-header text-center mb-4">
            <h2>Hóa đơn PetStore</h2>
            <p>102 Tam Trinh, Hoàng Mai, Hà Nội, Việt Nam</p>
            <p>Email: support@petstore.com | SĐT: 0123456789</p>
          </div>
          <div className="invoice-info"></div>
          <h5>Mã đơn hàng: {orderDetails.order._id}</h5>
          <p>
            <strong>Ngày đặt:</strong>{" "}
            {new Date(orderDetails.order.orderDate).toLocaleString()}
          </p>
          <p>
            <strong>Trạng thái:</strong> {orderDetails.order.status}
          </p>
          <p>
            <strong>Phương thức thanh toán:</strong>{" "}
            {orderDetails.order.paymentMethod}
          </p>
          <p>
            <strong>Trạng thái thanh toán:</strong>{" "}
            {orderDetails.order.paymentStatus}
          </p>
          <h5>Thông tin khách hàng</h5>
          <p>
            <strong>Địa chỉ:</strong> {orderDetails.order.address}
          </p>
          <p>
            <strong>Email:</strong> {orderDetails.order.email}
          </p>
          <p>
            <strong>Điện thoại:</strong> {orderDetails.order.phone}
          </p>

          <h5 className="mt-4">Sản phẩm đã mua:</h5>
          <table className="">
            <thead className="table-light">
              <tr>
                <th>Tên sản phẩm</th>
                <th>Hình ảnh</th>
                <th>Số lượng</th>
                <th>Trọng lượng (kg)</th>
                <th>Giá</th>
              </tr>
            </thead>
            <tbody>
              {orderDetails.orderDetails.map((item) => (
                <tr key={item._id}>
                  <td>{item.product.name}</td>
                  <td>
                    {item.product.image && (
                      <img
                        src={`http://localhost:10000/product_images/${item.product._id}/${item.product.image}`}
                        alt={item.product.name}
                        style={{ width: "100px", height: "100px" }}
                      />
                    )}
                  </td>
                  <td>{item.quantity}</td>
                  <td>{item.weight}</td>
                  <td>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(item.price)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="invoice-summary my-4">
          {orderDetails.orderDetails.map((item) => (
            <p className="text-end mt-3">
              <strong>  Tổng giá sản phẩm:{" "}</strong>
            
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(item.price)}
            </p>
          ))}
          <p className="text-end mt-3">
            <strong>Chi phí vận chuyển:{" "}</strong>
            
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(orderDetails.order.shippingFee)}
          </p>
          <p className="text-end mt-3">
            <strong> Tổng tiền:{" "}</strong>
           
            {new Intl.NumberFormat("vi-VN", {
              style: "currency",
              currency: "VND",
            }).format(orderDetails.order.total)}
          </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Success;
