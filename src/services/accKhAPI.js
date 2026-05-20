import axios from "../utils/axios-customize"

export const fetchAllAccKH = (query) => {
    const URL_BACKEND = `/api/acckh/get-kh?${query}`    
    return axios.get(URL_BACKEND)
}

export const fetchOneAccKH = (id) => {
    const URL_BACKEND = `/api/acckh/get-one-kh?${id}`    
    return axios.get(URL_BACKEND)
}

export const deleteAccKH = (id) => {
    return axios.delete(`/api/acckh/delete-kh/${id}`)
}

export const updateAccKH = (id, fullName, IdVoucher) => {
    return axios.put('/api/acckh/update-kh', {
        id, fullName, IdVoucher
    })
}

export const khoaAccKH = (id, isActive) => {
    return axios.put('/api/acckh/khoa-kh', {
        id, isActive
    })
}

export const doiThongTinKH = (_idAcc, fullName, email, phone, address, passwordMoi, image) => {
    return axios.put('/api/acckh/doi-thong-tin', {
        _idAcc, fullName, email, phone, address, passwordMoi, image
    })
}

export const LoginGG = (idToken) => {
    return axios.post('/api/auth/google', {
        idToken
    })
}