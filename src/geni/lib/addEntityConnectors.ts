import { Entity, GeniEntity } from "types/Entity";

import { GeniImmediateFamily } from "services/geniService";
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
  const rels = Object.values(entity.nodes);
  entity.upIds = [rels?.[1]?.id.substr(8), rels?.[2]?.id.substr(8)];
  entity.downIds = [];
}
