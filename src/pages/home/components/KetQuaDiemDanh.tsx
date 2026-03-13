import React from "react"
import { Box, Text, Modal, Button } from "zmp-ui"
import moment from "moment"
import "./KetQuaDiemDanh.css"
import images from "@/assets/images"

type Props = {
  visible: boolean
  onShowModal: (visible: boolean) => void
  response: any
  loaiDiemDanh: string
}

const KetQuaDiemDanh: React.FC<Props> = (props: Props) => {
  const { visible, onShowModal, response, loaiDiemDanh } = props

  const timeCheck =
    loaiDiemDanh === "CHECK_IN"
      ? moment(response?.thoiGianCheckIn || new Date()).format("YYYY-MM-DD HH:mm:ss")
      : moment(response?.thoiGianCheckOut || new Date()).format("YYYY-MM-DD HH:mm:ss")

  const PopupContent = () => {
    return (
      <Box className="ket-qua-container">
        <ViewIcon />
        <Box className="view-content">
          <Text className="title">Thông báo</Text>
          <Text className="slogan">Điểm danh thành công</Text>
          <Text className="time-text">Thời gian: {timeCheck}</Text>
          <Button
            onClick={() => onShowModal && onShowModal(false)}
            className="btn-ok"
          >
            Đồng ý
          </Button>
        </Box>
      </Box>
    )
  }

  return (
    <Modal
      visible={visible}
      onClose={() => onShowModal && onShowModal(false)}
      className="ket-qua-modal"
    >
      <Box className="modal-overlay" onClick={() => onShowModal && onShowModal(false)} />
      <PopupContent />
    </Modal>
  )
}

const ViewIcon = () => {
  return (
    <Box className="view-icon">
      <img 
        src={images.iconCheck} 
        alt="success" 
        className="icon-check"
      />
    </Box>
  )
}

export default KetQuaDiemDanh
