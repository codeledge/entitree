import { GeniNode, GeniRelType } from "types/Geni";

export function getIdsByUnionAndType(
  nodes: GeniNode[],
  ids: string[],
  type: GeniRelType,
) {
  const matchedNodes = nodes.filter(
    (node) =>
      node.gender && //check if profile is not private
      Object.entries(node.edges).some(
        ([id, edge]) => ids.includes(id) && edge.rel === type,
      ),
  );
  const matchedIds = matchedNodes.map((node) => "G" + node.guid);
  return matchedIds;
}
