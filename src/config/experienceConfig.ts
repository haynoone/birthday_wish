import { ExperienceConfig } from '../types';

/**
 * Birthday Experience Configuration for Sadia (“Lil Valcano🌋”)
 * Birthday: October 28
 *
 * All content, hints, allowed answers, game cards, and gift messages are configured here.
 * Replace placeholder assets (images, music URL, 3D model links) as desired.
 */
export const experienceConfig: ExperienceConfig = {
  recipient: {
    name: 'Sadia',
    nickname: 'Lil Valcano🌋',
    birthday: 'October 28',
  },

  /**
   * LOCKED LANDING PAGE & ACCESS GATE CONFIGURATION
   * - unlockDate: "2026-10-28T00:00:00"
   *   Target unlock date: October 28, 2026 at 00:00:00.
   *   By default, this is parsed in the celebrant/visitor's local browser timezone.
   *   To enforce a specific timezone (e.g. Bangladesh GMT+6 or EST), append an ISO offset like "+06:00":
   *   e.g. "2026-10-28T00:00:00+06:00"
   * - unlockPassword: "izel_sadia_is_hates_me"
   *   Static password allowing early access via the /login page.
   */
  unlockDate: '2026-10-28T00:00:00',
  unlockPassword: 'izel_sadia_is_hates_me',

  // Exact scene flow order
  scenes: [
    'intro1',
    'intro2',
    'identityGate',
    'excitementCheck',
    'terminalMessage3D',
    'nekoCursor',
    'memoryMatchGame',
    'giftReveal',
  ],

  // Intro typewriter texts
  introTexts: {
    intro1: 'Hey, wait a second!',
    intro2: 'This website is only for someone special.',
  },

  // Identity verification gate
  identityGate: {
    question: 'Secret code require!',
    hints: [
      '💡 Hint 1: A 5-letter special nickname: T _ _ _ o',
      '💡 Hint 2: A universal fact: "Tanvir is a..."',
    ],
    // Case-insensitive, whitespace trimmed matches
    allowedAnswers: [
      'tambo',
      'tanvir is a loser',
      'tanvir is a looser',
    ],
    errorMessage: 'Incorrect secret code! Try again… 🤔',
  },

  // Terminal sequential lines
  terminalMessages: [
    'Hey you 💞',
    'Happy Birthday 🎈',
    'May God bless you 🍀',
    'And give u many happiness 💕',
    'Just saying… you’re pretty awesome ❤️',
    'Sending good vibes and maybe a wink 😏',
    'Hope u have a great day today ❤️✨',
  ],

  // Memory card matching game pairs (4 pairs = 8 cards total)
  // Replace these image URLs with custom photos of Sadia or memories!
  memoryGame: {
    cards: [
      {
        pairId: 'volcano',
        title: 'Lil Valcano',
        emoji: '🌋',
        imageUrl:
          'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&auto=format&fit=crop&q=80',
      },
      {
        pairId: 'cake',
        title: 'Sweet Birthday',
        emoji: '🎂',
        imageUrl:
          'https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?w=400&auto=format&fit=crop&q=80',
      },
      {
        pairId: 'kitten',
        title: 'Playful Neko',
        emoji: '🐾',
        imageUrl:
          'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&auto=format&fit=crop&q=80',
      },
      {
        pairId: 'sparkle',
        title: 'Pure Magic',
        emoji: '✨',
        imageUrl:
          'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=400&auto=format&fit=crop&q=80',
      },
    ],
  },

  // Background Looping Music
  // Replace with any direct mp3 / audio URL. The built-in audio synthesizer also generates a cozy lofi melody!
  music: {
    url: 'https://cdn.pixabay.com/download/audio/2022/11/06/audio_c937397b9c.mp3?filename=happy-birthday-lofi-126084.mp3',
    title: 'Birthday Chill Lofi Beat',
    artist: 'Special Birthday Mix',
  },

  // Final gift & personal heartfelt note
  finalGift: {
    recipientName: 'Sadia',
    nickname: 'Lil Valcano🌋',
    birthdayDate: 'October 28',
    title: 'Happy Birthday, Sadia! 🎉',
    subtitle: 'To the one and only Lil Valcano 🌋✨',
    message: `Dear Sadia,

Happy Birthday! 🎂 Today is all about celebrating the wonderful, radiant energy you bring into the world. You’re truly one of a kind—explosive with positivity, heartwarming laughs, and endless kindness (truly living up to the Lil Valcano name! 🌋).

May this year bring you heaps of genuine happiness, glowing health, successful milestones, and unforgettable memories. God bless you always!

Keep shining, keep smiling, and never stop being your authentic awesome self. ❤️`,
    link: {
      label: 'Open Your Surprise Playlist & Memories 🎁',
      url: 'https://open.spotify.com',
    },
  },
};

export default experienceConfig;
