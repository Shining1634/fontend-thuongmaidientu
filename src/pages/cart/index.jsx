import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Input,
  InputNumber,
  message,
  notification,
  Popconfirm,
  Row,
  Tooltip,
  ConfigProvider,
  Empty,
  Space,
} from "antd";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  ShoppingCartOutlined,
  HomeOutlined,
  TagOutlined,
  ArrowRightOutlined,
  SafetyCertificateOutlined,
  RocketOutlined,
  CustomerServiceOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { IoWarningOutline } from "react-icons/io5";

import {
  applyVoucher,
  doDeleteItemCartAction,
  doUpdateCartAction,
  setVouchers,
} from "../../redux/order/orderSlice";
import { fetchOneAccKH } from "../../services/accKhAPI";
import styles from "./MyCart.module.css";

const MyCart = () => {
  const order = useSelector((state) => state.order);
  const customerId = useSelector((state) => state.accountKH.user._id);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [dataAccKH, setDataAccKH] = useState("");
  const [voucherCode, setVoucherCode] = useState("");

  const handleRedirectDetail = (item) => {
    const idLoaiSPString = item.IdLoaiSP.map((loai) => loai._id).join(",");
    window.location.href = `/detail-product?id=${item._id}&idLoaiSP=${idLoaiSPString}`;
  };

  const handleOnChangeInput = (productId, size, quantity) => {
    dispatch(doUpdateCartAction({ productId, size, quantity, customerId }));
  };

  const deleteCartAProduct = (productId, size) => {
    dispatch(doDeleteItemCartAction({ productId, size, customerId }));
  };

  const fetchOneAcc = async () => {
    let id = `id=${customerId}`;
    const res = await fetchOneAccKH(id);
    if (res && res.data) {
      setDataAccKH(res.data);
      const vouchersData = res.data?.[0]?.IdVoucher?.map((item) => ({
        code: item.code,
        dieuKien: item.dieuKien,
        giamGia: item.giamGia,
      }));
      dispatch(setVouchers({ vouchers: vouchersData }));
    }
  };

  useEffect(() => {
    if (customerId) fetchOneAcc();
  }, [customerId]);

  const handleApplyVoucher = () => {
    if (!voucherCode) return message.warning("Vui lòng nhập mã!");

    const voucher = dataAccKH?.[0]?.IdVoucher?.find(
      (item) => item.code === voucherCode
    );
    if (voucher) {
      if (order.totalPrice >= voucher.dieuKien) {
        dispatch(applyVoucher({ voucherCode }));
        message.success("Áp dụng mã giảm giá thành công!");
      } else {
        notification.error({
          message: "Không đủ điều kiện",
          description: `Đơn hàng tối thiểu ${voucher.dieuKien.toLocaleString()}đ để dùng mã này.`,
        });
      }
    } else {
      notification.error({
        message: "Voucher không hợp lệ",
        description: "Mã voucher bạn nhập không tồn tại trong kho của bạn.",
      });
    }
  };

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: "#d70018", borderRadius: 8 } }}
    >
      <div className={styles.cartPage}>
        {/* Breadcrumb Area */}
        <div className={styles.breadcrumbArea}>
          <div className={styles.container}>
            <Space style={{ fontSize: "14px", color: "#666" }}>
              <HomeOutlined
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              />
              <span>/</span>
              <b style={{ color: "#d70018" }}>Giỏ hàng của tôi</b>
            </Space>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.mainLayout}>
            {/* LEFT: Cart List */}
            <div className={styles.cartListCard}>
              <div className={styles.tableHead}>
                <div>Sản phẩm</div>
                <div style={{ textAlign: "center" }}>Đơn giá</div>
                <div style={{ textAlign: "center" }}>Số lượng</div>
                <div style={{ textAlign: "center" }}>Thành tiền</div>
              </div>

              {order.carts.length > 0 ? (
                <>
                  {order.carts.map((item, index) => {
                    const finalPrice = Math.ceil(
                      item.priceDaChon * (1 - item.detail.GiamGiaSP / 100)
                    );
                    return (
                      <div className={styles.cartItem} key={index}>
                        <div className={styles.productInfo}>
                          <Popconfirm
                            title="Xóa sản phẩm này?"
                            onConfirm={() =>
                              deleteCartAProduct(item._id, item.sizeDaChon)
                            }
                            okText="Xóa"
                            cancelText="Hủy"
                            okButtonProps={{ danger: true }}
                          >
                            <Button
                              type="text"
                              danger
                              icon={<RiDeleteBin6Line size={20} />}
                            />
                          </Popconfirm>
                          <img
                            src={item.detail.Image}
                            className={styles.thumbnail}
                            alt="thumb"
                          />
                          <div className={styles.itemDetails}>
                            <h6
                              onClick={() => handleRedirectDetail(item.detail)}
                              className={styles.itemTitle}
                            >
                              {item.detail.TenSP}
                            </h6>
                            <span className={styles.itemConfig}>
                              Cấu hình: {item.sizeDaChon}
                            </span>
                          </div>
                        </div>

                        <div className={styles.priceText}>
                          {finalPrice.toLocaleString()}đ
                        </div>

                        <div style={{ textAlign: "center" }}>
                          <InputNumber
                            min={1}
                            value={item.quantity}
                            onChange={(val) =>
                              handleOnChangeInput(
                                item._id,
                                item.sizeDaChon,
                                val
                              )
                            }
                          />
                        </div>

                        <div className={styles.totalText}>
                          {(finalPrice * item.quantity).toLocaleString()}đ
                        </div>
                      </div>
                    );
                  })}

                  {/* PHẦN NHẬP VOUCHER ĐÃ ĐƯỢC FIX */}
                  <div className={styles.voucherSection}>
                    <div className={styles.voucherTitle}>
                      <TagOutlined style={{ color: "#d70018" }} />
                      MÃ GIẢM GIÁ / VOUCHER
                    </div>
                    <div className={styles.voucherInputGroup}>
                      <Input
                        placeholder="Nhập mã voucher bạn đang có..."
                        className={styles.voucherInput}
                        value={voucherCode}
                        style={{ width: "70%" }}
                        onChange={(e) => setVoucherCode(e.target.value)}
                      />
                      <Button
                        type="primary"
                        className={styles.voucherBtn}
                        onClick={handleApplyVoucher}
                      >
                        ÁP DỤNG
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <Empty
                  image={<IoWarningOutline size={80} color="#d1d5db" />}
                  description={
                    <span style={{ fontSize: "18px", color: "#666" }}>
                      Giỏ hàng trống!
                    </span>
                  }
                >
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/")}
                  >
                    Tiếp tục mua sắm
                  </Button>
                </Empty>
              )}
            </div>

            {/* RIGHT: Summary */}
            <aside className={styles.summaryCard}>
              <h5 className={styles.summaryTitle}>Thông tin giỏ hàng</h5>
              <div className={styles.summaryRow}>
                <span>Tạm tính:</span>
                <b style={{ fontWeight: 700 }}>
                  {Math.ceil(order.totalPriceChuaGiam).toLocaleString()}đ
                </b>
              </div>
              <div className={styles.summaryRow}>
                <span>Giảm giá Voucher:</span>
                <b style={{ color: "#d70018" }}>
                  -{Math.ceil(order.appliedDiscount).toLocaleString()}đ
                </b>
              </div>
              <div className={styles.summaryRow}>
                <span>Phí giao hàng:</span>
                <b style={{ color: "#059669" }}>Miễn phí</b>
              </div>

              <div className={styles.totalPayRow}>
                <span style={{ fontWeight: 700 }}>Cần thanh toán:</span>
                <span className={styles.totalPriceLarge}>
                  {Math.ceil(order.totalPrice).toLocaleString()}đ
                </span>
              </div>

              <Button
                type="primary"
                className={styles.checkoutBtn}
                icon={<ShoppingCartOutlined />}
                onClick={() => navigate("/checkout")}
                disabled={order.carts.length === 0}
              >
                TIẾN HÀNH ĐẶT HÀNG
              </Button>
            </aside>
          </div>

          {/* Features Area */}
          <div className={styles.serviceArea}>
            <Row gutter={[20, 20]}>
              <Col lg={8} span={24}>
                <div className={styles.serviceCard}>
                  <SafetyCertificateOutlined
                    style={{ fontSize: 30, color: "#d70018" }}
                  />
                  <h4>Bảo hành chính hãng</h4>
                  <p style={{ fontSize: 12 }}>
                    Chính sách bảo hành lên tới 12 tháng
                  </p>
                </div>
              </Col>
              <Col lg={8} span={24}>
                <div className={styles.serviceCard}>
                  <RocketOutlined style={{ fontSize: 30, color: "#d70018" }} />
                  <h4>Giao hàng siêu tốc</h4>
                  <p style={{ fontSize: 12 }}>
                    Miễn phí nội thành trong vòng 2h
                  </p>
                </div>
              </Col>
              <Col lg={8} span={24}>
                <div className={styles.serviceCard}>
                  <CustomerServiceOutlined
                    style={{ fontSize: 30, color: "#d70018" }}
                  />
                  <h4>Hỗ trợ 24/7</h4>
                  <p style={{ fontSize: 12 }}>
                    Tư vấn và giải đáp mọi thắc mắc ngay lập tức
                  </p>
                </div>
              </Col>
            </Row>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default MyCart;
