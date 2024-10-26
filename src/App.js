import React, { useState, useEffect } from "react";
import axios from "axios";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import AllProducts from "./components/AllProducts";
import Login from "./components/Logins";
import Register from "./components/Register";
import ProductDetail from "./components/admin/ProductDetail";
import ProductDetailss from "./components/ProductDetailss";
import ProductsList from "./components/admin/ProductsList";
import EditProduct from "./components/admin/EditProduct";
import AddProduct from "./components/admin/AddProduct";
import UserManagement from "./components/admin/UserManagement";
import ProtectedRoute from "./components/ProtectedRoute";
import Cart from "./components/Cart";
import Checkout from "./components/Checkout";
import CheckoutNow from "./components/CheckoutNow";
import CategoryManager from "./components/admin/CategoryManager";
import Success from "./components/Success";
import AdminRoute from "./components/AdminRoute";
import CancelOrder from "./components/CancelOrder";
import Orders from "./components/Orders";
import OrderDetail from "./components/OrderDetails";
import UserAccount from "./components/UserAccount";
import AdminOrders from "./components/admin/OrderManager";
import AdminDashboard from "./components/admin/DashBoard";
import SearchResults from "./components/SearchResults";
import Testheader from "./components/layout/testheader";
import CategoryProducts from "./components/CategoryProducts";
import UserRoute from "./components/UserRoute";
import EditProfile from "./components/EditProfile";
import ChangePassword from "./components/ChangePassword";
import PaymentResult from "./components/PaymentResult";
import { CartProvider } from "./components/layout/CartContext";
import PaymentSuccess from "./components/PaymentSuccess";
import PaymentFailure from "./components/PaymentFailure";
import CancelPayment from "./components/CancelPayment";
import PetSpaBookingForm from "./components/PetSpaBookingForm";
import CreateShipmentForm from "./components/admin/CreateShipmentForm";
import UserBookings from "./components/UserBookings";
import PetCareServices from "./components/PetCareServices";
import VaccinationService from "./components/VaccinationService";
import BathService from "./components/BathService"; 
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("authToken");
        const res = await axios.get("https://back-end-42ja.onrender.com/users/check-auth", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        if (res.data.isAuthenticated) {
          setIsAuthenticated(true);
          setUser(res.data.user);
        } else {
          setIsAuthenticated(false);
          setUser(null);
          localStorage.removeItem("authToken");
          localStorage.removeItem("role");
        }
      } catch (err) {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem("authToken");
        localStorage.removeItem("role");
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <CartProvider>
      <Routes>
        <Route
          path="/"
          element={
            user && user.role === "admin" ? (
              <Navigate to="/admin/dashboard" />
            ) : (
              <AllProducts
                isAuthenticated={isAuthenticated}
                user={user}
                setIsAuthenticated={setIsAuthenticated}
                setUser={setUser}
                cart={cart}
                setCart={setCart}
              />
            )
          }
        />
        <Route path="/register" element={<Register />} />
        <Route
          path="/login"
          element={
            <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
          }
        />

        {/* Bọc các trang admin trong AdminRoute */}
        <Route
          element={<AdminRoute isAuthenticated={isAuthenticated} user={user} />}
        >
          <Route path="/admin/products" element={<ProductsList />} />
          <Route path="/admin/categories" element={<CategoryManager />} />
          <Route path="/admin/product-detail/:id" element={<ProductDetail />} />
          <Route path="/admin/products/add" element={<AddProduct />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/create-shipment" element={<CreateShipmentForm />} />
          <Route
            path="/admin/dashboard"
            element={
              <AdminDashboard
                isAuthenticated={isAuthenticated}
                user={user}
                setIsAuthenticated={setIsAuthenticated}
                setUser={setUser}
                cart={cart}
                setCart={setCart}
              />
            }
          />
          <Route
            path="/admin/products/edit-product/:id"
            element={<EditProduct />}
          />
          <Route path="/admin/users" element={<UserManagement />} />
        </Route>
        <Route path="/checkout/cancel" element={<CancelOrder />} />
        <Route
          path="/product/:id"
          element={
            <ProductDetailss
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/cart"
          element={
            <Cart
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/checkout"
          element={
            <Checkout
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/checkoutnow"
          element={
            <CheckoutNow
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/payment-result"
          element={
            <PaymentResult
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failure" element={<PaymentFailure />} />
        <Route
          path="/category/:categoryName"
          element={
            <CategoryProducts
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/search"
          element={
            <SearchResults
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/orders"
          element={
            <Orders
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
         <Route
          path="/Spa_Booking"
          element={
            <PetSpaBookingForm
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
           <Route
          path="/User_Booking"
          element={
            <UserBookings
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
         <Route
          path="/Dich-vu-thu-y"
          element={
            <PetCareServices
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
           <Route
          path="/Dich-vu-tiem"
          element={
            <VaccinationService
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
          <Route
          path="/Dich-vu-tam"
          element={
            <BathService
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />

        <Route path="/orders/:orderId" element={<OrderDetail />} />
        <Route
          path="/account"
          element={
            <UserAccount
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/editprofile"
          element={
            <EditProfile
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/changepassword"
          element={
            <ChangePassword
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/test"
          element={
            <Testheader
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
            />
          }
        />
        <Route
          path="/success"
          element={
            <Success
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
        <Route
          path="/cancel-payment"
          element={
            <CancelPayment
              isAuthenticated={isAuthenticated}
              user={user}
              setIsAuthenticated={setIsAuthenticated}
              setUser={setUser}
              cart={cart}
              setCart={setCart}
            />
          }
        />
      </Routes>
    </CartProvider>
  );
}

export default App;
