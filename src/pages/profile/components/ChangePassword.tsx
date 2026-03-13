import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Page, Box, Text, Input, Button } from "zmp-ui";
import { putDoiMatKhauNew } from "@/apis/user";
import { useAuth } from "@/hooks/login/useAuth";
import {
	EyeIcon,
	EyeOffIcon,
} from "@/pages/login/components/TextInputWithIcon";
import BaseModal from "@/components/common/BaseModal";
import images from "@/assets/images";
import "./ChangePassword.css";

interface PasswordFieldProps {
	label: string;
	value: string;
	placeholder: string;
	onChange: (value: string) => void;
}

const PasswordField: React.FC<PasswordFieldProps> = ({
	label,
	value,
	placeholder,
	onChange,
}) => {
	const [show, setShow] = useState(false);

	return (
		<Box className="cp-field-wrap">
			<Text className="cp-label">
				{label} <span className="cp-required">*</span>
			</Text>
			<Box className="cp-input-shell">
				<Input
					type={show ? "text" : "password"}
					value={value}
					placeholder={placeholder}
					onChange={(e) => onChange(e.target.value)}
					className="cp-input"
					style={{ fontSize: "16px" }}
				/>
				<button
					type="button"
					className="cp-eye-btn"
					onClick={() => setShow((prev) => !prev)}
					aria-label={show ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
				>
					{show ? <EyeOffIcon /> : <EyeIcon />}
				</button>
			</Box>
		</Box>
	);
};

function ChangePasswordPage() {
	const navigate = useNavigate();
	const { logout } = useAuth();
	const [loading, setLoading] = useState(false);
	const [oldPassword, setOldPassword] = useState("");
	const [newPassword, setNewPassword] = useState("");
	const [repeatPassword, setRepeatPassword] = useState("");
	const [modalVisible, setModalVisible] = useState(false);
	const [modalMessage, setModalMessage] = useState("");
	const [shouldLogoutAfterClose, setShouldLogoutAfterClose] = useState(false);

	const showMessage = (message: string, shouldLogout = false) => {
		setModalMessage(message);
		setShouldLogoutAfterClose(shouldLogout);
		setModalVisible(true);
	};

	const validate = () => {
		if (!oldPassword || !newPassword || !repeatPassword) {
			showMessage("Vui lòng nhập đầy đủ thông tin.");
			return false;
		}

		if (newPassword !== repeatPassword) {
			showMessage("Mật khẩu mới và xác nhận mật khẩu không khớp.");
			return false;
		}

		if (newPassword.length < 4 || newPassword.length > 12) {
			showMessage("Mật khẩu mới phải từ 4 đến 12 ký tự.");
			return false;
		}

		return true;
	};

	const onSubmit = async () => {
		if (!validate()) {
			return;
		}

		try {
			setLoading(true);
			await putDoiMatKhauNew({ oldPassword, newPassword });
			showMessage("Đổi mật khẩu thành công. Vui lòng đăng nhập lại.", true);
		} catch (error: any) {
			const message =
				error?.response?.data?.message ||
				error?.response?.data?.detail ||
				"Đổi mật khẩu thất bại.";
			showMessage(message);
		} finally {
			setLoading(false);
		}
	};

	const handleCloseModal = async () => {
		setModalVisible(false);

		if (shouldLogoutAfterClose) {
			await logout();
			navigate("/login", { replace: true });
		}
	};

	return (
		<Page className="change-password-page">
			<Box className="cp-header">
				<button
					type="button"
					className="cp-back-btn"
					onClick={() => navigate(-1)}
					aria-label="Quay lại"
				>
					<svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
						<path
							d="M15 6L9 12L15 18"
							stroke="white"
							strokeWidth="2.8"
							strokeLinecap="round"
							strokeLinejoin="round"
						/>
					</svg>
				</button>

				<Text className="cp-title">Đổi mật khẩu</Text>

				<img src={images.companyLogoWhite} alt="RIPT" className="cp-logo" />
			</Box>

			<Box className="cp-body">
				<PasswordField
					label="Mật khẩu cũ"
					placeholder="Mật khẩu cũ"
					value={oldPassword}
					onChange={setOldPassword}
				/>

				<PasswordField
					label="Mật khẩu mới"
					placeholder="Mật khẩu mới"
					value={newPassword}
					onChange={setNewPassword}
				/>

				<PasswordField
					label="Xác nhận mật khẩu mới"
					placeholder="Xác nhận mật khẩu"
					value={repeatPassword}
					onChange={setRepeatPassword}
				/>

				<Button
					variant="primary"
					className="cp-submit-btn"
					fullWidth
					loading={loading}
					disabled={loading}
					onClick={onSubmit}
				>
					Đổi mật khẩu
				</Button>
			</Box>

			<BaseModal
				visible={modalVisible}
				onRightText={handleCloseModal}
				turnOffModal={handleCloseModal}
				config={{
					image: images.icDialog,
					title: "Thông báo",
					description: modalMessage,
					rightText: "Đóng",
				}}
				numberOfBtn="one-button"
			/>
		</Page>
	);
}

export default ChangePasswordPage;
