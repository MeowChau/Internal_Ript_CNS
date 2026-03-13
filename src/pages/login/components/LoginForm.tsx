import React from "react";
import { Box, Button } from "zmp-ui";
import images from "@/assets/images";
import { TextInputWithIcon, UserIcon, LockIcon } from "./TextInputWithIcon";
import { TouchIDIcon } from "./TouchIDIcon";
import { useLogin } from "@/hooks/login/useLogin";
import "../index.css";

interface LoginFormProps {
  // Hook được truyền từ parent component
  loginHook: ReturnType<typeof useLogin>;
}

export const LoginForm: React.FC<LoginFormProps> = ({ loginHook }) => {
  const {
    username,
    password,
    loading,
    validationErrors,
    setUsername,
    setPassword,
    handleLogin,
  } = loginHook;

  return (
    <Box className="login-container">
      {/* Logo Section */}
      <Box className="logo-section">
        <img src={images.companyLogo} alt="RIPT" className="company-logo" />
      </Box>

      {/* Form Section */}
      <Box className="form-section">
        {/* Username Input */}
        <TextInputWithIcon
          label="Tài khoản"
          placeholder="Tài khoản"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          icon={<UserIcon />}
          error={validationErrors.username}
          maxLength={50}
        />

        {/* Password Input */}
        <TextInputWithIcon
          label="Mật khẩu"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          type="password"
          icon={<LockIcon />}
          error={validationErrors.password}
          maxLength={50}
        />

        {/* Login Button with Fingerprint */}
        <Box className="button-section">
          <Button
            variant="primary"
            fullWidth
            onClick={handleLogin}
            loading={loading}
            disabled={loading}
            className="login-button"
          >
            Đăng nhập
          </Button>
          <Box className="fingerprint-icon">
            <TouchIDIcon width={40} height={40} color="#003264" />
          </Box>
        </Box>
      </Box>

      {/* Illustration Section */}
      <Box className="illustration-section">
        <img 
          src={images.imageLogin} 
          alt="Illustration" 
          className="illustration-image"
        />
      </Box>
    </Box>
  );
};