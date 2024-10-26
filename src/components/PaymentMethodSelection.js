import React from "react";

const PaymentMethodSelection = ({ selectedMethod, onSelectMethod }) => {
  return (
    <div>
      <h3>Chọn phương thức thanh toán</h3>
      <label>
        <input
          type="radio"
          value="COD"
          checked={selectedMethod === "COD"}
          onChange={() => onSelectMethod("COD")}
        />
        Thanh toán khi nhận hàng (COD)
      </label>
      <label>
        <input
          type="radio"
          value="Online"
          checked={selectedMethod === "Online"}
          onChange={() => onSelectMethod("Online")}
        />
        Thanh toán trực tuyến (Stripe)
      </label>
    </div>
  );
};

export default PaymentMethodSelection;
