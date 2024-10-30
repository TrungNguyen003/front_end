import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./layout/Header";
import "./styles/UserBookings.css";
import { ClipLoader } from "react-spinners"; 
const MyBookings = ({ isAuthenticated, user, setIsAuthenticated, setUser }) => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await axios.get(
          "https://back-end-42ja.onrender.com/spa/my-bookings"
        );
        setBookings(response.data);
      } catch (err) {
        setError("Failed to fetch bookings. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <ClipLoader size={50} color={"#3498db"} loading={loading} />
      </div>
    );
  }

  if (error) {
    return <div style={{ textAlign: "center", marginTop: "50px" }}>{error}</div>;
  }

  if (bookings.length === 0) {
    return <div  style={{ textAlign: "center", marginTop: "50px" }}>No bookings found.</div>;
  }

  return (
    <div>
      <Header
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <div className="main-container-130">
        <div className="flex-row-cc-130">
          <div className="rectangle-c-130">
            <span className="span-130">lịch spa cho thú cưng của bạn</span>
            <div className="flex-row-e-130">
              <div className="pets-store-d-130">
                <span className="pets-e-130">Pets</span>
                <span className="store-f-130">Store</span>
              </div>
              <div className="rectangle-10-130" />
              <div className="rectangle-11-130" />
            </div>
          </div>
          <div className="table-responsive">
            <h2>My Bookings</h2>
            <table className="table table-striped my-bookings-table">
              <thead>
                <tr>
                  <th className="col-pet-name">Tên thú cưng</th>
                  <th className="col-pet-type">Loại thú cưng</th>
                  <th className="col-services">Dịch vụ</th>
                  <th className="col-booking-date">Ngày đặt</th>
                  <th className="col-status">Trạng thái</th>
                  <th className="col-notes">Ghi chú</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.petName}</td>
                    <td>{booking.petType}</td>
                    <td>
                      {booking.selectedServices
                        .map((service) => service.serviceName)
                        .join(", ")}
                    </td>
                    <td>
                      {new Date(booking.bookingDate).toLocaleDateString()} at{" "}
                      {new Date(booking.bookingDate).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </td>
                    <td>{booking.bookingStatus || "Pending"}</td>
                    <td>{booking.additionalNotes || "N/A"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
