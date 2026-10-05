export type SceneId =
  | 'intro1'
  | 'intro2'
  | 'identityGate'
  | 'excitementCheck'
  | 'terminalMessage3D'
  | 'nekoCursor'
  | 'memoryMatchGame'
  | 'giftReveal';

export interface MemoryGameCard {
  id?: string;
  pairId: string;
  title: string;
  emoji: string;
  imageUrl?: string;
}

export interface RecipientInfo {
  name: string;
  nickname: string;
  birthday: string;
}

export interface IdentityGateConfig {
  question: string;
  hints: string[];
  allowedAnswers: string[];
  errorMessage: string;
}

export interface MemoryGameConfig {
  cards: MemoryGameCard[];
}

export interface MusicConfig {
  url: string;
  title: string;
  artist: string;
}

export interface FinalGiftLink {
  label: string;
  url: string;
}

export interface FinalGiftContent {
  recipientName: string;
  nickname: string;
  birthdayDate: string;
  title: string;
  subtitle: string;
  message: string;
  link?: FinalGiftLink;
}

export interface ExperienceConfig {
  recipient: RecipientInfo;
  unlockDate: string;
  unlockPassword: string;
  scenes: SceneId[];
  introTexts: {
    intro1: string;
    intro2: string;
  };
  identityGate: IdentityGateConfig;
  terminalMessages: string[];
  memoryGame: MemoryGameConfig;
  music: MusicConfig;
  finalGift: FinalGiftContent;
}
