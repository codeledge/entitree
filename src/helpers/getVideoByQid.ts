import { YOUTUBE_LINKS } from "../constants/videos";

export default function getVideoByQid(qid: string) {
  return YOUTUBE_LINKS[qid];
}
