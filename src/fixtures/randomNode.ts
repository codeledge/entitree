import { Entity } from "types/Entity";

function getRandomArbitrary(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export const randomNode = (): Entity => {
  return {
    label: getRandomArbitrary(1, 100).toString(),
    id: getRandomArbitrary(1, 100).toString(),
    treeId: getRandomArbitrary(1, 100).toString(),
    openParentTreeIds: [],
  };
};
