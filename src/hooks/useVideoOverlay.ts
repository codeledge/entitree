import { EntityNode } from "types/EntityNode";
import getVideoByQid from "helpers/getVideoByQid";
import { setVideo } from "store/alertSlice";
import { useAppDispatch } from "store";
import { useEffect } from "react";

export default function useVideoOverlay(node: EntityNode) {
  const dispatch = useAppDispatch();

  //Make sure root is expanded by default
  useEffect(() => {
    if (node.wikidataId && window.innerWidth > 1000) {
      const video = getVideoByQid(node.id);
      if (video) {
        dispatch(setVideo(video));
      }
    }
  }, []);
}
