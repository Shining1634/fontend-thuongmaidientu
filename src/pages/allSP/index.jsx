import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  Col,
  Form,
  InputNumber,
  Pagination,
  Row,
  Select,
  ConfigProvider,
  Empty,
  Space,
  Tooltip,
  Divider,
} from "antd";
import { GrPowerReset } from "react-icons/gr";
import { FiFilter } from "react-icons/fi";
import { IoWarningOutline } from "react-icons/io5";

import styles from "./AllProduct.module.css";
import BodyProduct from "../../components/BodyProduct/BodyProduct";
import { fetchListHangSX } from "../../redux/HangSX/hangSXSlice";
import { fetchListCategory } from "../../redux/TheLoai/theLoaiSlice";
import { fetchAllProduct } from "../../services/productAPI";

const AllProduct = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formLocGia] = Form.useForm();
  const location = useLocation();

  const dataTheLoai = useSelector((state) => state.category.listCategorys.data);
  const dataHangSX = useSelector((state) => state.hangSX.listHangSXs.data);

  const [dataListSP, setDataListSP] = useState([]);
  const [current, setCurrent] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [total, setTotal] = useState(0);

  const [tuSelected, setTuSelected] = useState("");
  const [denSelected, setDenSelected] = useState("");
  const [categorySelected, setCategorySelected] = useState([]);
  const [hangSXSelected, setHangSXSelected] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  let tenSearch = queryParams.get("TenSP");

  const fetchListSP = async () => {
    let query = `page=${current}&limit=${pageSize}`;
    if (tenSearch) query += `&TenSP=${encodeURIComponent(tenSearch)}`;
    if (tuSelected) query += `&tu=${tuSelected}`;
    if (denSelected) query += `&den=${denSelected}`;
    if (categorySelected?.length > 0) {
      query += `&locTheoLoai=${encodeURIComponent(
        JSON.stringify(categorySelected)
      )}`;
    }
    if (hangSXSelected?.length > 0) {
      query += `&locTheoHangSX=${encodeURIComponent(
        JSON.stringify(hangSXSelected)
      )}`;
    }

    const res = await fetchAllProduct(query);
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
    tuSelected,
    denSelected,
    categorySelected,
    hangSXSelected,
  ]);

  useEffect(() => {
    dispatch(fetchListHangSX());
    dispatch(fetchListCategory());
  }, [dispatch]);

  const onFinishLocGia = (values) => {
    setTuSelected(values.tu || "");
    setDenSelected(values.den || "");
    setCurrent(1);
  };

  const cancelSelected = () => {
    formLocGia.resetFields();
    setTuSelected("");
    setDenSelected("");
    setCategorySelected([]);
    setHangSXSelected([]);
    setCurrent(1);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#d70018",
          borderRadius: 8,
        },
      }}
    >
      <div className={styles.allProductPage}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumbArea}>
          <div className={styles.container}>
            <Space style={{ fontSize: "14px", color: "#666" }}>
              <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
                Home
              </span>
              <span style={{ color: "#ccc" }}>/</span>
              <span style={{ color: "#d70018", fontWeight: 700 }}>
                Tất cả sản phẩm
              </span>
            </Space>
          </div>
        </div>

        <div className={styles.container}>
          <div className={styles.mainLayout}>
            {/* SIDEBAR FILTER */}
            <aside className={styles.sidebar}>
              <div className={styles.filterGroup}>
                <div className={styles.filterTitle}>
                  <span>
                    <FiFilter style={{ marginRight: 8 }} />
                    BỘ LỌC
                  </span>
                  <Tooltip title="Đặt lại">
                    <Button
                      type="text"
                      onClick={cancelSelected}
                      icon={<GrPowerReset />}
                      danger
                    />
                  </Tooltip>
                </div>
              </div>

              {/* Lọc Giá */}
              <div className={styles.filterGroup}>
                <p style={{ fontWeight: 700, marginBottom: 15 }}>Khoảng giá</p>
                <Form
                  form={formLocGia}
                  onFinish={onFinishLocGia}
                  layout="vertical"
                  className={styles.priceForm}
                >
                  <Row gutter={8}>
                    <Col span={11}>
                      <Form.Item name="tu">
                        <InputNumber
                          min={0}
                          placeholder="Từ"
                          style={{ width: "100%" }}
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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
                          formatter={(value) =>
                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
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

              <Divider style={{ margin: "15px 0" }} />

              {/* Lọc Loại */}
              <div className={styles.filterGroup}>
                <p style={{ fontWeight: 700, marginBottom: 15 }}>
                  Loại sản phẩm
                </p>
                <Checkbox.Group
                  className={styles.modernCheckbox}
                  value={categorySelected}
                  onChange={(val) => {
                    setCategorySelected(val);
                    setCurrent(1);
                  }}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {dataTheLoai?.map((item) => (
                      <Checkbox key={item._id} value={item._id}>
                        {item.TenLoaiSP}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </div>

              <Divider style={{ margin: "15px 0" }} />

              {/* Lọc Thương hiệu */}
              <div className={styles.filterGroup}>
                <p style={{ fontWeight: 700, marginBottom: 15 }}>Thương hiệu</p>
                <Checkbox.Group
                  className={styles.modernCheckbox}
                  value={hangSXSelected}
                  onChange={(val) => {
                    setHangSXSelected(val);
                    setCurrent(1);
                  }}
                >
                  <Space direction="vertical" style={{ width: "100%" }}>
                    {dataHangSX?.map((item) => (
                      <Checkbox key={item._id} value={item._id}>
                        {item.TenHangSX}
                      </Checkbox>
                    ))}
                  </Space>
                </Checkbox.Group>
              </div>
            </aside>

            {/* PRODUCT LIST */}
            <main className={styles.contentArea}>
              <div className={styles.headerActions}>
                <h2 className={styles.listTitle}>
                  {tenSearch
                    ? `Kết quả tìm kiếm cho: "${tenSearch}"`
                    : "Tất cả sản phẩm"}
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
                <Select
                  defaultValue="default"
                  style={{ width: 180 }}
                  options={[
                    { value: "default", label: "Sắp xếp theo" },
                    { value: "price-asc", label: "Giá thấp đến cao" },
                    { value: "price-desc", label: "Giá cao đến thấp" },
                  ]}
                />
              </div>

              {dataListSP?.length > 0 ? (
                <BodyProduct
                  dataListSP={dataListSP}
                  current={current}
                  pageSize={pageSize}
                  total={total}
                  setCurrent={setCurrent}
                  setPageSize={setPageSize}
                />
              ) : (
                <div
                  style={{
                    background: "#fff",
                    padding: "100px 0",
                    borderRadius: "12px",
                    textAlign: "center",
                  }}
                >
                  <Empty
                    image={<IoWarningOutline size={100} color="#d70018" />}
                    description={
                      <span style={{ fontSize: "18px", fontWeight: 600 }}>
                        Rất tiếc, không tìm thấy sản phẩm nào phù hợp!
                      </span>
                    }
                  />
                  <Button
                    type="primary"
                    onClick={cancelSelected}
                    style={{ marginTop: 20 }}
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                </div>
              )}

              {/* Phân trang - Chỉ hiển thị khi có SP */}
              {dataListSP?.length > 0 && (
                <div style={{ marginTop: 40, textAlign: "center" }}>
                  <Pagination
                    current={current}
                    pageSize={pageSize}
                    total={total}
                    onChange={(p, s) => {
                      setCurrent(p);
                      setPageSize(s);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                    }}
                    showSizeChanger
                    responsive
                  />
                </div>
              )}
            </main>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
};

export default AllProduct;
