import { EntityNode } from "types/EntityNode";

export default function filterSpouses(originNode: EntityNode) {
  //Remove spouses that are in the tree already
  const potentialSpouses: Record<string, 1> = {};
  originNode.children.forEach(({ data: { id } }) => {
    potentialSpouses[id] = 1;
  });

  originNode.children.forEach((child) => {
    child.data.rightIds = child.data.rightIds?.filter(
      (spouseId) => !potentialSpouses[spouseId],
    );
  });
}
