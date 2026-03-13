// ZaUI stylesheet
import "zmp-ui/zaui.css";
// Tailwind stylesheet
import "@/css/tailwind.scss";
// Your stylesheet
import "@/css/app.scss";

import React from "react";
import { createRoot } from "react-dom/client";

import App from "@/App";
import { apiDebug } from "@/utils/api.debug";

import appConfig from "../app-config.json";

if (!window.APP_CONFIG) {
  window.APP_CONFIG = appConfig as any;
}

// Initialize API debug utility
if (import.meta.env.DEV) {
  apiDebug.inspect();
}

// Bàn phím đè lên content thay vì resize viewport (giữ background cố định)
if ("virtualKeyboard" in navigator) {
  (navigator as any).virtualKeyboard.overlaysContent = true;
}

const root = createRoot(document.getElementById("app")!);
root.render(React.createElement(App));
