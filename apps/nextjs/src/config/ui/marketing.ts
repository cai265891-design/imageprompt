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
        title: "home",
        href: "/zh/image-prompt",
      },
      {
        title: "Tools",
        href: "/zh/image-to-prompt",
      },
    ],
    showGitHubStar: false,
    showLocaleChange: false, // 隐藏多语言切换
    loginStyle: "imageprompt", // 使用imageprompt的login样式
  };
};
