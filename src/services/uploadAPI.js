import axios from "../utils/axios-customize";

// upload hình ảnh
export const uploadImg = (file) => {
    const bodyFormData = new FormData();
    bodyFormData.append("file", file);
    return axios({
        method: "post",
        url: "/api/upload/upload",
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book",
        },
    });
};

// delete hình ảnh drive
export const deleteImg = (fileId) => {
    return axios({
        method: "post",
        url: `/api/upload/delete`,
        data: {
            fileId: fileId,
        },
    });
};

export const uploadImgMultiple = (files) => {
    const bodyFormData = new FormData();
    bodyFormData.append("files", files);
    return axios({
        method: "post",
        url: "/api/upload/upload-multiple",
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
            "upload-type": "book",
        },
    });
};

// Upload Excel
export const uploadExcel = (file) => {
    const bodyFormData = new FormData();
    bodyFormData.append("file", file); // Đảm bảo tên trường 'file' trùng với trong backend
    // bodyFormData.append('originalFileName', file.name);  // Truyền tên gốc của file vào body

    return axios({
        method: "post",
        url: "/api/upload/upload-excel", // Endpoint API upload file Excel
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data", // Quan trọng để gửi đúng định dạng multipart
            "upload-type": "excel", // Có thể thêm type nếu cần thiết
        },
    });
};

export const uploadImageToDrive = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await axios.post(
            "/api/upload/upload-image-to-drive",
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error uploading image to Google Drive:", error);
        throw error;
    }
};
