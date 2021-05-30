import React, { memo } from "react";
import styled, { useTheme } from "styled-components";

import { Theme } from "constants/themes";
import clsx from "clsx";
import getPathD from "lib/getPathD";

const Rel = ({ rel: { source, target } }) => {
  const relStart = target.virtualParent || source;
  const theme = useTheme() as Theme;

  return (
    <ThemedRel className={clsx("Rel")} d={getPathD(relStart, target, theme)} />
  );
};

export default memo(Rel);

const ThemedRel = styled.path`
  fill: none;
  stroke-linecap: round;
  transition: all ease-in-out 0.2s;
  stroke-width: ${({ theme }) => theme.relStrokeWidth}px;
  stroke: ${({ theme }) => theme.relStroke};
`;
