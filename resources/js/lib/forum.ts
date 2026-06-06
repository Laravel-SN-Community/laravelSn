const TINTS = [
    '#0f7b4d',
    '#b45309',
    '#0369a1',
    '#7c3aed',
    '#dc2626',
    '#188a5c',
];

export const authorTint = (id: number): string => TINTS[id % TINTS.length];
