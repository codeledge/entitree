import { Country } from "constants/countries";
import { EntityNode } from "types/EntityNode";
import { Image } from "types/Entity";
import { SettingsState } from "store/settingsSlice";
import { errorHandler } from "handlers/errorHandler";
import getGeniProfile from "services/geniService";
import { useEffect } from "react";

export default function useGeniProfileInfo(
  entityNode: EntityNode,
  settings: SettingsState,
  setThumbnails: (t: any) => void,
  addLifeSpan: (t: any) => void,
  setLifeSpanInYears: (t: any) => void,
  setBirthCountry: (t: any) => void,
  birthCountry?: Country,
) {
  useEffect(() => {
    if (entityNode.geniId && settings.showExternalImages) {
      getGeniProfile(entityNode.geniId)
        .then((geniProfile) => {
          if (geniProfile?.mugshot_urls?.thumb) {
            const geniImg: Image = {
              url: geniProfile.mugshot_urls.medium,
              alt: `Geni.com image`,
              sourceUrl: geniProfile.profile_url,
              downloadUrl:
                geniProfile.mugshot_urls.large ??
                geniProfile.mugshot_urls.medium,
            };
            setThumbnails((thumbnails) => thumbnails.concat(geniImg));
          }

          //add Geni dates and country
          if (
            geniProfile &&
            (geniProfile.birth || geniProfile.death) &&
            entityNode.lifeSpanInYears === undefined
          ) {
            if (geniProfile.birth && geniProfile.birth.date) {
              entityNode.birthYear = "" + geniProfile.birth.date.year; //convert to string
              if (
                geniProfile.birth.date.circa &&
                geniProfile.birth.date.circa === true
              ) {
                entityNode.birthYear = "~" + entityNode.birthYear;
              }
            }
            if (geniProfile.death && geniProfile.death.date) {
              entityNode.deathYear = "" + geniProfile.death.date.year;
              if (
                geniProfile.death.date.circa &&
                geniProfile.death.date.circa === true
              ) {
                entityNode.deathYear = "~" + entityNode.deathYear;
              }
            }
            addLifeSpan(entityNode);
            setLifeSpanInYears(entityNode.lifeSpanInYears);
          }
          if (
            geniProfile &&
            geniProfile.birth &&
            geniProfile.birth.location &&
            geniProfile.birth.location.country_code &&
            !birthCountry
          ) {
            setBirthCountry({
              code: geniProfile.birth.location.country_code,
              name: geniProfile.birth.location.country,
              text: "Born in " + geniProfile.birth.location.country + " (geni)",
            });
          } else if (
            geniProfile &&
            geniProfile.location &&
            geniProfile.location.country_code &&
            !birthCountry
          ) {
            setBirthCountry({
              code: geniProfile.location.country_code,
              name: geniProfile.location.country,
              text: "Lived in " + geniProfile.location.country + " (geni)",
            });
          }
        })
        .catch(errorHandler);
    }
  }, []);
}
