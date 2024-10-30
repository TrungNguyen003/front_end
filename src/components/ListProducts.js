import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import Header from "./layout/Header";
import "./styles/style_categories.css";
import Footer from "./layout/Footer";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ClipLoader } from "react-spinners";

const ListProducts = ({ isAuthenticated, user, setIsAuthenticated, setUser }) => {
  const { categoryName } = useParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // Sử dụng state để quản lý số trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // Sử dụng state để lưu tổng số trang

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:10000/products/all", {
          params: { page, limit: 10 }, // Gửi page và limit tới API
        });

        const transformedProducts = response.data.products.map((product) => ({
          ...product,
          price: product.price.$numberDecimal
            ? Number(product.price.$numberDecimal)
            : product.price,
        }));

        setProducts((prevProducts) =>
          page === 1 ? transformedProducts : [...prevProducts, ...transformedProducts]
        );

        setTotalPages(response.data.totalPages);
      } catch (err) {
        toast.error("Error fetching products");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [categoryName, page]);

  const loadMoreProducts = () => {
    if (page < totalPages) setPage((prevPage) => prevPage + 1); // Tăng page để tải trang tiếp theo
  };

  if (loading && products.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <ClipLoader size={50} color={"#3498db"} loading={loading} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        Không tìm thấy sản phẩm nào trong danh mục này 😕
      </div>
    );
  }

  return (
    <>
      <Header isAuthenticated={isAuthenticated} user={user} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
      <div className="main-container-2">
        <span className="shop-for-cat-8">Có thể bạn sẽ thích 😻</span>
        <div className="frame-2">
          {products.map((product, index) => (
            <Link key={index} to={`/product/${product._id}`}>
              <div className="group-2">
                <span className="product-2">
                  {product.name.length > 25 ? product.name.substring(0, 20) + "..." : product.name}
                </span>
                <div className="line-2" />
                <div className="rectangle-9-2" />
                <div
                  className="vn-ro-lwcoliizfkyhf-removebg-preview-2"
                  style={{
                    backgroundImage: `url(http://localhost:10000/product_images/${product._id}/${product.image})`,
                  }}
                />
                <span className="dollar-2">
                  {product.price
                    ? product.price.toLocaleString("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).replace("₫", "VND")
                    : "Giá không xác định"}
                </span>
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
      <ToastContainer />
    </>
  );
};

export default ListProducts;
