// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import {
  GeniEdge,
  GeniImmediateFamily,
  GeniNodes,
  GeniProfile,
  GeniRelType,
  geniApi,
} from "services/geniService";

import { Entity } from "types/Entity";
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
type unionArray = [string, { rel: GeniRelType }];
// type relationArray = [
//   string,
//   GeniProfile & {
//     edges: GeniEdge[];
//   },
// ];
export default async function addEntityConnectors(
  entity: Entity,
  options: ConnectorOptions,
) {
  const apiCall = await geniApi(
    [entity.id],
    options.geniAccessToken,
    "profile/immediate-family",
  );
  const entityCalled = apiCall.results[0];
  entity.nodes = entityCalled.nodes;
  const focusProfile = entity.focus?.id;
  if (!focusProfile) {
    return;
  }

  const focusEdges = entity.nodes?.[focusProfile].edges;
  const edgesArray: unionArray[] = Object.entries(focusEdges);
  // console.log("edges", edgesArray);
  // const nodesArray = Object.entries(focusEdges);
  if (!entity.nodes) {
    return;
  }
  const relations = Object.values(entity.nodes);
  relations.shift(); //remove first element which is the root
  //get parents
  const parentUnions = edgesArray
    .filter((obj) => obj[1].rel === "child")
    .map((obj) => obj[0]);

  const parentsIds = getIdsByUnionAndType(relations, parentUnions, "partner");

  //get children
  const childUnions = edgesArray
    .filter((obj) => obj[1].rel === "partner")
    .map((obj) => obj[0]);
  const childrenIds = getIdsByUnionAndType(relations, childUnions, "child");

  const spouseIds = getIdsByUnionAndType(relations, childUnions, "partner");
  const siblingIds = getIdsByUnionAndType(relations, parentUnions, "child");

  // //get children
  // const childrenRels = edgesArray.filter((obj) => obj[1].rel === "partner");
  // const childrenUnion = childrenRels?.[0]?.[0]; //can be multiple, change later
  // const childrenIds = getIdsByUnionAndType(relations, childrenUnion, "child");

  entity.upIds = parentsIds;
  entity.downIds = childrenIds;
  entity.leftIds = siblingIds;
  entity.rightIds = spouseIds;
  console.log(entity);
  // console.log(entity);
}

function getIdsByUnionAndType(relations, unions, type: GeniRelType) {
  const matchedRelations = relations.filter(
    (obj) =>
      obj.gender && //check if profile is not private
      Object.entries(obj.edges).some(
        (edg) => unions.includes(edg[0]) && edg[1].rel === type,
      ),
  );
  const matchedIds = matchedRelations.map((obj) => obj.id.substr(8));
  return matchedIds;
}
