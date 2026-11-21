import { DataSource } from "@entitree/helper";
import { LangCode } from "types/Lang";
import { loadEntityProps } from "actions/loadActions";
import { useAppSelector } from "store";
import { useAppDispatch } from "store";
import { useEffect } from "react";

// Loads the props dropdown in the browser when the server did not send it
export default function useLoadEntityProps(
  langCode: LangCode | undefined,
  dataSource: DataSource,
) {
  const dispatch = useAppDispatch();
  const entityId = useAppSelector(({ tree }) => tree.currentEntity?.id);
  const hasEntityProps = useAppSelector(
    ({ tree }) => !!tree.currentEntityProps,
  );

  useEffect(() => {
    if (entityId && langCode && !hasEntityProps)
      dispatch(loadEntityProps(entityId, langCode, dataSource));
  }, [entityId, langCode, dataSource, hasEntityProps]);
}
