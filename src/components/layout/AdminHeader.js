import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/style_header.css";
import axios from "axios";

function AdminHeader({ isAuthenticated, user, setIsAuthenticated, setUser }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
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

 
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  return (
    <div className="Main-Header-2">
      <span className="welcome-message">Welcome to shop !!!</span>
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
            placeholder="Search by Category"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            <i className="fa fa-search"></i>
          </button>
          {suggestions.length > 0 && (
            <ul className="suggestions">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion._id}
                  onClick={() => setSearchQuery(suggestion.Name)}
                >
                  {suggestion.Name}
                </li>
              ))}
            </ul>
          )}
        </div>
        <span className="category">Category</span>
        <div className="notification-bell">
          <i className="fa-regular fa-bell"></i>
        </div>
        <div className="user-profile">
          {isAuthenticated ? (
            <div className="user-dropdown">
              <button onClick={toggleDropdown}>
                {user && (
                  <span>
                  {user.username}
                  </span>
                )}
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/admin/products/add">Add Product</Link>
                  <Link to="/admin/categories">Category Management</Link>
                  <Link to="/admin/products">Product Management</Link>
                  <Link to="/admin/users">Users Management</Link>
                  <Link to="/admin/orders">Order Management</Link>
                  <Link to="/admin/dashboard">Admin Dashboard</Link>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Register</Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminHeader;
