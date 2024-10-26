import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate để điều hướng

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const navigate = useNavigate(); // Sử dụng useNavigate để điều hướng

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8081/admin/orders?page=${page}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });
        setOrders(response.data.orders);
        setTotalPages(response.data.totalPages);
        setLoading(false);
      } catch (err) {
        setError("Error fetching orders");
        setLoading(false);
      }
    };

    fetchOrders();
  }, [page]);

  const fetchOrderDetails = async (orderId) => {
    try {
      const response = await axios.get(`http://localhost:8081/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setOrderDetails(response.data);
      setSelectedOrder(orderId);
    } catch (err) {
      setError("Error fetching order details");
    }
  };

  const updateOrderStatus = async (orderId) => {
    try {
      await axios.put(`http://localhost:8081/admin/orders/${orderId}`, { status }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const response = await axios.get(`http://localhost:8081/admin/orders?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setOrders(response.data.orders);
      setStatus("");
    } catch (err) {
      setError("Error updating order status");
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await axios.delete(`http://localhost:8081/admin/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      const response = await axios.get(`http://localhost:8081/admin/orders?page=${page}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setOrders(response.data.orders);
      setSelectedOrder(null);
    } catch (err) {
      setError("Error deleting order");
    }
  };

  const handleCreateShipment = (order) => {
    navigate("/create-shipment", { state: { order } });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Admin Order Management</h1>

      {selectedOrder && orderDetails && (
        <div>
          <h2>Order Details</h2>
          <p>Order ID: {orderDetails._id}</p>
          <p>Total: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(orderDetails.total)}</p>
          <p>Status: {orderDetails.status}</p>
          <p>Email: {orderDetails.email}</p>
          <p>Address: {orderDetails.address}</p>
          <ul>
            {orderDetails.items.map((item) => (
              <li key={item._id}>
                <p>Product: {item.product.name}</p>
                <p>Quantity: {item.quantity}</p>
                <p>Price: {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.price)}</p>
              </li>
            ))}
          </ul>
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">Select Status</option>
            <option value="pending">Pending</option>
            <option value="shipped">Shipped</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refund">Refund</option>
            <option value="refused">Refused</option>
          </select>
          <button onClick={() => updateOrderStatus(orderDetails._id)}>Update Status</button>
        </div>
      )}

      {orders.length === 0 ? (
        <div>No orders found</div>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Username</th> {/* Thêm cột Username */}
              <th>Phone</th> {/* Thêm cột Phone */}
              <th>Total</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{order.username}</td> {/* Hiển thị Username */}
                <td>{order.phone}</td> {/* Hiển thị Phone */}
                <td>{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(order.total)}</td>
                <td>{order.status}</td>
                <td>
                  <button onClick={() => fetchOrderDetails(order._id)}>View Details</button>
                  <button onClick={() => deleteOrder(order._id)}>Delete</button>
                  <button onClick={() => handleCreateShipment(order)}>Create Shipment</button> {/* Nút mới */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            onClick={() => setPage(index + 1)}
            disabled={page === index + 1}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
