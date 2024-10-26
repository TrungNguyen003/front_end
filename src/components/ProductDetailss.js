import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import Header from "./layout/Header";
import { useCart } from "./layout/CartContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "./styles/productdetail.css";
import { ClipLoader } from "react-spinners";
const ProductDetails = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [productName, setProductName] = useState("");
  const [randomProducts, setRandomProducts] = useState([]);
  const { updateCartCount } = useCart();
  const navigate = useNavigate();

  const [selectedWeight, setSelectedWeight] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0); // Đặt giá mặc định

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `https://back-end-42ja.onrender.com/product/${id}`
        );
        console.log("Dữ liệu sản phẩm:", response.data.product); // Kiểm tra dữ liệu
        setProduct(response.data.product);
        setProductName(response.data.product.name);

        // Đặt cân nặng và giá mặc định từ dữ liệu đầu tiên
        if (response.data.product.prices_by_weight.length > 0) {
          const firstWeight = response.data.product.prices_by_weight[0].weight;
          const firstPrice = response.data.product.prices_by_weight[0].price;
          setSelectedWeight(firstWeight);
          setCurrentPrice(firstPrice);
        } else {
          setCurrentPrice(response.data.product.price); // Đặt giá mặc định nếu không có giá theo cân nặng
        }
      } catch (error) {
        console.error("Lỗi khi lấy chi tiết sản phẩm:", error);
        toast.error("Không thể lấy thông tin sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  useEffect(() => {
    const fetchRandomProducts = async () => {
      try {
        const response = await axios.get(
          "https://back-end-42ja.onrender.com/products/random"
        );
        setRandomProducts(response.data.products);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm ngẫu nhiên:", error);
        toast.error("Không thể lấy sản phẩm ngẫu nhiên.");
      }
    };

    fetchRandomProducts();
  }, []);

  const handleAddToCart = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      if (!authToken) {
        toast.error("Bạn cần đăng nhập trước");
        return;
      }

      const res = await axios.post(
        "https://back-end-42ja.onrender.com/cart/add",
        { productId: product._id, quantity, selectedWeight },
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
          withCredentials: true,
        }
      );

      const cartCount = res.data.items.reduce(
        (total, item) => total + item.quantity,
        0
      );

      toast.success(`${productName} đã được thêm vào giỏ hàng!`);
      updateCartCount(cartCount);
      console.log("Đã thêm vào giỏ hàng:", res.data);
    } catch (err) {
      console.error("Lỗi khi thêm vào giỏ hàng:", err);
      if (err.response) {
        toast.error(err.response.data.msg);
      } else {
        toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
      }
    }
  };

  const handleBuyNow = async () => {
    try {
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        toast.error("Bạn cần đăng nhập trước");
        return;
      }
      await handleAddToCart(); // Add product to cart

      const selectedProduct = {
        _id: product._id,
        product: product, // Ensure this is the correct product object
        quantity,
        price: currentPrice, // Use currentPrice instead of product.price
        weight: selectedWeight, // Include the selected weight
        images: product.images || [],
      };
      console.log("Đã lấy: ", selectedProduct);
      // Navigate to the checkout page, passing the selected product(s) in state
      navigate("/checkoutnow", {
        state: {
          selectedProducts: [selectedProduct], // Pass as an array
        },
      });
    } catch (err) {
      console.error("Error during Buy Now:", err);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <ClipLoader size={50} color={"#3498db"} loading={loading} />
      </div>
    );
  }

  if (!product) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Không tìm thấy sản phẩm.</div>;
  }

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <div className="main-container-111">
        <div className="flex-column-aa-111">
          <div className="rectangle-7-111">
            {/* <span className="custom-page-111"></span> */}
            <span className="home-111"><Link to="/">Trang chủ/ </Link> {product.name}</span>
          </div>
          <div className="rectangle-8-111">
            <div className="flex-column-e-111">
              <div className="pets-store-9-111">
                <span className="pets-a-111">Pets</span>
                <span className="store-b-111">Store</span>
              </div>
              <button className="rectangle-c-111">
                <span className="chat-now-111">chat ngay</span>
              </button>
            </div>
            <span className="contact-phone-number-111">
              Số điện thoại liên lạc: 0336343299
            </span>
          </div>
          <div className="rectangle-d-111"></div>
          <span className="product-description-111">Mô tả sản phẩm</span>
          <span className="wanpy-happy-100-pate-for-dogs-can-375g-111">
            <span
              className=""
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </span>
          <span className="other-products-111">sản phẩm khác</span>
          <div className="frame-111">
            {randomProducts.map((randomProduct) => (
              <div key={randomProduct._id} className="group-111">
                <span className="product-111">
                  {randomProduct.name.length > 25
                    ? randomProduct.name.substring(0, 20) + "..."
                    : randomProduct.name}
                </span>
                <span className="this-is-product-1-111">
                  {randomProduct.title}
                </span>
                <div className="line-111"></div>
                <div
                  className="rectangle-e-111"
                  style={{
                    backgroundImage: `url(https://back-end-42ja.onrender.com/product_images/${randomProduct._id}/${randomProduct.image})`,
                  }}
                  onClick={() =>
                    (window.location.href = `/product/${randomProduct._id}`)
                  }
                ></div>
                {randomProduct.isNew && <span className="new-111">New</span>}
                <span className="span-111">
                  {" "}
                  {randomProduct.price
                    .toLocaleString("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    })
                    .replace("₫", "VND")}
                </span>
                <div className="shopping-cart-checkout-111">
                  <div className="shopping-cart-checkout-15-111"></div>
                </div>
                <span className="span-16-111">Xem thêm</span>
              </div>
            ))}
          </div>
          <button className="rectangle-a7-111">
            <span className="see-more-111">xem thêm</span>
          </button>
          <div className="rectangle-a8-111">
            <div className="flex-row-ba-111">
              {product.image && (
                <img
                  src={`https://back-end-42ja.onrender.com/product_images/${product._id}/${product.image}`}
                  alt={product.title}
                  className="rectangle-a9-111"
                  onClick={() => {
                    setPhotoIndex(0);
                    setIsOpen(true);
                  }}
                />
              )}
              <span className="canned-pate-111">{product.name}</span>
              <div className="material-symbols-star-111">
                <div className="vector-aa-111"></div>
              </div>
              <div className="material-symbols-star-ab-111">
                <div className="vector-ac-111"></div>
              </div>
              <div className="material-symbols-star-ad-111">
                <div className="vector-ae-111"></div>
              </div>
              <div className="material-symbols-star-af-111">
                <div className="vector-b0-111"></div>
              </div>
              <div className="material-symbols-star-b1-111">
                <div className="vector-b2-111"></div>
              </div>
              <span className="price-18-111">
                {new Intl.NumberFormat("vi-VN", {
                  style: "currency",
                  currency: "VND",
                })
                  .format(currentPrice)
                  .replace("₫", "VND")}
              </span>
              <span className="shipping-address-111">Địa chỉ giao hàng</span>
              <span className="shipping-address-b4-111">
                {isAuthenticated && user ? (
                  user.address ? (
                    <p>{user.address}</p>
                  ) : (
                    <p>Chưa có địa chỉ</p>
                  )
                ) : null}
              </span>
              {/* <div className="vector-b5-111"></div> */}
              <span className="delivery-method-111">Cân nặng</span>

              <span className="rectangle-b6-111">
                <select
                  className="custom-select"
                  value={selectedWeight || ""}
                  onChange={(e) => {
                    const weight = e.target.value;
                    const selectedItem = product.prices_by_weight.find(
                      (item) => item.weight === Number(weight)
                    );
                    setSelectedWeight(Number(weight));
                    setCurrentPrice(
                      selectedItem ? selectedItem.price : product.price
                    );
                  }}
                >
                  <option value="" disabled>
                    Chọn cân nặng
                  </option>
                  {product.prices_by_weight.map((item, index) => (
                    <option key={index} value={item.weight}>
                      {item.weight} kg
                    </option>
                  ))}
                </select>
              </span>

              <div className="rectangle-b7-111">
                <span className="">
                  {" "}
                  Danh mục:{" "}
                  {product.category_id
                    ? product.category_id.Name
                    : "Không có danh mục"}{" "}
                </span>
              </div>
              {/* <button className="rectangle-ba-111">
                <div className="package-111"></div>
                <span className="normal-111">kg</span>
              </button> */}
            </div>
            <div className="flex-row-fe-111">
              <div className="rectangle-bb-111">
                <button
                  className="minus-111"
                  onClick={() =>
                    setQuantity((prevQuantity) => Math.max(prevQuantity - 1, 1))
                  }
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="quantity-input-111"
                />
                <button
                  className="plus-111"
                  onClick={() =>
                    setQuantity((prevQuantity) => prevQuantity + 1)
                  }
                >
                  +
                </button>
              </div>
              <span className="quantity-bc-111">Số lượng</span>
              <div className="frame-bd-111">
                <div style={{ display: "flex", flexWrap: "wrap" }}>
                  {product.galleryImages.length > 0 ? (
                    product.galleryImages.map((image, index) => (
                      <img
                        key={index}
                        src={`https://back-end-42ja.onrender.com/product_images/${product._id}/gallery/${image}`}
                        alt=""
                        style={{
                          height: "100px",
                          margin: "10px",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          setPhotoIndex(index + 1);
                          setIsOpen(true);
                        }}
                      />
                    ))
                  ) : (
                    <p>Không có hình ảnh trong thư viện</p>
                  )}
                </div>
              </div>
              <button className="rectangle-c2-111" onClick={handleAddToCart}>
                <div className="shopping-cart-111"></div>
                <span className="add-to-cart-c3-111">Thêm vào giỏ</span>
              </button>
              <button className="rectangle-c4-111" onClick={handleBuyNow}>
                <span className="buy-now-111">Mua ngay</span>
              </button>
            </div>
          </div>
          <div className="rectangle-c5-111"></div>
        </div>
        <div className="rectangle-c6-111">
          <span className="ingredients-111"></span>
        </div>
      </div>
      {isOpen && (
        <Lightbox
          mainSrc={
            photoIndex === 0
              ? `https://back-end-42ja.onrender.com/product_images/${product._id}/${product.image}`
              : `https://back-end-42ja.onrender.com/product_images/${product._id}/gallery/${
                  product.galleryImages[photoIndex - 1]
                }`
          }
          nextSrc={
            photoIndex === 0
              ? `https://back-end-42ja.onrender.com/product_images/${product._id}/gallery/${product.galleryImages[0]}`
              : product.galleryImages[
                  (photoIndex + 1) % product.galleryImages.length
                ]
          }
          prevSrc={
            photoIndex === 0
              ? null
              : product.galleryImages[
                  (photoIndex - 1 + product.galleryImages.length) %
                    product.galleryImages.length
                ]
          }
          onCloseRequest={() => setIsOpen(false)}
          onMovePrevRequest={() =>
            setPhotoIndex(
              (photoIndex - 1 + product.galleryImages.length) %
                product.galleryImages.length
            )
          }
          onMoveNextRequest={() =>
            setPhotoIndex((photoIndex + 1) % product.galleryImages.length)
          }
        />
      )}
      <ToastContainer />
    </>
  );
};

