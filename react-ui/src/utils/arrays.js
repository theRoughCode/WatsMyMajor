export const arrayEquals = (a1, a2) => (
  Array.isArray(a1) && Array.isArray(a2) && a1.length === a2.length && a1.every((v,i) => v === a2[i])
);

export const objectEquals = (o1, o2) => (
  (o1 == null && o2 == null) ||
  ((o1 != null && o2 != null) &&
  typeof o1 === 'object' && typeof o2 === 'object' && Object.keys(o1).length === Object.keys(o2).length && Object.keys(o1).every(k => (
    (Array.isArray(o1[k]) && Array.isArray(o2[k]))
      ? arrayEquals(o1[k], o2[k])
      : o1[k] === o2[k]
  )))
);

export const arrayOfObjectEquals = (a1, a2) => (
  Array.isArray(a1) && Array.isArray(a2) && a1.length === a2.length && a1.every((v,i) => objectEquals(v, a2[i]))
);
