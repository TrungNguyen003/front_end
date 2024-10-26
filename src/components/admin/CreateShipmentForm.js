import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const CreateShipmentForm = () => {
  const location = useLocation();
  const { order } = location.state || {}; // Nhận dữ liệu từ state

  const [formData, setFormData] = useState({
    payment_type_id: 2,
    note: "",
    required_note: "KHONGCHOXEMHANG",
    return_phone: "",
    return_address: "",
    return_district_id: "",
    return_ward_code: "",
    client_order_code: "",
    from_name: "",
    from_phone: "",
    from_address: "",
    from_ward_name: "",
    from_district_name: "",
    from_province_name: "",
    to_name: "",
    to_phone: "",
    to_address: "",
    to_ward_code: "",
    to_ward_name: "",
    to_district_name: "",
    to_province_name: "",
    cod_amount: 0,
    content: "",
    weight: 0,
    length: 0,
    width: 0,
    height: 0,
    cod_failed_amount: 0,
    pick_station_id: "",
    deliver_station_id: "",
    insurance_value: 0,
    service_id: 0,
    service_type_id: 2,
    coupon: null,
    pickup_time: null,
    pick_shift: [],
    items: [],
  });

  useEffect(() => {
    if (order) {
      // Cập nhật form data với thông tin từ order
      setFormData((prevFormData) => ({
        ...prevFormData,
        from_name: "Shoppets",
        from_phone: "0373516678",
        from_address: order.address,
        to_name: order.username,
        to_phone: order.phone,
        to_address: order.address,
        to_ward_code: "20308",
        cod_amount: parseInt(order.total, 10) || 0,
        content: order.items.map((item) => item.product.name).join(", "),
        items: order.items.map((item) => ({
          name: item.product.name,
          code: item.product.code,
          quantity: item.quantity,
          price: parseInt(item.price, 10) || 0,
          length: parseInt(item.product.length, 10) || 0,
          width: parseInt(item.product.width, 10) || 0,
          weight: parseInt(item.product.weight, 10) || 0,
          height: parseInt(item.product.height, 10) || 0,
        })),
      }));
    }
  }, [order]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Danh sách các trường cần chuyển đổi thành số nguyên
    const integerFields = [
      "weight",
      "length",
      "width",
      "height",
      "insurance_value",
      "cod_amount",
      "pick_station_id",
      "deliver_station_id",
    ];

    // Cập nhật dữ liệu form với giá trị đúng kiểu
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: integerFields.includes(name)
        ? parseInt(value, 10) || 0 // Chuyển đổi giá trị thành số nguyên, mặc định 0 nếu không hợp lệ
        : value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:8081/ship/create",
        formData
      );
      console.log("Đơn hàng vận chuyển đã được tạo:", response.data);
    } catch (error) {
      console.error(
        "Lỗi khi tạo đơn hàng vận chuyển:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* Các trường nhập liệu */}
      <div>
        <label>Tên người gửi:</label>
        <input
          type="text"
          name="from_name"
          value={formData.from_name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Số điện thoại người gửi:</label>
        <input
          type="text"
          name="from_phone"
          value={formData.from_phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Địa chỉ người gửi:</label>
        <input
          type="text"
          name="from_address"
          value={formData.from_address}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Tên người nhận:</label>
        <input
          type="text"
          name="to_name"
          value={formData.to_name}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Số điện thoại người nhận:</label>
        <input
          type="text"
          name="to_phone"
          value={formData.to_phone}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Địa chỉ người nhận:</label>
        <input
          type="text"
          name="to_address"
          value={formData.to_address}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Ghi chú:</label>
        <input
          type="text"
          name="note"
          value={formData.note}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Yêu cầu ghi chú:</label>
        <input
          type="text"
          name="required_note"
          value={formData.required_note}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Mã đơn hàng:</label>
        <input
          type="text"
          name="client_order_code"
          value={formData.client_order_code}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Tổng tiền thu hộ (COD):</label>
        <input
          type="number"
          name="cod_amount"
          value={formData.cod_amount}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Nội dung hàng hóa:</label>
        <input
          type="text"
          name="content"
          value={formData.content}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Trọng lượng (gram):</label>
        <input
          type="number"
          name="weight"
          value={formData.weight}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Kích thước (dài x rộng x cao) cm:</label>
        <input
          type="number"
          name="length"
          value={formData.length}
          onChange={handleChange}
        />
        <input
          type="number"
          name="width"
          value={formData.width}
          onChange={handleChange}
        />
        <input
          type="number"
          name="height"
          value={formData.height}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Giá trị bảo hiểm (VND):</label>
        <input
          type="number"
          name="insurance_value"
          value={formData.insurance_value}
          onChange={handleChange}
        />
      </div>

      <button type="submit">Tạo đơn hàng vận chuyển</button>
    </form>
  );
};

export default CreateShipmentForm;
