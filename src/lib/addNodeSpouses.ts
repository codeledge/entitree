/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable consistent-return */
import { EntityNode } from "types/EntityNode";
import { LangCode } from "types/Lang";
import getEntities from "./getEntities";
import getSpouseNode from "./getSpouseNode";

export default async function addNodeSpouses(
  node: EntityNode,
  languageCode: LangCode,
  currentPropId: string,
) {
  let lastSpouse;
  const entities = await getEntities(node.data.rightIds!, languageCode);
  entities.forEach((entity, index) => {
    const spouseNode = getSpouseNode(entity, index);
    spouseNode.depth = node.depth;
    spouseNode.virtualParent = node;
    spouseNode.parent = node.parent;
    const spouseIndex = node.parent!.children!.indexOf(node) + 1 + index; //need to be appended to the list
    node.parent!.children!.splice(spouseIndex, 0, spouseNode);
    lastSpouse = spouseNode;
  });
  return lastSpouse;
}
