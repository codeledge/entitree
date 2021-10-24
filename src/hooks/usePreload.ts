import {
  preloadChildren,
  preloadParents,
  preloadSiblings,
  preloadSpouses,
} from "actions/treeActions";

import { EntityNode } from "types/EntityNode";
import { SettingsState } from "store/settingsSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

export default function usePreload(node: EntityNode, settings: SettingsState) {
  const dispatch = useDispatch();

  //preload connected nodes
  useEffect(() => {
    if (!node.isRoot && settings.dataSource === "wikidata") {
      dispatch(preloadChildren(node));
      dispatch(preloadParents(node));
      dispatch(preloadSiblings(node));
      dispatch(preloadSpouses(node));
    }
  }, []);
}
