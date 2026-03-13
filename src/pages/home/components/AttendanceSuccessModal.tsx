import React from "react"
import { Box, Text, Modal, Button } from "zmp-ui"
import images from "@/assets/images"
import "./AttendanceSuccessModal.css"

type Props = {
  visible: boolean
  onClose: () => void
  type: "checkIn" | "checkOut"
  time: string
}

const AttendanceSuccessModal: React.FC<Props> = ({ visible, onClose, type, time }) => {
  const title = type === "checkIn" ? "Check-in thành công!" : "Check-out thành công!"
  const slogan = type === "checkIn" 
    ? "Chúc bạn một ngày làm việc hiệu quả!" 
    : "Cảm ơn bạn đã làm việc chăm chỉ!"

  return (
    <Modal
      visible={visible}
      onClose={onClose}
      title=""
      modalStyle={{
        borderRadius: "12px",
        maxWidth: "90%",
        width: "350px"
      }}
    >
      <Box className="attendance-success-modal">
        <Box className="success-icon-wrapper">
          <img 
            src={images.unnamed} 
            alt="success" 
            className="success-icon"
          />
        </Box>
        
        <Text className="success-title">{title}</Text>
        <Text className="success-slogan">{slogan}</Text>
        
        <Box className="success-info">
          <Box className="info-row">
            <img src={images.unnamed} alt="check" className="info-icon" />
            <Text className="info-text">
              {type === "checkIn" ? "Thời gian check in" : "Thời gian check out"}: {time}
            </Text>
          </Box>
        </Box>
        
        <Button
          onClick={onClose}
          className="success-button"
        >
          OK
        </Button>
      </Box>
    </Modal>
  )
}

export default AttendanceSuccessModal
