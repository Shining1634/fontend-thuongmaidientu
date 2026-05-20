import React, { useEffect, useState } from "react";
import {
  Button,
  Carousel,
  Pagination,
  Row,
  Col,
  ConfigProvider,
  Empty,
  Tooltip,
} from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { IoWarningOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import styles from "./BodyProduct.module.css";
import ModalViewDetail from "../Modal/ModalViewDetail";
import { fetchSPDetail } from "../../services/productAPI";
import {
  checkProductAvailability,
  doAddAction,
} from "../../redux/order/orderSlice";
import { doAddActionWishlist } from "../../redux/wishlist/wishlistSlice";

import imgBanner1 from "../../assets/images/banner/imgBannerpng2.png";
import bannert2 from "../../assets/images/banner/bannert2.jpg";
import bannert3 from "../../assets/images/banner/banner-apple-didongviet.jpg";

const BodyProduct = (props) => {
  const { dataListSP, current, setCurrent, setPageSize, pageSize, total } =
    props;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const customerId = useSelector((state) => state.accountKH.user._id);

  const [openDetail, setOpenDetail] = useState(false);
  const [dataDetailSP, setDataDetailSP] = useState(null);
  const [idDetail, setIdDetail] = useState("");
  const [currentQuantity] = useState(1);

  const fetchProductDetail = async () => {
    if (idDetail) {
      const res = await fetchSPDetail(idDetail);
      if (res && res.data) setDataDetailSP(res.data);
    }
  };

  useEffect(() => {
    if (idDetail) fetchProductDetail();
  }, [idDetail]);

  const handleOnchangePage = (p, s) => {
    setCurrent(p);
    setPageSize(s);
    window.scrollTo({ top: 500, behavior: "smooth" });
  };

  const handleRedirectDetail = (item) => {
    const idLoaiSPString = item.IdLoaiSP.map((loai) => loai._id).join(",");
    window.location.href = `/detail-product?id=${item._id}&idLoaiSP=${idLoaiSPString}`;
  };

  const handleAddToCart = (product) => {
    const sizeChon = product.sizes[0].size;
    const giaChon = product.sizes[0].price;

    dispatch(
      checkProductAvailability({
        dataDetailSP: product,
        selectedSize: sizeChon,
        currentQuantity,
      })
    ).then((availability) => {
      if (availability.payload) {
        dispatch(
          doAddAction({
            dataDetailSP: product,
            currentQuantity,
            discountCode: "MAVOUCHER",
            customerId,
            selectedItemss: giaChon,
            selectedSize: sizeChon,
          })
        );
      } else {
        message.error("Sản phẩm đã hết hàng trong kho!");
      }
    });
  };

  return (
    <ConfigProvider theme={{ token: { colorPrimary: "#d70018" } }}>
      <div className={styles.container}>
        {/* Banner Section */}
        {/* <div className={styles.bannerWrapper}>
          <Carousel autoplay speed={800} autoplaySpeed={3500} effect="fade">
            <img className={styles.bannerImg} src={imgBanner1} alt="banner 1" />
            <img className={styles.bannerImg} src={bannert2} alt="banner 2" />
            <img className={styles.bannerImg} src={bannert3} alt="banner 3" />
          </Carousel>
        </div> */}

        {/* Product Section */}
        <div className={styles.productGrid}>
          {dataListSP.length > 0 ? (
            dataListSP.map((item, index) => (
              <div className={styles.productCard} key={index}>
                {item.GiamGiaSP > 0 && (
                  <div className={styles.discountBadge}>
                    Giảm {item.GiamGiaSP}%
                  </div>
                )}

                <div
                  className={styles.imageWrapper}
                  onClick={() => handleRedirectDetail(item)}
                >
                  <img
                    src={item.Image}
                    alt={item.TenSP}
                    className={styles.productImg}
                  />
                </div>

                <div className={styles.productContent}>
                  <span className={styles.brandName}>
                    {item.IdHangSX?.TenHangSX}
                  </span>
                  <h3
                    className={styles.productName}
                    onClick={() => handleRedirectDetail(item)}
                  >
                    {item.TenSP}
                  </h3>

                  <div className={styles.priceSection}>
                    <span className={styles.currentPrice}>
                      {Math.ceil(
                        item.sizes[0].price * (1 - item.GiamGiaSP / 100)
                      ).toLocaleString()}
                      đ
                    </span>
                    {item.GiamGiaSP > 0 && (
                      <span className={styles.oldPrice}>
                        {item.sizes[0].price.toLocaleString()}đ
                      </span>
                    )}
                  </div>

                  <div className={styles.actionGroup}>
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      className={styles.addToCartBtn}
                      onClick={() => handleAddToCart(item)}
                    >
                      Thêm vào giỏ
                    </Button>
                    <Tooltip title="Xem nhanh">
                      <button
                        className={styles.wishlistBtn}
                        onClick={() => {
                          setIdDetail(item._id);
                          setOpenDetail(true);
                        }}
                      >
                        <EyeOutlined />
                      </button>
                    </Tooltip>
                    <Tooltip title="Yêu thích">
                      <button
                        className={styles.wishlistBtn}
                        onClick={() =>
                          dispatch(
                            doAddActionWishlist({
                              dataDetailSP: item,
                              customerId,
                              selectedItemss: item.sizes[0].price,
                              selectedSize: item.sizes[0].size,
                            })
                          )
                        }
                      >
                        <HeartOutlined />
                      </button>
                    </Tooltip>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <Empty
                image={<IoWarningOutline size={80} color="#d70018" />}
                description="Rất tiếc, không tìm thấy sản phẩm nào!"
              />
            </div>
          )}
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Pagination
              current={current}
              pageSize={pageSize}
              total={total}
              onChange={handleOnchangePage}
              showSizeChanger
              pageSizeOptions={["12", "24", "48"]}
            />
          </div>
        )}

        <ModalViewDetail
          openDetail={openDetail}
          setOpenDetail={setOpenDetail}
          setDataDetailSP={setDataDetailSP}
          setIdDetail={setIdDetail}
          dataDetailSP={dataDetailSP}
        />
      </div>
    </ConfigProvider>
  );
};

export default BodyProduct;
