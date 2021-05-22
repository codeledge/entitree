import { BigEntity } from "types/Entity";

export default function addInceptionAbolishedSpan(entity: BigEntity) {
  let inceptionAblishedSpan = "";
  if (entity.inceptionDate) inceptionAblishedSpan += entity.inceptionDate;
  if (entity.inceptionDate && entity.abolishedDate)
    inceptionAblishedSpan += " - ";

  if (entity.abolishedDate) inceptionAblishedSpan += entity.abolishedDate;

  if (inceptionAblishedSpan)
    entity.inceptionAblishedSpan = inceptionAblishedSpan;
}
