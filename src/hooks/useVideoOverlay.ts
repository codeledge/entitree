import { EntityNode } from "types/EntityNode";
import getVideoByQid from "helpers/getVideoByQid";
import { setVideo } from "store/alertSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function useVideoOverlay(node: EntityNode) {
  const dispatch = useDispatch();

  //Make sure root is expanded by default
  useEffect(() => {
    if (window.innerWidth > 1000) {
      const video = getVideoByQid(node.id);
      if (video) {
        dispatch(setVideo(video));
      }
    }
  }, []);
}
