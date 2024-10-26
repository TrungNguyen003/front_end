import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Header from "./layout/Header";
import "./styles/searchResults.css";
import Footer from "./layout/Footer";
import { Link } from "react-router-dom";

// Custom hook để lấy các tham số truy vấn từ URL
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SearchResults({ isAuthenticated, user, setIsAuthenticated, setUser }) {
  // Lấy giá trị của tham số 'query' từ URL
  const query = useQuery().get("query");
  const [products, setProducts] = useState([]); // State để lưu trữ danh sách sản phẩm tìm kiếm
  const [page, setPage] = useState(1); // State để theo dõi trang hiện tại
  const [totalPages, setTotalPages] = useState(1); // State để lưu tổng số trang

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          `https://back-end-42ja.onrender.com/products/searchh?query=${query}&page=${page}`
        );
        console.log(res.data.products); // Kiểm tra dữ liệu sản phẩm trả về từ API
        setProducts((prevProducts) => [...prevProducts, ...res.data.products]);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("Error fetching search results:", err);
      }
    };

    if (query) {
      fetchProducts();
    }
  }, [query, page]);
  // Hàm để tải thêm sản phẩm khi người dùng cuộn đến cuối trang
  const loadMore = () => {
    if (page < totalPages) {
      setPage(page + 1); // Tăng số trang hiện tại để tải thêm sản phẩm
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
        {products.length > 0 ? (
          <div className="frame-3">
            {products.map((product, index) => (
              <Link key={index} to={`/product/${product._id}`}>
                <div className="group-3" key={product._id}>
                  <span className="product-3">
                    {" "}
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
                      backgroundImage: `url(https://back-end-42ja.onrender.com/product_images/${product._id}/${product.image})`,
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

                  <div className="shopping-cart-shopping-cart-checkout-10-3">
                    {/* <div className="shopping-cart-shopping-cart-checkout-11-3" /> */}
                  </div>
                  <span className="add-to-cart-3">Xem thêm</span>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="shop-for-cat-8-3">
            Không tìm thấy sản phẩm nào 
          </p>
        )}
        {page < totalPages && (
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
