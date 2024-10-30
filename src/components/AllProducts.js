import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Header from "./layout/Header"; // Import Header component
import "./styles/style_homepage.css";
import Footer from "./layout/Footer"; // Import Header component
import Navigation from "./layout/Nav_homepage";
import { toast, ToastContainer } from "react-toastify"; // Nhập toast từ react-toastify
import "react-toastify/dist/ReactToastify.css"; // Nhập stylesheet cho Toastify
import { ClipLoader } from "react-spinners"; // Hoặc spinner CSS của bạn

const AllProduct = ({ isAuthenticated, user, setIsAuthenticated, setUser }) => {
  // Khai báo các state để lưu trữ danh sách sản phẩm
  const [newTrendingProducts, setNewTrendingProducts] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [lowestPrices, setLowestPrices] = useState([]);
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const productSectionRef = useRef(null); // Tạo tham chiếu đến phần sản phẩm

  const scrollToProductSection = () => {
    if (productSectionRef.current) {
      productSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };
  
  useEffect(() => {
    // Fetch New & Trending Products
    axios
      .get("https://back-end-42ja.onrender.com/products", {
        params: {
          category_id: "6710a70499ba2d30f429c06a", // ID của danh mục New & Trending
          limit: 5, // Số lượng sản phẩm muốn lấy
        },
        withCredentials: true,
      })
      .then((res) => {
        setLoading(false);
        console.log("New & Trending Products:", res.data);
        setNewTrendingProducts(res.data.products); // Cập nhật state với dữ liệu lấy được
        // toast.success("New & Trending Products fetched successfully!");
      })
      .catch((err) => {
        console.error("Error fetching New & Trending products:", err);
        // toast.error("Failed to fetch New & Trending Products.");
      });

    // Fetch Popular Items
    axios
      .get("https://back-end-42ja.onrender.com/products", {
        params: {
          category_id: "6710b6a24cb6583204dd290a", // ID của danh mục Popular Items
          limit: 5, // Số lượng sản phẩm muốn lấy
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log("Popular Items:", res.data);
        setPopularItems(res.data.products); // Cập nhật state với dữ liệu lấy được
        // toast.success("Popular Items fetched successfully!");
      })
      .catch((err) => {
        console.error("Error fetching Popular Items:", err);
        toast.error("Failed to fetch Popular Items.");
      });

    // Fetch Lowest Prices
    axios
      .get("https://back-end-42ja.onrender.com/products", {
        params: {
          category_id: "6710b6b54cb6583204dd290c", // ID của danh mục Lowest Prices
          limit: 5, // Số lượng sản phẩm muốn lấy
        },
        withCredentials: true,
      })
      .then((res) => {
        console.log("Lowest Prices:", res.data);
        setLowestPrices(res.data.products); // Cập nhật state với dữ liệu lấy được
        // toast.success("Lowest Prices fetched successfully!");
      })
      .catch((err) => {
        console.error("Error fetching Lowest Prices:", err);
        toast.error("Failed to fetch Lowest Prices.");
      });
  }, []); // Chạy useEffect chỉ một lần khi component được mount

 

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />

      <div className="main-container">
      <Navigation/>
        <div className="flex-row-c">
          <div className="image" />
          <div className="image-6" />
          <div className="rectangle-7">
            <span className="up-to">up to</span>
            <span className="pet-favorites">
              Hàng ngàn thứ vật nuôi yêu thích!
            </span>
            <span className="discount">45% oFF</span>
            <div className="line" />
            <div className="rectangle-8">
              <span className="shop-now" onClick={scrollToProductSection}>Mua ngay</span>
            </div>
            <div className="inner-plugin-iframe-9">
              <div className="vector-a" />
            </div>
          </div>
          <div className="rectangle-b">
            <span className="kitty-stuff">
              Đang tìm đồ
              <br />
              cho mèo???
            </span>
            <div className="rectangle-c">
              <div className="inner-plugin-iframe-d">
                <div className="vector-e" />
              </div>
              <span className="shop-here">
                Mua ngay <i class="fa-solid fa-chevron-right"></i>
              </span>
            </div>
          </div>
          <div className="rectangle-f">
            <span className="doggy-stuff">
              Đang tìm đồ
              <br />
              cho chó???
            </span>
            <div className="rectangle-10">
              <span className="shop-here-13">
                Mua ngay <i class="fa-solid fa-chevron-right "></i>{" "}
              </span>
            </div>
          </div>
          <div className="image-14" />
        </div>
        <div className="top-categories">
          <span className="top">Top </span>
          <span className="categories">Thể loại</span>
        </div>
        <div className="flex-row-eee">
          <div className="rectangle-15">
            <div className="pet-food" />
          </div>
          <div className="rectangle-16">
            <div className="image-17" />
          </div>
          <div className="rectangle-18">
            <div className="vector-19" />
          </div>
          <div className="rectangle-1a">
            <div className="image-1b" />
          </div>
          <div className="rectangle-1c">
            <div className="layer">
              <div className="vector-1d" />
            </div>
          </div>
          <div className="rectangle-1e">
            <div className="image-1f" />
          </div>
          <div className="rectangle-20">
            <div className="layer-21" />
          </div>
          <div className="rectangle-22">
            <div className="object" />
          </div>
        </div>
        <div className="flex-row-fcd">
          <Link to="/category/thức ăn cho chó">
            <span className="dog-foods">Đồ ăn cho chó</span>
          </Link>
          <Link to="/category/thức ăn cho mèo">
            <span className="cat-food">Đồ ăn cho mèo</span>
          </Link>
          <Link to="/category/đồ ăn vặt">
            <span className="treats">Đồ ăn vặt</span>
          </Link>
          <Link to="/category/tổ mèo">
            <span className="trees-scratchers">Nhà cây & tổ ngủ </span>
          </Link>
          <Link to="/category/đồ chơi">
            <span className="toys">Đồ chơi</span>
          </Link>
          <Link to="/category/bát">
            <span className="bowls-dishes">Bát & Đĩa</span>
          </Link>
          <Link to="/category/balo">
            <span className="carries">Mang theo</span>
          </Link>
          <Link to="/category/cát">
            <span className="litter-box">Cát vệ sinh</span>
          </Link>
        </div>
        <div className="flex-row" ref={productSectionRef}>
          <div className="new-trending">
            <span className="new" >Mới & </span>
            <span className="trending">Xu hướng</span>
          </div>
          <div className="inner-plugin-iframe-23" />
          <div className="inner-plugin-iframe-24" />
        </div>
        <div className="flex-row-cc">
          {loading ? ( // Kiểm tra trạng thái loading
            <div style={{ marginLeft: "50%", marginTop: "50px" }}>
              <ClipLoader size={50} color={"#3498db"} loading={loading} />
            </div>
          ) : (
            newTrendingProducts.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="product-link"
              >
                <div className="rectangle-25">
                  <div className="rectangle-26">
                    <span className="new-27">New</span>
                  </div>
                  <div
                    className="image-28"
                    style={{
                      backgroundImage: `url(https://back-end-42ja.onrender.com/product_images/${product._id}/${product.image})`,
                    }}
                  />
                  <div className="flex-row-ce">
                    <div className="vector-29" />
                    <div className="vector-2a" />
                    <div className="vector-2b" />
                    <div className="vector-2c" />
                  </div>
                  <span className="product">
                    {product.name.length > 25
                      ? product.name.substring(0, 20) + "..."
                      : product.name}
                  </span>
                  <div className="line-2e" />
                  <div className="flex-row-2f">
                    <span className="price">
                      {product.price
                        .toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                        .replace("₫", "VND")}
                    </span>
                    <div className="shopping-cart-checkout">
                      {/* <div className="shopping-cart-checkout-30" /> */}
                    </div>
                    <span className="add-to-cart">Xem thêm</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="flex-row-fb">
          <div className="popular-items">
            <span className="popular">Các mặt hàng </span>
            <span className="items">phổ biến</span>
          </div>
          <Link to="/category/phổ biến">
            <span className="view-all">Xem thêm</span>
          </Link>
          <div className="vector-b4" />
        </div>
        {/* Popular Items Section */}
        <div className="flex-row-cc">
          {loading ? ( // Kiểm tra trạng thái loading
            <div style={{ marginLeft: "50%", marginTop: "50px" }}>
              <ClipLoader size={50} color={"#3498db"} loading={loading} />
            </div>
          ) : (
            popularItems.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="product-link"
              >
                <div className="rectangle-25">
                  <div className="rectangle-26">
                    <span className="new-27">New</span>
                  </div>
                  <div
                    className="image-28"
                    style={{
                      backgroundImage: `url(https://back-end-42ja.onrender.com/product_images/${product._id}/${product.image})`,
                    }}
                  />
                  <div className="flex-row-ce">
                    {/* Add your additional elements */}
                  </div>
                  <span className="product">
                    {" "}
                    {product.name.length > 25
                      ? product.name.substring(0, 20) + "..."
                      : product.name}
                  </span>
                  <div className="line-2e" />
                  <div className="flex-row-2f">
                    <span className="price">
                      {product.price
                        .toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                        .replace("₫", "VND")}
                    </span>
                    <div className="shopping-cart-checkout">
                      {/* <div className="shopping-cart-checkout-30" /> */}
                    </div>
                    <span className="add-to-cart">Chi tiết</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="flex-row-d-149">
          <div className="lowest-prices">
            <span className="todays">Giá thấp nhất </span>
            <span className="lowest-prices-14a">hôm nay</span>
          </div>
          <Link to="/category/hôm nay">
            <span className="view-all-14b">Xem thêm</span>
          </Link>
          <div className="vector-14c" />
        </div>
        {/* Today’s Lowest Prices Section */}
        <div className="flex-row-cc">
          {loading ? ( // Kiểm tra trạng thái loading
            <div style={{ marginLeft: "50%", marginTop: "50px" }}>
              <ClipLoader size={50} color={"#3498db"} loading={loading} />
            </div>
          ) : (
            lowestPrices.map((product) => (
              <Link
                to={`/product/${product._id}`}
                key={product._id}
                className="product-link"
              >
                <div className="rectangle-25">
                  <div className="rectangle-26">
                    <span className="new-27">New</span>
                  </div>
                  <div
                    className="image-28"
                    style={{
                      backgroundImage: `url(https://back-end-42ja.onrender.com/product_images/${product._id}/${product.image})`,
                    }}
                  />
                  <div className="flex-row-ce">
                    {/* <div className="vector-29" />
                  <div className="vector-2a" />
                  <div className="vector-2b" />
                  <div className="vector-2c" /> */}
                  </div>
                  <span className="product">
                    {" "}
                    {product.name.length > 25
                      ? product.name.substring(0, 20) + "..."
                      : product.name}
                  </span>
                  <div className="line-2e" />
                  <div className="flex-row-2f">
                    <span className="price">
                      {product.price
                        .toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })
                        .replace("₫", "VND")}
                    </span>
                    <div className="shopping-cart-checkout">
                      {/* <div className="shopping-cart-checkout-30" /> */}
                    </div>
                    <span className="add-to-cart">Chi tiết</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
        <div className="flex-row-1dd-1">
          <div className="image-1de" />
          <div className="image-1df" />
          <div className="rectangle-1e0">
            <span className="find-nearest-vet">Tìm bác sĩ thú y gần nhất!</span>
            <div className="rectangle-1e1">
              <div className="inner-plugin-iframe-1e2">
                <div className="vector-1e3" />
              </div>
              <span className="view-list">Danh sách</span>
            </div>
          </div>
          <div className="rectangle-1e4">
            <span className="grooming-team-service">
              Luôn sẵn sàng phục vụ bạn!
            </span>
            <div className="rectangle-1e5">
              <span className="book-now">Đặt ngay</span>
            </div>
            <div className="inner-plugin-iframe-1e6">
              <div className="vector-1e7" />
            </div>
          </div>
          <span className="trusted-vets">
            Bạn đang tìm kiếm
            <br />
            bác sĩ đáng tin cậy?
          </span>
          <span className="dog-haircut">
            Dịch vụ
            <br />
            cắt lông!
          </span>
        </div>
        <div className="top-brands-1">
          <span className="top-brands-1e8">Top </span>
          <span className="brands">Thương hiệu</span>
        </div>
        <div className="flex-row-e-1e9-1">
          <div className="rectangle-1ea" />
          <div className="rectangle-1eb" />
          <div className="rectangle-1ec" />
          <div className="rectangle-1ed" />
          <div className="rectangle-1ee" />
          <div className="rectangle-1ef" />
          <div className="rectangle-1f0" />
          <div className="rectangle-1f1" />
        </div>
        <div className="flex-row-1f2-1">
          <div className="image-1f3" />
          <div className="rectangle-1f4">
            <span className="happy-pet">
              làm thú cưng
              <br />
              của bạn hạnh phúc!!!
            </span>
            <span className="adopt-pet">
              Hãy nhận nuôi một con vật cưng ngay hôm nay!!!
            </span>
            <div className="rectangle-1f5">
              <div className="inner-plugin-iframe-1f6">
                <div className="vector-1f7" />
              </div>
              <span className="contact">Liên hệ</span>
            </div>
          </div>
          <div className="rectangle-1f8">
            <span className="contact-specialist">
              Hãy liên hệ với chuyên gia của chúng tôi!
            </span>
            <div className="rectangle-1f9">
              <div className="inner-plugin-iframe-1fa">
                <div className="vector-1fb" />
              </div>
              <span className="contact-1fc">Liên hệ</span>
            </div>
          </div>
          <div className="image-1fd" />
          <span className="pet-training">
            Thú cưng cần được
            <br />
            Huấn luyện?
          </span>
        </div>
        <div className="recent-articles">
          <span className="recent-articles-1fe">Gần đây </span>
          <span className="articles">Bài viết</span>
        </div>
        <div className="flex-row-c-1ff">
          <div className="rectangle-200">
            <div className="rectangle-201" />
            <span className="dog-training-tips">
              10 mẹo huấn luyện chó cho mọi chú chó
              <br />
              chủ sở hữu nên biết
            </span>
          </div>
          <div className="rectangle-202">
            <div className="rectangle-203" />
            <span className="cat-sleeping">
              làm sao tôi biết được mèo của tôi ngủ quá nhiều?
            </span>
            <div className="rectangle-204">
              <span className="porenting">Chi tiết</span>
            </div>
          </div>
          <div className="rectangle-205">
            <div className="rectangle-206" />
            <span className="importance-portion-control">
              tầm quan trọng của việc kiểm soát khẩu phần ăn <br />
              đối với sức khỏe của mèo
            </span>
            <div className="rectangle-207">
              <span className="parenting">Chi tiết</span>
            </div>
          </div>
          <div className="rectangle-208">
            <span className="parenting-209">Chi tiết</span>
          </div>
        </div>
        <div className="rectangle-20a">
          <div className="image-20b" />
          <div className="flex-column-ec">
            <div className="subscribe-newsletter">
              <span className="subscribe">Subscribe </span>
              <span className="newsletter">
                to our
                <br />
                newsletter
              </span>
            </div>
            <div className="rectangle-20c">
              <div className="rectangle-20d" />
              <div className="vector-20e" />
              <span className="enter-email">Enter your email</span>
            </div>
            <span className="subscribe-20f">Đặt mua</span>
          </div>
        </div>
        <Footer />
      </div>
      <ToastContainer />
    </>
  );
};
export default AllProduct;
{
  /* <div>
<h2>Tất cả sản phẩm</h2>
{Object.keys(groupedProducts).map((categoryId) => (
  <div key={categoryId}>
    <h3>
      Category: {groupedProducts[categoryId][0].category_id.name}
    </h3>
    <ul>
      {groupedProducts[categoryId].map((product) => (
        <li key={product._id}>
          <h3>{product.name}</h3>
          <p>{product.description}</p>
          <p>Giá: {product.price.$numberDecimal} VND</p>
          {product.image && (
            <img
              src={`https://back-end-42ja.onrender.com/product_images/${product._id}/${product.image}`}
              alt={product.name}
              className="product-image"
            />
          )}
          <Link to={`/products/${product._id}`}>Xem chi tiết</Link>
        </li>
      ))}
    </ul>
  </div>
))}
</div> */
}
