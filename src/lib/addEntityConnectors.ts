import {
  CHILD_ID,
  NUMBER_OF_CHILDREN_ID,
  SIBLINGS_ID,
  START_DATE_ID,
} from "../constants/properties";
import getClaimIds, { checkIfClaimsHasSeriesOrdinal } from "./getClaimIds";

import { Claim } from "types/Claim";
import { Entity } from "types/Entity";
import getSimpleClaimValue from "./getSimpleClaimValue";
import store from "store";

export type ConnectorOptions = {
  currentPropId?: string;
  upMap?: Record<string, string[]>;
  addDownIds?: boolean;
  addRightIds?: boolean;
  addLeftIds?: boolean;
};

export default function addEntityConnectors(
  entity: Entity,
  options: ConnectorOptions,
) {
  if (options.upMap) {
    entity.upIds = options.upMap[entity.id];
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
  else {
    delete entity.rightIds;
  }
  if (options.addLeftIds) entity.leftIds = getClaimIds(entity, SIBLINGS_ID);
  else delete entity.leftIds;
}

function addRightIds(entity: Entity) {
  let claim: Claim[] = [];
  const { rightEntityOption } = store.getState().settings;
  if (rightEntityOption?.propIds) {
    //cannot use simpleclaims here as only preferred will show up
    claim = rightEntityOption.propIds.reduce(
      (acc: Claim[], propId) => acc.concat(entity.claims?.[propId] || []),
      [],
    );
  }

  entity.rightIds = claim
    .sort((a, b) => {
      try {
        return a.qualifiers?.[START_DATE_ID][0].datavalue?.value["time"] <
          b.qualifiers?.[START_DATE_ID][0].datavalue?.value["time"]
          ? 1
          : -1;
      } catch (error) {
        return 1;
      }
    })
    .map(({ mainsnak }) => {
      try {
        return mainsnak.datavalue?.value["id"]; //for 'No value' and 'Unknown'
      } catch (error) {
        return null;
      }
    })
    .filter((id, index, ids) => {
      // Filter out 'No value' and 'Unknown'
      // Filter people married twice with same person (e.g. elon musk)
      return id && ids.indexOf(id) === index;
    });
}
