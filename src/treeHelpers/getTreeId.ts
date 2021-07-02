let currentId = 0;
export default function getTreeId() {
  currentId += 1;
  return currentId;
}
