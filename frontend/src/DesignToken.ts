const lightTheme = {
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
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",

    fontSizeSmall: "12px",
    fontSizeMed: "14px",
    fontSizeLg: "16px",
    fontSizeXl: "18px",
    borderRadiusMed: "8px",
    borderRadiusSmall: "4px",
  },
};

export const useDesignToken = () => {
  return lightTheme.token;
};
