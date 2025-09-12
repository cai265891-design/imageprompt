import type { Locale } from "~/config/i18n-config";
import type { MarketingConfig } from "~/types";

export const getMarketingConfig = async ({
  params: {},
}: {
  params: {
    lang: Locale;
  };
}): Promise<MarketingConfig> => {
  // ImagePrompt专用导航配置
  return {
    mainNav: [
      {
        title: "Home",
        href: "/",
      },
      {
        title: "ImagePrompt.org",
        href: "/image-prompt",
        isBrand: true, // 特殊标记这是品牌链接
      },
    ],
    showGitHubStar: false,
    showLocaleChange: true,
    loginStyle: "imageprompt", // 使用imageprompt的login样式
  };
};
