export const DisplayMode = {
  edit: 'edit',
  layout: 'layout',
  front: 'front',
  back: 'back',
} as const;

export type DisplayMode = (typeof DisplayMode)[keyof typeof DisplayMode];
