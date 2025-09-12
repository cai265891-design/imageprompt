import { type Locale, i18n } from "~/config/i18n-config";
import { ImageToPromptPage } from "./_components/image-to-prompt-page";

export async function generateStaticParams() {
  return i18n.locales.map((locale) => ({ lang: locale }));
}

export default function Page({
  params,
}: {
  params: { lang: Locale };
}) {
  return <ImageToPromptPage lang={params.lang} />;
}