import React from "react";
import { Modal, Box, Button, Text } from "zmp-ui";
import "./BaseModal.css";

export type ModalType = "one-button" | "two-button";

interface BaseModalProps {
  visible: boolean;
  config: {
    image?: string; // URL or imported image
    imageClassName?: string;
    title?: string;
    description: string;
    leftText?: string;
    rightText?: string;
  };
  onRightText?: () => void;
  onLeftText?: () => void;
  turnOffModal?: () => void;
  numberOfBtn?: ModalType;
}

interface ViewBtnProps {
  numberOfBtn: ModalType;
  config: BaseModalProps["config"];
  onLeftText?: () => void;
  onRightText?: () => void;
}

const ViewBtn: React.FC<ViewBtnProps> = ({
  numberOfBtn,
  config,
  onLeftText,
  onRightText,
}) => {
  if (numberOfBtn === "two-button") {
    return (
      <Box className="base-modal-btn-container">
        <Button
          variant="secondary"
          onClick={onLeftText}
          className="base-modal-btn base-modal-btn-cancel"
        >
          {config.leftText || "Hủy"}
        </Button>
        <Button
          variant="primary"
          onClick={onRightText}
          className="base-modal-btn base-modal-btn-accept"
        >
          {config.rightText || "Đồng ý"}
        </Button>
      </Box>
    );
  } else {
    return (
      <Button
        variant="primary"
        onClick={onRightText}
        className="base-modal-btn-single"
      >
        {config.rightText || "Đồng ý"}
      </Button>
    );
  }
};

const BaseModal: React.FC<BaseModalProps> = ({
  visible,
  config,
  onLeftText,
  onRightText,
  turnOffModal,
  numberOfBtn = "two-button",
}) => {
  return (
    <Modal
      visible={visible}
      onClose={turnOffModal}
      title=""
      modalStyle={{
        backgroundColor: "transparent",
      }}
    >
      <Box className="base-modal-container">
        {/* Icon/Image */}
        {config.image && (
          <Box className="base-modal-image-container">
            <img
              src={config.image}
              alt="modal icon"
              className={`base-modal-image ${config.imageClassName || ""}`.trim()}
            />
          </Box>
        )}

        {/* Title */}
        <Text 
          className="base-modal-title"
          style={{ marginBottom: config.description ? "8px" : "24px" }}
        >
          {config.title || "Thông báo"}
        </Text>

        {/* Description */}
        {config.description && (
          <Text className="base-modal-description">{config.description}</Text>
        )}

        {/* Buttons */}
        <ViewBtn
          config={config}
          numberOfBtn={numberOfBtn}
          onLeftText={onLeftText}
          onRightText={onRightText}
        />
      </Box>
    </Modal>
  );
};

export default BaseModal;
