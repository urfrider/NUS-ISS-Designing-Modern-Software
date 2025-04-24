export const lightTheme = {
  token: {
    // colorPrimary: "#5562EB",
    colorBlue: "#8490FF",
    colorOrange: "#FEA178",
    colorSalmon: "#FF8D80",
    colorPrimary: "#8490FF",
    colorSuccess: "#22C55E",
    colorError: "#EF4444",
    colorWarning: "#FACC15",
    colorBgBase: "#F7F8FA",
    colorTextBase: "#1F2937",
    colorTextBaseSecondary: "#313C4C",
    opacityTextSecondary: "0.7",
    colorTextWhite: "#FFFFFF",
    colorBgWhite: "#FFFFFF",

    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",

    fontSizeSmall: "12px",
    fontSizeMed: "14px",
    fontSizeLg: "16px",
    fontSizeXl: "18px",
    borderRadiusMed: "8px",
    borderRadiusSmall: "4px",
  },
  components: {
    Tabs: {
      colorPrimary: "#8490FF",
      inkBarColor: "#8490FF",
      itemSelectedColor: "#8490FF",
      itemActiveColor: "#8490FF",
      titleFontSize: 16,
    },
    Button: {
      colorPrimary: "#8490FF",
      colorPrimaryHover: "#959DF7",
      colorPrimaryActive: "#6B79EB",
    },
    Checkbox: {
      colorPrimary: "#8490FF",
    },
    Radio: {
      colorPrimary: "#8490FF",
    },
    Switch: {
      colorPrimary: "#8490FF",
    },
    Slider: {
      colorPrimary: "#8490FF",
    },
    Input: {
      activeBorderColor: "#8490FF",
      hoverBorderColor: "#959DF7",
    },
    Select: {
      colorPrimary: "#8490FF",
      optionSelectedColor: "#8490FF",
    },
    DatePicker: {
      colorPrimary: "#8490FF",
    },
    Menu: {
      colorItemTextSelectedHorizontal: "#8490FF",
      colorItemTextSelected: "#8490FF",
      colorItemBgSelected: "rgba(132, 144, 255, 0.1)",
    },
    // Add other component overrides as needed
  },
};

export const useDesignToken = () => {
  return lightTheme.token;
};
