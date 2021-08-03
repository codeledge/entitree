import { YOUTUBE_LINKS } from "../constants/videos";

export default function getVideoByQid(qid: string) {
  const search = YOUTUBE_LINKS.find((c) => c.qid === qid);
  if (search) {
    search.embedLink =
      "https://www.youtube.com/embed/" + search.url.split("?v=")[1];
    return search;
  }
  return null;
}
