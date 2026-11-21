import { LANGS } from "constants/langs";
import React from "react";
import { use100vh } from "react-div-100vh";
import { useRouter } from "next/router";

export default function IframePage() {
  const {
    query: { langCode, propSlug, itemSlug },
  } = useRouter();

  const height = use100vh();

  // Only frame our own tree pages: an unchecked segment like "/evil.example"
  // would turn the src into a protocol-relative URL to another site
  if (
    typeof langCode !== "string" ||
    typeof propSlug !== "string" ||
    typeof itemSlug !== "string" ||
    !LANGS.some(({ code }) => code === langCode)
  )
    return null;

  return (
    <iframe
      width="100%"
      height={`${height}`}
      src={`/${langCode}/${encodeURIComponent(propSlug)}/${encodeURIComponent(
        itemSlug,
      )}`}
      frameBorder="0"
      title="Test iframe"
    />
  );
}
