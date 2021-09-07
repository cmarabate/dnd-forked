export function reorderArray({ array, fromIndex, toIndex }) {
  if (fromIndex === toIndex) {
    return array;
  }

  const arrayClone = [...array];
  const [item] = arrayClone.splice(fromIndex, 1);
  arrayClone.splice(toIndex, 0, item);

  return arrayClone;
}
