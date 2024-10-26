import React, { useEffect, useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import AdminHeader from "../layout/AdminHeader";
import "../styles/ad_dashboard.css";
// Register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = ({ isAuthenticated, user, setIsAuthenticated, setUser }) => {
  const [combinedStats, setCombinedStats] = useState({
    stats: { totalOrders: 0, revenue: 0 },
    ordersRevenue: { daily: [], weekly: [], monthly: [] },
    cancelledOrders: { daily: [], weekly: [], monthly: [] },
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("daily");
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  useEffect(() => {
    const fetchCombinedStats = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/admin/dashboard/combined-stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setCombinedStats(response.data);
      } catch (err) {
        setError("Error fetching combined stats data.");
      } finally {
        setLoading(false);
      }
    };
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8081/admindb/orders",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("authToken")}`,
            },
          }
        );
        setOrders(response.data.orders);
        setLoading(false);
      } catch (err) {
        setError("Error fetching orders");
        setLoading(false);
      }
    };

    fetchOrders();
    fetchCombinedStats();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `http://localhost:8081/admin/orders/${orderId}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      // Cập nhật lại danh sách đơn hàng sau khi thay đổi trạng thái
      const updatedOrders = orders.map((order) =>
        order._id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
    } catch (err) {
      setError("Error updating order status.");
    }
  };

  const openModal = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:8081/admin/orders/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );
      setSelectedOrder(response.data);
      setModalIsOpen(true);
    } catch (error) {
      setError("Error fetching order details.");
    }
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setSelectedOrder(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div style={{ color: "red" }}>{error}</div>;
  }

  const getChartData = () => {
    switch (viewMode) {
      case "daily":
        return {
          labels: combinedStats.ordersRevenue.daily.map((stat) => stat.date),
          datasets: [
            {
              label: "Total Orders (Daily)",
              data: combinedStats.ordersRevenue.daily.map(
                (stat) => stat.totalOrders
              ),
              backgroundColor: "#FF6384",
            },
            {
              label: "Total Revenue (Daily)",
              data: combinedStats.ordersRevenue.daily.map(
                (stat) => stat.totalRevenue
              ),
              backgroundColor: "#36A2EB",
            },
            {
              label: "Cancelled Orders (Daily)",
              data: combinedStats.cancelledOrders.daily.map(
                (stat) => stat.total
              ),
              backgroundColor: "#FFCE56",
            },
          ],
        };
      case "weekly":
        return {
          labels: combinedStats.ordersRevenue.weekly.map(
            (stat) => `Week ${stat.week}`
          ),
          datasets: [
            {
              label: "Total Orders (Weekly)",
              data: combinedStats.ordersRevenue.weekly.map(
                (stat) => stat.totalOrders
              ),
              backgroundColor: "#FF6384",
            },
            {
              label: "Total Revenue (Weekly)",
              data: combinedStats.ordersRevenue.weekly.map(
                (stat) => stat.totalRevenue
              ),
              backgroundColor: "#36A2EB",
            },
            {
              label: "Cancelled Orders (Weekly)",
              data: combinedStats.cancelledOrders.weekly.map(
                (stat) => stat.total
              ),
              backgroundColor: "#FFCE56",
            },
          ],
        };
      case "monthly":
        return {
          labels: combinedStats.ordersRevenue.monthly.map(
            (stat) => `Month ${stat.month}`
          ),
          datasets: [
            {
              label: "Total Orders (Monthly)",
              data: combinedStats.ordersRevenue.monthly.map(
                (stat) => stat.totalOrders
              ),
              backgroundColor: "#FF6384",
            },
            {
              label: "Total Revenue (Monthly)",
              data: combinedStats.ordersRevenue.monthly.map(
                (stat) => stat.totalRevenue
              ),
              backgroundColor: "#36A2EB",
            },
            {
              label: "Cancelled Orders (Monthly)",
              data: combinedStats.cancelledOrders.monthly.map(
                (stat) => stat.total
              ),
              backgroundColor: "#FFCE56",
            },
          ],
        };
      default:
        return {};
    }
  };

  return (
    <div>
      <AdminHeader
        isAuthenticated={isAuthenticated}
        user={user}
        setIsAuthenticated={setIsAuthenticated}
        setUser={setUser}
      />
      <h1>Admin Dashboard</h1>
      <div>
        <button onClick={() => setViewMode("daily")}>Daily</button>
        <button onClick={() => setViewMode("weekly")}>Weekly</button>
        <button onClick={() => setViewMode("monthly")}>Monthly</button>
      </div>

      <h2>
        Total Orders and Revenue (
        {viewMode.charAt(0).toUpperCase() + viewMode.slice(1)})
      </h2>
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <Bar data={getChartData()} />
      </div>

      <h2>Summary</h2>
      <div>
        <p>Total Orders: {combinedStats.stats.totalOrders}</p>
        <p>
          Total Revenue:{" "}
          {new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
          }).format(combinedStats.stats.revenue)}
        </p>
        <p>
          Cancelled Orders:{" "}
          {combinedStats.cancelledOrders[viewMode].reduce(
            (acc, item) => acc + item.total,
            0
          )}
        </p>
      </div>

      <h2>Recent Orders</h2>
      {orders.length === 0 ? (
        <div>No orders found</div>
      ) : (
        <div className="table-container scrollable-table">
          <table>
            <thead>
              <tr>
                <th>Product</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>
                    {order.items.map((item) => (
                      <p key={item._id}>{item.product.name}</p>
                    ))}
                  </td>
                  <td>
                    {new Intl.NumberFormat("vi-VN", {
                      style: "currency",
                      currency: "VND",
                    }).format(order.total)}
                  </td>
                  <td>{order.status}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                    >
                      <option value="pending">Pending</option>
                      <option value="shipped">Shipped</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="refund">Refund</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                      {/* Thêm các trạng thái khác nếu cần */}
                    </select>
                    <button onClick={() => openModal(order._id)}>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Order Details"
        style={{
          content: {
            top: "50%",
            left: "50%",
            right: "auto",
            bottom: "auto",
            marginRight: "-50%",
            transform: "translate(-50%, -50%)",
          },
        }}
      >
        {selectedOrder ? (
          <div>
            <h2>Order Details</h2>
            <p>
              <strong>ID:</strong> {selectedOrder._id}
            </p>
            <p>
              <strong>Status:</strong> {selectedOrder.status}
            </p>
            <p>
              <strong>Total:</strong>{" "}
              {new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
              }).format(selectedOrder.total)}
            </p>
            <p>
              <strong>Items:</strong>
            </p>
            <ul>
              {selectedOrder.items.map((item) => (
                <li key={item._id}>
                  {item.product.name} - {item.quantity}
                </li>
              ))}
            </ul>
            <button onClick={closeModal}>Close</button>
          </div>
        ) : (
          <div>Loading...</div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;
