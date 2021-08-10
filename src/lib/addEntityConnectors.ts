import {
  CHILD_ID,
  NUMBER_OF_CHILDREN_ID,
  PARTNER_ID,
  SIBLINGS_ID,
  SPOUSE_ID,
} from "../constants/properties";
import getClaimIds, { checkIfClaimsHasSeriesOrdinal } from "./getClaimIds";

import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";
import getUpIds from "wikidata/getUpIds";
import { sortClaimsByStartDate } from "claims/sortClaims";

export type ConnectorOptions = {
  currentPropId?: string;
  addUpIds?: boolean;
  addDownIds?: boolean;
  addRightIds?: boolean;
  addLeftIds?: boolean;
};

export default async function addEntityConnectors(
  entity: Entity,
  options: ConnectorOptions,
) {
  if (options.addUpIds && options.currentPropId) {
    entity.upIds = await getUpIds(entity.id, options.currentPropId);
  } else {
    delete entity.upIds;
  }

  if (options.addDownIds && options.currentPropId) {
    entity.downIds = getClaimIds(entity, options.currentPropId);
    entity.downIdsAlreadySorted = checkIfClaimsHasSeriesOrdinal(
      entity,
      options.currentPropId,
    );

    //use number of children property, use count of children if not available
    if (options.currentPropId === CHILD_ID) {
      //only for family trees
      entity.childrenCount =
        Number(
          getSimpleClaimValue(entity.simpleClaims, NUMBER_OF_CHILDREN_ID),
        ) || entity.downIds.length;
    } else {
      entity.childrenCount = entity.downIds.length;
    }
  } else {
    delete entity.downIds;
  }

  if (options.addRightIds) addRightIds(entity);

  if (options.addLeftIds) entity.leftIds = getClaimIds(entity, SIBLINGS_ID);
  else delete entity.leftIds;
}

function addRightIds(entity: Entity) {
  //cannot use simpleclaims here as only preferred will show up
  //load everything here then you filter on the client

  const spousesClaim = entity.claims?.[SPOUSE_ID];
  const partnersClaim = entity.claims?.[PARTNER_ID];
  const combinedClaim = [...(spousesClaim || []), ...(partnersClaim || [])];

  if (spousesClaim) {
    entity.spousesIds = sortClaimsByStartDate(spousesClaim);
  }
  if (partnersClaim) {
    entity.partnersIds = sortClaimsByStartDate(partnersClaim);
  }
  if (combinedClaim) {
    entity.rightIds = sortClaimsByStartDate(combinedClaim);
  }
}
