import { ExperienceConfig } from '../types';
import img1 from '../assets/images/img1.jpg';
import img2 from '../assets/images/img2.jpg';
import img3 from '../assets/images/img3.jpg';
import img4 from '../assets/images/img4.jpg';

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
   * - unlockPassword: "izel_sadia_hates_me"
   *   Static password allowing early access via the /login page.
   */
  unlockDate: '2026-10-28T00:00:00',
  unlockPassword: 'izel_sadia_hates_me',

  // Exact scene flow order
  scenes: [
    'intro1',
    'intro2',
    'identityGate',
    'excitementCheck',
    'nekoCursor',
    'terminalMessage3D',
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
    'Hey you ✨',
    'Happy Birthday 🎈',
    'May God bless you 🍀',
    'And give u endless happiness 🎉',
    'Just saying… you’re pretty awesome ⭐',
    'Sending good vibes and huge cheers 😎',
    'Hope u have the most epic day today 🎂✨',
  ],

  // Memory card matching game pairs (4 pairs = 8 cards total)
  // Powered by custom photos added by user in src/assets/images
  memoryGame: {
    cards: [
      {
        pairId: 'memory-1',
        title: 'Memory 1',
        emoji: '✨',
        imageUrl: img1,
      },
      {
        pairId: 'memory-2',
        title: 'Memory 2',
        emoji: '💖',
        imageUrl: img2,
      },
      {
        pairId: 'memory-3',
        title: 'Memory 3',
        emoji: '🌸',
        imageUrl: img3,
      },
      {
        pairId: 'memory-4',
        title: 'Memory 4',
        emoji: '🌟',
        imageUrl: img4,
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

Happy Birthday! 🎂 Today is all about celebrating you and the amazing energy you bring wherever you go. You’re honestly one of a kind—full of positivity (and lowkey negativity 🙃), random laughs, and so much kindness. Hope you have the best day and keep being the wonderful person you are! ❤️

May this year bring you heaps of genuine happiness, glowing health, successful milestones, and unforgettable memories. God bless you always!

Thank you for being such a wonderful friend to me for more than a year...

Keep shining, keep smiling, and never stop being the kind soul who cares for and protects every cat you find. 🐱❤️🌟`,
    link: {
      label: 'Write or wish something 💌',
      url: '/message-for-tanvir',
    },
  },
};

export default experienceConfig;
