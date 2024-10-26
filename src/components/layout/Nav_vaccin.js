import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../styles/style_navvaccin.css";

function Navigation({ children }) {
  const [isCatsDropdownOpen, setIsCatsDropdownOpen] = useState(false);
  const [isDogsDropdownOpen, setIsDogsDropdownOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false); // State for services dropdown

  const toggleCatsDropdown = () => {
    setIsCatsDropdownOpen(!isCatsDropdownOpen);
  };

  const toggleDogsDropdown = () => {
    setIsDogsDropdownOpen(!isDogsDropdownOpen);
  };

  const toggleServicesDropdown = () => {
    setIsServicesDropdownOpen(!isServicesDropdownOpen); // Toggle the dropdown state for services
  };

  return (
    <>
      <div className="main-container-13331">
        <div className="rectangle-5-131">
          <div className="rectangle-6-131">
            <span className="phone-number-131">033 63 43 299</span>
            <div className="ep-phone-131" />
            <div className="vector-131" />
          </div>
          <div className="frame-131">
            {/* Dropdown Mua cho mèo */}
            <div className="group-131 dropdown">
              <span className="mua-cho-meo-131" onClick={toggleCatsDropdown}>
                Mua cho mèo{" "}
                <i
                  className={`arrow-131 ${isCatsDropdownOpen ? "up-131" : "down-131"}`}
                ></i>
              </span>
              {/* <div className="vector-7-131" /> */}
              {isCatsDropdownOpen && (
                <div className="dropdown-menu-131">
                  <Link to="/category/CatsFood">Thức ăn cho mèo</Link>
                  <Link to="/category/CatsToys">Đồ chơi cho mèo</Link>
                  <Link to="/category/CatsAccessories">Phụ kiện cho mèo</Link>
                </div>
              )}
            </div>

            {/* Dropdown Mua cho chó */}
            <div className="group-8-131 dropdown">
              <span className="mua-cho-cho-131" onClick={toggleDogsDropdown}>
                Mua cho chó
                <i
                  className={`arrow-131 ${isDogsDropdownOpen ? "up-131" : "down-131"}`}
                ></i>
              </span>
              {isDogsDropdownOpen && (
                <div className="dropdown-menu-131">
                  <Link to="/category/DogsFood">Thức ăn cho chó</Link>
                  <Link to="/category/DogsToys">Đồ chơi cho chó</Link>
                  <Link to="/category/DogsAccessories">Phụ kiện cho chó</Link>
                </div>
              )}
            </div>

            {/* Dropdown Dịch vụ */}
            <div className="group-a-131 dropdown">
              <span className="dich-vu-131" onClick={toggleServicesDropdown}>
                Dịch vụ
                <i
                  className={`arrow-131 ${isServicesDropdownOpen ? "up-131" : "down-131"}`}
                ></i>
              </span>
              {isServicesDropdownOpen && (
                <div className="dropdown-menu-131">
                  <Link to="/services/Grooming">Chăm sóc thú cưng</Link>
                  <Link to="/Dich-vu-thu-y">Dịch vụ thú y</Link>
                  <Link to="/services/Training">Huấn luyện thú cưng</Link>
                </div>
              )}
            </div>

            <span className="thuoc-thu-y-131">Thuốc thú y</span>
            <span className="lien-he-131">Liên hệ</span>
            <span className="blog-131">Blog</span>
          </div>
        </div>
        <main>{children}</main>
      </div>
    </>
  );
}

export default Navigation;