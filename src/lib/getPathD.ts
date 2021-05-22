/* eslint-disable no-nested-ternary */
import { Theme } from "constants/themes";

export default function getPathD(
  { x: startX, y: startY },
  { x: endX, y: endY },
  theme: Theme,
) {
  if (startX === endX) return `M${startX},${startY} V${endY}`;
  if (startY === endY) return `M${startX},${startY} H${endX}`;
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
}
