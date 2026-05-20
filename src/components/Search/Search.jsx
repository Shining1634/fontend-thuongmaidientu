import React, { useEffect, useState, useRef } from "react";
import { Input, ConfigProvider } from "antd";
import { useSelector } from "react-redux";
import { SearchOutlined } from "@ant-design/icons";
import styles from "./SearchInput.module.css";

const { Search } = Input;

const useTypingEffect = (strings, isTyping) => {
  const [placeholder, setPlaceholder] = useState("");
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (!strings || strings.length === 0 || isTyping) return;

    // Tốc độ gõ và xóa
    const timeout = setTimeout(
      () => {
        setSubIndex((prev) => prev + (reverse ? -1 : 1));
      },
      reverse ? 50 : 150
    );

    // Khi gõ hết câu, dừng 2s rồi xóa
    if (!reverse && subIndex === strings[index].length + 1) {
      clearTimeout(timeout);
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    // Khi xóa hết, chuyển sang câu tiếp theo
    if (reverse && subIndex === 0) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % strings.length);
    }

    setPlaceholder(strings[index].substring(0, subIndex));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse, strings, isTyping]);

  return placeholder;
};

const SearchInput = ({ value, onSearchChange, disabled }) => {
  const dataTheLoai = useSelector((state) => state.category.listCategorys.data);
  const [isTypingState, setIsTypingState] = useState(false);
  const [localValue, setLocalValue] = useState(value);

  // Chuyển dữ liệu thể loại thành mảng text
  const strings = dataTheLoai?.map(
    (item) => `Tìm kiếm ${item.TenLoaiSP}...`
  ) || ["Tìm sản phẩm...", "Tìm thương hiệu..."];
  const placeholder = useTypingEffect(strings, isTypingState);

  // Đồng bộ props value vào state local
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalValue(val);
    setIsTypingState(val.length > 0);
  };

  const onSearch = (val) => {
    // Thực hiện tìm kiếm và cuộn xuống phần sản phẩm
    onSearchChange(val);

    setTimeout(() => {
      const element = document.getElementById("sptrongcuahang");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#10b981", // Màu Emerald đồng bộ
        },
      }}
    >
      <div className={styles.searchWrapper}>
        <Search
          placeholder={placeholder}
          value={localValue}
          onChange={handleSearchChange}
          onSearch={onSearch}
          enterButton={
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <SearchOutlined style={{ fontSize: "18px" }} />
              <span>Tìm kiếm</span>
            </div>
          }
          size="large"
          disabled={disabled}
        />
      </div>
    </ConfigProvider>
  );
};

export default SearchInput;
