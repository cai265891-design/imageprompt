import type { Locale } from "~/config/i18n-config";
import { getDictionary } from "~/lib/get-dictionary";
import { ModalProvider } from "~/components/modal-provider";

export default async function ImagePromptLayout({
  children,
  params: { lang },
}: {
  children: React.ReactNode;
  params: {
    lang: Locale;
  };
}) {
  const dict = await getDictionary(lang);

  return (
    <>
      <ModalProvider dict={dict.login} />
      {children}
    </>
  );
}
