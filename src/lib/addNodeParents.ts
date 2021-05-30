import { Entity, EntityProp } from "types/Entity";

/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { CHILD_ID } from "../constants/properties";
import { EntityNode } from "types/EntityNode";
import { LangCode } from "types/Lang";
import filterSpouses from "./filterSpouses";
import getEntities from "./getEntities";
import getNodeUniqueId from "./getNodeUniqueId";
import { hierarchy } from "d3-hierarchy";
import { sortByGender } from "./sortEntities";

export const addParentEntities = (
  node: EntityNode,
  entities: Entity[],
  currentPropId?: EntityProp["id"],
) => {
  entities.forEach((entity, index) => {
    const parentNode = hierarchy(entity) as EntityNode;
    parentNode.isParent = true;
    parentNode.depth = node.depth! - 1;
    parentNode.parent = node;
    parentNode.treeId = getNodeUniqueId(parentNode, index);
    if (!node.children) {
      node.children = [];
    }
    node.children.push(parentNode);
  });

  //TS complains TypeError: Cannot assign to read only property 'rightIds' of object '#<Object>'
  // if (currentPropId === CHILD_ID) {
  //   filterSpouses(node);
  // }
};
