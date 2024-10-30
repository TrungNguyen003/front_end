import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./layout/Header";
import Footer from "./layout/Footer";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
// import "./styles/editprofile.css";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = ({
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
  const [specificAddress, setSpecificAddress] = useState(""); // Địa chỉ cụ thể
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Token not found");
      return;
    }

    axios
      .get("http://localhost:10000/users/me", {
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
        setSpecificAddress(response.data.specificAddress || ""); // Lưu trữ địa chỉ cụ thể từ API
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to fetch user data");
      });

    // Fetch provinces
    axios
      .get("http://localhost:10000/api/provinces")
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

    setFullAddress(
      `${specificAddress ? specificAddress + ", " : ""}${wardName ? wardName + ", " : ""}${
        districtName ? districtName + ", " : ""
      }${provinceName}`
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
          `http://localhost:10000/api/provinces/${selectedProvince}/districts`
        )
        .then((response) => {
          setDistricts(response.data);
          setWards([]); // Clear wards if province changes
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch districts");
        });
    } else {
      setDistricts([]);
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      axios
        .get(`http://localhost:10000/api/districts/${selectedDistrict}/wards`)
        .then((response) => {
          setWards(response.data);
        })
        .catch((err) => {
          console.error(err);
          setError("Failed to fetch wards");
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
        "http://localhost:10000/users/upload-avatar",
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
        setError("Failed to upload avatar");
      });
  };

  const handleUpdateProfile = () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setError("Token not found");
      return;
    }

    if (!username || !fullAddress || !phone) {
      toast.error("Vui lòng điền vào tất cả các trường");
      return;
    }

    const updates = [];

    if (username !== user.username) {
      updates.push(
        axios.post(
          "http://localhost:10000/users/update-username",
          { username },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );
    }

    if (fullAddress !== user.address) {
      updates.push(
        axios.post(
          "http://localhost:10000/users/update-address",
          { address: fullAddress },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );
    }

    if (phone !== user.phone) {
      updates.push(
        axios.post(
          "http://localhost:10000/users/update-phone",
          { phone },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
      );
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
        toast.success("Hồ sơ đã được cập nhật thành công");
      })
      .catch((err) => {
        console.error(err);
        toast.error("Không cập nhật được hồ sơ");
      });
  };

  const handleProfileUpdateClick = () => {
    handleUpdateProfile().catch((err) => {
      console.error(err);
      toast.error("Không cập nhật được hồ sơ");
    });
  };

  const handleAvatarClick = () => {
    document.getElementById("fileInput").click();
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <div className="main-container-7">
        <div className="flex-row-bb-7">
          <div className="rectangle-7-7" />
          <div className="rectangle-8-7" />
          <span className="edit-profile-9-7">Chỉnh sửa hồ sơ</span>
          <div className="vector-a-7" />
          <Link to="/account">
            <span className="account-overview-7">Tổng quan về tài khoản</span>
          </Link>
          <div className="vector-b-7" />
          <div
            className="rectangle-c-7"
            onClick={handleAvatarClick}
            style={{ cursor: "pointer" }}
          >
            {avatar ? (
              <img
                src={avatar}
                alt="User Avatar"
                style={{ width: 100, height: 100, borderRadius: "50%" }}
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
          <input
            id="fileInput"
            type="file"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button onClick={() => handleUpload(fileInput)}>Tải lên</button>

          <div className="input-wrapper-7">
            <label>Tên người dùng</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="input-wrapper-7">
            <label>Số điện thoại</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div className="input-wrapper-7">
            <label>Chọn tỉnh</label>
            <select
              value={selectedProvince}
              onChange={(e) => setSelectedProvince(e.target.value)}
            >
              <option value="">Chọn tỉnh</option>
              {provinces.map((province) => (
                <option
                  key={province.province_id}
                  value={province.province_id}
                >
                  {province.province_name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-wrapper-7">
            <label>Chọn quận</label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
            >
              <option value="">Chọn quận</option>
              {districts.map((district) => (
                <option key={district.district_id} value={district.district_id}>
                  {district.district_name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-wrapper-7">
            <label>Chọn phường</label>
            <select
              value={selectedWard}
              onChange={(e) => setSelectedWard(e.target.value)}
            >
              <option value="">Chọn phường</option>
              {wards.map((ward) => (
                <option key={ward.ward_id} value={ward.ward_id}>
                  {ward.ward_name}
                </option>
              ))}
            </select>
          </div>

          <div className="input-wrapper-7">
            <label>Địa chỉ cụ thể</label>
            <input
              type="text"
              value={specificAddress}
              onChange={(e) => setSpecificAddress(e.target.value)}
            />
          </div>

          <div className="full-address">
            <label>Địa chỉ đầy đủ: {fullAddress}</label>
          </div>

          <button onClick={handleProfileUpdateClick}>
            Chỉnh sửa hồ sơ
          </button>

          <ToastContainer />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfile;
