import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  Col,
  Form,
  InputNumber,
  Row,
  Space,
  ConfigProvider,
  Breadcrumb,
  Tooltip,
} from "antd";
import { GrPowerReset } from "react-icons/gr";
import { HomeOutlined } from "@ant-design/icons";

import styles from "./ProductToCategory.module.css";
import BodyProduct from "../../components/BodyProduct/BodyProduct";
import { fetchAllProductToCategoryLienQuan } from "../../services/productAPI";
import { fetchListHangSX } from "../../redux/HangSX/hangSXSlice";
import { fetchListCategory } from "../../redux/TheLoai/theLoaiSlice";
import { fetchOneTheLoai } from "../../services/loaiSPAPI";

const ProductToCategory = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formLocGia] = Form.useForm();
  const location = useLocation();

  const dataHangSX = useSelector((state) => state.hangSX.listHangSXs.data);
  const [dataListSP, setDataListSP] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [total, setTotal] = useState(0);
  const [dataLoaiSP, setDataLoaiSP] = useState(null);

  const [tuSelected, setTuSelected] = useState("");
  const [denSelected, setDenSelected] = useState("");
  const [hangSXSelected, setHangSXSelected] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  let tenSearch = queryParams.get("TenSP");
  let idLoaiSP = queryParams.get("IdLoaiSP");

  const fetchOneLSP = async () => {
    if (!idLoaiSP) return;
    const query = `IdLoaiSP=${
      Array.isArray(idLoaiSP) ? idLoaiSP.join(",") : idLoaiSP
    }`;
    const res = await fetchOneTheLoai(query);
    if (res && res.data) {
      setDataLoaiSP(res.data);
    }
  };

  const fetchListSP = async () => {
    let query = `page=${current}&limit=${pageSize}`;
    if (tenSearch) query += `&TenSP=${encodeURIComponent(tenSearch)}`;
    if (tuSelected) query += `&tu=${tuSelected}`;
    if (denSelected) query += `&den=${denSelected}`;
    if (hangSXSelected?.length > 0) {
      query += `&locTheoHangSX=${encodeURIComponent(
        JSON.stringify(hangSXSelected)
      )}`;
    }
    if (idLoaiSP) {
      query += `&IdLoaiSP=${
        Array.isArray(idLoaiSP) ? idLoaiSP.join(",") : idLoaiSP
      }`;
    }

    const res = await fetchAllProductToCategoryLienQuan(query);
    if (res && res.data) {
      setDataListSP(res.data);
      setTotal(res.totalSanPham);
    }
  };

  useEffect(() => {
    fetchListSP();
  }, [
    tenSearch,
    current,
    pageSize,
    idLoaiSP,
    tuSelected,
    denSelected,
    hangSXSelected,
  ]);
  useEffect(() => {
    fetchOneLSP();
  }, [idLoaiSP]);
  useEffect(() => {
    dispatch(fetchListHangSX());
    dispatch(fetchListCategory());
  }, [dispatch]);

  const onFinishLocGia = (values) => {
    setTuSelected(values.tu);
    setDenSelected(values.den);
    setCurrent(1);
  };

  const cancelSelected = () => {
    formLocGia.resetFields();
    setTuSelected("");
    setDenSelected("");
    setHangSXSelected([]);
    setCurrent(1);
  };

  return (
    <ConfigProvider
      theme={{ token: { colorPrimary: "#d70018", borderRadius: 8 } }}
    >
      <div className={styles.pageWrapper}>
        {/* Breadcrumb Section */}
        <div className={styles.breadcrumbArea}>
          <div className={styles.container}>
            <Breadcrumb
              items={[
                {
                  title: (
                    <span
                      onClick={() => navigate("/")}
                      style={{ cursor: "pointer" }}
                    >
                      <HomeOutlined /> Home
                    </span>
                  ),
                },
                {
                  title: (
                    <span style={{ color: "#d70018", fontWeight: 700 }}>
                      {dataLoaiSP?.TenLoaiSP || "Danh mục"}
                    </span>
                  ),
                },
              ]}
            />
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.mainLayout}>
            {/* SIDEBAR FILTER */}
            <aside className={styles.sidebar}>
              <div className={styles.filterBox}>
                <div className={styles.filterHeader}>
                  <h5 className={styles.filterTitle}>KHOẢNG GIÁ</h5>
                  <Tooltip title="Đặt lại">
                    <GrPowerReset
                      className={styles.resetBtn}
                      onClick={cancelSelected}
                      size={18}
                    />
                  </Tooltip>
                </div>
                <Form
                  form={formLocGia}
                  onFinish={onFinishLocGia}
                  layout="vertical"
                  className={styles.priceForm}
                >
                  <Row gutter={10}>
                    <Col span={11}>
                      <Form.Item name="tu">
                        <InputNumber
                          min={0}
                          placeholder="Từ"
                          style={{ width: "100%" }}
                          formatter={(v) =>
                            `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                        />
                      </Form.Item>
                    </Col>
                    <Col
                      span={2}
                      style={{ textAlign: "center", paddingTop: 5 }}
                    >
                      -
                    </Col>
                    <Col span={11}>
                      <Form.Item name="den">
                        <InputNumber
                          min={0}
                          placeholder="Đến"
                          style={{ width: "100%" }}
                          formatter={(v) =>
                            `${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                          }
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className={styles.applyBtn}
                  >
                    ÁP DỤNG
                  </Button>
                </Form>
              </div>

              <div className={styles.filterBox}>
                <div className={styles.filterHeader}>
                  <h5 className={styles.filterTitle}>THƯƠNG HIỆU</h5>
                </div>
                <Checkbox.Group
                  style={{ width: "100%" }}
                  value={hangSXSelected}
                  onChange={(val) => {
                    setHangSXSelected(val);
                    setCurrent(1);
                  }}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {dataHangSX?.map((item) => (
                      <Checkbox
                        key={item._id}
                        value={item._id}
                        className={styles.customCheckbox}
                      >
                        {item.TenHangSX}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </div>
            </aside>

            {/* PRODUCT LIST CONTENT */}
            <section>
              <div className={styles.contentHeader}>
                <h2 className={styles.categoryTitle}>
                  {tenSearch
                    ? `Kết quả cho: "${tenSearch}"`
                    : dataLoaiSP?.TenLoaiSP}
                  <span
                    style={{
                      fontSize: "14px",
                      color: "#888",
                      fontWeight: 400,
                      marginLeft: 15,
                    }}
                  >
                    ({total} sản phẩm)
                  </span>
                </h2>
              </div>

              <BodyProduct
                dataListSP={dataListSP}
                current={current}
                setCurrent={setCurrent}
                setPageSize={setPageSize}
                pageSize={pageSize}
                total={total}
                setTotal={setTotal}
              />
            </section>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default ProductToCategory;
