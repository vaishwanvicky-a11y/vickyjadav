
export enum Mode {
  HOME = 'HOME',
  IMAGE = 'IMAGE',
  ANIME = 'ANIME',
  REALISTIC = 'REALISTIC',
  THUMBNAIL = 'THUMBNAIL',
  WISH = 'WISH'
}

export interface GeneratedAsset {
  id: string;
  type: Mode;
  url: string;
  prompt: string;
  timestamp: number;
}
