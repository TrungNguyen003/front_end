import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "./styles/editprofile.css";
import "react-toastify/dist/ReactToastify.css";
import UserMenu from "./UserMenu";
const UserAccount = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const [error, setError] = useState("");
  const [avatar, setAvatar] = useState("");
  const [address, setAddress] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [fileInput, setFileInput] = useState(null);
  const [fullAddress, setFullAddress] = useState("");
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState(""); // Địa chỉ cụ thể

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Token not found");
      return;
    }

    axios
      .get("https://back-end-42ja.onrender.com/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setUser(response.data);
        setAvatar(response.data.avatar || "");
        setAddress(response.data.address || "");
        setUsername(response.data.username || "");
        setPhone(response.data.phone || "");
        setSpecificAddress(response.data.specificAddress || ""); // Đặt giá trị mặc định cho địa chỉ cụ thể
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch user data");
      });

    // Fetch provinces
    axios
      .get("https://back-end-42ja.onrender.com/api/provinces")
      .then((response) => {
        setProvinces(response.data);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch provinces");
      });
  }, [setUser]);

  useEffect(() => {
    const provinceName =
      provinces.find((p) => p.province_id === selectedProvince)
        ?.province_name || "";
    const districtName =
      districts.find((d) => d.district_id === selectedDistrict)
        ?.district_name || "";
    const wardName =
      wards.find((w) => w.ward_id === selectedWard)?.ward_name || "";

    // Nối địa chỉ cụ thể vào trước các thành phần còn lại
    setFullAddress(
      `${specificAddress ? specificAddress + ", " : ""}${
        wardName ? wardName + ", " : ""
      }${districtName ? districtName + ", " : ""}${provinceName}`
    );
  }, [
    specificAddress,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    provinces,
    districts,
    wards,
  ]);

  useEffect(() => {
    if (selectedProvince) {
      axios
        .get(
          `https://back-end-42ja.onrender.com/api/provinces/${selectedProvince}/districts`
        )
        .then((response) => {
          setDistricts(response.data);
          setWards([]); // Clear wards if province changes
        })
        .catch((err) => {
          console.error(err);
          setError("Không thể lấy được các quận");
        });
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`https://back-end-42ja.onrender.com/api/districts/${selectedDistrict}/wards`)
        .then((response) => {
          setWards(response.data);
        })
        .catch((err) => {
          console.error(err);
          setError("Không thể lấy được phường");
        });
    } else {
      setWards([]);
    }
  }, [selectedDistrict]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = (file) => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Token not found");
      return;
    }

    axios
      .post(
        "https://back-end-42ja.onrender.com/users/upload-avatar",
        { avatar },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        setUser((prevUser) => ({ ...prevUser, avatar: response.data.avatar }));
      })
      .catch((err) => {
        console.error(err);
        setError("Không tải được ảnh đại diện");
      });
  };

  const handleUpdateProfile = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      toast.error("Token not found");
      return Promise.reject(new Error("Token not found"));
    }

    const updates = [];

    // Kiểm tra và cập nhật username
    if (username !== user.username && username) {
      updates.push(
        axios.post(
          "https://back-end-42ja.onrender.com/users/update-username",
          { username },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );
    }

    // Kiểm tra và cập nhật địa chỉ
    if (fullAddress !== user.address && fullAddress) {
      updates.push(
        axios.post(
          "https://back-end-42ja.onrender.com/users/update-address",
          { address: fullAddress },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );
    }

    // Kiểm tra và cập nhật số điện thoại
    if (phone !== user.phone && phone) {
      updates.push(
        axios.post(
          "https://back-end-42ja.onrender.com/users/update-phone",
          { phone },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );
    }

    if (updates.length === 0) {
      return Promise.resolve();
    }

    return Promise.all(updates)
      .then((responses) => {
        const updatedUser = { ...user };

        responses.forEach((response) => {
          if (response.config.url.includes("update-username")) {
            updatedUser.username = response.data.username;
          } else if (response.config.url.includes("update-address")) {
            updatedUser.address = response.data.address;
          } else if (response.config.url.includes("update-phone")) {
            updatedUser.phone = response.data.phone;
          }
        });

        setUser(updatedUser);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Cập nhật thất bại");
        throw err;
      });
  };

  const handleProfileUpdateClick = () => {
    handleUpdateProfile()
      .then(() => {
        toast.success("Đã cập nhật hồ sơ thành công!");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Lỗi khi cập nhật hồ sơ");
      });
  };

  const handleAvatarClick = () => {
    document.getElementById("fileInput").click();
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prev) => !prev);
  };

  if (error) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Error: {error}</div>;
  }

  if (!user) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>Loading...</div>;
  }

  return (
    <>
      <div className="main-container-6">
        <Header
          isAuthenticated={isAuthenticated}
          user={user}
          setIsAuthenticated={setIsAuthenticated}
          setUser={setUser}
        />

        {/* <div className="frame-6">
          <div className="flex-row-6">
            <div className="rectangle-7-6" />
            <span className="home-6">Home /</span>
            <span className="customer-page-6">customer page</span>
          </div>
          <div className="flex-row-af-6" onClick={toggleDropdown}>
            <div className="vector-8-6" />
            <span className="my-account-6">my account</span>
            <div className={`arrow ${isDropdownOpen ? "up" : "down"}`} />
          </div>
          {isDropdownOpen && (
            <div className="dropdown-menu-6">
              <span className="file-6">file</span>
              <span className="address-6">Address</span>
              <span className="change-password-6">change password</span>
            </div>
          )}
          <div className="flex-row-ad-6">
            <div className="group-6" />
            <Link to="/orders"> <span className="purchase-order-6">purchase order</span></Link>
          </div>
          <div className="flex-row-aab-6">
            <div className="vector-9-6" />
            <span className="notification-6">Notification</span>
          </div>
        </div> */}
        <UserMenu
          toggleDropdown={toggleDropdown}
          isDropdownOpen={isDropdownOpen}
        />
        <span className="my-profile-6">Hồ sơ của tôi</span>
        <span className="manage-profile-information-6">
          Quản lý thông tin hồ sơ để giữ an toàn cho tài khoản của bạn
        </span>
        <div className="rectangle-a-6">
          <div className="rectangle-b-6" />
        </div>
        <div className="rectangle-c-6">
          <span className="username-micelle-amoid-6">
            Username: Micelle Amoid{" "}
          </span>
          <span className="name-6">Tên</span>
          <div className="flex-row-d-6">
            <div
              className="ellipse-e-6"
              onClick={handleAvatarClick}
              style={{ cursor: "pointer" }}
            >
              {avatar ? (
                <img
                  src={avatar}
                  alt="User Avatar"
                  // style={{ width: 100, height: 100, borderRadius: "50%" }}
                />
              ) : (
                <div
                  style={{
                    width: 100,
                    height: 100,
                    borderRadius: "50%",
                    backgroundColor: "#ccc",
                  }}
                >
                  Nhấp để thêm hình đại diện
                </div>
              )}
            </div>

            <div className="">
              <input
                className="rectangle-f-6"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Update username"
              />
            </div>
            <span className="email-6">email</span>
            <div className="">
              <input
                className="rectangle-10-6"
                type="text"
                value={user.gmail}
                placeholder="Unable to update email"
                disabled
              />
            </div>
            <span className="country-of-region-6">Địa chỉ</span>
          </div>
          <div className="">
            <input
              className="rectangle-11-6"
              type="text"
              value={user.address}
              placeholder="Address"
              readOnly
            />
          </div>
          <div className="flex-row-ab-6">
            <button className="rectangle-12-6" onClick={handleUpload}>
              <span className="upload_avt">Tải lên</span>{" "}
            </button>
            <input
              id="fileInput"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />

            <span className="country-of-region-13-6">Cập nhật lại địa chỉ</span>
          </div>
          <div className="flex-row-14-6">
            <div className="">
              <input
                className="rectangle-16-6"
                type="text"
                value={fullAddress}
                placeholder="Address"
                readOnly
              />
            </div>
          </div>
          <div className="flex-row-c-6">
            <select
              className="rectangle-19-6"
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <option value="">Chọn Tỉnh</option>
              {provinces.map((province) => (
                <option key={province.province_id} value={province.province_id}>
                  {province.province_name}
                </option>
              ))}
            </select>
            <select
              className="rectangle-1a-6"
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              disabled={!selectedProvince}
            >
              <option value="">Chọn Quận</option>
              {districts.map((district) => (
                <option key={district.district_id} value={district.district_id}>
                  {district.district_name}
                </option>
              ))}
            </select>
            <select
              className="rectangle-1b-6"
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
              disabled={!selectedDistrict}
            >
              <option value="">Chọn phường</option>
              {wards.map((ward) => (
                <option key={ward.ward_id} value={ward.ward_id}>
                  {ward.ward_name}
                </option>
              ))}
            </select>
            <span className="specific-address-6">Địa chỉ cụ thể</span>
            <input
              className="specific-address-input-6"
              type="text"
              placeholder="Nhập số nhà, tên đường"
              value={specificAddress}
              onChange={(e) => setSpecificAddress(e.target.value)}
            />
          </div>
          <div className="flex-row-1f-6">
            <div className="vector-20-6" />
            <span className="phone-number-6">Số điện thoại</span>
            <span className="phone-number-21-6">
              {" "}
              <input
                className="group-input-20-7"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Update phone"
              />
            </span>
          </div>
          <div className="flex-row-e-6">
            <button className="rectangle-22-6">
              <span className="cancel-6">Hủy</span>
            </button>
            <button
              className="rectangle-23-6"
              onClick={handleProfileUpdateClick}
            >
              <span className="save-6">Lưu</span>
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UserAccount;
