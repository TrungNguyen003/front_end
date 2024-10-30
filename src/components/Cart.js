import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Header from "./layout/Header";
import "./styles/style_cart.css";
import "./assets/images/b8229832-a182-45cf-a63b-e15abc464082.png";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners"; 
import Footer from "./layout/Footer";
const Cart = ({ isAuthenticated, user, setIsAuthenticated, setUser }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [itemLoading, setItemLoading] = useState({});
  const [selectedItems, setSelectedItems] = useState([]);
  const [checkoutLoading, setCheckoutLoading] = useState(false); // State để quản lý trạng thái khi đặt hàng
  const userId = localStorage.getItem("userId");
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchCart = async () => {
      if (!userId || !authToken) {
        console.error("userId hoặc authToken không được định nghĩa");
        setLoading(false);
        return;
      }
      try {
        const response = await axios.get(
          `https://back-end-42ja.onrender.com/cart/${userId}`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        setCart(response.data);
        setSelectedItems(response.data.items.map((item) => item._id));
      } catch (error) {
        toast.error(
          "Lỗi khi lấy giỏ hàng: " +
            (error.response ? error.response.data : error.message)
        );
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [userId, authToken]);

  const handleSelectItem = (itemId) => {
    if (selectedItems.includes(itemId)) {
      setSelectedItems(selectedItems.filter((id) => id !== itemId));
    } else {
      setSelectedItems([...selectedItems, itemId]);
    }
  };

  const updateItemQuantity = async (itemId, quantity) => {
    if (quantity < 1) return;
    setItemLoading((prev) => ({ ...prev, [itemId]: true }));
    try {
      const response = await axios.put(
        `https://back-end-42ja.onrender.com/cart/${userId}/items/${itemId}`,
        { quantity },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setCart(response.data);
      setSelectedItems(response.data.items.map((item) => item._id));
      toast.success("Số lượng sản phẩm đã được cập nhật.");
    } catch (error) {
      toast.error(
        "Lỗi khi cập nhật số lượng sản phẩm: " +
          (error.response ? error.response.data : error.message)
      );
    } finally {
      setItemLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const removeItemFromCart = async (itemId) => {
    setItemLoading((prev) => ({ ...prev, [itemId]: true }));
    try {
      const response = await axios.post(
        "https://back-end-42ja.onrender.com/cart/remove",
        { productId: itemId },
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setCart(response.data);
      toast.success("Sản phẩm đã được xóa khỏi giỏ hàng.");
    } catch (error) {
      toast.error(
        "Lỗi khi xóa sản phẩm khỏi giỏ hàng: " +
          (error.response ? error.response.data : error.message)
      );
    } finally {
      setItemLoading((prev) => ({ ...prev, [itemId]: false }));
    }
  };

  const calculateSelectedTotal = () => {
    return selectedItems.reduce((total, itemId) => {
      const item = cart.items.find((item) => item._id === itemId);
      return total + item.price * item.quantity;
    }, 0);
  };

  const formatCurrency = (amount) => {
    return amount
      .toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
      })
      .replace("₫", "VND");
  };

  const handleCheckout = () => {
    if (selectedItems.length > 0) {
      setCheckoutLoading(true); // Bắt đầu hiển thị spinner
      const selectedProducts = cart.items.filter((item) =>
        selectedItems.includes(item._id)
      );

      // Trì hoãn điều hướng 2 giây để xem spinner
      setTimeout(() => {
        navigate("/checkout", {
          state: {
            selectedProducts,
            total: formatCurrency(calculateSelectedTotal()),
          },
        });
        setCheckoutLoading(false); // Tắt spinner sau khi điều hướng
      }, 2000);
    } else {
      toast.warn("Vui lòng chọn ít nhất một sản phẩm để đặt hàng.");
    }
  };

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />

      {loading && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <ClipLoader size={50} color={"#3498db"} loading={loading} />
        </div>
      )}
      {!loading && cart === null && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          Không tìm thấy giỏ hàng
        </div>
      )}
      {!loading && cart && cart.items.length === 0 && (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          Giỏ hàng trống
        </div>
      )}
      {!loading && cart && cart.totalPrice > 0 && (
        <div className="main-container-1">
          <span className="cart-1">Giỏ Hàng </span>
          <div className="flex-row-fbd">
            <span className="description-1">Tên sản phẩm</span>
            <span className="quantity-1">Số lượng</span>
            <span className="price-1">Giá</span>
          </div>
          {cart.items.map((item) => (
            <div className="rectangle-21a" key={item._id}>
              <input
                type="checkbox"
                checked={selectedItems.includes(item._id)}
                onChange={() => handleSelectItem(item._id)}
              />
              <div className="rectangle-21b">
                {item.product.image && (
                  <img
                    src={`https://back-end-42ja.onrender.com/product_images/${item.product._id}/${item.product.image}`}
                    alt={item.product.name}
                    style={{ width: "120px", height: "120px" }}
                  />
                )}
              </div>
              <div className="flex-column-d-1">
                <span className="product-1">
                  {item.product.name.length > 25
                    ? item.product.name.substring(0, 20) + "..."
                    : item.product.name}
                </span>
              </div>
              <div className="rectangle-a-1">
                <button
                  className="plus"
                  onClick={() =>
                    updateItemQuantity(item._id, item.quantity + 1)
                  }
                  disabled={itemLoading[item._id]}
                >
                  +
                </button>
                <button
                  className="minus"
                  onClick={() =>
                    updateItemQuantity(item._id, item.quantity - 1)
                  }
                  disabled={itemLoading[item._id] || item.quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-b-1">{item.quantity}</span>
              </div>
              <button
                className="vector-c-1"
                onClick={() => removeItemFromCart(item.product._id)}
                disabled={itemLoading[item._id]}
              >
                {itemLoading[item._id] ? "Đang xử lý..." : ""}
              </button>
              <span className="price-d-1">{formatCurrency(item.price)}</span>
            </div>
          ))}

          <div className="flex-row-c-1">
            {/* <span className="price-total">
              
            </span> */}
            <div className="rectangle-2a-1">
              <button
                className="payment"
                onClick={handleCheckout}
                disabled={checkoutLoading}
              >
                {checkoutLoading ? (
                  <ClipLoader size={20} color={"#fff"} />
                ) : (
                  "Đặt hàng"
                )}
              </button>
            </div>
            <span className="total-text-1">
              Tổng: {formatCurrency(calculateSelectedTotal())}
            </span>
          </div>
          <Footer />
        </div>
      )}
      <ToastContainer />
    </>
  );
};

export default Cart;
