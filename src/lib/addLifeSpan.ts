import { Entity } from "types/Entity";

export default function addLifeSpan(entity: Entity) {
  let lifeSpan = "";
  if (entity.birthDate) lifeSpan += entity.birthDate;
  if (entity.birthDate && entity.deathDate) lifeSpan += " - ";
  if (!entity.birthDate && entity.deathDate) lifeSpan += "? - ";

  if (entity.deathDate) lifeSpan += entity.deathDate;

  if (lifeSpan) entity.lifeSpan = lifeSpan;

  let lifeSpanInYears = "";
  if (entity.birthYear) lifeSpanInYears += entity.birthYear;
  if (entity.birthYear && entity.deathYear) lifeSpanInYears += " - ";
  if (!entity.birthYear && entity.deathYear) lifeSpanInYears += "? - ";

  if (entity.deathYear) lifeSpanInYears += entity.deathYear;

  if (lifeSpanInYears) entity.lifeSpanInYears = lifeSpanInYears;
}
