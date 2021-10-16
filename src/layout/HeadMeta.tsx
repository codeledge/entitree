import Head from "next/head";
import React from "react";

export const HeadMeta = ({
  ogTitle,
  ogImage,
  ogDescription,
  twitterDescription,
  twitterCard,
  twitterTitle,
  twitterImage,
}) => {
  return (
    <Head>
      <title>{ogTitle}</title>
      {ogTitle && <meta property="og:title" content={ogTitle} />}
      {ogImage && <meta property="og:image" content={ogImage} />}
      {ogDescription && (
        <meta property="og:description" content={ogDescription} />
      )}
      {twitterDescription && (
        <meta property="twitter:description" content={twitterDescription} />
      )}
      {twitterCard && <meta property="twitter:card" content={twitterCard} />}
      {twitterTitle && <meta property="twitter:title" content={twitterTitle} />}
      {twitterImage && <meta property="twitter:image" content={twitterImage} />}
      {ogDescription && <meta name="description" content={ogDescription} />}
    </Head>
  );
};
