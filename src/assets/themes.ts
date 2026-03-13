import colors from "./colors"

const themes = {
  shadow: {
    shadowColor: colors.black0,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1.84,
    elevation: 1.84
  },
  shadowGray: {
    shadowColor: colors.black0,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3
  },
  hitSlop: {
    top: 25,
    left: 25,
    right: 25,
    bottom: 25
  },
}

export default themes
