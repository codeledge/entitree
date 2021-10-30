import { EntityNode } from "types/EntityNode";
import { SettingsState } from "store/settingsSlice";
import { PARTNER_ID, SPOUSE_ID } from "constants/properties";

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
      settings.rightEntityOption.propIds.indexOf(SPOUSE_ID) > -1 &&
      node.spousesIds?.includes(nextAfterId)
    )
      return true;
    if (
      settings.rightEntityOption.propIds.indexOf(PARTNER_ID) > -1 &&
      node.partnersIds?.includes(nextAfterId)
    )
      return true;

    return false;
  });
};
