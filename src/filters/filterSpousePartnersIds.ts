import { WD_SPOUSE, WD_UNMARRIED_PARTNER } from "@entitree/helper";

import { EntityNode } from "types/EntityNode";
import { SettingsState } from "store/settingsSlice";

export const filterSpousePartnersIds = (
  node: EntityNode,
  settings: SettingsState,
) => {
  // Filter Available only for Wikidata
  if (settings.dataSource !== "wikidata") {
    return node.nextAfterIds;
  }

  return node.nextAfterIds?.filter((nextAfterId) => {
    if (
      settings.rightEntityOption.propIds.indexOf(WD_SPOUSE) > -1 &&
      node.spousesIds?.includes(nextAfterId)
    )
      return true;
    if (
      settings.rightEntityOption.propIds.indexOf(WD_UNMARRIED_PARTNER) > -1 &&
      node.partnersIds?.includes(nextAfterId)
    )
      return true;

    return false;
  });
};
