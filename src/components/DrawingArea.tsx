import { MAX_SCALE, MIN_SCALE } from "constants/tree";

import Graph from "./Graph";
import React from "react";
import { TransformWrapper } from "react-zoom-pan-pinch";
import styled from "styled-components";

export default function DrawingArea() {
  return (
    <GraphWrapper>
      <TransformWrapper
        zoomIn={{ step: 20 }}
        zoomOut={{ step: 20 }}
        wheel={{ step: 25 }}
        doubleClick={{
          disabled: true,
        }}
        options={{
          limitToBounds: false,
          minScale: MIN_SCALE,
          maxScale: MAX_SCALE,
        }}
      >
        {(props) => <Graph {...props} />}
      </TransformWrapper>
    </GraphWrapper>
  );
}

const GraphWrapper = styled.div`
  position: relative;
  flex: 1;
  .react-transform-component,
  .react-transform-element {
    width: 100%;
    height: 100%;
    position: relative;
  }
`;