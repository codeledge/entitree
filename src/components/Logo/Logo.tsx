import React from "react";

export default function Logo({ height = "1em", width = "1em" }) {
  const circleRadius = 8;
  const arcRadius = 2 * circleRadius;
  const svgWidth = 100;
  const svgHeight = 100;
  const topY = 2 * circleRadius;
  const middleY = svgHeight / 2;
  const bottomY = svgHeight - topY;
  const pathRightX = svgWidth - 3 * circleRadius;
  const pathArcRightX = 7 * circleRadius;
  const pathArcLeftX = pathArcRightX - arcRadius;
  const pathArcTopY = topY + arcRadius;
  const pathArcBottomY = bottomY - arcRadius;
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${svgWidth} ${svgHeight}`}
      //style={{ background: "lightgray" }}
    >
      <circle fill="currentColor" cx={circleRadius} cy="50" r={circleRadius} />
      <path
        stroke="currentColor"
        strokeLinecap="butt"
        strokeWidth={2 * circleRadius}
        fill="none"
        d={`M${pathRightX},${topY}
        H${pathArcRightX}
        A${arcRadius} ${arcRadius} 0 0 0 ${pathArcLeftX} ${pathArcTopY}
        V${pathArcBottomY}
        A${arcRadius} ${arcRadius} 0 0 0 ${pathArcRightX} ${bottomY}
        H${pathRightX}`}
      />
      <path
        stroke="currentColor"
        strokeLinecap="butt"
        strokeWidth={2 * circleRadius}
        fill="none"
        d={`M${3 * circleRadius},${middleY} H${pathRightX}`}
      />
      <circle
        fill="currentColor"
        cx={svgWidth - circleRadius}
        cy={topY}
        r={circleRadius}
      />
      <circle
        fill="currentColor"
        cx={svgWidth - circleRadius}
        cy={middleY}
        r={circleRadius}
      />
      <circle
        fill="currentColor"
        cx={svgWidth - circleRadius}
        cy={bottomY}
        r={circleRadius}
      />
    </svg>
  );
}
