import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Header from "./layout/Header";
import "./styles/style_categories.css";
import Footer from "./layout/Footer"; // Import Footer component
import { toast, ToastContainer } from "react-toastify"; // Nhập toast từ react-toastify
import "react-toastify/dist/ReactToastify.css"; // Nhập stylesheet cho Toastify
import { ClipLoader } from "react-spinners";

const CategoryProducts = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const { categoryName } = useParams(); // Lấy category name từ URL params
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1); // Thêm state page
  const [totalPages, setTotalPages] = useState(1); // Theo dõi tổng số trang

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:10000/products/category",
          {
            params: { query: categoryName, page },
          }
        );

        // Chuyển đổi price từ Decimal128 sang số
        const transformedProducts = response.data.products.map((product) => {
          return {
            ...product,
            price: product.price.$numberDecimal
              ? Number(product.price.$numberDecimal)
              : product.price,
          };
        });

        // Nếu là trang đầu tiên, thay thế danh sách sản phẩm, nếu không, nối thêm vào danh sách cũ
        if (page === 1) {
          setProducts(transformedProducts);
        } else {
          setProducts((prevProducts) => [
            ...prevProducts,
            ...transformedProducts,
          ]);
        }

        setTotalPages(response.data.totalPages); // Cập nhật tổng số trang
      } catch (err) {
        toast.error("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, page]);

  const loadMoreProducts = () => {
    if (page < totalPages) {
      setPage((prevPage) => prevPage + 1); // Tăng số trang khi nhấn "See More"
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <ClipLoader size={50} color={"#3498db"} loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (products.length === 0) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Không tìm thấy sản phẩm nào trong danh mục này 😕</div>;
  }

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <div className="main-container-2">
        <span className="shop-for-cat-8">{categoryName}</span>
        <div className="frame-2">
          {products.map((product, index) => (
            <Link key={index} to={`/product/${product._id}`}>
              <div className="group-2">
                <span className="product-2">
                  {product.name.length > 25
                    ? product.name.substring(0, 20) + "..."
                    : product.name}
                </span>
                <div className="line-2" />
                <div className="rectangle-9-2" />
                {/* <button className="rectangle-a-2" /> */}
                {/* <span className="new-2">New</span> */}
                <div
                  className="vn-ro-lwcoliizfkyhf-removebg-preview-2"
                  style={{
                    backgroundImage: `url(http://localhost:10000/product_images/${product._id}/${product.image})`,
                  }}
                />
                <div className="vector-b-2" />
                <div className="vector-c-2" />
                <div className="vector-d-2" />
                <div className="vector-e-2" />
                <div className="vector-f-2" />
                <span className="dollar-2">
                  {product.price
                    ? product.price
                        .toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                        .replace("₫", "VND")
                    : "Giá không xác định"}
                </span>

                <div className="shopping-cart-shopping-cart-checkout-10-2">
                  {/* <div className="shopping-cart-shopping-cart-checkout-11-2" /> */}
                </div>
                <span className="add-to-cart-2">Xem thêm</span>
              </div>
            </Link>
          ))}
        </div>
        {page < totalPages && (
          <button className="button-146" onClick={loadMoreProducts}>
            <span className="see-more">Xem thêm</span>
          </button>
        )}
        <Footer />
      </div>
      <ToastContainer /> {/* Thêm ToastContainer để hiển thị thông báo */}
    </>
  );
};

export default CategoryProducts;
