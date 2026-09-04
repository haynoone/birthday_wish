# Assets & Media Customization Guide

This folder and `src/config/experienceConfig.ts` make it effortless to customize the birthday experience for Sadia ("Lil Valcano🌋"):

### 1. Photos & Memory Game Images
- Update the `memoryGame.cards` array in `src/config/experienceConfig.ts`.
- You can place your own images directly in `/public/images/` and reference them like `/images/sadia-photo-1.jpg`, or use external image URLs.

### 2. Looping Background Music
- Update `music.url` in `src/config/experienceConfig.ts`.
- Supported formats: `.mp3`, `.ogg`, `.wav`.
- You can place an MP3 in `/public/audio/birthday-music.mp3` and set `url: '/audio/birthday-music.mp3'`.
- If an external audio track fails or is blocked by browser autoplay policies, our built-in Web Audio API melodic synthesizer automatically ensures a cozy, cheerful birthday melody plays seamlessly!

### 3. 3D Model Customization
- The 3D scene in `src/components/three/Interactive3DPanel.tsx` features a stylized 3D low-poly mini volcano ("Lil Valcano🌋") with animated emissive lava crater, particle eruptions, plus alternate Birthday Cake and Floating Heart models.
- If you have a custom `.glb` model (e.g. from Blender or Sketchfab), place it in `/public/models/my-volcano.glb` and load it with Drei's `useGLTF('/models/my-volcano.glb')`.

### 4. Neko Kitten Sprite
- Handcrafted vector frames are built into `src/components/neko/NekoKitten.tsx` (Idle sitting pose, Trot frame 1, Trot frame 2, and Trot frame 3).
- To replace with custom PNG spritesheets, see the sprite section in `src/components/neko/NekoKitten.tsx`.
