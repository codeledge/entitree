/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { EntityNode } from "types/EntityNode";
import { LangCode } from "types/Lang";
import getEntities from "./getEntities";
import getSiblingNode from "./getSiblingNode";
import { sortByBirthDate } from "./sortEntities";

export default async function addNodeSiblings(
  node: EntityNode,
  languageCode: LangCode,
  currentPropId: string,
) {
  if (!node.data.leftIds) return;

  let firstSibling;
  const entities = await getEntities(node.data.leftIds, languageCode);
  sortByBirthDate(entities);
  entities.forEach((entity, index) => {
    const siblingNode = getSiblingNode(entity, index);
    siblingNode.depth = node.depth;
    siblingNode.virtualParent = node;
    siblingNode.parent = node.parent;
    const siblingIndex = node.parent!.children!.indexOf(node); //it will keep prepending to the node index
    node.parent!.children!.splice(siblingIndex, 0, siblingNode);
    if (!firstSibling) firstSibling = siblingNode;
  });
  return firstSibling;
}
