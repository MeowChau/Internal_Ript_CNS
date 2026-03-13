/**
 * Responsive utilities for Zalo Mini App
 * Base design: 375 x 812 (iPhone X)
 */

// Base dimensions
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

/**
 * Calculate responsive width
 */
export const WIDTH = (w: number): number => {
  return (window.innerWidth * w) / BASE_WIDTH;
};

/**
 * Calculate responsive height
 */
export const HEIGHT = (h: number): number => {
  return (window.innerHeight * h) / BASE_HEIGHT;
};

/**
 * Calculate responsive font size
 */
export const getFont = (f: number): number => {
  // Scale font based on width
  const scale = window.innerWidth / BASE_WIDTH;
  return Math.round(f * scale);
};

/**
 * Get current window dimensions
 */
export const getWidth = (): number => window.innerWidth;
export const getHeight = (): number => window.innerHeight;

/**
 * Generate CSS variables for responsive design
 * Call this once at app initialization
 */
export const injectResponsiveVariables = () => {
  const root = document.documentElement;

  // Width scale
  const widthScale = window.innerWidth / BASE_WIDTH;
  const heightScale = window.innerHeight / BASE_HEIGHT;

  // Set CSS variables
  root.style.setProperty("--width-scale", widthScale.toString());
  root.style.setProperty("--height-scale", heightScale.toString());

  // Common responsive values (from React Native code)
  root.style.setProperty("--logo-width", `${WIDTH(180)}px`);
  root.style.setProperty("--logo-height", `${HEIGHT(80)}px`);
  root.style.setProperty("--logo-margin-top", `${HEIGHT(80)}px`);
  root.style.setProperty("--logo-margin-bottom", `${HEIGHT(30)}px`);
  root.style.setProperty("--logo-margin-right", `${WIDTH(24)}px`);

  root.style.setProperty("--padding-horizontal", `${WIDTH(24)}px`);
  root.style.setProperty("--input-max-width", `${WIDTH(335)}px`);
  root.style.setProperty("--input-margin-bottom", `${HEIGHT(18)}px`);
  root.style.setProperty("--form-margin-top", `${HEIGHT(10)}px`);

  root.style.setProperty("--font-size-label", `${getFont(13)}px`);
  root.style.setProperty("--font-size-input", `${getFont(15)}px`);
  root.style.setProperty("--font-size-button", `${getFont(14)}px`);

  root.style.setProperty("--illustration-max-width", `${WIDTH(290)}px`);
};

/**
 * Re-inject responsive variables on window resize
 * Không update khi height giảm (bàn phím mở) - tránh đẩy logo/form
 */
export const setupResponsiveListener = () => {
  let lastHeight = window.innerHeight;
  let lastWidth = window.innerWidth;
  let resizeTimer: ReturnType<typeof setTimeout>;

  const maybeUpdate = () => {
    const h = window.innerHeight;
    const w = window.innerWidth;
    // Chỉ update khi height tăng (đóng bàn phím) hoặc width thay đổi (xoay màn hình)
    if (h >= lastHeight || Math.abs(w - lastWidth) > 20) {
      lastHeight = h;
      lastWidth = w;
      injectResponsiveVariables();
    }
  };

  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(maybeUpdate, 100);
  });

  window.addEventListener("orientationchange", () => {
    setTimeout(() => {
      lastHeight = window.innerHeight;
      lastWidth = window.innerWidth;
      injectResponsiveVariables();
    }, 200);
  });

  injectResponsiveVariables();
};