export default ProductDetails;

// {/* <h2>Chi tiết sản phẩm</h2>
// <h2>{product.name}</h2>
// {product.image && (
//   <img
//     src={`https://back-end-42ja.onrender.com/product_images/${product._id}/${product.image}`}
//     alt={product.title}
//     className="product-image"
//     onClick={() => {
//       setPhotoIndex(0);
//       setIsOpen(true);
//     }}
//   />
// )}
// <h3>{product.title}</h3>
// <p>
//   Mô tả:{" "}
//   <span
//     className=""
//     dangerouslySetInnerHTML={{ __html: product.description }}
//   />
// </p>

// {product.prices_by_weight.length > 0 && (
//   <div>
//     <h3>Giá theo cân nặng</h3>
// <select
//   value={selectedWeight || ""}
//   onChange={(e) => {
//     const weight = e.target.value;
//     const selectedItem = product.prices_by_weight.find(
//       (item) => item.weight === Number(weight)
//     );
//     setSelectedWeight(Number(weight));
//     setCurrentPrice(
//       selectedItem ? selectedItem.price : product.price
//     ); // Cập nhật giá dựa trên lựa chọn
//   }}
// >
//   <option value="" disabled>
//     Chọn cân nặng
//   </option>
//   {product.prices_by_weight.map((item, index) => (
//     <option key={index} value={item.weight}>
//       {item.weight} kg
//     </option>
//   ))}
// </select>
//     <p>
//       Giá:{" "}
//       {new Intl.NumberFormat("vi-VN", {
//         style: "currency",
//         currency: "VND",
//       }).format(currentPrice)}
//     </p>
//   </div>
// )}

