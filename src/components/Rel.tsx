import React, { memo } from "react";
import styled, { useTheme } from "styled-components";

import { EntityRel } from "types/EntityRel";
import getPathD from "lib/getPathD";
import useSettings from "hooks/useSettings";

const Rel = ({ rel: { source, target } }: { rel: EntityRel }) => {
  const theme = useTheme();
  const { orientation } = useSettings();

  return <ThemedRel d={getPathD(source, target, theme, orientation)} />;
};

export default memo(Rel);

const ThemedRel = styled.path`
  fill: none;
  stroke-linecap: round;
  transition: all ease-in-out 0.2s;
  stroke-width: ${({ theme }) => theme.relStrokeWidth}px;
  stroke: ${({ theme }) => theme.relStroke};
`;
