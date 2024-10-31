import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import {
  FaClock,
  FaDollarSign,
  FaBox,
  FaExclamationCircle,
} from "react-icons/fa";
import Modal from "react-modal";
import { ToastContainer, toast } from "react-toastify"; // Nhập ToastContainer và toast
import "react-toastify/dist/ReactToastify.css"; // Nhập stylesheet cho Toastify
import "./styles/orders.css";
import Header from "./layout/Header";
import UserMenu from "./UserMenu";
import OrderDetail from "./OrderDetails";
import { ClipLoader } from "react-spinners";
const Orders = ({ isAuthenticated, user, setIsAuthenticated, setUser }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [ordersPerPage] = useState(5);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [refundReason, setRefundReason] = useState("");
  const [refundModalIsOpen, setRefundModalIsOpen] = useState(false);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    unpaid: 0,
    shipped: 0,
    paid: 0,
    completed: 0,
  });
  const userId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("authToken");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    if (!userId || !authToken) {
      console.error("userId hoặc authToken không được định nghĩa");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      const token = localStorage.getItem("authToken");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(
          `https://back-end-42ja.onrender.com/orders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Orders response:", response.data);
        const sortedOrders = response.data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setOrders(sortedOrders);

        const counts = {
          pending: 0,
          unpaid: 0,
          shipped: 0,
          paid: 0,
          completed: 0,
        };
        sortedOrders.forEach((order) => {
          if (order.status === "chưa giải quyết") counts.pending += 1;
          if (order.status === "chưa thanh toán") counts.unpaid += 1;
          if (order.status === "đang vận chuyển") counts.shipped += 1;
          if (order.status === "trả trước") counts.paid += 1;
          if (order.status === "hoàn thành") counts.completed += 1;
        });
        setStatusCounts(counts);

        setLoading(false);
      } catch (err) {
        toast.error("Lỗi khi lấy đơn hàng"); // Hiển thị thông báo lỗi
        setError("Error fetching orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, navigate]);

  const fetchOrderDetails = (orderId) => {
    setLoadingDetails(true);
    const order = orders.find((o) => o._id === orderId);
    if (order) {
      setOrderDetails(order);
      setModalIsOpen(true);
    } else {
      toast.error("Không tìm thấy đơn hàng"); // Hiển thị thông báo lỗi
    }
    setLoadingDetails(false);
  };

  const handlePayment = async (orderId) => {
    try {
      const response = await axios.post(
        "https://back-end-42ja.onrender.com/cart/process-payment",
        { orderId }
      );
      window.location.href = response.data.checkoutUrl;
      toast.success("Chuyển hướng đến thanh toán"); // Hiển thị thông báo thành công
    } catch (error) {
      console.error("Lỗi thanh toán:", error);
      toast.error("Thanh toán không thành công. Vui lòng thử lại."); // Hiển thị thông báo lỗi
    }
  };

  const formatCurrencyVND = (amount) => {
    return amount
      .toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })
      .replace("₫", "VND");
  };

  const filteredOrders = orders.filter(
    (order) => selectedStatus === "all" || order.status === selectedStatus
  );

  const handleRefundRequest = async (orderId) => {
    if (!refundReason) {
      toast.error("Vui lòng chọn lý do hoàn tiền");
      return;
    }

    try {
      const response = await axios.post(
        "https://back-end-42ja.onrender.com/orders/request-refund",
        { orderId, refundReason }
      );
      toast.success("Yêu cầu hoàn tiền đã được gửi thành công");
      setModalIsOpen(false);
    } catch (error) {
      toast.error("Lỗi khi gửi yêu cầu hoàn tiền");
    }
  };

  const handleReceivedConfirmation = async (orderId) => {
    try {
      const response = await fetch(
        `https://back-end-42ja.onrender.com/orders/orders/${orderId}/received`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`, // Đặt token vào header
          },
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Đơn hàng đã được xác nhận là đã nhận hàng."); // Hiển thị thông báo thành công
        // Cập nhật trạng thái đơn hàng trên giao diện nếu cần thiết
      } else {
        toast.error(`Lỗi: ${data.msg}`);
      }
    } catch (error) {
      console.error("Error confirming received order:", error);
      toast.error("Đã xảy ra lỗi khi xác nhận đơn hàng.");
    }
  };

  const calculateEstimatedDeliveryDate = (address) => {
    const today = new Date();
    let deliveryDays = 0;

    if (address.includes("Hà Nội") || address.includes("HCM")) {
      deliveryDays = Math.floor(Math.random() * 2) + 1; // Từ 1 đến 2 ngày
    } else {
      deliveryDays = Math.floor(Math.random() * 2) + 2; // Từ 2 đến 3 ngày
    }

    const estimatedDate = new Date(today);
    estimatedDate.setDate(today.getDate() + deliveryDays);

    return estimatedDate.toLocaleDateString("vi-VN"); // Định dạng ngày
  };

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
  };

  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = orders.slice(indexOfFirstOrder, indexOfLastOrder);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  // Mở modal lý do hoàn tiền
  const openRefundModal = () => {
    setRefundModalIsOpen(true);
  };

  // Đóng modal lý do hoàn tiền
  const closeRefundModal = () => {
    setRefundModalIsOpen(false);
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <ClipLoader size={50} color={"#3498db"} loading={loading} />
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>{error}</div>
    );
  }

  return (
    <>
      <div className="main-container-117">
        <Header
          isAuthenticated={isAuthenticated}
          user={user}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
        />
        <div className="flex-row-cb-117">
          <UserMenu
            toggleDropdown={toggleDropdown}
            isDropdownOpen={isDropdownOpen}
          />
          <div onClick={() => handleStatusClick("chưa giải quyết")}>
            <div className="ellipse-c-117" />
            <span className="pending-117">chưa giải quyết</span>
            <div className="vector-19-117" />
          </div>
          <div className="ellipse-d-117" />
          <div onClick={() => handleStatusClick("trả trước")}>
            <span className="unpaid-117">Đã trả trước</span>
            <div className="ellipse-e-117" />
          </div>
          <div onClick={() => handleStatusClick("đang vận chuyển")}>
            <div className="ellipse-10-117" />
            <span className="shipped-117">Đang vận chuyển</span>
          </div>
          <div className="ellipse-f-117" />

          <div className="ellipse-11-117" />
          <div onClick={() => handleStatusClick("hoàn thành")}>
            <div className="ellipse-12-117" />
            <span className="waiting-for-goods-117">Đơn đã hoàn thành</span>
          </div>

          <div className="ellipse-13-117" />
          <div className="ellipse-14-117" />
          <div className="ellipse-15-117" />
          <span className="number-4-16-117">{statusCounts.pending}</span>
          <span className="number-0-117">{statusCounts.paid}</span>
          <span className="zero-117">{statusCounts.shipped}</span>
          <span className="zero-17-117">{statusCounts.completed}</span>
          <span className="zero-18-117">0</span>

          <div className="vector-1a-117" />
          <div className="vector-1b-117" />
          <div className="vector-1c-117" />
          <div className="vector-1d-117" />
          {/* <div className="line-1177" /> */}
          {/* <div className="line-1e-117" /> */}
          {/* <div className="line-1f-117" /> */}
          {/* <div className="line-20-117" /> */}

          <span className="evaluate-117">Đánh giá</span>
          <div className="rectangle-21-117">
            <div className="orders-container">
              {currentOrders.length === 0 ? (
                <div>Không tìm thấy đơn hàng nào</div>
              ) : (
                filteredOrders.map((order) => (
                  <div className="order-item-117" key={order._id}>
                    <div className="order-header-117">
                      <span className="oder-code-117">Sản phẩm</span>
                      <span className="price-117">Giá</span>
                      <span className="oder-placed-at-117">
                        đơn hàng được đặt tại
                      </span>
                      <span className="status-117">trạng thái</span>
                      <span className="action-117">chức năng</span>
                    </div>
                    <div className="order-details-117">
                      <div className="gqefp-117">
                        {" "}
                        {order.items.map((item, index) => (
                          <img
                            key={index}
                            src={`https://back-end-42ja.onrender.com/product_images/${item.product._id}/${item.product.image}`}
                            alt={item.product.name}
                            className="product-image"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                            }}
                          />
                        ))}
                      </div>
                      <div className="total-vnd-117">
                        {formatCurrencyVND(
                          order.items.reduce(
                            (sum, item) => sum + item.price * item.quantity,
                            0
                          ) + order.shippingFee
                        )}
                      </div>
                      <div className="am-117">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                      <div className="has-odered-117">{order.status}</div>
                      <button
                        className="rectangle-23-117"
                        onClick={() => fetchOrderDetails(order._id)}
                      >
                        <span className="view-117">Xem</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        className="ReactModal__Content-1"
        overlayClassName="ReactModal__Overlay-1"
        contentLabel="Order Details"
      >
        {loadingDetails ? (
          <div>Đang tải thông tin chi tiết đơn hàng...</div>
        ) : (
          orderDetails && (
            <div className="rectangle-117">
              <span className="ordered-117">{orderDetails.status}</span>
              <div className="flex-row-fb-117">
                <button className="nutx" onClick={() => setModalIsOpen(false)}>
                  <div className="group-1-117" />
                </button>
                <div className="regroup-117">
                  <span className="oders-code-117">Mã đơn: &nbsp;</span>
                  <span className="gqefp-118"> {orderDetails._id} |</span>
                  {/* <div className="line-117" /> */}
                </div>
              </div>
              <div className="rectangle-2-117">
                <span className="thank-you-shop-pets-117">
                  cảm ơn bạn đã mua sắm tại PetsStore!
                </span>
                <div className="flex-column-e-117">
                  {/* Nếu phương thức thanh toán là "stripe" và trạng thái là "chưa giải quyết" */}
                  {orderDetails.paymentMethod === "stripe" &&
                  orderDetails.paymentStatus === "chưa giải quyết" ? (
                    <button
                      className="rectangle-3-117"
                      onClick={() => handlePayment(orderDetails._id)}
                    >
                      <span className="cancel-order-117">Thanh Toán</span>
                    </button>
                  ) : orderDetails.status === "chưa giải quyết" ||
                    orderDetails.status === "đang xử lý" ||
                    orderDetails.status ===
                      "đã bàn giao cho đơn vị vận chuyển" ||
                    orderDetails.status === "đang vận chuyển" ? (
                    <button
                      className="rectangle-3-117"
                      onClick={() => openRefundModal()}
                    >
                      <span className="cancel-order-117">Hủy đơn</span>
                    </button>
                  ) : orderDetails.status === "đã giao hàng" ? (
                    <button
                      className="rectangle-3-117"
                      onClick={() =>
                        handleReceivedConfirmation(orderDetails._id)
                      }
                    >
                      <span className="cancel-order-1117">
                        Đã nhận được hàng
                      </span>
                    </button>
                  ) : orderDetails.status === "đã nhận hàng" ? (
                    <button
                      className="rectangle-3-117"
                      onClick={() => openRefundModal()}
                    >
                      <span className="cancel-order-117">Trả hàng</span>
                    </button>
                  ) : null}

                  <div className="rectangle-4-117">
                    <span className="lien-he-117">Liên hệ</span>
                  </div>
                </div>
              </div>
              <div className="order-container">
                <div className="inner-plugin-iframe-117" />
                <div className="line-f-117" />
                <div className="flex-row-d-117">
                  <span className="dia-chi-nhan-hang-117">
                    Địa chỉ Nhận Hàng
                  </span>
                  <div className="regroup-8-117">
                    <span className="oder-placed-117">Đơn đặt lúc:</span>
                    <span className="time-117">
                      {new Date(orderDetails.createdAt).toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex-row-9-117">
                  <div className="line-a-117" />
                </div>
                <div className="line-b-117" />
                <span className="product-117">
                  tên người nhận: {orderDetails.username}
                </span>
                <div className="flex-row-c-117">
                  <div className="regroup-d-117">
                    <span className="update-at-117">cập nhật lúc: </span>
                    <span className="time-e-117">
                      {new Date(orderDetails.updatedAt).toLocaleString()}
                    </span>
                  </div>
                  <span className="phone-number-117">
                    Số điện thoại: {orderDetails.phone}
                  </span>
                  <span className="address-117">{orderDetails.address}</span>
                </div>

                {/* Thời gian giao hàng dự kiến */}
                {orderDetails.status !== "yêu cầu hoàn trả" && (
                  <div className="flex-row-s-117">
                    <div className="delivery-time-estimate">
                      <span className="delivery-time-title">
                        Thời gian giao hàng dự kiến:
                      </span>
                      <span className="delivery-time-value">
                        {orderDetails.address.includes("Hà Nội") ||
                        orderDetails.address.includes("HCM")
                          ? "1-2 ngày "
                          : "2-3 ngày "}
                      </span>
                      <span className="estimated-delivery-date">
                        (Dự kiến giao hàng vào:{" "}
                        {calculateEstimatedDeliveryDate(orderDetails.address)})
                      </span>
                    </div>
                  </div>
                )}
                {orderDetails.status === "yêu cầu hoàn trả" && (
                  <div className="flex-row-s-117">
                    <div className="delivery-time-estimate">
                      <h6>Lý do hoàn trả: {orderDetails.refundReason}</h6>
                    </div>
                  </div>
                )}
                {/* Danh sách sản phẩm */}
                <div className="product-list">
                  {orderDetails.items.map((item) => (
                    <div key={item.product._id} className="product-item">
                      <img
                        src={`https://back-end-42ja.onrender.com/product_images/${item.product._id}/${item.product.image}`}
                        alt={item.product.name}
                        className="product-image"
                      />
                      <div className="product-details">
                        <div className="product-info">
                          <span className="product-name">
                            {item.product.name} x{item.quantity} {item.weight}kg
                          </span>
                          <span className="product-category">
                            Phân loại: {item.product.category_id.Name}
                          </span>
                        </div>
                        <span className="price-119">
                          {formatCurrencyVND(item.price)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Các phần tóm tắt */}
                <div className="summary-table">
                  <table>
                    <tbody>
                      <tr>
                        <td className="empty"></td> <td className="empty"></td>{" "}
                        {/* Ô trống để căn bảng sang bên phải */}
                        <td className="label">Tổng tiền hàng</td>
                        <td className="value">
                          {formatCurrencyVND(
                            orderDetails.items.reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            )
                          )}
                        </td>
                      </tr>

                      <tr>
                        <td className="empty"></td> <td className="empty"></td>
                        <td className="label">Phí vận chuyển</td>
                        <td className="value">
                          {formatCurrencyVND(orderDetails.shippingFee)}
                        </td>
                      </tr>

                      <tr>
                        <td className="empty"></td>
                        <td className="empty"></td>{" "}
                        <td className="label">Thành tiền</td>
                        <td className="value">
                          {formatCurrencyVND(
                            orderDetails.items.reduce(
                              (sum, item) => sum + item.price * item.quantity,
                              0
                            ) + orderDetails.shippingFee
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="empty"></td>
                        <td className="empty"></td>{" "}
                        <td className="label">Phương thức thanh toán</td>
                        <td className="value">{orderDetails.paymentMethod}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )
        )}
      </Modal>

      <Modal
        isOpen={refundModalIsOpen}
        onRequestClose={closeRefundModal}
        className="ReactModal__Content-2"
        overlayClassName="ReactModal__Overlay-2"
        contentLabel="Refund Reason"
      >
        <div className="modal-content-1000">
          <h2>Chọn lý do hủy đơn</h2>
          <select
            value={refundReason}
            onChange={(e) => setRefundReason(e.target.value)}
            className="refund-select-1000"
          >
            <option value="">-- Chọn một lý do --</option>
            <option value="Khác với mô tả">Khác với mô tả</option>
            <option value="Muốn mua sản phẩm khác">
              Muốn mua sản phẩm khác
            </option>
            <option value="Chất lượng sản phẩm không tốt">
              Chất lượng sản phẩm không tốt
            </option>
            <option value="Khác">Khác</option>
          </select>
          <div className="modal-buttons-1000">
            <button
              className="btn btn-danger"
              onClick={() => handleRefundRequest(orderDetails._id)}
            >
              Xác nhận yêu cầu hủy đơn
            </button>
            <button className="btn btn-secondary" onClick={closeRefundModal}>
              Đóng
            </button>
          </div>
        </div>
      </Modal>

      <ToastContainer />
    </>
  );
};

export default Orders;

//  <h2>Order Details</h2>
// {loadingDetails ? (
//   <div>Loading order details...</div>
// ) : (
//   orderDetails && (
//     <div>
//       <p>
// Total:{" "}
// {formatCurrencyVND(
//   orderDetails.items.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   ) + orderDetails.shippingFee
// )}
//       </p>
//       <p>
//         Shipping Fee:{" "}
// {new Intl.NumberFormat("vi-VN", {
//   style: "currency",
//   currency: "VND",
// }).format(orderDetails.shippingFee)}
//       </p>
//       <p>Status: {orderDetails.status}</p>
//       <p>Payment Method: {orderDetails.paymentMethod}</p>
//       <p>Email: {orderDetails.email}</p>
//       <p>Address: {orderDetails.address}</p>
//       <p>
//         Order Date: {new Date(orderDetails.createdAt).toLocaleString()}
//       </p>
//       <ul>
//         {orderDetails.items.map((item) => (
//           <li key={item._id}>
//             <p>Product: {item.product.name}</p>
//             <p>Quantity: {item.quantity}</p>
//             <p>Price: {formatCurrencyVND(item.price)}</p>
//             {item.product.image && (
//               <div>
// <img
//   src={`https://back-end-42ja.onrender.com/product_images/${item.product._id}/${item.product.image}`}
//   alt={item.product.name}
//   style={{
//     width: "100px",
//     height: "100px",
//     margin: "5px",
//   }}
// />
//               </div>
//             )}
//           </li>
//         ))}
//       </ul>

// {orderDetails.paymentMethod === "stripe" &&
//   orderDetails.status === "chưa giải quyết" && (
//     <button onClick={() => handlePayment(orderDetails._id)}>
//       Pay Now
//     </button>
//   )}

// {orderDetails.status && (
//   <button
//     className="btn btn-danger"
//     onClick={() => openRefundModal()}
//   >
//     Request Refund
//   </button>
// )}

//       <button onClick={() => setModalIsOpen(false)}>Close</button>
//     </div>
//   )
// )}