// {isAuthenticated && user && user.address && (
//   <div>
//     <h3>Địa chỉ giao hàng của bạn</h3>
//     <p>{user.address}</p>
//   </div>
// )}
// <p>
//   {" "}
// Danh mục:{" "}
// {product.category_id ? product.category_id.Name : "Không có danh mục"}
// </p>

// <h3>Thư viện hình ảnh sản phẩm</h3>
// {/* Hiển thị hình ảnh trong thư viện */}
// <div style={{ display: "flex", flexWrap: "wrap" }}>
//   {product.galleryImages.length > 0 ? (
//     product.galleryImages.map((image, index) => (
//       <img
//         key={index}
//         src={`https://back-end-42ja.onrender.com/product_images/${product._id}/gallery/${image}`}
//         alt=""
//         style={{ height: "200px", margin: "10px", cursor: "pointer" }}
//         onClick={() => {
//           setPhotoIndex(index + 1);
//           setIsOpen(true);
//         }}
//       />
//     ))
//   ) : (
//     <p>Không có hình ảnh trong thư viện</p>
//   )}
// </div>

// <div>
//   <label>Số lượng:</label>
//   <input
//     type="number"
//     min="1"
//     value={quantity}
//     onChange={(e) => setQuantity(Number(e.target.value))}
//   />
//   <button onClick={handleAddToCart}>Thêm vào giỏ hàng</button>
//   <button onClick={handleBuyNow}>Mua ngay</button>
// </div>

