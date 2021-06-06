import { Entity } from "types/Entity";

export const findEntity = (
  tree: Entity,
  entity: Entity,
  prop: "parents" | "children",
) => {
  let current: Entity | undefined = tree;
  const next = [current];

  while (current) {
    if (current.id === entity.id) {
      return current;
    }

    const more = current[prop];
    if (more) {
      next.push(...more);
    }

    current = next.pop();
  }
};
