import { CIRCA_ID, PRESUMABLY_ID } from "../constants/entities";
import { Claim, ClaimSnakTimeValue } from "types/Claim";
import { getBestClaim, getBestClaimValue } from "./getBestClaim";

import { DEFAULT_LANG_CODE } from "../constants/langs";
import { DateTime } from "luxon";
import { LangCode } from "types/Lang";
import { SOURCING_CIRCUMSTANCES_ID } from "../constants/properties";
import ordinalize from "ordinalize";
import wbk from "wikidata-sdk";

export const getDateClaimISO = (dateClaim): string | undefined => {
  const bestClaimValue = getBestClaimValue(
    dateClaim,
  ) as ClaimSnakTimeValue["value"];
  if (bestClaimValue) return wbk.wikibaseTimeToISOString(bestClaimValue.time);
};

export default function formatDateClaim(
  claims: Claim[],
  languageCode: LangCode,
  yearOnly = false, //TODO: make this an option object
): string {
  const dateClaim = getBestClaim(claims);
  const value = getBestClaimValue(claims) as ClaimSnakTimeValue["value"];
  if (!value) return "";
  const sourcingCircumstances =
    dateClaim?.qualifiers?.[SOURCING_CIRCUMSTANCES_ID]?.[0]?.datavalue?.value[
      "id"
    ];

  return parseDate(value, languageCode, yearOnly, sourcingCircumstances);
}

/**
 *
 * @param wikidatatime
 * @returns {{output: null, dateObject: null}|{output: string, dateObject: number}|{output: *, dateObject: null}}
 */
function parseDate(
  wikidatatime: ClaimSnakTimeValue["value"],
  languageCode = DEFAULT_LANG_CODE,
  yearOnly = false,
  sourcingCircumstances = null,
) {
  // example of  valid object {time: "+1500-07-07T00:00:00Z" ,precision:8}
  // https://www.wikidata.org/wiki/Help:Dates
  /*
    0 - billion years
    3 - million years
    4 - hundred thousand years
    6 - millenium
    7 - century
    8 - decade
    9 - year (only year)
    10 - month (only month);
    11 - day
    */

  // eslint-disable-next-line prefer-const
  let { precision, time } = wikidatatime;

  // for precision < 6 this doesn't make sense
  const dateISOString: string = wbk.wikibaseTimeToISOString(time);
  const dateOnly = dateISOString.split("T")[0];
  const parsedDate = DateTime.fromISO(dateOnly);
  const { year } = parsedDate;
  let eraSuffix = ""; // moment has only BC
  if (year <= 0) {
    parsedDate.plus({ years: 1 }); // adjust year formatting for BCE
    eraSuffix = " BCE";
  }
  if (yearOnly && precision > 9) {
    precision = 9;
  }
  let sourcingPrefix = "";
  let sourcingPostfix = "";
  if (sourcingCircumstances === CIRCA_ID) {
    // circa
    sourcingPrefix = "~";
  } else if (sourcingCircumstances === PRESUMABLY_ID) {
    // presumably/maybe
    sourcingPostfix = "?";
  }
  switch (precision) {
    case 0: {
      const [, byear] = time.split("-");
      const bya = parseFloat(String(Number(byear) / 1e9));
      return bya + " Bya";
    }
    case 2: {
      // Earth Q2 has precision 2 WTF, not in docs
      const [, myear2] = time.split("-");
      const mya2 = parseFloat(String(Number(myear2) / 1e6));
      return mya2 + " Mya";
    }
    case 3: {
      const [, myear] = time.split("-");
      const mya = parseFloat(String(Number(myear) / 1e6));
      return mya + " Mya";
    }
    case 4: {
      const [, kyear] = time.split("-");
      const kya = parseFloat(String(Number(kyear) / 1e3)); // should be 1e5
      return kya + " Kya";
    }
    case 6: {
      const millenniumIndex = Math.abs(Math.floor(year / 1000));
      const millenniumNumber = year > 0 ? millenniumIndex + 1 : millenniumIndex;
      return ordinalize(millenniumNumber) + " mill." + eraSuffix;
    }
    case 7: {
      const centuryNumber =
        year > 0 ? Math.ceil(year / 100) : Math.abs(Math.floor(year / 100));
      return ordinalize(centuryNumber) + " cent." + eraSuffix;
    }
    case 8:
      return Math.floor(year / 10) + "0s" + eraSuffix;
    case 9:
      return sourcingPrefix + Math.abs(year) + sourcingPostfix + eraSuffix;
    case 10:
      return parsedDate.setLocale(languageCode).toFormat("MMM y") + eraSuffix;
    case 11: {
      return parsedDate.setLocale(languageCode).toFormat("d MMM y") + eraSuffix;
    }
    default:
      return wbk.wikibaseTimeToSimpleDay(wikidatatime);
  }
}
