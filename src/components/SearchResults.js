import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "./layout/Header";
import "./styles/searchResults.css";
import Footer from "./layout/Footer";
import { Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader"; // Thêm spinner từ react-spinners

// Custom hook để lấy các tham số truy vấn từ URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults({ isAuthenticated, user, setIsAuthenticated, setUser }) {
  const query = useQuery().get("query");
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(false); // State để theo dõi trạng thái tải

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // Bắt đầu tải dữ liệu
      try {
        const res = await axios.get(
          `http://localhost:10000/products/searchh?query=${query}&page=${page}`
        );
        setProducts((prevProducts) => [...prevProducts, ...res.data.products]);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching search results:", err);
      } finally {
        setIsLoading(false); // Hoàn tất tải dữ liệu
      }
    };

    if (query) {
      fetchProducts();
    }
  }, [query, page]);

  const loadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
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
      <div className="main-container-3">
        <span className="shop-for-cat-8-3">Kết quả tìm kiếm cho "{query}"</span>
        {isLoading ? (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <ClipLoader size={50} color={"#3498db"} /> {/* Hiển thị spinner */}
          </div>
        ) : products.length > 0 ? (
          <div className="frame-3">
            {products.map((product, index) => (
              <Link key={index} to={`/product/${product._id}`}>
                <div className="group-3" key={product._id}>
                  <span className="product-3">
                    {product.name.length > 25
                      ? product.name.substring(0, 20) + "..."
                      : product.name}
                  </span>
                  <div className="line-3" />
                  <div className="rectangle-9-3" />
                  <button className="rectangle-a-3" />
                  <span className="new-3">New</span>
                  <div
                    className="vn-ro-lwcoliizfkyhf-removebg-preview-3"
                    style={{
                      backgroundImage: `url(http://localhost:10000/product_images/${product._id}/${product.image})`,
                    }}
                  />
                  <div className="vector-b-3" />
                  <div className="vector-c-3" />
                  <div className="vector-d-3" />
                  <div className="vector-e-3" />
                  <div className="vector-f-3" />
                  <span className="dollar-3">
                    {parseFloat(product.price.$numberDecimal).toLocaleString(
                      "vi-VN",
                      { style: "currency", currency: "VND" }
                    )}
                  </span>
                  <div className="shopping-cart-shopping-cart-checkout-10-3" />
                  <span className="add-to-cart-3">Xem thêm</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="shop-for-cat-8-3">Không tìm thấy sản phẩm nào</p>
        )}
        {page < totalPages && !isLoading && (
          <button className="button-147" onClick={loadMore}>
            <span className="see-more">Xem thêm</span>
          </button>
        )}
        <Footer />
      </div>
    </>
  );
}

export default SearchResults;
