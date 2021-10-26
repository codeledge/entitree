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
  setBirthCountry: (t: any) => void,
  birthCountry?: Country,
) {
  useEffect(() => {
    if (entityNode.geniId && settings.showExternalImages) {
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
          if (!birthCountry) {
            setBirthCountry(geniEntity.countryOfCitizenship);
          }
        })
        .catch(errorHandler);
    }
  }, []);
}
