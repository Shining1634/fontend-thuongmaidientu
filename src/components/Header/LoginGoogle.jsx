// src/components/Header/LoginGoogle.jsx
import React from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { notification } from 'antd'
import { LoginGG } from '../../services/accKhAPI'

const LoginGoogle = ({ onLoginSuccess }) => {
  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential
      // Gọi API backend để verify và lấy JWT + user
      const res = await LoginGG(idToken)
      if (res && res.success) {
        const { token, user } = res
        // Lưu token vào localStorage
        localStorage.setItem('access_token', token)
        // Đẩy lên parent để dispatch Redux, navigate…
        onLoginSuccess({ token, user })
      } else {
        notification.error({
          message: 'Đăng nhập thất bại',
          description: res.message || 'Không thể đăng nhập bằng Google'
        })
      }
    } catch (err) {
      notification.error({
        message: 'Lỗi khi đăng nhập Google',
        description: err.message
      })
    }
  }

  const handleError = () => {
    notification.error({
      message: 'Google Login Failed',
      description: 'Không thể kết nối tới Google'
    })
  }

  return (
    <GoogleLogin    
      onSuccess={handleSuccess}
      onError={handleError}
    />
  )
}

export default LoginGoogle