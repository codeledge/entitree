import { Entity } from "types/Entity";

export default function addStartEndSpan(entity: Entity) {
  let startEndSpan = "";
  if (entity.startDate) startEndSpan += entity.startDate;
  if (entity.startDate && entity.endDate) startEndSpan += " - ";

  if (entity.endDate) startEndSpan += entity.endDate;

  if (startEndSpan) entity.startEndSpan = startEndSpan;
}
