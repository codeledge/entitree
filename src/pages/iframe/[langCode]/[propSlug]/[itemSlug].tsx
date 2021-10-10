import React from "react";
import { use100vh } from "react-div-100vh";
import { useRouter } from "next/router";

export default function IframePage() {
  const {
    query: { langCode, propSlug, itemSlug },
  } = useRouter();

  const height = use100vh();

  return (
    <iframe
      width="100%"
      height={`${height}`}
      src={`/${langCode}/${propSlug}/${itemSlug}`}
      frameBorder="0"
      title="Test iframe"
    />
  );
}
