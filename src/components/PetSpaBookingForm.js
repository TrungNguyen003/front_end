import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./layout/Header"; // Import Header component
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import CSS for Toastify
import "./styles/BookingForm.css";
import Footer from "./layout/Footer";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
const PetSpaBookingForm = ({
  isAuthenticated,
  user,
  setIsAuthenticated,
  setUser,
}) => {
  const [petName, setPetName] = useState("");
  const [petType, setPetType] = useState("");
  const [owner, setOwner] = useState(""); // Owner should be fetched or input
  const [selectedServices, setSelectedServices] = useState([]);
  const [bookingDate, setBookingDate] = useState("");
  const [additionalNotes, setAdditionalNotes] = useState("");
  const [services, setServices] = useState([]);
  const navigate = useNavigate();
  // Danh sách dịch vụ và giá của chúng
  const availableServices = [
    { name: "Tắm", price: 100000 }, // 100,000 VND
    { name: "Cắt tỉa", price: 150000 }, // 150,000 VND
    { name: "Làm móng", price: 50000 }, // 50,000 VND
    { name: "massage", price: 200000 }, // 200,000 VND
    { name: "Vệ sinh tai", price: 70000 }, // 70,000 VND
  ];

  // Gán danh sách dịch vụ vào state
  useEffect(() => {
    setServices(availableServices);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const bookingData = {
      petName,
      petType,
      owner: user._id,
      selectedServices,
      bookingDate,
      additionalNotes,
    };

    try {
      const response = await axios.post(
        "https://back-end-42ja.onrender.com/spa/bookings",
        bookingData
      );
      toast.success("Đặt phòng được tạo thành công!"); // Show success toast
      // Clear form fields after submission
      setPetName("");
      setPetType("");
      setSelectedServices([]);
      setBookingDate("");
      setAdditionalNotes("");
      setTimeout(() => {
        navigate("/User_Booking"); // Điều hướng về trang chủ sau 2 giây
      }, 2000);
    } catch (error) {
      console.error("Error creating booking", error);
      toast.error("Không thể tạo đặt chỗ. Vui lòng thử lại."); // Show error toast
    }
  };

  // Hàm xử lý khi chọn dịch vụ
  const handleServiceSelection = (service) => {
    setSelectedServices((prevServices) => {
      const alreadySelected = prevServices.find(
        (s) => s.serviceName === service.name
      );
      if (alreadySelected) {
        return prevServices.filter((s) => s.serviceName !== service.name);
      }
      return [
        ...prevServices,
        { serviceName: service.name, price: service.price },
      ];
    });
  };

    // Lấy ngày hiện tại và định dạng cho thuộc tính "min"
    const getCurrentDateTime = () => {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

  return (
    <>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <div className="main-container-129">
        <div className="flex-row-cc-129">
          <div className="rectangle-c-129">
            <form onSubmit={handleSubmit}>
              <span className="span-129">
                đặt lịch spa cho thú cưng của bạn
              </span>
              <div className="flex-row-e-129">
                <div className="pets-store-d-129">
                  <span className="pets-e-129">Pets</span>
                  <span className="store-f-129">Store</span>
                </div>
                <div className="rectangle-10-129" />
                <div className="rectangle-11-129" />
              </div>
              <div className="flex-row-bc-129">
                <input
                  type="text"
                  className="rectangle-12-129"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="Nhập tên thú cưng của bạn"
                  required
                />
                <div className="rectangle-13-129">
                  <div className="studio-shodwe-129">
                    <div className="vector-14-129" />
                  </div>
                </div>
                <span className="span-15-129">tên thú cưng</span>
                <select
                  className="rectangle-16-129"
                  value={petType}
                  onChange={(e) => setPetType(e.target.value)}
                  required
                >
                  <option value="">Chọn loại thú cưng</option>
                  <option value="Chó">Chó</option>
                  <option value="Mèo">Mèo</option>
                  <option value="Khác">Khác</option>
                </select>
                <span className="span-17-129">loại thú cưng</span>
                <span className="span-1a-129">chọn dịch vụ</span>
                <div className="span-1d-129">
                  {services.map((service) => (
                    <div key={service.name} className="form-check">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={service.name}
                        onChange={() => handleServiceSelection(service)}
                        checked={selectedServices.some(
                          (s) => s.serviceName === service.name
                        )}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={service.name}
                      >
                        {service.name} - {service.price} VND
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex-row-c-129">
                <input
                  type="datetime-local"
                  className="rectangle-27-129"
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  min={getCurrentDateTime()} // Chỉ cho phép chọn từ thời điểm hiện tại trở đi
                  required
                />
                <span className="span-28-129">đặt lịch ngay</span>
              </div>
              <div className="flex-row-f-129">
                <textarea
                  className="rectangle-2b-129"
                  value={additionalNotes}
                  placeholder="Ghi chú"
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                />
                <span className="additional-note-129">ghi chú bổ sung</span>
                <span className="note">Ghi chú</span>
              </div>
              <button type="submit" className="flex-row-bd-129">
                <span className="schedule-appointment-129">đặt lịch hẹn</span>
              </button>
            </form>
            <div className="rectangle-2d-129">
              <span className="contact-petstore-129">
                liên hệ lịch tiêm ngay cho petStore chúng tôi
              </span>
              <span className="contact-petstore-2e-129">
                liên hệ lịch tiêm ngay cho petStore chúng tôi
              </span>
              <span className="hotline-129">hotline: 0336343299</span>
              <span className="hotline-2f-129">hotline: 0336343299</span>
            </div>
          </div>
          <div className="inner-plugin-iframe-129" />
          <div className="inner-plugin-iframe-30-129" />
        </div>
        <Footer />
      </div>
      <ToastContainer /> {/* Include ToastContainer to show notifications */}
    </>
  );
};

export default PetSpaBookingForm;