// {/* Hiển thị Lightbox */}
// {isOpen && (
//   <Lightbox
//     mainSrc={
//       photoIndex === 0
//         ? `https://back-end-42ja.onrender.com/product_images/${product._id}/${product.image}`
//         : `https://back-end-42ja.onrender.com/product_images/${
//             product._id
//           }/gallery/${product.galleryImages[photoIndex - 1]}`
//     }
//     nextSrc={
//       photoIndex === 0
//         ? `https://back-end-42ja.onrender.com/product_images/${product._id}/gallery/${product.galleryImages[0]}`
//         : product.galleryImages[
//             (photoIndex + 1) % product.galleryImages.length
//           ]
//         ? `https://back-end-42ja.onrender.com/product_images/${
//             product._id
//           }/gallery/${
//             product.galleryImages[
//               photoIndex % product.galleryImages.length
//             ]
//           }`
//         : null
//     }
//     prevSrc={
//       photoIndex === 0
//         ? null
//         : product.galleryImages[
//             (photoIndex - 1 + product.galleryImages.length) %
//               product.galleryImages.length
//           ]
//         ? `https://back-end-42ja.onrender.com/product_images/${
//             product._id
//           }/gallery/${
//             product.galleryImages[
//               (photoIndex - 2 + product.galleryImages.length) %
//                 product.galleryImages.length
//             ]
//           }`
//         : null
//     }
//     onCloseRequest={() => setIsOpen(false)}
//     onMovePrevRequest={() =>
//       setPhotoIndex(
//         (photoIndex - 1 + product.galleryImages.length) %
//           product.galleryImages.length
//       )
//     }
//     onMoveNextRequest={() =>
//       setPhotoIndex((photoIndex + 1) % product.galleryImages.length)
//     }
//   />
// )} */}
