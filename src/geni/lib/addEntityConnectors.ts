import { Entity, GeniEntity } from "types/Entity";
import { GeniImmediateFamily, GeniRelType } from "services/geniService";

import { WikibaseAlias } from "wikibase/getWikibaseInstance";
import { sortClaimsByStartDate } from "claims/sortClaims";

export type ConnectorOptions = {
  wikibaseAlias: WikibaseAlias;
  currentPropId?: string;
  addUpIds?: boolean;
  addDownIds?: boolean;
  addRightIds?: boolean;
  addLeftIds?: boolean;
};

export default async function addEntityConnectors(
  entity: GeniEntity,
  options: ConnectorOptions,
) {
  const focusProfile = entity.focus?.id;
  if (!focusProfile) {
    return;
  }
  const focusEdges = entity.nodes?.[focusProfile].edges;
  const edgesArray = Object.entries(focusEdges);
  // console.log("edges", edgesArray);
  const nodesArray = Object.entries(focusEdges);
  const relations = Object.values(entity.nodes);

  //get parents
  const parentsRels = edgesArray.filter((obj) => obj[1].rel === "child");
  const parentsUnion = parentsRels?.[0]?.[0]; //can be multiple, change later

  const parentsIds = getIdsByUnionAndType(relations, parentsUnion, "partner");

  //get children
  const childrenRels = edgesArray.filter((obj) => obj[1].rel === "partner");
  const childrenUnion = childrenRels?.[0]?.[0]; //can be multiple, change later
  const childrenIds = getIdsByUnionAndType(relations, childrenUnion, "child");

  entity.upIds = parentsIds;
  entity.downIds = childrenIds;
}

function getIdsByUnionAndType(relations, union, type: GeniRelType) {
  const matchedRelations = relations.filter((obj) =>
    Object.entries(obj.edges).some(
      (edg) => edg[0] === union && edg[1].rel === type,
    ),
  );
  const matchedIds = matchedRelations.map((obj) => obj.id.substr(8));
  return matchedIds;
}
