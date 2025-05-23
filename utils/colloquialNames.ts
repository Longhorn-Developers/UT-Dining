interface ColloquialNameMap {
  [key: string]: string;
}

const colloquialNames: ColloquialNameMap = {
  "Jesta' Pizza": "Jizza's",
  'Jester City Market': 'Jarket',
  'J2 Dining': 'J2',
  'JCL Dining': 'JCL',
  'Kins Dining': 'Kins',
  'Cypress Bend Cafe': 'Cypress',
  'Littlefield Patio Cafe': 'Littlefield Cafe',
};

export const getLocationName = (originalName: string, useColloquial: boolean): string => {
  if (!useColloquial) return originalName;
  return colloquialNames[originalName] || originalName;
};
