import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Header from "./layout/Header";
import { toast, ToastContainer } from "react-toastify";
import { ClipLoader } from "react-spinners";
import "react-toastify/dist/ReactToastify.css";
import "./styles/checkout.css";

const Checkout = ({ isAuthenticated, user, setIsAuthenticated, setUser }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkoutStatus, setCheckoutStatus] = useState(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Online");
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("GHN");
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");

  const userId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  const location = useLocation();
  const selectedProducts = location.state?.selectedProducts || [];
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchCartAndUser = async () => {
      if (!userId || !authToken) {
        toast.error("User ID or auth token is missing");
        setLoading(false);
        return;
      }
      try {
        const userResponse = await axios.get(
          `http://localhost:10000/users/${userId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setAddress(userResponse.data.address || "");
        setPhone(userResponse.data.phone || "");
      } catch (error) {
        toast.error("Error fetching user information");
      } finally {
        setLoading(false);
      }
    };

    fetchCartAndUser();
  }, [userId, authToken]);

  const calculateShippingFee = (shippingMethod, address) => {
    let fee = 0;
    switch (shippingMethod) {
      case "GHN":
        fee = 17000;
        break;
      case "GHTK":
        fee = 20000;
        break;
      default:
        fee = 0;
    }
    if (address.includes("Hà Nội")) {
      fee += 10000;
    }
    return fee;
  };

  const handleCheckout = async () => {
    if (!phone) {
      toast.error("Vui lòng thêm số điện thoại trong trang cá nhân");
      return;
    }

    if (!address) {
      toast.error("Vui lòng thêm địa chỉ giao hàng trong trang cá nhân");
      return;
    }
    if (!Array.isArray(selectedProducts) || selectedProducts.length === 0) {
      toast.error("Invalid product list");
      return;
    }

    try {
      setCheckoutLoading(true);
      let endpoint = "http://localhost:10000/cart/checkout";
      if (selectedPaymentMethod === "COD") {
        endpoint += "/cod";
      } else if (selectedPaymentMethod === "VNPAY") {
        endpoint += "/vnpay";
      } else if (selectedPaymentMethod === "Online") {
        endpoint += "/stripe";
      }

      const response = await axios.post(
        endpoint,
        {
          selectedItems: selectedProducts.map((p) => p._id),
          shippingMethod: selectedShippingMethod,
          shippingFee: shippingFee,
          address: address,
          phone: phone,
        },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );

      if (response.data && response.data.url) {
        if (
          selectedPaymentMethod === "VNPAY" ||
          selectedPaymentMethod === "Online"
        ) {
          window.location.href = response.data.url;
        }
      } else {
        toast.success("Order placed successfully");
        navigate(`/success?orderId=${response.data.orderId}`);
      }
    } catch (error) {
      toast.error("Error placing order");
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <ClipLoader size={50} color={"#3498db"} loading={loading} />
      </div>
    );
  }

  if (selectedProducts.length === 0) {
    return <div>Không có sản phẩm nào để thanh toán</div>;
  }

  const totalPrice = selectedProducts.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shippingFee = calculateShippingFee(selectedShippingMethod, address);
  const totalPriceWithShipping = totalPrice + shippingFee;
  const formattedTotalPriceWithShipping = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  })
    .format(totalPriceWithShipping)
    .replace("₫", "VND");

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <div className="main-container-112">
        <div className="flex-row-dfd-112">
          <span className="check-out-7-112">Thanh toán</span>

          <div className="rectangle-8-112">
            <div className="div-flex-row-112">
              {selectedProducts.map((item) => (
                <div key={item._id} className="product-item-112">
                  <div className="div-rectangle-112">
                    {item.product.image && (
                      <img
                        src={`http://localhost:10000/product_images/${item.product._id}/${item.product.image}`}
                        alt={item.product.name}
                        style={{ width: "100px", height: "100px" }}
                      />
                    )}
                  </div>
                  <span className="span-product-112">
                    {item.product.name.length > 25
                      ? item.product.name.substring(0, 20) + "..."
                      : item.product.name}
                  </span>
                  <div className="div-rectangle-1a-112">
                    <span className="span-one-112">{item.quantity}</span>
                  </div>
                  <span className="span-dollar-1b-112">
                    {" "}
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                      .format(item.price)
                      .replace("₫", "VND")}
                  </span>
                </div>
              ))}
            </div>
            <div className="div-line-112" />

            <span className="span-promo-code-112">
              Bạn có mã khuyến mại không?
            </span>
            <div className="div-flex-row-a-112">
              <div className="div-rectangle-1c-112">
                <span className="span-enter-promo-code-112">
                  nhập mã khuyến mại
                </span>
              </div>
              <button className="button-rectangle-112">
                <span className="span-apply-112">Áp dụng</span>
              </button>
            </div>
            <div className="div-line-1d-112" />
            <span className="span-payment-112">Thanh toán</span>
            <div className="div-flex-row-dc-112">
              <span className="span-subtotal-112">Tổng:</span>
              <span className="span-dollar-1e-112">
                {" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
                  .format(totalPrice)
                  .replace("₫", "VND")}
              </span>
            </div>
            <div className="div-flex-row-fce-112">
              <span className="span-shipping-112">Phí giao hàng: </span>
              <span className="span-dollar-1f-112">
                {" "}
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
                  .format(shippingFee)
                  .replace("₫", "VND")}
              </span>
            </div>
            <div className="div-flex-row-cf-112">
              <span className="tax-112">Thành tiền:</span>
              <span className="dollar-20-112">
                {formattedTotalPriceWithShipping}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="rectangle-21-112"
              disabled={checkoutLoading}
            >
              {checkoutLoading ? (
                <ClipLoader
                  size={20}
                  color={"#ffffff"}
                  loading={checkoutLoading}
                />
              ) : (
                <span className="confirm-order-112">Đặt mua</span>
              )}
            </button>
          </div>
          <span className="checkout-counter-112">
            Quầy thanh toán là nơi bạn trả tiền cho những thứ bạn đang mua
          </span>
          <span className="contract-info-112">Địa chỉ nhận hàng</span>
          <div className="rectangle-22-112">
            <div className="vector-23-112" />
          </div>
          <span className="name-112">Thông tin người dùng</span>
          <span className="micelle-112">{user?.username || "Guest"} {phone} {address || "undefined"}</span>
          <div className="line-112" />
          {/* <div className="rectangle-24-112">
            <div className="inner-plugin-iframe-112">
              <div className="vector-25-112" />
            </div>
          </div> */}
          {/* <div className="rectangle-26-112">
            <div className="vector-27-112" />
          </div>
          <span className="phone-number-112">Số điện thoại</span>
          <span className="email-112">Email</span>
          <span className="plus-28-112">{phone}</span>
          <span className="email-address-112">{user?.gmail || "Guest"}</span>
          <div className="line-29-112" />
          <div className="line-2a-112" /> */}
          {/* <div className="rectangle-2b-112">
            <div className="group-112" />
          </div> */}
          {/* <span className="address-112">Địa chỉ</span>
          <span className="address-info-112">{address || "undefined"}</span>
          <div className="line-2c-112" /> */}
          <span className="delivery-method-112">Đơn vị vận chuyển</span>
          <button
            className={`rectangle-2d-112 ${
              selectedShippingMethod === "GHN" ? "active" : ""
            }`}
            onClick={() => setSelectedShippingMethod("GHN")}
          >
            <div className="local-shipping-112" />
            <span className="same-day-112">Giao nhanh</span>
          </button>

          <button
            className={`rectangle-2e-112 ${
              selectedShippingMethod === "GHTK" ? "active" : ""
            }`}
            onClick={() => setSelectedShippingMethod("GHTK")}
          >
            <div className="box-112">
              <div className="box-2f-112" />
            </div>
            <span className="express-112">Tiết kiệm</span>
          </button>

          <button
            className={`rectangle-31-112 ${
              selectedShippingMethod === "Normal" ? "active" : ""
            }`}
            onClick={() => setSelectedShippingMethod("Normal")}
          >
            <div className="package-112" />
            <span className="normal-112">Bình thường</span>
          </button>
          <span className="payment-method-112">Phương thức thanh toán</span>

          <div
            className={`rectangle-32-112 ${
              selectedPaymentMethod === "Online" ? "active" : ""
            }`}
            onClick={() => setSelectedPaymentMethod("Online")}
          >
            <div className="vector-33-112" />
            <span className="credit-card-112">Credit card</span>
          </div>

          <div
            className={`rectangle-34-112 ${
              selectedPaymentMethod === "COD" ? "active" : ""
            }`}
            onClick={() => setSelectedPaymentMethod("COD")}
          >
            <div className="empty-112" />
            <span className="cod-112">khi nhận hàng</span>
          </div>

          <div
            className={`rectangle-35-112 ${
              selectedPaymentMethod === "VNPAY" ? "active" : ""
            }`}
            onClick={() => setSelectedPaymentMethod("VNPAY")}
          >
            <div className="logo-vnpay-qr-112" />
            <span className="vnpay-112">VNPAY</span>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default Checkout;

