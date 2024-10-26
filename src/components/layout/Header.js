import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import axios from "axios";
import { useCart } from "./CartContext"; // Import context
function Header({ isAuthenticated, user, setIsAuthenticated, setUser }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const { cartCount, updateCartCount } = useCart();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      const res = await axios.get("https://back-end-42ja.onrender.com/users/logout", {
        withCredentials: true,
      });
      if (res.status === 200) {
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
        setIsAuthenticated(false);
        setUser(null);
        navigate("/login");
      }
    } catch (err) {
      console.error("Error during logout:", err);
    }
  };

  const handleSearch = () => {
    navigate(`/search?query=${searchQuery}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchQuery.length > 0) {
        try {
          const res = await axios.get(
            "https://back-end-42ja.onrender.com/categories/suggestions",
            {
              params: { query: searchQuery },
            }
          );
          setSuggestions(res.data);
        } catch (err) {
          console.error("Error fetching category suggestions:", err);
        }
      } else {
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [searchQuery]);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (isAuthenticated && user) {
        try {
          const res = await axios.get(`https://back-end-42ja.onrender.com/cart/${user._id}`);
          updateCartCount(res.data.items.length);
        } catch (err) {
          console.error("Error fetching cart data:", err);
        }
      }
    };

    fetchCartCount();
  }, [isAuthenticated, user]);

  useEffect(() => {
    console.log("cartCount trong Header:", cartCount);
  }, [cartCount]);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <>
    <div className="Main-Header-2">
      <span className="welcome-message">Chào mừng đến với cửa hàng !!!</span>
      <div className="rectangle">
        <div className="logo" />
        <div className="pets-store">
          <Link to="/">
            <span className="pets">Pets</span>
            <span className="store">Store</span>
          </Link>
        </div>
        <div className="rectangle-1">
          <input
            type="text"
            placeholder="Tìm kiếm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown} // Add this line
          />
          <button className="search-button" onClick={handleSearch}>
            <i className="fa fa-search"></i>
          </button>
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion._id}
                  onClick={() => setSearchQuery(suggestion.name)}
                >
                  {suggestion.name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="ellipse" />
        <span className="number">{cartCount}</span>
        <div className="shopping-cart">
          <Link to="/cart">
            <div className="shopping-cart-3"></div>
          </Link>
          {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
        </div>

        <div className="user-profile">
          {isAuthenticated ? (
            <div className="user-dropdown">
              <button onClick={toggleDropdown}>
                {user && (
                  <span>
                    <img src={user.avatar} alt="User Avatar" />
                    {user.username}
                  </span>
                )}
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu-1">
                  <Link to="/orders">Đơn hàng</Link>
                  <Link to="/account">Tài khoản</Link>
                  <Link to="/Spa_Booking">Đặt lịch spa</Link>
                  <Link to="/User_Booking">Lịch sử đặt lịch </Link>
                  <button onClick={handleLogout}>Đăng xuất</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">Đăng nhập</Link>
              <Link to="/register">Đăng ký</Link>
            </>
          )}
        </div>
      </div>

    </div>
    </>
  );
}

export default Header;
