import jsonp from "jsonp-promise";

export type FandomProfile = {
  query: any;
};

export default async function getFandomPageProps(
  fandomHost: string,
  fandomPage: string,
): Promise<any | undefined> {
  try {
    const host = `https://${fandomHost}.fandom.com/api.php`;
    const data = await jsonp(
      `${host}?action=query&prop=pageprops&titles=${fandomPage}&format=json`,
      {
        param: "callback",
        timeout: 2000,
      },
    ).promise;
    return data;
  } catch (e) {
    //TODO: go through server and use axios
  }
}
