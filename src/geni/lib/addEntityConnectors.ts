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
  serverside?: boolean;
};
type unionArray = [string, { rel: GeniRelType }];
// type relationArray = [
//   string,
//   GeniProfile & {
//     edges: GeniEdge[];
//   },
// ];
export default async function addGeniEntityConnectors(
  entity: Entity,
  options: ConnectorOptions,
) {
  // const apiCallId = entity.geniProfileId
  //   ? entity.geniProfileId
  //   : "g" + entity.geniId;
  console.log("getGeniConnectors", entity.geniId);
  if (!entity.geniId) {
    console.log("err", entity);
    throw new Error();
  }
  const apiCall = await geniApi(
    "profile/immediate-family",
    {
      guids: entity.geniId,
      access_token: options.geniAccessToken,
      fields: "guid,id,gender",
    },
    options.serverside,
  );
  if (!apiCall) {
    //TODO try again
    return;
  }
  //   entity.geniProfileId
  // ? await geniApi("profile/immediate-family", {
  //     ids: entity.geniProfileId,
  //     access_token: options.geniAccessToken,
  //   })
  // : ;
  const entityCalled = apiCall.results[0];
  entity.focus = entityCalled.focus;
  entity.nodes = entityCalled.nodes;
  console.log("start", entity);
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
  console.log("resls", relations);
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

  if (options.addUpIds && !entity.upIds?.length) entity.upIds = parentsIds;
  if (options.addDownIds && !entity.downIds?.length)
    entity.downIds = childrenIds;
  if (options.addLeftIds && !entity.leftIds?.length)
    entity.leftIds = siblingIds;
  if (options.addRightIds && !entity.rightIds?.length)
    entity.rightIds = spouseIds;
  console.log("added ids", entity);
  // console.log(entity);
  // return entity;
}

function getIdsByUnionAndType(relations, unions, type: GeniRelType) {
  const matchedRelations = relations.filter(
    (obj) =>
      obj.gender && //check if profile is not private
      Object.entries(obj.edges).some(
        (edg) => unions.includes(edg[0]) && edg[1].rel === type,
      ),
  );
  // const matchedIds = matchedRelations.map((obj) => obj.id.substr(8));
  const matchedIds = matchedRelations.map((obj) => "G" + obj.guid);
  return matchedIds;
}
