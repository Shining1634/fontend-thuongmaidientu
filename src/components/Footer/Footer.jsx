import React from "react";
import payment02 from "../../assets/images/payment/02.png";
import payment03 from "../../assets/images/payment/03.png";
import payment06 from "../../assets/images/payment/06.png";
import SearchMobile from "../Search/SearchMobile";
import styles from "./Footer.module.css";
import {
  PhoneOutlined,
  FacebookFilled,
  TwitterSquareFilled,
  YoutubeFilled,
  InstagramFilled,
} from "@ant-design/icons";
import { Button } from "antd";

const Footer = () => {
  return (
    <footer className={styles.footerWrapper}>
      <SearchMobile />
      <div className={styles.container}>
        <div className={styles.footerMain}>
          {/* Cột 1 */}
          <div className={styles.column}>
            <h3>Giới thiệu</h3>
            <div className={styles.contactInfo}>
              <div className={styles.callBox}>
                <div className={styles.iconCircle}>
                  <PhoneOutlined />
                </div>
                <div>
                  <span style={{ fontSize: "12px", color: "#94a3b8" }}>
                    Hỗ trợ 24/7
                  </span>
                  <a href="tel:0765231603" className={styles.phoneNumber}>
                    0765 231 603
                  </a>
                </div>
              </div>
              <div className={styles.openingHour}>
                <div className={styles.single}>
                  <p>
                    Thứ 2 - Thứ 6: <span>08:00 - 18:00</span>
                  </p>
                </div>
                <div className={styles.single}>
                  <p>
                    Thứ 7: <span>08:00 - 18:00</span>
                  </p>
                </div>
                <div className={styles.single}>
                  <p>
                    Chủ Nhật: <span style={{ color: "#ef4444" }}>Đóng cửa</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Cột 2 */}
          <div className={styles.column}>
            <h3>Cửa hàng</h3>
            <ul className={styles.navList}>
              <li>
                <a href="/">Trang chủ</a>
              </li>
              <li>
                <a href="/wishlist">Sản phẩm yêu thích</a>
              </li>
              <li>
                <a href="/all-product">Tất cả sản phẩm</a>
              </li>
            </ul>
          </div>

          {/* Cột 3 */}
          <div className={styles.column}>
            <h3>Khám phá</h3>
            <ul className={styles.navList}>
              <li>
                <a href="/quayso">Vòng quay may mắn</a>
              </li>
              <li>
                <a href="/cauhoithuonggap">Trung tâm hỗ trợ</a>
              </li>
              <li>
                <a href="#">Chính sách bảo hành</a>
              </li>
            </ul>
          </div>

          {/* Cột 4 */}
          <div className={styles.column}>
            <h3>Hợp tác</h3>
            <ul className={styles.navList}>
              <li>
                <a href="#">Trở thành đối tác</a>
              </li>
              <li>
                <a href="#">Tuyển dụng</a>
              </li>
              <li>
                <a href="#">Liên hệ quảng cáo</a>
              </li>
            </ul>
          </div>

          {/* Cột 5 */}
          <div className={styles.column}>
            <div className={styles.newsletter}>
              <h3>Nhận ưu đãi</h3>
              <p>
                Đăng ký email để nhận thông báo về sản phẩm mới và chương trình
                giảm giá sớm nhất.
              </p>
              <form
                className={styles.subscribeForm}
                onSubmit={(e) => e.preventDefault()}
              >
                <input
                  type="email"
                  placeholder="Email của bạn..."
                  className={styles.inputEmail}
                  required
                />
                <Button size="large" className={styles.btnSubscribe}>
                  Gửi
                </Button>
              </form>
              <p
                style={{
                  marginTop: "15px",
                  fontStyle: "italic",
                  fontSize: "12px",
                }}
              >
                * Chúng tôi cam kết không gửi spam email.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.copyrightBar}>
        <div className={styles.container}>
          <div className={styles.copyContent}>
            <p>
              ©2026 - Thiết kế bởi{" "}
              <a href="#" style={{ color: "#10b981", textDecoration: "none" }}>
                Duy Khang
              </a>
              . Bảo lưu mọi quyền.
            </p>
            <div className={styles.storeLinks}>
              <img src={payment02} alt="App Store" />
              <img src={payment03} alt="Google Play" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
