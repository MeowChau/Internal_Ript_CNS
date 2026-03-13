import React from "react";
import R from "@/assets/R";

interface BottomTabIconProps {
  name: string;
  size?: number;
  color?: string;
  className?: string;
}

// Simple size helper to replace WIDTH/HEIGHT from original
const getSize = (baseSize: number) => baseSize;

export const BottomTabIcon: React.FC<BottomTabIconProps> = ({
  name,
  size = 24,
  color = R.colors.primaryColor,
  className,
}) => {
  const renderIcon = () => {
    switch (name) {
      case "home":
      case "Trang chủ":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
          >
            <path
              d="M191.5 51l-63.7 51h-27.7c-32.1 0-35.4.6-41.9 7-6 6.1-7.2 10.6-7.2 28.5v15.1l-6 1.2c-7.5 1.6-13.5 6.1-16.9 12.7l-2.6 4.9-.3 144.3L25 460h-7c-8.1 0-12.8 1.6-15.8 5.5-2.1 2.6-2.2 3.8-2.2 21.2v18.5l3.4 3.4 3.4 3.4h498.4l3.4-3.4 3.4-3.4v-18.5c0-17.4-.1-18.6-2.2-21.2-3-3.9-7.7-5.5-15.8-5.5h-7l-.2-144.3-.3-144.3-2.6-4.9c-3.3-6.6-9.4-11.1-16.9-12.7l-5.8-1.2-.4-17c-.3-18.6-.8-20.5-6.7-26.3-6.7-6.7-6.9-6.8-46.6-7.1l-36.1-.3L314.1 51C282.5 22.9 256.4 0 256 0c-.4 0-29.4 22.9-64.5 51zm65.8 2.1c4.9 1.3 11.5 7.3 13.8 12.4 2.2 4.7 2.5 14.8.7 20.9-1.9 6.1-8.4 12.1-15.4 14.2-19.4 5.6-37.1-11-32.4-30.5 3.3-14 17.7-21.4 33.3-17zM153 243v38H77v-76h76v38zm154 0v38H205v-76h102v38zm128 0v38h-76v-76h76v38zM153 371v38H77v-76h76v38zm113.1-36.6c19.3 4.1 35.4 20.1 39.4 39.3 1.1 5.3 1.5 15.9 1.5 46.5V460H205v-39.8c0-43.9.5-48.3 6-59.3 6.3-12.4 20.6-23.4 34.3-26.4 8.1-1.8 12.8-1.8 20.8-.1zM435 371v38h-76v-76h76v38z"
              fill={color}
            />
          </svg>
        );

      case "utilities":
      case "Tiện ích":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
          >
            <path
              d="M147.5 1.5c-9.1 2-19.1 6.1-27.5 11.2-6.1 3.8-16.1 13.2-55.5 52.7-51.2 51.3-52.4 52.7-58.9 69C-.2 148.8 0 142.3 0 296.5c0 137.9.1 142.2 2 150.2 3.9 16.4 12.3 30.7 24.7 42.3 9.5 8.9 19.9 15.1 32.3 19.3l9.5 3.2 184.9.3c181.3.2 185 .2 193.2-1.8 31.9-7.5 56.7-32.9 63.9-65.3 1.4-6.4 1.5-22.5 1.3-151.7l-.3-144.5-3.3-9.5c-6.7-19.4-7.5-20.3-61.2-74-51.7-51.8-53-52.9-69.4-59.4C363.4-.1 366.2 0 255.5.1c-80.6 0-103.3.3-108 1.4zM358 60.2c4.3 2.1 11.1 8.3 30.5 27.8l25 25h-315L123 88.5c13.5-13.5 26.1-25.6 28-26.8 7.4-4.6 7-4.6 107-4.4l94.5.2 5.5 2.7zM182.8 230.9c5.5 2.8 11 8.4 13.4 13.7 1.1 2.6 2.2 8.5 2.8 14.6 1.4 16 6.3 27 16.6 37.3 10.9 10.9 24.7 16.5 40.4 16.5s29.5-5.6 40.4-16.5c10.3-10.3 15.2-21.3 16.6-37.3.6-6.1 1.7-12 2.8-14.6 5.6-12.6 21-19.5 34-15.2 6.9 2.3 14.3 9.1 17.2 15.8 2 4.8 2.2 6.3 1.7 17.3-2.1 48.2-36.5 90.3-84.4 103.2-8.9 2.5-11.4 2.7-28.3 2.7s-19.4-.2-28.3-2.7c-47.9-12.9-82.3-55-84.4-103.2-.5-11-.3-12.5 1.7-17.3 2.8-6.5 10.5-13.6 16.9-15.7 6.1-2 15.5-1.4 20.9 1.4z"
              fill={color}
            />
          </svg>
        );

      case "notifications":
      case "Thông báo":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 461 512"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
          >
            <path
              d="M203.5 1.5c-11.5 3.2-21.2 9-30.8 18.3-8.2 8.1-14 16.7-18.3 27.4l-3.3 8.1-10.8 5.2c-56.4 27-85.2 77.2-85.3 148.7 0 18.9-1.6 44.7-3.5 58.7-4.4 31.4-12.7 49.1-35.6 76.6-5 6-10.5 13.9-12.3 17.5-2.9 6.1-3.1 7.2-3.1 17.5 0 10 .2 11.5 2.8 16.7 3.6 7.3 10.1 14.5 16.8 18.5 11.2 6.7-1.6 6.3 199.4 6.3 199 0 187.6.3 198.7-5.7 13.8-7.5 23.3-25.7 21.3-40.7-1.4-9.8-4.3-15.3-15.7-29.5-22.2-27.4-28.7-39.8-33.8-64.4-3.2-15.3-3.9-23.9-5-55.7-.6-16.8-1.7-36.6-2.6-44-5.9-51.3-29.5-89.3-70.3-113.4-5-3-12.5-6.9-16.6-8.7-6.6-2.9-7.6-3.7-8.6-6.8-2.1-6.5-8.6-18.5-13.5-25-8.8-11.7-24-21.9-38-25.5-7.6-2-24.9-2-31.9-.1zM139 458.9c-.5 1.1-1 2.6-1 3.3 0 3 10.3 16.8 18.2 24.4 13 12.5 28.1 20.4 45.5 24 10.7 2.3 33 1.5 42.8-1.5 21.4-6.4 39.9-20 51.5-37.7 5.1-7.7 6-11 3.8-13.2-.9-.9-20.1-1.2-80.5-1.2-77.3 0-79.3 0-80.3 1.9z"
              fill={color}
            />
          </svg>
        );

      case "profile":
      case "Cá nhân":
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 512 512"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
          >
            <path
              d="M236.5 1.6c-1.6.2-7.3.9-12.5 1.5-37.8 4.3-78.4 19.6-111.8 42.1-19.8 13.3-44.7 37-59 56.1-27 35.9-43.8 76.8-50.4 123.2-2 13.9-1.6 52.3.6 67 8.3 54.8 33.2 104.7 71.4 143.3C114.7 475 164 500 220.5 508.6c16.9 2.6 54.1 2.6 71 0 56-8.5 105.3-33.3 144.7-72.9 34.4-34.4 57.9-77.7 68.7-126.3 7.5-33.8 7.3-74.1-.5-109.4-16.7-75-66.8-138.6-135.9-172.5-18.7-9.2-30.7-13.6-49.9-18.5C297 3.6 283.8 1.9 260 1.5c-11.3-.2-21.8-.1-23.5.1zm36.1 111.3c29.3 6.1 52.2 27.3 61.6 57.1 2 6.5 2.3 9.6 2.3 22.5s-.3 16-2.3 22.5c-8.8 27.9-30.3 48.7-58.2 56.1-10.6 2.8-28 3.1-38.2.6-29.2-7.2-52.4-29.5-60.4-58.2-2.4-8.7-2.9-28.2-1.1-37.1 9.5-44.5 52.1-72.6 96.3-63.5zm59.9 218.9c11.4 3.1 26.7 11 35 17.9 19 16 31.9 40.4 32.7 62.1l.3 6.5-7 6c-22.1 18.7-53.5 34.6-83 42.2-20.4 5.2-33.4 6.9-54.5 6.9-26 0-46.6-3.4-70.5-11.6-24.5-8.3-50.3-23-69-39.2l-5.7-4.9.7-6.6c4.4-41.5 36.3-75 77-81 3.3-.5 35.3-.8 71-.7 63.6.2 65.2.2 73 2.4z"
              fill={color}
            />
          </svg>
        );

      case "check-in":
      case "Điểm danh":
      case "Điểm danh trong giờ":
        return (
          <svg
            width={size}
            height={size}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 105 105"
            className={className}
          >
            <path fill="url(#clockPattern)" d="M0 0h105v105H0z" />
            <defs>
              <pattern id="clockPattern" patternContentUnits="objectBoundingBox" width={1} height={1}>
                <use xlinkHref="#clockImage" transform="scale(.00111)" />
              </pattern>
              <image
                id="clockImage"
                width={900}
                height={900}
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA4QAAAOECAYAAAD5Tv87AAAgAElEQVR4nOzdTXYUSZY24GtBVqhmrW8FrVpBK2eBJiVmKESellZQsIKEFQArgFyBVCuQ6oAkZqgmoFmqV1DqHahnJVUS9g1wskhSAv1EhJu5P8+kf06fzNvd4B6v27V7IwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAqpLYLAKjR6s7G4vnw/HFO+T/ejw+etF0PAMBNCIQA1zA6uL80mAye5oiNiFiMiMicnrx/sPey3coAAK5PIAS4gtGrB6tpMPkxPgbB38kRj47W97fnXBYAwK0IhABfMdobP0wp/yVyWv3W/2yeDO4d/fD6cB51AQBMw6DtAgBKNNobP7y7N/5Hiti6ShiMiEiDyc7o4P7SrGsD6nR3f+3CDgOANjghBGj8Oigm4i8RcaNglyK2363vP5pyaUDlRnvjhyliKyJOIqefFv71h+3Dzd3TtusCEAiB3vssCP4YnwbF3MLC+fD/+aEHfO7u3vgf8dsPTaeR8nZO+aejtTcnbdUFIBACvTXtIPhJinj+bn3/2bT+eUDdPjsdvFCK2I6In96t7x/PsSyAiBAIgR6aVRD8zMn79f0/zeCfC1TogtPBi6V8mD/ceW44FTBPAiHQG3MIgr+yhgKI+Pbp4IVSPsw5/dUzBJgHgRDovHkGwV+lfPh+fHBvLv8uoFh399feXnVS8QVOcsRzwRCYJYEQ6KxWguBnUsT37gRBf41ePVhNg8nbKfyjBENgZuwhBDpptDd+eDY8/zlHPI0WwmDjx5b+vUAB0p0PT6f0j1pKEVt398b/GO2NH07pnwkQEU4IgY5p7us8jRvuEZw2Kyign6Z4OngRJ4bA1DghBDph9OrB6t39tbfN8IYiwmBExPnw/HHbNQDzM8XTwYs4MQSmxgkhULXRwf2lNBm8iIiNtmu5xOn79f3/13YRwPzM+HTwIk4MgRsTCIEqre5sLJ4tnD2NnIo/gbOCAvplZW+8lSPaOLk7zpPBE3sMgesQCIHqrOyNn7U1OfSGjt+v73/fdhHA7DVdC/9otQgL7oFrEAiBajRtWEXdEbyqPBnc8+MMuq/F08GL7ObB5MnR2puTtgsByiUQAsUbHdxfSjlt3WK5c+tSxPa79f1HbdcBzE4Rp4MXSBHbw/PhExOPgYsIhECxPlssP8tpfXOTB5M/+VIP3VXY6eCXTlPET8Pz4UvBEPictRNAkb5YLN8Jg8mg1B+KwC2NDu4vFRwGIyIWc8TTs+H5z1ZVAJ9zQggUpQvtoV9xunA+/JOv89A9d/fXXtQw9fhXBs8ADYEQKELX2kMvYwUFdM/qzsbi2fD8H1HP5ONfuV8IaBkFWjd69WC1a+2hl0k9+N8R+uZ8eP44KgyDERE54uHZ8PwfK3vjZ23XArTDCSHQmuar+lZEbLRdyzyliO/fre8ft10HcHs1nw5e4CRPBo+0kUK/OCEEWnH39frj5kdUn8Lgbp4M7gmD0B01nw5eYCkNJm/v7o13Rgf3q9v3CtyME0Jgrjo+NOYipylidzKYPLdyArqlY6eDXzpNET+9W9/XSgodJxACc7OyN37Wh3uCDTu/oOPuvl5/HCm/aLuOGTvOk8ETbaTQXQIhMHMre+PlHLEVEctt1zIHJzniuUmi0H1398b/iIh+tFam/HLhbOG5D1zQPQIhMFM9OhU8zhE/CYLQD82HrrfRzXbRy5xGyo/ejw922y4EmB6BEJiJ3pwKWu4MvTbaGz9s1sn046Two908mDxxLxq6QSAEpq4Xp4KCIPCZ0asHq+nOh6d9GpgVOT1//2DvZduFALcjEAJTMzq4v5Qmg53o8qmgIAh8xcreeDkifswRD9uuZS5SPswpP3JaCPUSCIGpaKbtPY2u3qcRBIFrGB3cXxpMBk/zx12r3Xwu/pvTQqiYQAjcyurOxuLZwtlOZ9ukBEHgFlZ3NhbPh+ePc8SP0fVg6LQQqiQQAjd2d39tI3Laim7+yDnJk8EjQRCYhh4FQ6eFUBmBELi25lTwaeT0uO1aZsAeQWBmehIMnRZCNQRC4Fo6vE7CV21gbnoSDE9zxBMf2KBsAiFwZc3gmBdt1zFlpynip+H58OXh5u5p28UA/dKTYLi7cD585BkLZRIIgW9a3dlYPBueb8XHaXmdkSK2J4PJcy1NQNt6EAxP82Sw6V42lEcgBL6qaRHdiYiltmuZmpQPU05P3q3vH7ddCsDnOh8MU375fnzwpO0ygH8TCIFLdbBF9CRSfvJ+fLDbdiEAX/PZHsMuLrg/ThGPfJSDMgiEwO90sEX0NEX89G59/1nbhQBcx+jg/lKaDF5Ed57Hnxg4A4UQCIHf6FqLqHuCQBeMXj1YTXc+PI2cVtuuZcoMnIGWCYTAr0Z744fp40qJLjjOk8ETAwyALrm7v7YROb2Ijny0a5ykiE0tpNAOgRD4NMTgRUfuqtgnCHTeyt74WecGz+T0xLMb5k8ghJ5r7qfsRDcWzWs9AnqjYx/zPvEchzkTCKHHRq8erKbBZCfq/8J8kieDR9pDmYbRqwe/3tFKdz4sppx+87Ekp/wfMdsPKMcpp//74t95nD/c+fUHsj/rfG5lb7ycU37RofuFWkhhjgRC6KmurJRIEc+H58OXvibzNSt74+XJZLAYg8nSoLl7lVP+c3z8Txaj7hPy40j5NCIi5fT3iIhJxElMBieDweTUj+r+6Nj9QlNIYU4EQuiZzrQYWS7PZ0YH95fil++WUsrLKeXFz8LectR/Aj4dKR9+/A9NaJwMDgXG7vlssf3TtmuZhhSxPTwfPvHRD2ZHIIQeafYLvo26T0MMjemx0asHq59O+XLKf+7A6V4pTiLlk5TT33NOpzmn4z/+8t2xH+H1Gh3cX0o5bXWkjfQ4Dyab1gfBbAiE0BPNfsG3UfNpScqHOeVHfhR0X3MnainltNwEv6XoRhtcbU4j5eOU098nESeDiGMninVp1gm9iJqf/R+d5slg0/1ZmD6BEHqgAz8InAp22MreeHkSsZxS/q+IWO7IiUbXHaeI45zT/+Scjv1IL9vqzsbi2cLZ08jpcdu13JrVFDB1AiF0XLOrqt67JE4FO6VpY1uOiD+H8NctH+8oHuec/icGk0N/Z8vTTJZ+EZW3WbtXCNMlEEJHdWB4jFPBDvh0+jeI+HOOWA1tn31yGhGHkdPfU8qHWk3LUf2Hwo+OF86H94RCuD2BEDqo+uExTgWrtbI3Xs45rcbHKZ+rUW+bMtMnIBakI0NnTlPEPX+W4HYEQuiYZnjMTtR5EuNUsDKjg/tLMRmsOgHkBn4NiPnOh10fgNrR7KR9GhV/vMkRj+wrhJsTCKFDKp8kepwiHvnSW77Rqwer6c6H/25OFuo8haZEJ5HybkT8/f34YLftYvqkE6eFKb98Pz540nYZUCOBEDqimSS61XYdN5Einr9b33/Wdh1cbHVnY/Gfw/ONFPHfoQ2U+dl1ejhftZ8WGjYDNyMQQgc0L/EXbddxAyd5MnhkZH15Rgf3l9KHOxuR8l/CKSDtO46UD1NOf9VFMFsdOC00bAauSSCEyq3sjbcqnSS6u3A+fOSlXY5mGfxfIqeNcBeQcp1EyrvC4WxV/KExwrAZuBaBECpWaRg0OKYgQiCVEw5nqLmXvhV1dgmc5slgUwcKfJtACBWqeK2EwTEF+Kwd9McQAukO4XBGat5baAIpfJtACJWpNQy67N+u1Z2NxbM//OuhO4H0xEnk9JOBNNMzevVgNQ0mW1HhRySDy+DrBEKoyOjg/lKaDHairh/0pzniiS+07bi7v7YROf0lIjbargVakfJhzumvfzwf7vogdTvNB8mtqPB5kiK2363vP2q7DiiRQAiVqHTHoBbRFjRTAn+MnB5GXX9eYJZOU8RuRPzkmXQ7zZqjF1Hf88UwM7iAQAgVqDEMahGdr892Bf4YdZ0gQxtOIqefFv71h23PqJupeOCMtRTwBYEQCldjGIycnpgiOh9OA+F2UsT2ZDL4q2mUN3N3f+1F5PS47TquSSiEzwiEULDm/tdW1PND3+6nORntjR+mj+sial0eDaU5zhE/ue98fRW+qyK8r+BXAiEUqrmjsdV2Hdfgi+uMre5sLJ4Pzx/niL9EhZP+oBKnKeKnyWCybULp1dU69EwoBIEQilRbGDS9bbZGB/eXBpPB0xzxsO1aoE+0k15fhS2kQiG9JxBCYWoLg5b+zs7o1YPVdOfDU22h0LJmdYVn3dVUOIXUeiR6TSCEglQWBn1VnZHmz4FpoVCekxzxXHD4thqnkPrASV8JhFCIysKg+4Iz0PwZeBruB0LpTlPET8Pz4UvPwcvVuMheKKSPBEIoQE1h0H7B6Vrd2Vg8+8O/HkbKP4YgCLURDK9gZW/8LH/82FUFoZC+EQihZZWFwefv1veftV1HF3w2MfTHqOeeDXAxwfAbaltNIRTSJwIhtKimMOjlOB2CIHSaYPgVtd0r9N6jLwRCaElFYdDwmClp2qYEQeg+wfAStd0rFArpA4EQWlBRGDxOEY+EwdsxLAZ6SzC8RE37CoVCuk4ghDmrKAyaJHo7giDQsOfuAhW9D4VCOk0ghDlq7k/83HYd35Iitt+t7z9qu45aWSgPXMIewy8078W3UUErvVBIVwmEMCe1vPSEwZsbHdxfSjltCYLAV6V8mD/ceX70w+vDtkspwejg/lKaDHaigmEzQiFdJBDCHNQSBr3obmZ1Z2PxbOHsaS33YYBi7ObB5MnR2puTtgtpW/Mc3anhg5p3JV0jEMKMCYPdZnJo5xxHyp/uzR6nnP4vIiLndJpz+s1wpcFgcjrNgUsre+PlyWTwmz9HKeXllPKv/72c8p/j3/9F8T+cuZoU8dzgmY9W9sZbOeJh23V8i3cmXSIQwgw147V/jrKHipzmyWBT69L1jF49WE2DyVaU/f9bPpfy4cf/kP4eEZFTPs4f7pzGd7+c1HxCMzq4vxS/fLcUETEYTFYjInLEf0XKi5HTcvhYUQuDZxrNh7enbdfxLUIhXSEQwow0YfBtlH0nwo7Ba2ruuryISnZo9U7Khymnk4j430+Bz8eOXwcdLaaPAfE/c8pLwmKhPv4ZftL353ItE0iFQrpAIIQZEAa7qZav1j1xnCKOI+J/J5PBYe2nfG1Z3dlY/Od3vyynlJdjMPnPiFjWilqIlF8unC0873MbadOJsROFf7hIEd97l1IzgRBm4O7eeCfKPkE6zoPJph/QV6M9tGUfWz2Pc07/M4g49sNr9lb2xss55aWU03JO+c9OE1vT+zbSSu7h+8BK1QRCmLIKTpEsnL+i5qR3K8oO911znJrwl1I+9AOrHCt74+VJxHJK+b+aU8SSOyC6JeXDnPKjvn7Ea0LhVpT9Z04opFoCIUxZ4e2iwuAV3X29/jhSfhplf5XuguPmBPDvC2cLh/5s1uNTu+lgMFltThG1ms5Yinj+bn3/Wdt1tKHwd+snp3kw+b6vwZ16CYQwA4W+uITBK2ha5V74cTszAmCHjV49WBUQZ+4kTwaP+jgsqdB365e8a6mOQAgzUli7oRfUFVTQ7lujkxRxmFP+mwDYL82i8dWI+HPktBHu4E5XT4fOrO5sLJ4Pz18UvqvQO5eqCIQwY60v2U35cOFsYdOL6XKV3E+pR8qHMRn8zR1APjc6uL+UPtzZiJT/HGV8KOuC3p4Wtv5u/ZaUD9+PD+61XQZchUAIc9DWiytFbL9b3380739vTZwKTsVpRBzmiL/98Xy46+MD3/Lp9DDl9N/5Yzh0V/c2enpaWHIo9P6lJgIhzMm8X1xeRl/nVPDWTlPEbk75b+/HB7ttF0Pd7u6vbYTW0tvq5WlhiaHQ+5faCIQwR83kyhez/vd4GX2dU8EbEwKZuWaw01+Ewxvq4Wnh3f21F5HT47briPD+pU4CIczZaG/8MH08mZoJL6PLjQ7uL6Wctkw/vJ4UsS0E0oa7+2sb2kpv5CRFbPbpDu+s361X4f1LrQRCaMHMXlwusV+q+b/5i/Cj8mpSPsw5/dWdQErR/B3+7zCQ5sr6trewzVAoDFIzgRBaMoMXlzHXFyhs/UfpTlLEXyeDybbFypRqdWdj8ewP/3oYKf8YWkq/LeXDnPKjvvydbiMUCoPUTiCEFjWDTd7G7U+thMELjF49WE2DyVb40fhVWkKp1creeDkiftRS+k2nkfKjvvwdn2coFAbpAoEQWjaFUCgMXsDgmG86iZx+WvjXH7b92aF2qzsbi/8cnm+kiB/D5OBLpYjt4fnwSR/+zs8jFAqDdIVACAW4RSgUBr/Q7DfbMTjmUruR8l/7clJA/4xePVgdDCZ/KW0VQUGOU8SjPgycmWUoFAbpEoEQCnGDUCgMfqFpEd0JrWNfOo2Ut3PKP/XlHhGMDu4vDSaDh/njqaFnwm+d5ognR+v7220XMmuzCIXCIF0jEEJBmgEob+PbLU+neTD53o/7f9MieiFtoRC/hoKn4T7xb/SlhXSqoTDll+/HB0+m8s+CQgiEUJgrhMLTFHGvD+0+V6FF9ELHOeKnPnz9h+sYvXqwmu58eOp58RvHeTDZ7PoHxpW98dZt24hzxCPPVbpIIIQCfSUUCoOfadpsd8JX/49SPswf7jw/+uH1YdulQMk+m07qnuFHvZhCeptQKAzSZQIhFOqik688GdzzY/+jNhcQF2g3TwY/+bMB19PcM3wqGH7Uh0X2NwmFwiBdJxBC4T69vLyQ/m0arT9dkCK2J4PJ8663esGsCYa/sbtwPnzU5XuF13mHePfSBwIhVGD06sGq059rDd3pNEEQZkMw/FXnV1Pc3RvvRMTG1/5nhEH6QiAEquC+YHy8I5jyI0EQZkswjIiI0zwZbHb1Y+S3PjAKg/SJQAgUr7kv+CL6ukvMsBhohWAYETk9ef9g72XbZczCZaFQGKRvBEKgaD3fL3icJ4MngiC0q+/rKrq8iL0JhT9H030iDNJHAiFQrB4PjznJEc/9KIGyjF49WE2DyYvo4z3mlA8XzhY2uzhsprmS8DZHPPHcpY8EQqA4PR4ec5oifur62HeoXY/b2Ds/bAb6SCAEitJ8qd2KnoXBFLE9PB8+6eLXd+ii1Z2NxfPh+eMetrSfpoh7QiF0h0AIFOFT20706qt7yocppyd+XEGdRgf3l9Jk8CK+scKgY061V0J3CIRAEXrYguUHFXRIc79wK3q0GscAFugGgRBoXRMGt9quY25SfrlwtvBceyh0TzMZ+cfoy8etlF++Hx88absM4OYEQqBVvVoroT0UeqFvbaRdXksBfSAQAq3p0VqJ08jpeVeXOwMXu7u/thE5vYh+tJHuLpwPH+l8gPoIhEArehQG/UiCHlvd2Vg8Wzh7Gjk9bruWOTheOB/e87yDugiEwFw1Owa3ovutVKeR8qP344PdtgsB2tejoTNCIVRGIATmpkcL550KAhfqyb1poRAqIhACc9GTMOhUEPimZufqVnT7eXiSIjYN0YLyCYTAzPUkDDoVBK7l7v7ai47fLTxNEfeEQiibQAjMVA/CoFNB4MZ6cLdQKITCDdouAOiuzofBlA8Xzod/EgaBmzr64fXhwvnw+xSx3XYtM7KYI96u7I27+R6ADnBCCMxE58NgTk/sFQSmqdlbuBURi23XMgNOCqFQAiEwdR0Pg8cp4pEfNcAsjA7uL6WctiKn1bZrmQGhEAokEAJT1eUwmCK2h+fDJwbHALPW4fUUQiEURiAEpqbDYfA0Rzw5Wt/v6h0foEDNwJmd6F4LqVAIBTFUBpiKDofB4xRxTxgE5q0ZOPOnSPmw7VqmzKAZKIgTQuDWuhoGtYgCpehoC+npwvnwT56x0C6BELiVrobBHPHIqSBQko5OIT1eOB/eEwqhPVpGgVs5G55vRbfC4GmK+F4YBErzfnywmweT7yOiS3fvls+G529Xdza6FHKhKgIhcGMre+OtiNhou44pOl44H/7JoAOgVEdrb04Wzof3OrbIXiiEFmkZBW5kZW+8lSMetl3HtKSI7Xfr+4/argPgqu6+Xn8cKb9ou44p2n2/vr/ZdhHQN04IgWtrhht0Jgzmj4vmhUGgKu8f7L2MlDcioiv37zaazhNgjpwQAtcy2hs/TBFdeWGf5slg8+iH110b6Q70yMreeDlH7ETEUtu1TIOODZgvJ4TAlXUsDH7cLygMApV7t75/vHA+7MywmRzxcLQ37kwXCpTOCSFwJc0X6LfRjXHnxpwDndSl+93W/8B8CITAT3UpDGpFArquS0vsU8T3Jj/DbGkZBb5qdWdjMX9sE60+DEbKL4VBoOvere8/yxGdeNbliLcre+Mu7bqF4giEwFedDc/fRgcWz+eIR+/HB0/argNgHo7W97c7MoF0MUds2VEIsyMQApdqxn/XHgZP3UMB+uj9+GA3RdyL+kPhcvNxEpgBgRC4UEd2DZ6miHvCINBX79b3j5tQeNJ2Lbe0bEchzIahMsDvdGS9xGmKuGcYAcDH++CduAKQ05P3D/Zetl0GdIlACPxGRyaKHqeIR8IgwL91JhSmvPl+fLDbdhnQFQIh8Kvmx8LPEbHUdi23YMcgwCU6Egp1gMAUuUMI/Kr5kSAMAnTU4ebu6cL58F6KqPlu9WKO2DF5FKZDIAQiohMTRYVBgCs43Nw9fbe+/6jyULh0tnC203YR0AUCIRCjvfHDyieKCoMA11R9KMxp9e7+2ou2y4DauUMIPdeBITLCIMAtrOyNt6r+KGjIDNyKQAg91oEhMsIgwBRUHgoNmYFb0DIKPdbcvxAGAXqu8vbRxRyxZcgM3IxACD21sjd+Fjmttl3HDQmDAFNWeShcPh+eu08IN6BlFHpo9OrBahpM3rZdxw0JgwAzVHP7aI54dLS+X2uohVYIhNAzzb3Bf0SdQ2SEQYA5uLs3/jkqXUWUIr53nxCuTsso9Exzb1AYBOBSC+fDexFRZahynxCuRyCEHqn43uBpingkDALMx+Hm7mnFodB9QrgGLaPQExXfGzROHKAlzTWDt1Fh+6j7hHA1AiH0QMX7BoVBgJat7I2Xc8TbqO+6wWkeTL4/Wntz0nYhUDIto9ADZ8PzragvDEaOeCIMArTr3fr+cYq4FxG1te0upslgp+0ioHQCIXTcaG/8MCI22q7jurT6AJTj3fr+cZ4MNtuu4waWV/bGz9ouAkqmZRQ6bHRwfylNBj9HbW0+Kb98Pz540nYZAPzWaG/8MEVstV3HdeXJ4N7RD68P264DSuSEEDos5bQVlYXBFLEtDAKU6Wh9fztFPG+7jutKg4lVFHAJgRA6qtIVE8fv1vcftV0EAJd7t77/LEXU1tK/ZBUFXEwghA5qJsI9bbuOazpudl4BULjm411VQ79yxMO7+2vV3amHWRMIoYNyffc7LJ4HqEyVi+tz0joKXxAIoWOaaWpVLRDOk8Gm9RIAdTnc3D1NEY+irnUUi80qJqBhyih0SNMq+nPbdVyH9RIAdRu9erCaBpO3bddxLSlvvh8f7LZdBpTACSF0SG2toiliWxgEqNvRD68PI6e6pkNrHYVfCYTQERW2ipooCtAR7x/svaxs8qjWUWgIhNABFU4VPTVRFKBbhufDJ1HXkJmN0asHta1ngqkTCKEDcspV7VZKEfdMFAXolsPN3dM8mGxGRUNmLKwHgRCqd/f1+uOqFtDn9MREUYBuOlp7c5Ing82267iGpbOFs5o6bGDqTBmFiq3ubCyeDc//ERFVfN1MEdvuDQJ038re+FlNVxlSxPc+VtJXTgihYs2F+CrCYEQcN/dLAOi4d+v7zyLlw7br+JapnTDNAiFUqnkIvxG23Vc0WmzaTwP0x8LZwmZEnLRdxxUtN5fqAaJlFGrVtIr+HBFLbddyFZbPA/RTMwX757bruKK+fvemh5wQQo3Oh+ePo5IwaPk8QH+9W98/ThHP267jimwmhBAIoTqjg/tLVc1Q014K0HPvH+y9jErui6aMIBBChSaDSTV7B+0bBCAifg2GvwqFUFsCIdSk3L2DW1FTSwwA89H8bPkxUrbHDL5FIIRKlLx30L5BAD6n0ogUVRyBECpQ+L2DzUm/IQB8ydq9tYcp4knbdXxJoT9boJcEQljwewcrJSNHbBkeAwAfK/y+YYTdvViMe4V0m0AIC3zvwDBFbNs3CMBXrO5sLEbKW1H2h1b3CnvPvUIAoJ1A6O4g+L+9O0+y48qOBP8rM5k5gLwLd/yLEf+IvsjMBVxqq6urxb2cqUXcVe/uspcU6k9qqmYkUQ0BJEAgLvcl4I/cF+7uYZkZcf37e2dcwMmGARDAz5T8UbiqiYPCIN0mEMICW/B1Eyk/VSwPAP9Q5r5CxfJ0nEAIC6zoeoliG3sgmBuBEID/U/i9wsXdWUhPCYSwoA96u31xOAz3BgH4Ffc49w7+mNdB6TKBEBZQ4fcGD3PED5bNA/ArhRdOlNqBBB0lEMJC/SCo4Z5AqT8QAMDnCq+j0NEKXSYQ/v/tnW+MI1eVx783u8dqBakGiU+1RVqBRSJYpI6WELuVKQoZbGvx4kWySOLPn0UQ4QqkSMAK2MiLYPHCAg5ESpBoY4Hk9uCdZ6W5gJZa3kmzqFVtFkQxGmtXwlW9v57Jnh6/d/sHeL/v1zs/PQN4qjy/53gmp09d//o8nSaecLrX6+1+54f/8J1fyzcG4MO5y+/5l/rnj8OvvF67yQQrgVCVj5tKrm/fKJ4Hfhd/cC7/MF6MlH84O3wYgiCs54flC+PH+XvLq13++Y/l2xN9uPb6+O3wG+H3wq+HC5d/vvKx0j/Hcf5+6ec58tey3i/99Yj+Oz7ur8Vxfq/+PJ8f+r35az/Mxyv//C+vhov94j3O+/qNXh5fcK18Dfvj4vfu+/DcL3yOcjv5Y/bef91fr9q/d/HajNu/+PP18rxHPmb+/Mrz6V/Pl39mre9F6/0Rfr38c/q15Z8N5WNfdfy/+MWr+f+L//xzv97xz9xf+5j//f5z5WPkP//LY77a8d/5vfWf7X8Zi//Nv5z3ePjh+lM9gI/b7bv//N8/evvuf/zet378k3++EB782X98OX/sy+EB68Qpe/h6uPD135m/bv1+0D8D/+u2j/0vP877+Y/y5/aQC+PP/i38nfCL4UL+mHXj/sWj/31rZdOe8r3s16fP4qeP0Aw/++5/jsd2dq6O/tYVv/K5/W+3d+7P66v/Ou8yBEKQhv5Zvo2rMPjZ3/5oBGp2+Vs//Y1Hjn/0t4v/Tr9y+6d//0f/9Kuf+fq9D3/4xy/Vj3MUCb+SBz5YyGcbP/OZ3OP/+Tflv/3X9f+8/LXF1+aw+Iv/fi/838/9R/xfeey/Lf5b/3rl8/nzuZaH1rvxf84htvivvN9vho/m/3753/7za+Nn//xj+ddvXvh38s+qvxmO0u99Z+d+2uRjnLn8/t1bCLYfmfvZiOOjeRgdXS/7x84hdhSXl/73w4/z//6c42/m/z3Y+G/+tf7r+3GczuLsaj+uhJB/x5n9vPz3t93/3YMfHW+u4OuDQAgSMT++tRvZx3+NF8Pk+A889pMfPfSr73/wM+XZ0fB1PF/+N/pQWoTXMs6Ws7wE9XK+sPd65y+tz5XB+FH/t/r/LgLq4o++DIvle/zFX/31a0r5F/N99MG6XrSL8Fz+9xsv5e/Xg3jx+P1z/U0QFvLj5OO8sPC5g3z/z7/kv/ffv+nX6oH/Nv/X+Lz+Y/z+dYRen+/v+/nxYfbxgQBIgEAIkrD82HJ+7/C5Y3qvhcH7P/mbxZ/7MFm/Vs6O/nV+keuMvR7n8tuvL4T7dSj9u/I1lv+d/rX5QugsQmz58fwXfvzDy/V//x+v//+L16cP1/nC2S8C5z3Pcv7MvQmCj+jD+f++XwTK+uv5Y//yYl5KCM/X+3nL6V8q/bWqf5/r86//3vmXfy3/l/X7Lb5+/Xs//HMRTufPl39e6rvyN/v/Xnr3X43fv+nJoMuVovr3Ft/rZ+9Zve9L9WPe93p99xdvzvl6/D+fX3zPr+ePee9qf/14R//qB+Dvl+FaBBsv3X+f/tc+NPefz+EX+qefX/eH83sFz978ztX+cTx+n/Nn1sv1zR9Y/3vPl4v/+eN/7B+rP+b9Z7F/HXvx9F7Iw/OTz51b/Dzuw+d/e94Lv9nPRaG8/vj+3//Lzy8d/P/vXw0nv19+z/94sPLvl+H9rTEwxnD/wT/+5dZK/P++fNt3zv/Zn/xqfq/q9w9q9wd3+u+v95+MexH/2yL+d35e9r6fc/3xXU+u7/ffV+d7Q/2+X/w3f/z6n5q/l63+3V6/Ypx/fJ8PDm92/9W8rl8u/62d/t8o/+3+M/uf5fXvdf/c4r/l/17+Ofuv3xz/d/T8/+x/++f7cv/7H5j/HepPy5XCfuGy/t/jX4/1+5f/vvQ3/+cD/+5+/f28T/7pef+z1QugAY/v8TXqn1p/b8vvy+3vXX+c/3/+d/nfM/xauJ+fcxHYX3rd+9e0v//cf9369/3zX+4+f/P5/f3f+Tf+dXmd+vPG0vl+0RfW/3Gzvz/0K5/1KqT2jdTF1+n/vf6+9K+VpcX3/IH75/X/vLb9Y/vw//zzU5/xsV9/+OXv1f4/vfBF8r8s/9MqGE8ACYjho+O7dN0ffyzK0vdfev3g5Y9Mxq/38h/Yd2+96gdF/e/0b15ff2jev/M98iD48D8w6r97/U/y+jH7f+Sf+/j913t3cZ//c/3s3+te/3h91fuv/p/y/1/+Tfjg/bML+4X/HjUfDM/0r52Xmjsf/a+Vr/9+Lf86/PbrP/Lf/vm1sMH7c/+1/r9nv9cf+2GDj/ve2vvf+3/2e//c/DGv/u+P//Y9//3tpfw/i//b+d/X/X/+31+/37M/S378JTevN/9f+/+5f+3tH/O5f/78v/+/j/739+/l+/ff/5//l9/Ot/v/q/df/d9f/b3UZ+rf/H+s+8nv/t///X+8/P3/ff9//l/99+XHevN/r/fP6+9//Ofv45n7f/2e//P/cvj//p+Xr/X/fLT/c/qlbz14j/b/fPTf/+tL+9f5v/evW/tf+udf/q/xSvwf/T0MHv/5/T76+/jc5/3I61P/b93/Mxz++/DG4uPZ+9ejvzeunK+fyT8TfvHnxcOPN+83l/7wv96P+dd/sft+xUr2/7c+/vt6+f8BnLc3/+3/fd0Pr9/8N3n4N/G/vz4+0v//w6+X/dfo5n3/+v91a+3/o/7f//8d/v//rN9fv/T//L/v++T/ff73sf+ef//s6//jfz9//N7+/1+/n/rn5vnH/XKuf/Z/9af+3+sfm8vln/P+mfvH/8flt3Ppv/7Hy/Fd/vf6uYv/nbn/ee/W/7r57z//Pn97x+t4P/b/+93jk/f/4n8+/ub/X/fnB/i/D75/fvo+/i/v+xf//kP/gOx/8n/s/jr0P38Pv+9f+v/Qb/+/9//m//v+mPd/d/+s+9+M/+P+eb1//PD+v3/2//tHUPz//7P99//nT/7d+//P8kM/M//rz/rv/vnf++eX//d3f7Pyb5T/yffOf/7W/v93/XvXPi7+/w8H14+v1B8zPnHZxofl/Rl8bPv/35j7gkCDf/TRr85d/uSlfFH8y/Dz+de+dvXL+Rff+SdyAP57CIQAH7OPjmgF4NS5Qwh8TJY/vnHF0vl0XGkFfux+Nip/3PAw1wIAHygQAnzMDsOVl365+vrf/lF+jxAAdIrn+wWAj89/Dj8LX8gX/PvHaHo9L5UAegYBoLsEQuBjM/z28Q/7J2sXxfDm+LH/6Av5i+Ev+y+Cr/a/+uH/+s+vf/YrXw//8WvhD777kzf+4Xv/9MZ3f/LW9/7+zb/7h3/61v/5P2/9y//6l3/+l+/9yw/++Z//8fu/VH6vf/xvfzZfVo/5vzMrz9e5+vcAoKsWN+6AL5b//I//+NVf+Lnf+fLTP/O1L3zhZ3/3Cw3fEgAAHQqE/3O//Wv3y9+4/fxXQ/ho//h/EJaLwt8L/3N4+5MfDr+V3x/8q+/+03e/+3f/9FaD9wQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMOt+k0A0L2L/n+6fnPldvdv/vP/+Mf/8U//Gx/+jdf/9ZX/4z/9Mj54vb5f/vqV25+7/Y2v/N9/+OefX/tz+UKff/5r/3jx7z/3t7/+N7/+N49un12+kN/7+vl/uP3bX/9fl78e8tfe/tp//e3f/eP//EJ+3MtnLv/+53717/LXXvq9L/zFb//+F/7m0z/7u8VL+Welf++XKrf+k089f+sX/v0X//3VP/3jl198/vd+5/nf/YPnf+9Pnv/dP3rht/7Lt37/a0/9waee+oOnfvE3f+OzT3zys1//4899vvy30D+/r374Z3c+/p8vAOgUgRCgs4H+51/+3u/dfy58J4fD58M7r/6bV//d/R/dfeu//uLFi1/5+OLGpV8Lv/byH7z+9Dd+/xt/8NLlx8vfA4COEwgBOhl+f/vv3p9/Lnwvf/5G+O6Nv3zvG/dffef7X80//3K+SP7Zj+ONT18+3eZPAAACIUCnI+BH57/mn+uvP+efX83/+/Xy1/P/fj+/3v9O+ZUP+vfL3w+v5td9r3w1f/wHd17IXzv/n+d//Rbfmwt/+FT+vvyrv/U3T+YL/68BAACdJBACHQ+wv/7Kt57Yn+f3An8rB7cX7v+v/+f//pffl/iZ//lKfsw/6H+0X3ytf61fuPz3Xvip5/LH1pffFyy/krdLf/hU/trPfv27f/rdt/P/Xn793wn/7Z/PCAACIUAnh7f+w+eeX4TD+T8u7JbB7wv/+VJ5vfe/Fv5qvuj/1yA4f/67Xw8//3/+y//4+f/5D39Y3rP8+H/9QrG8/2B0SwAgxfpNALDZAe5rf/PLOfqVq/b3L+b49N0P/n3c//vy65bh7+X7/0E/fnN+If/vP+cL/n/r27/3v77Qf/1/+Mf8c+H/zE98s/z1H+V/J78//+M9rwUAcYgQaCPAlfcFy5C3s3i//+e/79u/F17Ml/6f7cffC+GB+XxB/8H9e/T9J/LX/x/5Ql9+Lr/26+V9wvC1Hv+/A7AtvwoANivQ/erfPpq/V7hyP+4/+n/Gn/9G+O/5Av8vOfgt7ov2sfC//n/3vxfefv0//tff9j9Xvn/5fX85f/39f8zf+0F+v09++v1fDwA+oJ4xL4C2Y9uZXCyWF/FyKfzC2+MLe/m9++/9nfMPhN1yub/88zP5Qp83/mvl7/9wft38v7t/8qd+agDAO0w6BWhNH/r2bzwTno0rS+H73/vZP/nvF/rH6J8ffuf/+J//r0eu/N3LkLf7t//xK/n18ffkRx8AAB8XIAA25T/lT+QI+H+v1K2GQV8vALAtq4QAbUj+S/5Mfm/w7OX/vhsm/f8+gAaEQoBWBL8vXa7YXyv6v3/Cg/+mAoAmBEKAtow+lqP/2Uu3u3//L++//vcBAO+T+o1AC0H/L3MU/FL//uAdf/sP3vPXAQDvl0AI0Jbkz+fod+a7v/uN9/IXVQAAGhAIAdrw7Xz5/8X88frYd7NhCwDkEwgB2hHzi361v/j3/KnG7wgAxCEQArRk/FL+RP59v/oDAPAhCYQA0LpwJYQjf+MAHN3iJgBgYwb5A/17hPc/tz//evntb/z+V/zNw3YYQwVoTTrqg+HZRn/hTRdG8NMAug4Ad6KiNdGv1z/g97vVWP4H/dPlfcDK/wYAxCFAAFq29JeBV/YNH/vOD/PrP/UH8Rd/8Qdf3Oj9AwDXCIQA7Sv3Cb98+98/k4P/o/k1fr45GwQAYhAIAYBTKJfTf5S/kO+T+OsG4GTqNwEAW3AuX+zLe4NnG7kPAADvmUAIAJ2N/peyPxz84gP/uxACAAIhAHT68v988X71vYJ/m//m9/tPffLT++X7A3/6j083dcMA4H0SCAGgI9Gvb192p//dS/n1LuYP7+SA+Ozy+wAAB/UCQBe+/fKP8uXe/+z//zH/d5R/vp0v/A/fe/Pvf/CP34m/LgBwL4EQADYr+9V29+6db/zUH1ys//yfh++89p3vlfcL/c0CgBCCAKAD4e/Cq/mS/5l/+vv/+OI/vfJv55e+/x+e+v6dn/3GHz/29d/56ud/7Y++/pWf/6M/+cof3P/j5/74/h/95X//46/8yW/93l/80h/85ff++KXf/ot//tT/e+GP/vjf/sEf//k/5I//9u/+9V/+/T//63f+5R++98rbz33nf7703Ov/8V9e/+F3nvuP//i91374bz/4cffP/uF73X+fPv6fKQC0bv4iAGzLpbXb6fqN/OtnrtzOXbr9y+v/+5P1m1H8tI+fydF88dLfP//ar/T/+99uf+nW96+u5lfyf+9eud352q0vXX38//Xl//bXc/VW/+/c92Ov5g/vXLn1s/e/VwDghhT+NYbQWPBf/L/zKx/f/NffyB/fyZf6ZXzL3+f+a3/hc1/8Z+V9+uu/fhAWH/7aw/lj53+/gflS/vD9/3W//r9Vb/3pC/PwbvQH4PQQCAFafwF/71//33/x6j+P7v/5xft//8kvhk//fxfzuv39T//Xx5f+d/HXvph/79n8azv5a1999Mv/7Wf/9kv/4VbYv/yxy1/74i89tPrP6y+e8mv5e8kB8HZ5z88/9vCvXfn+AIBACMCmB76X8ufy1z+74euv1hfDz+av7/9Z9dflry//t+r+75VfL396vf+tf/7y98qvn/0V/Vv6u/x3/k4AwJ2q3wQAXbhMf+YX/8FffPRP+y//F+A//cWv/PLqr//M577wP/Ol/r/lr3/5b//2af9kAEAgBOCUc/+P/sPz95eVF7Yw9APAyaXwrwOgtRfyP63vPfrpy0v/5Z8n+7z/VL+R++cVAAIhACcX/Xby5/fv4T3hBgAIhAC05fy192uf9B/5AwAEQgC2dun/F+8J/7s/8QcAaDEQblVv+O1aEfI+YXo+a7w0Hk6vTZa1v9zNX5vst8K1YVA+nj9ejDvT+Z2fz/5qfn2aP+buz/7j+PN/WN4Xvv+J8K3//MMXnvqP3/7mt374wu1/+H7/5/6N//fV7/z13/7d/37uCwAQCIFTiYj3j/qT/N/+feSYd/dP/+LlhfzrfyM/5pnlJfvMr/3up//+V37z4U/8yd/+ygO/+T+/+kt//Kv//YE/+o/f+L8e/K2f/+K/Pfh/fPPhL37h/3j4K5966Uu/8djXHv1vX8uv96uff+LB/NrX/+cf/Zev/D+Pfs+fDgD4dAGdDYB3v/LmG9/pl/v0P/7tP//gC//PczcC39W//n/cCIF/9bXFX/jPKfxleuDP/+d3/s+f+oc/yO/lV/7s1f/xj1/7q1f+2z/mv/qN//7/Pfc337v71+k1vrP6fY1/+mtvvs/vCQDc0wIAG3LtPt6VW//C5V/cfecffP4frv/1sy+EC+/6ev/j7yzD38ftt/7f+z/3/l/h+/mW/37+/5f+we/c9+c//fQv/o8fvvJv/+nV/JfP9h+/99+/+r3//uq//NO//dPwlX/+p39efpx/L5bzr/7g1Tc+0s8LAE5yCAVoORBef+Fev/D/xv3/52/+Qv7Qf+lF/8sXwov9i//f5H/n3u99X/yFT/xZ9W/ll+dP//1TP8r//t+F//r89e/rzr90//3/H3/+4fnf+U+v/pf88fp/+cGr/+X1//YPf//q//c/fvHHZz/zwvzFv/3R/LuZv/gPP+w+l//J/2nzZwUAnCICYdsB8O58+X/8xj/9u/zrv/j1f/j1/F7c/d/6zb/+5P3/1++8/x/qX/rlt17/h7f+5T7f5y/kj3/v//jM8//0i996+Wv/cRkD//FvXxnNrq3s/9pPff2/f/ZrP3zuV/7Dzx75JwQAnKxACNAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAO+b/A2tQ03tq69HCAAAAAElFTkSuQmCC"
              />
            </defs>
          </svg>
        );

      default:
        // Fallback to a simple icon
        return (
          <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
          >
            <circle cx="12" cy="12" r="10" fill={color} />
          </svg>
        );
    }
  };

  return renderIcon();
};
