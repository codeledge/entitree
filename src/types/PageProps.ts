import { LangCode } from "types/Lang";

export type PageProps = {
  errorCode?: number;
  message?: string;
  ogDescription?: string;
  ogImage?: string;
  ogTitle?: string;
  twitterCard?: string;
  twitterDescription?: string;
  twitterImage?: string;
  twitterTitle?: string;
  langCode?: LangCode;
};
