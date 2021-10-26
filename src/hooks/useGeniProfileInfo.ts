import { Country } from "constants/countries";
import { EntityNode } from "types/EntityNode";
import { SettingsState } from "store/settingsSlice";
import { errorHandler } from "handlers/errorHandler";
import { formatGeniProfile } from "lib/formatGeniProfile";
import getGeniProfile from "services/geniService";
import { useEffect } from "react";

export default function useGeniProfileInfo(
  entityNode: EntityNode,
  settings: SettingsState,
  setThumbnails: (t: any) => void,
  setLifeSpanInYears: (t: any) => void,
  setCountry: (c?: Country) => void,
  country?: Country,
) {
  useEffect(() => {
    if (
      entityNode.wikidataId &&
      entityNode.geniId &&
      settings.showExternalImages
    ) {
      getGeniProfile(entityNode.geniId)
        .then((geniProfile) => {
          const geniEntity = formatGeniProfile(geniProfile!);
          if (geniEntity?.thumbnails?.[0]) {
            setThumbnails((thumbnails) =>
              thumbnails.concat(geniEntity.thumbnails![0]),
            );
          }
          if (!entityNode.lifeSpanInYears && geniEntity.lifeSpanInYears) {
            setLifeSpanInYears(geniEntity.lifeSpanInYears);
          }
          if (!country) {
            setCountry(geniEntity.countryOfCitizenship);
          }
        })
        .catch(errorHandler);
    }
  }, []);
}
