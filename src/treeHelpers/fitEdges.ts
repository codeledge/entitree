export default function fitEdges({
  drawingWidth,
  drawingHeight,
  rightX,
  leftX,
  bottomY,
  topY,
  setTransform,
}) {
  const halfWidth = drawingWidth / 2;
  const halfHeight = drawingHeight / 2;

  const fitWidth = rightX - leftX;
  const centerX = leftX + fitWidth / 2;
  const fitHeight = bottomY - topY;
  const centerY = topY + fitHeight / 2;

  let nextScale;
  if (fitWidth !== drawingWidth || fitHeight !== drawingHeight) {
    if (fitWidth / drawingWidth > fitHeight / drawingHeight) {
      nextScale = drawingWidth / fitWidth;
    } else {
      nextScale = drawingHeight / fitHeight;
    }
    if (nextScale > 1) nextScale = 1; //1 is the fitting max, not the client max
  }

  const calculatedPositionX = halfWidth - (halfWidth + centerX) * nextScale;

  const calculatedPositionY = halfHeight - (halfHeight + centerY) * nextScale;

  setTransform(calculatedPositionX, calculatedPositionY, nextScale);
}
