import {
  CHILD_ID,
  NUMBER_OF_CHILDREN_ID,
  PARTNER_ID,
  SIBLINGS_ID,
  SPOUSE_ID,
} from "../constants/properties";
import getClaimIds, { checkIfClaimsHasSeriesOrdinal } from "./getClaimIds";

import { DataSource } from "wikibase/getWikibaseInstance";
import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";
import getWikibaseSourceIds from "wikibase/getWikibaseSourceIds";
import { sortClaimsByStartDate } from "claims/sortClaimsByStartDate";

export type ConnectorOptions = {
  dataSource: DataSource;
  currentPropId?: string;
  addSourceIds?: boolean;
  addTargetIds?: boolean;
  addNextAfterIds?: boolean;
  addNextBeforeIds?: boolean;
};

export default async function addEntityConnectors(
  entity: Entity,
  options: ConnectorOptions,
) {
  if (options.addSourceIds && options.currentPropId) {
    entity.sourceIds = await getWikibaseSourceIds(
      entity.id,
      options.currentPropId,
      options.dataSource,
    );
  } else {
    delete entity.sourceIds;
  }

  if (options.addTargetIds && options.currentPropId) {
    entity.targetIds = getClaimIds(entity, options.currentPropId);
    entity.areTargetIdsSorted = checkIfClaimsHasSeriesOrdinal(
      entity,
      options.currentPropId,
    );

    //use number of children property, use count of children if not available
    if (options.currentPropId === CHILD_ID) {
      //only for family trees
      entity.targetsCount =
        Number(
          getSimpleClaimValue(entity.simpleClaims, NUMBER_OF_CHILDREN_ID),
        ) || entity.targetIds.length;
    } else {
      entity.targetsCount = entity.targetIds.length;
    }
  } else {
    delete entity.targetIds;
  }

  if (options.addNextAfterIds) addNextAfterIds(entity);

  if (options.addNextBeforeIds)
    entity.nextBeforeIds = getClaimIds(entity, SIBLINGS_ID);
  else delete entity.nextBeforeIds;
}

function addNextAfterIds(entity: Entity) {
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
    entity.nextAfterIds = sortClaimsByStartDate(combinedClaim);
  }
}
