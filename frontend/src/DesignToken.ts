const lightTheme = {
  token: {
    // colorPrimary: "#5562EB",
    colorBlue: "#8490FF",
    colorOrange: "#FEA178",
    colorPrimary: "#8490FF",
    colorSuccess: "#22C55E",
    colorError: "#EF4444",
    colorWarning: "#FACC15",
    colorBgBase: "#F7F8FA",
    colorTextBase: "#1F2937",
    colorTextWhite: "#FFFFFF",
    fontFamily:
      "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  },
};

export const useDesignToken = () => {
  return lightTheme.token;
};
