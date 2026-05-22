import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { message, Button, Badge } from "antd";
import {
  MenuOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  LogoutOutlined,
  LoginOutlined,
} from "@ant-design/icons";

import SearchInput from "../Search/Search";
import { fetchListCategory } from "../../redux/TheLoai/theLoaiSlice";
import { handleLogout } from "../../services/loginKHAPI";
import { doLogoutAction } from "../../redux/accKH/accountSlice";
import {
  doDeleteItemCartAction,
  doLogoutActionCart,
} from "../../redux/order/orderSlice";
import { doLogoutActionWishlist } from "../../redux/wishlist/wishlistSlice";

import styles from "./Header.module.css";

const Header = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const dataTheLoai = useSelector((state) => state.category.listCategorys.data);
  const isAuthenticated = useSelector(
    (state) => state.accountKH.isAuthenticated
  );
  const order = useSelector((state) => state.order);
  const wishList = useSelector((state) => state.wishlist.Wishlist);
  const user = useSelector((state) => state.accountKH.user);

  const [searchQuery, setSearchQuery] = useState("");
  const queryParams = new URLSearchParams(location.search);
  let idLoaiSP = queryParams.get("IdLoaiSP");

  useEffect(() => {
    dispatch(fetchListCategory());
  }, [dispatch]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
    if (typeof query === "string") {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set("TenSP", query);
      if (idLoaiSP) searchParams.set("IdLoaiSP", idLoaiSP);

      const path = ["/mycart", "/wishlist", "/myaccount", "/checkout"].includes(
        location.pathname
      )
        ? "/all-product"
        : location.pathname;

      navigate(`${path}?${searchParams.toString()}`);
      window.scrollTo({ top: 500, behavior: "smooth" });
    }
  };

  const logoutClick = async () => {
    const res = await handleLogout();
    if (res) {
      dispatch(doLogoutAction());
      dispatch(doLogoutActionCart());
      dispatch(doLogoutActionWishlist());
      message.success("Đã đăng xuất");
      navigate("/");
    }
  };

  return (
    <div className={styles.headerWrapper}>
      {/* 1. TOP BANNER */}
      <header className={styles.topBanner}>
        <div className={styles.topBannerInner}>
          <img
            className={styles.topBannerImg}
            src="https://cdn2.cellphones.com.vn/x/https://dashboard.cellphones.com.vn/storage/Top banner_Chinh hang.svg"
            alt="chinh-hang"
          />
          {/* <img
            className={styles.topBannerImg}
            src="https://cdn2.cellphones.com.vn/x/https://dashboard.cellphones.com.vn/storage/Top%20banner_Smember.svg"
            alt="smember"
          /> */}
          <img
            className={styles.topBannerImg}
            src="https://cdn2.cellphones.com.vn/x/https://dashboard.cellphones.com.vn/storage/Top%20banner_Giao%20hang.svg"
            alt="giao-hang"
          />
        </div>
      </header>

      {/* 2. MAIN HEADER */}
      <div className={styles.mainHeader}>
        <div className={styles.container}>
          {/* Logo */}
          <div className={styles.logo} onClick={() => navigate("/")}>
            <img
              src="https://github.com/Shining1634/fontend-thuongmaidientu/blob/main/ok.png"
              alt="logo"
            />
          </div>

          {/* Danh mục */}
          <div className={styles.categoryBtn}>
            <MenuOutlined style={{ fontSize: "18px" }} />
            <span>Danh mục</span>
            <ul className={styles.categoryMenu}>
              {dataTheLoai?.map((item, index) => (
                <li
                  key={index}
                  className={styles.categoryItem}
                  onClick={() =>
                    navigate(`/all-product-category?IdLoaiSP=${item._id}`)
                  }
                >
                  <img width={25} src={item.Image} alt="icon" />
                  <span>{item.TenLoaiSP}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Tìm kiếm */}
          <div className={styles.searchBox}>
            <SearchInput
              value={searchQuery}
              onSearchChange={handleSearchChange}
            />
          </div>

          {/* Actions */}
          <div className={styles.actionGroup}>
            {/* Wishlist */}
            <div
              className={styles.actionItem}
              onClick={() => navigate("/wishlist")}
            >
              <div style={{ position: "relative" }}>
                <HeartOutlined className={styles.actionIcon} />
                {wishList?.length > 0 && (
                  <span className={styles.badge}>{wishList.length}</span>
                )}
              </div>
              <span className={styles.actionLabel}>Yêu thích</span>
            </div>

            {/* Giỏ hàng */}
            <div
              className={`${styles.actionItem} ${styles.cartContainer}`}
              onClick={() => navigate("/mycart")}
            >
              <div style={{ position: "relative" }}>
                <ShoppingCartOutlined className={styles.actionIcon} />
                <span className={styles.badge}>{order.totalQuantity}</span>
              </div>
              <span className={styles.actionLabel}>Giỏ hàng</span>

              {/* Hover Cart Preview - Logic tương tự CellphoneS */}
              <div
                className={styles.cartPopup}
                onClick={(e) => e.stopPropagation()}
              >
                <h6
                  style={{
                    borderBottom: "1px solid #eee",
                    paddingBottom: "10px",
                  }}
                >
                  Giỏ hàng của bạn
                </h6>
                {order.carts.length > 0 ? (
                  <>
                    <div style={{ maxHeight: "300px", overflowY: "auto" }}>
                      {order.carts.slice(0, 3).map((item) => (
                        <div
                          key={item._id}
                          style={{
                            display: "flex",
                            gap: "10px",
                            marginBottom: "10px",
                          }}
                        >
                          <img src={item.detail.Image} width={50} alt="item" />
                          <div style={{ fontSize: "12px" }}>
                            <div style={{ fontWeight: "600" }}>
                              {item.detail.TenSP}
                            </div>
                            <div style={{ color: "#d70018" }}>
                              {Math.ceil(item.priceDaChon).toLocaleString()}đ
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      type="primary"
                      danger
                      block
                      onClick={() => navigate("/mycart")}
                    >
                      Xem tất cả
                    </Button>
                  </>
                ) : (
                  <p style={{ color: "#666", textAlign: "center" }}>Trống</p>
                )}
              </div>
            </div>

            {/* User / Login */}
            {!isAuthenticated ? (
              <div
                className={styles.actionItem}
                onClick={() => navigate("/login-web")}
              >
                <LoginOutlined className={styles.actionIcon} />
                <span className={styles.actionLabel}>Đăng nhập</span>
              </div>
            ) : (
              <>
                <div
                  className={styles.actionItem}
                  onClick={() => navigate("/myaccount")}
                >
                  <UserOutlined className={styles.actionIcon} />
                  <span className={styles.actionLabel}>Cá nhân</span>
                </div>
                <div className={styles.actionItem} onClick={logoutClick}>
                  <LogoutOutlined className={styles.actionIcon} />
                  <span className={styles.actionLabel}>Thoát</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
