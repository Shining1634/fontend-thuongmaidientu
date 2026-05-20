import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Carousel, Button, ConfigProvider, Tag, Typography } from "antd";
import {
  ThunderboltFilled,
  VerifiedOutlined,
  CustomerServiceFilled,
  GiftFilled,
  ArrowRightOutlined,
  FireFilled,
  StarFilled,
  TrophyFilled,
  TagFilled,
} from "@ant-design/icons";

import styles from "./Home.module.css";
import BodyProduct from "../../components/BodyProduct/BodyProduct";
import ModalViewDetail from "../../components/Modal/ModalViewDetail";
import { fetchListHangSX } from "../../redux/HangSX/hangSXSlice";
import { fetchListCategory } from "../../redux/TheLoai/theLoaiSlice";
import { fetchAllProduct, fetchSPDetail } from "../../services/productAPI";

const { Title, Text } = Typography;

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const dataTheLoai = useSelector((state) => state.category.listCategorys.data);

  // States
  const [idDetail, setIdDetail] = useState("");
  const [openDetail, setOpenDetail] = useState(false);
  const [dataSP, setDataSP] = useState([]);
  const [dataDetailSP, setDataDetailSP] = useState(null);
  const [dataSPNew, setDataSPNew] = useState([]);
  const [dataSPTopRated, setDataSPTopRated] = useState([]);
  const [dataSPBestSeller, setDataSPBestSeller] = useState([]);
  const [dataSPSale, setDataSPSale] = useState([]);

  // Auto-scroll Offsets
  const [offsets, setOffsets] = useState([0, 0, 0, 0]);

  useEffect(() => {
    dispatch(fetchListHangSX());
    dispatch(fetchListCategory());
    fetchAllSections();
  }, []);

  const fetchAllSections = async () => {
    const [resMain, resNew, resRated, resSale, resSeller] = await Promise.all([
      fetchAllProduct(`page=1&limit=24&sort=updatedAt&order=desc`),
      fetchAllProduct(`page=1&limit=15&sort=createdAt&order=desc`),
      fetchAllProduct(`SoLuotDanhGia=10`),
      fetchAllProduct(`GiamGiaSP=20`),
      fetchAllProduct(`SoLuotBan=10`),
    ]);

    if (resMain?.data) setDataSP(resMain.data);
    if (resNew?.data) setDataSPNew(resNew.data);
    if (resRated?.data) setDataSPTopRated(resRated.data);
    if (resSale?.data) setDataSPSale(resSale.data);
    if (resSeller?.data) setDataSPBestSeller(resSeller.data);
  };

  // Tự động cuộn cho 4 cột xu hướng
  useEffect(() => {
    const interval = setInterval(() => {
      setOffsets((prev) => prev.map((o) => (o < 1000 ? o + 90 : 0)));
    }, 3500);
    return () => clearInterval(interval);
  }, []);

  const handleRedirectDetail = (item) => {
    const ids = item.IdLoaiSP.map((l) => l._id).join(",");
    window.location.href = `/detail-product?id=${item._id}&idLoaiSP=${ids}`;
  };

  const renderMiniItem = (item) => (
    <div
      key={item._id}
      className={styles.miniCard}
      onClick={() => handleRedirectDetail(item)}
    >
      <img src={item.Image} alt="" className={styles.miniImg} />
      <div className={styles.miniInfo}>
        <h5>{item.TenSP}</h5>
        <Text style={{ color: "#d70018", fontWeight: 800 }}>
          {Math.ceil(
            item.sizes[0].price * (1 - item.GiamGiaSP / 100)
          ).toLocaleString()}
          đ
        </Text>
      </div>
    </div>
  );

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: "#d70018", borderRadius: 16 } }}
    >
      <div className={styles.homeWrapper}>
        <div className={styles.container}>
          {/* 1. HERO BANNER */}
          <section className={styles.heroSection}>
            <Carousel
              autoplay
              speed={1500}
              effect="fade"
              className={styles.bannerMain}
            >
              <div>
                <img
                  src="https://24hstore.vn/images/banners/banner_large/cover-web-30-4-pc_1743414597.webp"
                  className={styles.bannerImg}
                  alt="b1"
                />
              </div>
              <div>
                <img
                  src="https://cdn2.cellphones.com.vn/x/https://dashboard.cellphones.com.vn/storage/690x300_MacbookAirM3_v1.png"
                  className={styles.bannerImg}
                  alt="b2"
                />
              </div>
            </Carousel>
          </section>

          {/* 2. SERVICES - Floating Design */}
          <div className={styles.serviceGrid}>
            <div className={styles.serviceCard}>
              <ThunderboltFilled className={styles.serviceIcon} />
              <div className={styles.serviceInfo}>
                <h4>Giao hỏa tốc</h4>
                <p>Nhận hàng trong 2h</p>
              </div>
            </div>
            <div className={styles.serviceCard}>
              <VerifiedOutlined className={styles.serviceIcon} />
              <div className={styles.serviceInfo}>
                <h4>Chính hãng</h4>
                <p>Bảo hành 12 tháng</p>
              </div>
            </div>
            <div className={styles.serviceCard}>
              <CustomerServiceFilled className={styles.serviceIcon} />
              <div className={styles.serviceInfo}>
                <h4>Hỗ trợ 24/7</h4>
                <p>Chuyên gia tư vấn</p>
              </div>
            </div>
            <div className={styles.serviceCard}>
              <GiftFilled className={styles.serviceIcon} />
              <div className={styles.serviceInfo}>
                <h4>Ưu đãi lớn</h4>
                <p>Nhiều quà tặng kèm</p>
              </div>
            </div>
          </div>

          {/* 3. CIRCLE CATEGORIES */}
          <section style={{ marginBottom: 60 }}>
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Danh mục sản phẩm</h2>
            </div>
            <Carousel
              slidesToShow={8}
              dots={false}
              infinite
              responsive={[
                { breakpoint: 1024, settings: { slidesToShow: 5 } },
                { breakpoint: 600, settings: { slidesToShow: 3 } },
              ]}
            >
              {dataTheLoai?.map((item) => (
                <div
                  key={item._id}
                  className={styles.categoryItem}
                  onClick={() =>
                    navigate(`/all-product-category?IdLoaiSP=${item._id}`)
                  }
                >
                  <div className={styles.categoryIconWrapper}>
                    <img
                      src={item.Image}
                      alt=""
                      className={styles.categoryIcon}
                    />
                  </div>
                  <span className={styles.categoryName}>{item.TenLoaiSP}</span>
                </div>
              ))}
            </Carousel>
          </section>

          {/* 4. MAIN PRODUCTS GRID */}
          <div id="sptrongcuahang">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Săn Deal Mới Nhất</h2>
              <Button
                type="primary"
                danger
                style={{ width: "20%" }}
                shape="round"
                icon={<ArrowRightOutlined />}
                onClick={() => navigate("/all-product")}
              >
                Tất cả
              </Button>
            </div>
            <BodyProduct dataListSP={dataSP} />
          </div>

          {/* 5. TRENDING AUTO-SCROLL (FIXED HEADER) */}
          <div className={styles.trendingGrid}>
            <div className={styles.scrollCol}>
              <h3>
                <FireFilled style={{ color: "#ff4d4f" }} /> Trending
              </h3>
              <div className={styles.scrollContainer}>
                <div
                  className={styles.productListInner}
                  style={{ transform: `translateY(-${offsets[0]}px)` }}
                >
                  {dataSPNew.map(renderMiniItem)}
                </div>
              </div>
            </div>
            <div className={styles.scrollCol}>
              <h3>
                <StarFilled style={{ color: "#fadb14" }} /> Phổ biến
              </h3>
              <div className={styles.scrollContainer}>
                <div
                  className={styles.productListInner}
                  style={{ transform: `translateY(-${offsets[1]}px)` }}
                >
                  {dataSPTopRated.map(renderMiniItem)}
                </div>
              </div>
            </div>
            <div className={styles.scrollCol}>
              <h3>
                <TrophyFilled style={{ color: "#52c41a" }} /> Bán chạy
              </h3>
              <div className={styles.scrollContainer}>
                <div
                  className={styles.productListInner}
                  style={{ transform: `translateY(-${offsets[2]}px)` }}
                >
                  {dataSPBestSeller.map(renderMiniItem)}
                </div>
              </div>
            </div>
            <div className={styles.scrollCol}>
              <h3>
                <TagFilled style={{ color: "#1890ff" }} /> Giảm sốc
              </h3>
              <div className={styles.scrollContainer}>
                <div
                  className={styles.productListInner}
                  style={{ transform: `translateY(-${offsets[3]}px)` }}
                >
                  {dataSPSale.map(renderMiniItem)}
                </div>
              </div>
            </div>
          </div>
        </div>

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

export default Home;
