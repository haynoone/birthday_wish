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
  id: string;
  pairId: string;
  title: string;
  emoji: string;
  imageUrl: string;
}

export interface FinalGiftContent {
  title: string;
  subtitle: string;
  message: string;
  link?: {
    label: string;
    url: string;
  };
  birthdayDate: string;
  recipientName: string;
  nickname: string;
}

export interface ExperienceConfig {
  recipient: {
    name: string;
    nickname: string;
    birthday: string;
  };
  scenes: SceneId[];
  introTexts: {
    intro1: string;
    intro2: string;
  };
  identityGate: {
    question: string;
    hints: string[];
    allowedAnswers: string[];
    errorMessage: string;
  };
  terminalMessages: string[];
  memoryGame: {
    cards: Array<{
      pairId: string;
      title: string;
      emoji: string;
      imageUrl: string;
    }>;
  };
  music: {
    url: string;
    title: string;
    artist: string;
  };
  // Unlock date & password gate for locked countdown landing
  unlockDate: string;
  unlockPassword: string;
  finalGift: FinalGiftContent;
}
