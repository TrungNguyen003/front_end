import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "./layout/Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";


const CheckoutNow = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [address, setAddress] = useState(user?.address || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("Online");
  const [selectedShippingMethod, setSelectedShippingMethod] = useState("GHN");
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const selectedProducts = location.state?.selectedProducts || [];

  const userId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("authToken");

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

  if (selectedProducts.length === 0) {
    return <div>Không có sản phẩm nào được chọn để thanh toán.</div>;
  }

  const calculateShippingFee = (shippingMethod, address) => {
    let fee = 0;
    switch (shippingMethod) {
      case "GHN":
        fee = 30000;
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
    if (!selectedProducts.length) {
      toast.error("Không có sản phẩm nào được chọn để thanh toán.");
      return;
    }

    if (!phone) {
      toast.error("Vui lòng thêm số điện thoại trong trang cá nhân");
      return;
    }

    if (!address) {
      toast.error("Vui lòng thêm địa chỉ giao hàng trong trang cá nhân");
      return;
    }
  
    try {
      setCheckoutLoading(true);
      const shippingFee = calculateShippingFee(selectedShippingMethod, address);
      const endpoint =
        selectedPaymentMethod === "COD"
          ? "http://localhost:10000/cart/checkout/buynow/cod"
          : selectedPaymentMethod === "VNPAY"
          ? "http://localhost:10000/cart/checkout/vnpay/now"
          : "http://localhost:10000/cart/checkout/buynow/stripe";
  
      // Log the data that will be sent to the server
      const payload = {
        address: address,
        selectedProduct: {
          product: selectedProducts[0].product._id, // Assuming you only want the first product for COD
          quantity: selectedProducts[0].quantity,
          price: selectedProducts[0].price,
          image: selectedProducts[0].product.image,
          weight: selectedProducts[0].weight, // Thêm thông tin cân nặng
        },
        shippingMethod: selectedShippingMethod,
        shippingFee: shippingFee,
      };
  
      console.log("Payload gửi đến server:", payload); // Log the payload
  
      const response = await axios.post(endpoint, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
  
      if (response.data && response.data.url) {
        window.location.href = response.data.url;
      } else {
        toast.success("Đã đặt hàng thành công!");
        navigate(`/success?orderId=${response.data.orderId}`);
      }
    } catch (error) {
      console.error(
        "Lỗi khi đặt hàng:",
        error.response ? error.response.data : error.message
      );
      toast.error("Lỗi khi đặt hàng");
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
          <span className="check-out-7-112">Đặt hàng</span>

          <div className="rectangle-8-112">
            <div className="div-flex-row-112">
              {selectedProducts.map((item) => (
                <div key={item._id} className="product-item">
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
                    {" "}
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
            <span className="span-payment-112">Thanh Toán</span>
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
              <span className="span-shipping-112">Phí ship: </span>
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
          <span className="contract-info-112">thông tin hợp đồng</span>
          <div className="rectangle-22-112">
            <div className="vector-23-112" />
          </div>
          <span className="name-112">Thông tin người dùng</span>
          <span className="micelle-112">{user?.username || "Guest"} ,{phone || "Chưa có số điện thoại"} ,{address || "Chưa có địa chỉ"}</span>
          <div className="line-112" />
          {/* <div className="rectangle-24-112">
            <div className="inner-plugin-iframe-112">
              <div className="vector-25-112" />
            </div>
          </div>
          <div className="rectangle-26-112">
            <div className="vector-27-112" />
          </div>
          <span className="phone-number-112">Số điện thoại</span>
          <span className="email-112">Email</span>
          <span className="plus-28-112">{phone}</span>
          <span className="email-address-112">{user?.gmail || "Guest"}</span>
          <div className="line-29-112" />
          <div className="line-2a-112" />
          <div className="rectangle-2b-112">
            <div className="group-112" />
          </div>
          <span className="address-112">Địa chỉ</span>
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
            <span className="cod-112">Khi nhận hàng</span>
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

export default CheckoutNow;
