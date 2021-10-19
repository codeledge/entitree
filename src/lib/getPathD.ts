/* eslint-disable no-else-return */
/* eslint-disable no-nested-ternary */

import { DefaultTheme } from "styled-components";

export default function getPathD(
  { x: startX, y: startY },
  { x: endX, y: endY },
  theme: DefaultTheme,
  orientation: "horizontal" | "vertical",
) {
  if (startX === endX) return `M${startX},${startY} V${endY}`;
  if (startY === endY) return `M${startX},${startY} H${endX}`;

  if (orientation === "vertical") {
    const yDiff = endY - startY;

    const r = Math.min(
      theme.nodeWidth / 4,
      Math.abs(yDiff) / 4, // cap radius to this limit
    );

    const halfY = yDiff / 2 + startY;
    const arcStartY = halfY - r * Math.sign(yDiff);
    const arcEndY = halfY + r * Math.sign(yDiff);

    //if there is not enough space for arc use cubic line
    if (Math.abs(startX - endX) < 2 * r) {
      return `M${startX},${startY} V${arcStartY} C${startX},${halfY} ${endX},${halfY} ${endX},${endY}`;
    }

    const isLeft = startX > endX;
    const isDown = startY > endY;

    const ax1 = isLeft ? startX - r : startX + r;
    const ay1 = isDown ? arcStartY - r : arcStartY + r;
    const hEnd = isLeft ? endX + r : endX - r;

    const d = `M${startX},${startY} V${arcStartY} A${r} ${r} 0 0 ${
      isLeft ? (isDown ? 0 : 1) : isDown ? 1 : 0
    } ${ax1} ${ay1} H${hEnd} A${r} ${r} 0 0 ${
      isLeft ? (isDown ? 1 : 0) : isDown ? 0 : 1
    } ${endX} ${arcEndY} V${endY}`;

    return d;
  } else {
    const xDiff = endX - startX;

    const r = Math.min(
      theme.nodeHeight / 4,
      Math.abs(xDiff) / 4, // cap radius to this limit
    );

    const halfX = xDiff / 2 + startX;
    const arcStartX = halfX - r * Math.sign(xDiff);
    const arcEndX = halfX + r * Math.sign(xDiff);

    //if there is not enough space for arc use cubic line
    if (Math.abs(startY - endY) < 2 * r) {
      return `M${startX},${startY} H${arcStartX} C${halfX},${startY} ${halfX},${endY} ${endX},${endY}`;
    }

    const isLeft = startX > endX;
    const isDown = startY > endY;

    const ay1 = isDown ? startY - r : startY + r;
    const ax1 = isLeft ? arcStartX - r : arcStartX + r;
    const vEnd = isDown ? endY + r : endY - r;

    const d = `M${startX},${startY} H${arcStartX} A${r} ${r} 0 0 ${
      isLeft ? (isDown ? 1 : 0) : isDown ? 0 : 1
    } ${ax1} ${ay1} V${vEnd} A${r} ${r} 0 0 ${
      isLeft ? (isDown ? 0 : 1) : isDown ? 1 : 0
    } ${arcEndX} ${endY} H${endX}`;

    return d;
  }
}
