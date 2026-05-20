import { useState, useEffect, useRef } from "react";
import { Modal, Button, message, Divider } from "antd";
import {
  CopyOutlined,
  ClockCircleOutlined,
  BankOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import styles from "./Payment.module.css";
import Lottie from "lottie-react";
import successAnimation from "../../../public/Success.json";
import { getMotDonHang } from "../../services/orderAPI";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount || 0);
};

export default function Payment({ thanhTien, onCOD, form }) {
  const [method, setMethod] = useState("cod");
  const [qrURL, setQrUrl] = useState("");
  const [open, setOpen] = useState(false);
  const [timer, setTimer] = useState(900);
  const [maDonHang, setMaDonHang] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const timerRef = useRef(null);
  const pollingRef = useRef(null);
  const [displayAmount, setDisplayAmount] = useState(0);

  const BANK_ID = "MB";
  const BANK_NAME = "Ngân hàng MBBank";
  const ACCOUNT_NO = "07016032004";
  const ACCOUNT_NAME = "HO DUY KHANG";

  useEffect(() => {
    // Khi thanhTien từ props thay đổi (từ 0 nhảy lên số thực tế)
    if (thanhTien) {
      console.log("Số tiền thực tế nhận được:", thanhTien);
      setDisplayAmount(thanhTien);
    }
  }, [thanhTien]); // Lắng nghe sự thay đổi của thanhTien

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await form.validateFields();
    } catch {
      message.error("Vui lòng điền đủ thông tin giao hàng!");
      setLoading(false);
      return;
    }

    // 1. Gọi hàm tạo đơn hàng từ Checkout.jsx
    // Checkout.jsx sẽ tự navigate nếu là COD, hoặc trả về ID nếu là Bank
    const idMaDH = await onCOD(method);

    if (!idMaDH) {
      setLoading(false);
      return;
    }

    // 2. Nếu là Bank -> Setup Modal và không chuyển trang
    if (method === "bank") {
      setMaDonHang(idMaDH);
      const noiDung = `DH ${idMaDH}`;
      const qrLink = `https://img.vietqr.io/image/${BANK_ID}-${ACCOUNT_NO}-print.png?amount=${thanhTien}&addInfo=${encodeURIComponent(
        noiDung
      )}&accountName=${encodeURIComponent(ACCOUNT_NAME)}`;

      setQrUrl(qrLink);
      setOpen(true);
      setIsSuccess(false);
      startCountdown();
      startPollingThanhToan(idMaDH);
    }
    setLoading(false);
  };

  const startPollingThanhToan = (maDon) => {
    if (pollingRef.current) clearInterval(pollingRef.current);
    pollingRef.current = setInterval(async () => {
      try {
        const res = await getMotDonHang(maDon);
        if (
          res?.success &&
          (res?.data?.trangThaiThanhToan === "Đã Thanh Toán" ||
            res?.data?.TinhTrangThanhToan === "Đã Thanh Toán")
        ) {
          clearInterval(pollingRef.current);
          clearInterval(timerRef.current);
          setIsSuccess(true);
          setTimeout(() => {
            message.success("Thanh toán thành công!");
            window.location.href = "/myaccount";
          }, 3500);
        }
      } catch (err) {
        console.error(err);
      }
    }, 3000);
  };

  const startCountdown = () => {
    setTimer(900);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          clearInterval(pollingRef.current);
          setOpen(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleCopy = (text, label) => {
    navigator.clipboard.writeText(text);
    message.success(`Đã chép ${label}`);
  };
  const displayPrice = formatCurrency(displayAmount);
  console.log("displayAmount: ", displayAmount);

  return (
    <div className={styles.paymentContainer}>
      <h3 className={styles.sectionTitle}>
        <SafetyCertificateOutlined /> Phương thức thanh toán
      </h3>

      <div className={styles.methodGroup}>
        <label
          className={`${styles.methodOption} ${
            method === "cod" ? styles.selected : ""
          }`}
        >
          <input
            type="radio"
            checked={method === "cod"}
            onChange={() => setMethod("cod")}
          />
          <div className={styles.methodInfo}>
            <span className={styles.methodName}>
              Thanh toán khi nhận hàng (COD)
            </span>
            <span className={styles.methodDesc}>
              Giao hàng tận nơi mới trả tiền
            </span>
          </div>
        </label>

        <label
          className={`${styles.methodOption} ${
            method === "bank" ? styles.selected : ""
          }`}
        >
          <input
            type="radio"
            checked={method === "bank"}
            onChange={() => setMethod("bank")}
          />
          <div className={styles.methodInfo}>
            <span className={styles.methodName}>Chuyển khoản QR tự động</span>
            <span className={styles.methodDesc}>Duyệt nhanh, bảo mật 24/7</span>
          </div>
          <span className={styles.badge}>Khuyên dùng</span>
        </label>
      </div>

      <Button
        type="primary"
        block
        className={styles.btnCheckout}
        onClick={handleSubmit}
        loading={loading}
      >
        {method === "bank" ? "TIẾN HÀNH THANH TOÁN" : "ĐẶT HÀNG NGAY"}
      </Button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={850}
        centered
        className={styles.paymentModal}
        maskClosable={false}
      >
        {isSuccess ? (
          <div className={styles.successContainer}>
            <Lottie
              animationData={successAnimation}
              loop={false}
              style={{ width: 300 }}
            />
            <h2 className={styles.successTitle}>Giao dịch thành công!</h2>
            <p className={styles.successSub}>
              Hệ thống đang chuyển hướng bạn về trang cá nhân...
            </p>
          </div>
        ) : (
          <div className={styles.modalBody}>
            <div className={styles.leftCol}>
              <div className={styles.qrContainer}>
                <img src={qrURL} alt="QR" className={styles.qrImage} />
              </div>
              <div className={styles.timerBox}>
                <div className={styles.timerValue}>
                  <ClockCircleOutlined /> {Math.floor(timer / 60)}:
                  {(timer % 60).toString().padStart(2, "0")}
                </div>
              </div>
              <p className={styles.guideText}>
                Mở App Ngân hàng bất kỳ <br /> quét mã QR để thanh toán nhanh
              </p>
            </div>

            <div className={styles.rightCol}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 20,
                }}
              >
                <span style={{ color: "#64748b" }}>Mã đơn hàng:</span>
                <span style={{ fontWeight: 800, color: "#10b981" }}>
                  #{maDonHang}
                </span>
              </div>
              <Divider style={{ margin: "15px 0" }} />

              <div className={styles.bankDetailBox}>
                <div
                  style={{ fontWeight: 700, color: "#064e3b", marginBottom: 5 }}
                >
                  <BankOutlined /> {BANK_NAME}
                </div>
                <div
                  style={{ fontSize: 16, fontWeight: 800, color: "#1e293b" }}
                >
                  {ACCOUNT_NAME}
                </div>
              </div>

              <div className={styles.infoField}>
                <div className={styles.fieldLabel}>Số tài khoản</div>
                <div className={styles.fieldValueBox}>
                  <span className={styles.fieldValue}>{ACCOUNT_NO}</span>
                  <CopyOutlined
                    className={styles.copyBtn}
                    onClick={() => handleCopy(ACCOUNT_NO, "STK")}
                  />
                </div>
              </div>

              <div className={styles.infoField}>
                <div className={styles.fieldLabel}>Số tiền</div>
                <div className={styles.fieldValueBox}>
                  <span className={`${styles.fieldValue} ${styles.highlight}`}>
                    {displayAmount ? displayPrice : "0 ₫"}
                  </span>
                  <CopyOutlined
                    className={styles.copyBtn}
                    onClick={() =>
                      handleCopy(displayAmount?.toString(), "số tiền")
                    }
                  />
                </div>
              </div>

              <div className={styles.infoField}>
                <div className={styles.fieldLabel}>
                  Nội dung chuyển khoản (Bắt buộc)
                </div>
                <div className={`${styles.fieldValueBox} ${styles.warningBox}`}>
                  <span className={styles.fieldValue}>DH {maDonHang}</span>
                  <CopyOutlined
                    className={styles.copyBtn}
                    onClick={() => handleCopy(`DH ${maDonHang}`, "nội dung")}
                  />
                </div>
              </div>

              <div className={styles.secureNote}>
                <SafetyCertificateOutlined />
                <span>Giao dịch an toàn & tự động 24/7 qua SePay</span>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
