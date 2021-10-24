/* eslint-disable @typescript-eslint/no-unused-vars */
import { ConnectorOptions } from "lib/addEntityConnectors";
import { Entity } from "types/Entity";
import { GeniImmediateFamily } from "types/Geni";
import { getIdsByUnionAndType } from "./getIdsByUnionAndType";

export const addGeniEntityConnectors = (
  enitity: Entity,
  immediateFamily: GeniImmediateFamily,
  options: Omit<ConnectorOptions, "dataSource">,
) => {
  const [_currentNode, ...allNodes] = Object.values(immediateFamily.nodes);

  const currentNodeUnions = Object.entries(
    immediateFamily.nodes?.[immediateFamily.focus?.id].edges,
  );

  const parentUnionIds = currentNodeUnions
    .filter(([_id, edge]) => edge.rel === "child")
    .map(([id]) => id);

  const childUnionIds = currentNodeUnions
    .filter(([_id, edge]) => edge.rel === "partner")
    .map(([id]) => id);

  if (options.addSourceIds) {
    const parentsIds = getIdsByUnionAndType(
      allNodes,
      parentUnionIds,
      "partner",
    );
    enitity.sourceIds = parentsIds;
  }
  if (options.addTargetIds) {
    const childrenIds = getIdsByUnionAndType(allNodes, childUnionIds, "child");
    enitity.targetIds = childrenIds;
  }
  if (options.addNextBeforeIds) {
    const siblingIds = getIdsByUnionAndType(allNodes, parentUnionIds, "child");
    enitity.nextBeforeIds = siblingIds;
  }
  if (options.addNextAfterIds) {
    const spouseIds = getIdsByUnionAndType(allNodes, childUnionIds, "partner");
    enitity.nextAfterIds = spouseIds;
  }
};
