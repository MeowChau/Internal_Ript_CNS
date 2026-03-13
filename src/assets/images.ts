// Lottie (JSON) - Vite ESM imports
import aimData from "./images/aim.json";
import statisticData from "./images/statistic.json";
import workingManData from "./images/workingMan.json";
import loadingData from "./images/loading.json";

// PNG: import từ src/assets/images/
import companyLogoUrl from "./images/companyLogo.png";
import companyLogoWhiteUrl from "./images/companyLogoWhite.png";
import imageLoginUrl from "./images/imageLogin.png";
import backgroundHeaderUrl from "./images/backgroundHeader.png";
import homeLayoutUrl from "./images/homeLayout.png";
import morningUrl from "./images/morning.png";
import afternoonUrl from "./images/afternoon.png";
import loginBackgroundUrl from "./images/loginBackground.png";
import icDialogUrl from "./images/icDialog.png";
import iconCheckUrl from "./images/iconCheck.png";
import iconErrorUrl from "./images/iconError.png";
import noWifiUrl from "./images/noWifi.png";
import avaUrl from "./images/ava.png";
import profileBackgroundUrl from "./images/profileBackground.png";
import unnamedUrl from "./images/unnamed.jpg";
import checkinUrl from "./images/checkin.png";
import checkoutUrl from "./images/checkout.png";

const images = {
  companyLogo: companyLogoUrl,
  companyLogoWhite: companyLogoWhiteUrl,
  imageLogin: imageLoginUrl,
  backgroundHeader: backgroundHeaderUrl,
  homeLayout: homeLayoutUrl,
  morning: morningUrl,
  afternoon: afternoonUrl,
  loginBackground: loginBackgroundUrl,
  icDialog: icDialogUrl,
  iconCheck: iconCheckUrl,
  iconError: iconErrorUrl,
  noWifi: noWifiUrl,
  ava: avaUrl,
  profileBackground: profileBackgroundUrl,
  unnamed: unnamedUrl,
  checkin: checkinUrl,
  checkout: checkoutUrl,

  // Lottie animation data (for lottie-react)
  aim: aimData as object,
  statistic: statisticData as object,
  workingMan: workingManData as object,
  loading: loadingData as object,
};

export default images;