{
  /* <div>
<h1>Checkout</h1>
<table>
  <thead>
    <tr>
      <th>Image</th>
      <th>Product</th>
      <th>Quantity</th>
      <th>Price</th>
    </tr>
  </thead>
  <tbody>
    {selectedProducts.map((item) => (
      <tr key={item._id}>
        <td>
          {item.product.image && (
            <img
              src={`http://localhost:10000/product_images/${item.product._id}/${item.product.image}`}
              alt={item.product.name}
              style={{ width: "50px", height: "50px" }}
            />
          )}
        </td>
        <td>{item.product.name}</td>
        <td>{item.quantity}</td>
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
<h2>
  Shipping Fee:{" "}
  {new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(shippingFee)}
</h2>
<h2>
  Total Price (including shipping fee): {formattedTotalPriceWithShipping}
</h2>

<div>
  <h3>Choose Payment Method:</h3>
  <label>
    <input
      type="radio"
      name="paymentMethod"
      value="Online"
      checked={selectedPaymentMethod === "Online"}
      onChange={() => setSelectedPaymentMethod("Online")}
    />
    Online
  </label>
  <label>
    <input
      type="radio"
      name="paymentMethod"
      value="COD"
      checked={selectedPaymentMethod === "COD"}
      onChange={() => setSelectedPaymentMethod("COD")}
    />
    COD
  </label>
  <label>
    <input
      type="radio"
      name="paymentMethod"
      value="VNPAY"
      checked={selectedPaymentMethod === "VNPAY"}
      onChange={() => setSelectedPaymentMethod("VNPAY")}
    />
    VNPAY
  </label>
</div>

<div>
  <h3>Choose Shipping Method:</h3>
  <label>
    <input
      type="radio"
      name="shippingMethod"
      value="GHN"
      checked={selectedShippingMethod === "GHN"}
      onChange={() => setSelectedShippingMethod("GHN")}
    />
    Giao Hàng Nhanh
  </label>
  <label>
    <input
      type="radio"
      name="shippingMethod"
      value="GHTK"
      checked={selectedShippingMethod === "GHTK"}
      onChange={() => setSelectedShippingMethod("GHTK")}
    />
    Giao Hàng Tiết Kiệm
  </label>
</div>

{selectedPaymentMethod && (
  <div>
    <h3>Shipping Information:</h3>
    <label>
      Address:
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        required
        disabled
      />
    </label>
    <label>
      Phone:
      <input
        type="text"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        required
        disabled
      />
    </label>
  </div>
)}

<button onClick={handleCheckout} disabled={checkoutLoading}>
  {checkoutLoading ? "Processing..." : "Place Order"}
</button>
{checkoutStatus && <p>{checkoutStatus}</p>}
</div>
<ToastContainer />  */
}
