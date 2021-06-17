import { LANGS, SECOND_LABELS } from "constants/langs";

import { createSelector } from "reselect";
import { useAppSelector } from "store";

const secondLabelCodeSelector = ({ settings }) => settings.secondLabelCode;

export const secondLabelSelector = createSelector(
  [secondLabelCodeSelector],
  (secondLabelCode) => {
    return (
      secondLabelCode &&
      (SECOND_LABELS.find(({ code }) => code === secondLabelCode) ||
        LANGS.find(({ code }) => secondLabelCode === code)!)
    );
  },
);

export const useCurrentSecondLabel = () => useAppSelector(secondLabelSelector);
