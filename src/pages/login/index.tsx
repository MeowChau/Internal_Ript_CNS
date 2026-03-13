import React, { useEffect, useState } from "react";
import { Page } from "zmp-ui";
import { useLogin } from "@/hooks/login/useLogin";
import { LoginForm } from "./components/LoginForm";
import BaseModal from "@/components/common/BaseModal";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import images from "@/assets/images";
import "./index.css";

const lockViewport = () => {
  if (typeof window === 'undefined') return;
  const initialHeight = window.innerHeight;
  const initialWidth = window.innerWidth;
  const vh = initialHeight / 100;
  document.documentElement.style.setProperty('--vh', `${vh}px`);
  document.body.style.height = `${initialHeight}px`;
  document.body.style.width = `${initialWidth}px`;
  document.body.style.position = 'fixed';
  document.body.style.overflow = 'hidden';
  document.body.style.top = '0';
  document.body.style.left = '0';
  document.documentElement.style.height = `${initialHeight}px`;
  document.documentElement.style.overflow = 'hidden';
};

function LoginPage() {
  const loginHook = useLogin();
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    lockViewport(); 
    loginHook.loadSavedUsername();
    const preventScroll = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      window.scrollTo(0, 0);
    };
    window.addEventListener('scroll', preventScroll, { passive: false });
    document.addEventListener('scroll', preventScroll, { passive: false });
    const preventTouchmove = (e: TouchEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
        e.preventDefault();
      }
    };
    document.addEventListener('touchmove', preventTouchmove, { passive: false });
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', preventScroll);
        document.removeEventListener('scroll', preventScroll);
        document.removeEventListener('touchmove', preventTouchmove);
      }
    };
  }, []);

  useEffect(() => {
    if (loginHook.error) {
      setModalVisible(true);
    }
  }, [loginHook.error]);

  const handleCloseModal = () => {
    setModalVisible(false);
    setTimeout(() => {
      loginHook.clearErrors();
    }, 300);
  };

  return (
    <Page 
      className="login-page" 
      hideScrollbar 
      style={{
        '--login-background-image': `url(${images.loginBackground})`
      } as React.CSSProperties}
    >
      <div className="login-page-content">
        <LoginForm loginHook={loginHook} />
      </div>
      <BaseModal
        visible={modalVisible}
        onRightText={handleCloseModal}
        turnOffModal={handleCloseModal}
        config={{
          image: images.icDialog,
          title: "Thông báo",
          description: loginHook.error,
          rightText: "Đóng",
        }}
        numberOfBtn="one-button"
      />
      <LoadingSpinner loading={loginHook.loading} />
    </Page>
  );
}

export default LoginPage;