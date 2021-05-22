import React, { memo } from "react";
import getPathD from "../../lib/getPathD";
import "./Rel.scss";
import styled, { useTheme } from "styled-components";
import clsx from "clsx";

export default memo(function Rel({ rel: { source, target }, debug }) {
  if (debug) console.log(target);
  const relStart = target.virtualParent || source;
  const theme = useTheme();

  return (
    <ThemedRel className={clsx("Rel")} d={getPathD(relStart, target, theme)} />
  );
});

const ThemedRel = styled.path`
  stroke-width: ${({ theme }) => theme.relStrokeWidth}px;
  stroke: ${({ theme }) => theme.relStroke};
`;
