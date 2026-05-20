import React, { useState } from "react";
import {
  Tooltip,
  Button,
  ConfigProvider,
  Empty,
  notification,
  Space,
} from "antd";
import { IoWarningOutline } from "react-icons/io5";
import { RiDeleteBin6Line } from "react-icons/ri";
import {
  ShoppingCartOutlined,
  HomeOutlined,
  HeartFilled,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import { doDeleteItemWishlistAction } from "../../redux/wishlist/wishlistSlice";
import {
  checkProductAvailability,
  doAddAction,
} from "../../redux/order/orderSlice";
import styles from "./WishList.module.css";

const WishList = () => {
  const wishList = useSelector((state) => state.wishlist.Wishlist);
  const user = useSelector((state) => state.accountKH.user);
  const customerId = user?._id;
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [currentQuantity] = useState(1);
  const [discountCode] = useState("MAVOUCHER");

  const handleRedirectDetail = (item) => {
    const idLoaiSPString = item.IdLoaiSP.map((loai) => loai._id).join(",");
    window.location.href = `/detail-product?id=${item._id}&idLoaiSP=${idLoaiSPString}`;
  };

  const deleteWishlistAProduct = (productId, size) => {
    dispatch(doDeleteItemWishlistAction({ productId, size, customerId }));
  };

  const handleAddToCart = (product, giaChon, sizeChon) => {
    dispatch(
      checkProductAvailability({
        dataDetailSP: product,
        selectedSize: sizeChon,
        currentQuantity,
      })
    )
      .then((availability) => {
        if (!availability.payload) {
          notification.error({
            message: "Sản phẩm hết hàng",
            description:
              "Xin lỗi, hiện tại sản phẩm này không đủ số lượng trong kho.",
          });
          return;
        }
        dispatch(
          doAddAction({
            dataDetailSP: product,
            currentQuantity,
            discountCode,
            customerId,
            selectedItemss: giaChon,
            selectedSize: sizeChon,
          })
        );
        notification.success({
          message: "Thành công",
          description: "Đã thêm sản phẩm vào giỏ hàng của bạn.",
        });
      })
      .catch((error) => {
        console.error("Lỗi thêm giỏ hàng:", error);
      });
  };

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: "#d70018", borderRadius: 10 } }}
    >
      <div className={styles.wishlistPage}>
        {/* Breadcrumb Area */}
        <div className={styles.breadcrumbArea}>
          <div className={styles.container}>
            <Space style={{ fontSize: "14px", color: "#666" }}>
              <HomeOutlined
                onClick={() => navigate("/")}
                style={{ cursor: "pointer" }}
              />
              <span>/</span>
              <b style={{ color: "#d70018" }}>Danh sách yêu thích</b>
            </Space>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.wishlistCard}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                marginBottom: "25px",
              }}
            >
              <HeartFilled style={{ color: "#d70018", fontSize: "24px" }} />
              <h4 style={{ margin: 0, fontWeight: 800 }}>
                SẢN PHẨM BẠN ĐÃ THÍCH
              </h4>
            </div>

            {wishList.length > 0 ? (
              <>
                {/* Table Header */}
                <div className={styles.headerRow}>
                  <div>Sản phẩm</div>
                  <div style={{ textAlign: "center" }}>Giá niêm yết</div>
                  <div style={{ textAlign: "center" }}>Giá khuyến mãi</div>
                  <div></div>
                </div>

                {/* List Items */}
                {wishList.map((item, index) => {
                  const product = item.detail;
                  const discountedPrice = Math.ceil(
                    item.priceDaChon * (1 - product.GiamGiaSP / 100)
                  );

                  return (
                    <div
                      className={styles.wishlistItem}
                      key={`${item._id}-${index}`}
                    >
                      <div className={styles.productInfo}>
                        <div className={styles.closeBtn}>
                          <Tooltip title="Xóa khỏi danh sách">
                            <Button
                              type="text"
                              danger
                              className={styles.deleteBtn}
                              icon={<RiDeleteBin6Line size={22} />}
                              onClick={() =>
                                deleteWishlistAProduct(
                                  item._id,
                                  item.sizeDaChon
                                )
                              }
                            />
                          </Tooltip>
                        </div>
                        <img
                          src={product.Image}
                          className={styles.thumbnail}
                          alt="thumb"
                          onClick={() => handleRedirectDetail(product)}
                        />
                        <div>
                          <h6
                            className={styles.itemTitle}
                            onClick={() => handleRedirectDetail(product)}
                          >
                            {product.TenSP}
                          </h6>
                          <span className={styles.itemConfig}>
                            Cấu hình: {item.sizeDaChon}
                          </span>
                        </div>
                      </div>

                      <div className={styles.oldPrice}>
                        {item.priceDaChon.toLocaleString()}đ
                      </div>

                      <div className={styles.sellPrice}>
                        {discountedPrice.toLocaleString()}đ
                      </div>

                      <div className={styles.actionArea}>
                        <Button
                          type="primary"
                          icon={<ShoppingCartOutlined />}
                          className={styles.addToCartBtn}
                          onClick={() =>
                            handleAddToCart(
                              product,
                              item.priceDaChon,
                              item.sizeDaChon
                            )
                          }
                        >
                          Thêm vào giỏ
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </>
            ) : (
              <div className={styles.emptyState}>
                <Empty
                  image={<IoWarningOutline size={100} color="#d1d5db" />}
                  description={
                    <span style={{ fontSize: "18px", color: "#666" }}>
                      Danh sách yêu thích đang trống
                    </span>
                  }
                >
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/")}
                  >
                    Quay lại trang chủ
                  </Button>
                </Empty>
              </div>
            )}
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default WishList;
