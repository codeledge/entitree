// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { GeniEntity } from "types/Entity";
import { GeniImmediateFamily } from "services/geniService";

// import { LangCode } from "types/Lang";

export default function formatGeniProfile(
  geniResult: GeniImmediateFamily | undefined,
) {
  const geniProfile = geniResult.focus;
  const entity: GeniEntity = {
    ...geniResult,
  };
  entity.id = "Q10000";
  entity.label = geniProfile?.first_name + " " + geniProfile?.last_name;
  entity.description = geniProfile?.id;
  entity.birthDate = geniProfile?.birth.date.formatted_date;
  return entity;
}
