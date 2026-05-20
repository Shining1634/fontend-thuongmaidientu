import React, { useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Space,
  Typography,
  ConfigProvider,
  Divider,
  Input,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { HomeOutlined } from "@ant-design/icons";

import styles from "./Checkout.module.css";
import { orderDH, orderDHVNPay } from "../../services/orderAPI";
import {
  doResetCartAfterOrder,
  setOrderPlaced,
} from "../../redux/order/orderSlice";
import Payment from "../../components/Payment/Payment";

const { Title, Text } = Typography;

const Checkout = () => {
  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const order = useSelector((state) => state.order);
  const user = useSelector((state) => state.accountKH.user);
  const customerId = user?._id;
  console.log("order: ", order);
  // Tự động điền thông tin khách hàng
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        address: user.address || "",
        phone: user.phone || "",
        email: user.email || "",
        lastName: user.fullName?.split(" ").slice(0, -1).join(" ") || "",
        firstName: user.fullName?.split(" ").slice(-1)[0] || "",
      });
    }
  }, [user, form]);

  /**
   * Hàm xử lý đặt hàng chính (Truyền vào component Payment)
   * @param {string} method 'cod' hoặc 'bank'
   */
  const handleProcessOrder = async (method) => {
    const values = form.getFieldsValue();

    const orderData = {
      lastName: values.lastName,
      firstName: values.firstName,
      email: values.email,
      address: values.address,
      phone: values.phone,
      note: values.note || "Khách hàng không để lại ghi chú",
      products: order?.carts?.map((item) => ({
        _idSP: item.detail._id,
        size: item.sizeDaChon,
        price: Math.ceil(item.priceDaChon * (1 - item.detail.GiamGiaSP / 100)),
        quantity: item.quantity,
      })),
      soTienGiamGia: order.appliedDiscount,
      giamGia: order.soPhanTramGiam,
      soTienCanThanhToan: order.totalPrice,
      thanhTien: order.totalPriceChuaGiam,
      tongSoLuong: order.totalQuantity,
      idKhachHang: customerId,
    };

    try {
      if (method === "bank") {
        // Thanh toán Online (Lấy ID đơn hàng để hiện QR)
        const res = await orderDH(orderData);
        console.log("res orderDH", res);
        if (res && res.data) {
          dispatch(doResetCartAfterOrder());
          localStorage.removeItem(`cart-${customerId}`);
          dispatch(setOrderPlaced(true));
          return res.data.maDonHang; // Trả về ID để component Payment xử lý tiếp
        }
      } else {
        // Thanh toán COD (Thành công thì chuyển trang luôn)
        const res = await orderDH(orderData);
        console.log("res orderDH", res);
        if (res && res.data) {
          message.success("Đặt hàng thành công!");
          dispatch(doResetCartAfterOrder());
          localStorage.removeItem(`cart-${customerId}`);
          navigate("/myaccount");
          return true;
        }
      }
    } catch (error) {
      console.error("Order Error:", error);
      return false;
    }
  };

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: "#d70018", borderRadius: 10 } }}
    >
      <div className={styles.checkoutPage}>
        <div className={styles.breadcrumbArea}>
          <div className={styles.container}>
            <Space>
              <HomeOutlined /> <Text>Trang chủ / Giỏ hàng / </Text>
              <Text strong style={{ color: "#d70018" }}>
                Thanh toán
              </Text>
            </Space>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.mainLayout}>
            {/* CỘT TRÁI: FORM NHẬP LIỆU */}
            <div className={styles.card}>
              <Title level={4} className={styles.sectionTitle}>
                Thông tin giao hàng
              </Title>
              <Form form={form} layout="vertical">
                <Row gutter={16}>
                  <Col span={12}>
                    <Form.Item
                      label="Họ"
                      name="lastName"
                      rules={[{ required: true, message: "Nhập họ" }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Tên"
                      name="firstName"
                      rules={[{ required: true, message: "Nhập tên" }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Số điện thoại"
                      name="phone"
                      rules={[{ required: true, message: "Nhập SĐT" }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Email"
                      name="email"
                      rules={[{ required: true, type: "email" }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item
                      label="Địa chỉ nhận hàng"
                      name="address"
                      rules={[{ required: true, message: "Nhập địa chỉ" }]}
                    >
                      <Input size="large" />
                    </Form.Item>
                  </Col>
                  <Col span={24}>
                    <Form.Item label="Ghi chú" name="note">
                      <Input.TextArea
                        rows={3}
                        placeholder="Ghi chú thêm về đơn hàng..."
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
            </div>

            {/* CỘT PHẢI: BILL & PAYMENT COMPONENT */}
            <aside>
              <div className={styles.card}>
                <Title level={4} className={styles.sectionTitle}>
                  Đơn hàng ({order.totalQuantity} sản phẩm)
                </Title>
                <div className={styles.orderScroll}>
                  {order?.carts?.map((item, idx) => (
                    <div className={styles.productItem} key={idx}>
                      <img
                        src={item.detail.Image}
                        className={styles.thumbnail}
                        alt=""
                      />
                      <div className={styles.prodInfo}>
                        <Text strong className={styles.prodName}>
                          {item.detail.TenSP}
                        </Text>
                        <div className={styles.prodMeta}>
                          Size: {item.sizeDaChon} | SL: {item.quantity}
                        </div>
                      </div>
                      <Text strong>
                        {(
                          Math.ceil(
                            item.priceDaChon * (1 - item.detail.GiamGiaSP / 100)
                          ) * item.quantity
                        ).toLocaleString()}
                        đ
                      </Text>
                    </div>
                  ))}
                </div>

                <div className={styles.summaryBox}>
                  <div className={styles.summaryRow}>
                    <Text>Tạm tính:</Text>
                    <Text strong>
                      {Math.ceil(order.totalPriceChuaGiam).toLocaleString()}đ
                    </Text>
                  </div>
                  <div className={styles.summaryRow}>
                    <Text>Giảm giá:</Text>
                    <Text strong style={{ color: "#52c41a" }}>
                      -{Math.ceil(order.appliedDiscount).toLocaleString()}đ
                    </Text>
                  </div>
                  <div className={styles.summaryRow}>
                    <Text>Vận chuyển:</Text>
                    <Text strong style={{ color: "#52c41a" }}>
                      Miễn phí
                    </Text>
                  </div>
                  <Divider style={{ margin: "12px 0" }} />
                  <div className={styles.summaryRow}>
                    <Title level={4}>Tổng tiền:</Title>
                    <span className={styles.totalPrice}>
                      {Math.ceil(order.totalPrice).toLocaleString()}đ
                    </span>
                  </div>
                </div>

                {/* TÍCH HỢP COMPONENT PAYMENT VÀO ĐÂY */}
                <Payment
                  thanhTien={order.totalPrice}
                  onCOD={handleProcessOrder}
                  form={form}
                />
              </div>
            </aside>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default Checkout;
