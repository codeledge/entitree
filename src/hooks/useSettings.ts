import { useAppSelector } from "store";

export default function useSettings() {
  return useAppSelector(({ settings }) => settings);
}
