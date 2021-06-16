import { MAX_SCALE, MIN_SCALE } from "constants/tree";
import React, { useRef } from "react";

import Graph from "./Graph";
import Navigation from "components/Navigation";
import { TransformWrapper } from "react-zoom-pan-pinch";
import styled from "styled-components";
import useElementSize from "hooks/useElementSize";

export default function DrawingArea() {
  const wrapperRef = useRef(null);

  const { width: drawingWidth, height: drawingHeight } = useElementSize(
    wrapperRef,
  );

  return (
    <GraphWrapper ref={wrapperRef}>
      <TransformWrapper
        velocityAnimation={{
          disabled: false,
        }}
        doubleClick={{
          disabled: true,
        }}
        limitToBounds={false}
        minScale={MIN_SCALE}
        maxScale={MAX_SCALE}
        wheel={{ step: 0.02 }}
      >
        {(props) => (
          <>
            <Graph {...props} />
            <Navigation
              {...props}
              drawingWidth={drawingWidth}
              drawingHeight={drawingHeight}
            />
          </>
        )}
      </TransformWrapper>
    </GraphWrapper>
  );
}

const GraphWrapper = styled.div`
  position: relative;
  flex: 1;
  .react-transform-wrapper,
  .react-transform-content {
    width: 100%;
    height: 100%;
    position: relative;
  }
`;
