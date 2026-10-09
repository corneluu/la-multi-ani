// =========================================================================
// 🌸 CONFIGURARE GALERIE POZE ȘI VIDEOCLIPURI PE CAPITOLE INTERACTIVE 🌸
// =========================================================================

const BASE_URL = import.meta.env.BASE_URL || '/'

export const MEDIA_GROUPS = [
  // ── CAPITOLUL 1: Deblocat imediat (toate imaginile "noi") ──
  {
    id: 'group-1',
    chapterNumber: 1,
    title: 'Capitolul 1',
    unlockType: 'immediate',
    isVaUrma: false,
    items: [
      { id: 'p-1', mediaType: 'image', src: `${BASE_URL}media/1noi.jpg`, name: 'Amintire #1 ✨' },
      { id: 'p-2', mediaType: 'image', src: `${BASE_URL}media/2noi.png`, name: 'Amintire #2 🌸' },
      { id: 'p-3', mediaType: 'image', src: `${BASE_URL}media/3noi.jpg`, name: 'Amintire #3 💖' },
      { id: 'p-4', mediaType: 'image', src: `${BASE_URL}media/4noi.jpg`, name: 'Amintire #4 ☀️' },
      { id: 'p-5', mediaType: 'image', src: `${BASE_URL}media/5noi.jpg`, name: 'Amintire #5 🌿' },
      { id: 'p-6', mediaType: 'image', src: `${BASE_URL}media/6noi.jpg`, name: 'Amintire #6 💫' },
      { id: 'p-7', mediaType: 'image', src: `${BASE_URL}media/7noi.jpg`, name: 'Amintire #7 💕' },
      { id: 'p-8', mediaType: 'image', src: `${BASE_URL}media/8noi.jpg`, name: 'Amintire #8 🌷' },
      { id: 'p-9', mediaType: 'image', src: `${BASE_URL}media/9noi.jpg`, name: 'Amintire #9 📸' },
      { id: 'p-10', mediaType: 'image', src: `${BASE_URL}media/10noi.png`, name: 'Amintire #10 ❤️' },
    ],
  },

  // ── CAPITOLUL 2: Deblocat imediat (Va urma!:) ──
  {
    id: 'group-2',
    chapterNumber: 2,
    title: 'Capitolul 2',
    unlockType: 'immediate',
    isVaUrma: true,
    items: [],
  },

  // ── CAPITOLUL 3: Parolă / Întrebare: În ce dată te-am întrebat dacă vrei să fii iubita mea? (3 iunie 2026) ──
  {
    id: 'group-3',
    chapterNumber: 3,
    title: 'Capitolul 3',
    unlockType: 'question',
    question: 'În ce dată te-am întrebat dacă vrei să fii iubita mea?',
    placeholder: 'Ex: 3 iunie 2026 sau 3.06.2026',
    isVaUrma: false,
    items: [
      { id: 'v-4-1', mediaType: 'video', src: `${BASE_URL}media/4.1.mp4`, name: 'Momentul Nostru 🎬' },
    ],
  },

  // ── CAPITOLUL 4: Bară drag la 100% (Cât de mult îți iubești iubitul?) ──
  {
    id: 'group-4',
    chapterNumber: 4,
    title: 'Capitolul 4',
    unlockType: 'slider',
    question: 'Cât de mult îți iubești iubitul?',
    isVaUrma: false,
    items: [
      { id: 'v-2-1', mediaType: 'video', src: `${BASE_URL}media/2.1.mp4`, name: 'Amintire Video #1 🎥' },
      { id: 'v-2-2', mediaType: 'video', src: `${BASE_URL}media/2.2.mp4`, name: 'Amintire Video #2 💕' },
      { id: 'v-2-3', mediaType: 'video', src: `${BASE_URL}media/2.3.mp4`, name: 'Amintire Video #3 🎁' },
      { id: 'v-2-4', mediaType: 'video', src: `${BASE_URL}media/2.4.mp4`, name: 'Amintire Video #4 🌸' },
      { id: 'v-2-5', mediaType: 'video', src: `${BASE_URL}media/2.5.mp4`, name: 'Amintire Video #5 ✨' },
      { id: 'v-2-6', mediaType: 'video', src: `${BASE_URL}media/2.6.mp4`, name: 'Amintire Video #6 💫' },
    ],
  },

  // ── CAPITOLUL 5: Întrebare data de naștere (19 iunie 2005) ──
  {
    id: 'group-5',
    chapterNumber: 5,
    title: 'Capitolul 5',
    unlockType: 'question',
    question: 'Care e data mea de naștere? (zi lună an)',
    placeholder: 'Ex: 19 iunie 2005 sau 19.06.2005',
    isVaUrma: false,
    items: [
      { id: 'p-5-1', mediaType: 'image', src: `${BASE_URL}media/5.1.jpg`, name: 'Foto 5.1 🌸' },
      { id: 'p-5-2', mediaType: 'image', src: `${BASE_URL}media/5.2.jpg`, name: 'Foto 5.2 ✨' },
      { id: 'p-5-3', mediaType: 'image', src: `${BASE_URL}media/5.3.webp`, name: 'Foto 5.3 💖' },
      { id: 'p-5-4', mediaType: 'image', src: `${BASE_URL}media/5.4.webp`, name: 'Foto 5.4 🌟' },
      { id: 'p-5-5', mediaType: 'image', src: `${BASE_URL}media/5.5.jpg`, name: 'Foto 5.5 ☀️' },
      { id: 'p-5-6', mediaType: 'image', src: `${BASE_URL}media/5.6.jpg`, name: 'Foto 5.6 ❤️' },
      { id: 'v-5-7', mediaType: 'video', src: `${BASE_URL}media/5.7.mp4`, name: 'Video 5.7 💕' },
      { id: 'v-5-8', mediaType: 'video', src: `${BASE_URL}media/5.8.mp4`, name: 'Video 5.8 🎥' },
      { id: 'v-5-9', mediaType: 'video', src: `${BASE_URL}media/5.9.mp4`, name: 'Video 5.9 🌷' },
      { id: 'v-5-10', mediaType: 'video', src: `${BASE_URL}media/5.10.mp4`, name: 'Video 5.10 💫' },
    ],
  },

  // ── CAPITOLUL 6: Întrebare deschisă + Discord Webhook (Când crezi că te va cere Cornel de nevastă?) ──
  {
    id: 'group-6',
    chapterNumber: 6,
    title: 'Capitolul 6',
    unlockType: 'open_question',
    question: 'Când crezi că te va cere Cornel de nevastă?',
    placeholder: 'Scrie răspunsul tău aici...',
    webhookUrl: 'https://discord.com/api/webhooks/1558227877651021916/Y604bkjjxNmbuT1F7_17zFBFz_vTXjkHZxgT4-OiEIyYBIf3WMK1FfuAV1XyZGkM5Hss',
    isVaUrma: false,
    items: [
      { id: 'p-1-1', mediaType: 'image', src: `${BASE_URL}media/1.1.jpg`, name: 'Foto 1.1 🌹' },
      { id: 'p-1-2', mediaType: 'image', src: `${BASE_URL}media/1.2.jpg`, name: 'Foto 1.2 💖' },
      { id: 'v-1-3', mediaType: 'video', src: `${BASE_URL}media/1.3.mp4`, name: 'Video 1.3 ✨' },
      { id: 'v-1-4', mediaType: 'video', src: `${BASE_URL}media/1.4.mp4`, name: 'Video 1.4 🌸' },
    ],
  },

  // ── CAPITOLUL 7: Va urma!: ──
  {
    id: 'group-7',
    chapterNumber: 7,
    title: 'Capitolul 7',
    unlockType: 'immediate',
    isVaUrma: true,
    items: [],
  },
]

// Toate elementele aplatizate (pentru compatibilitate deplină cu LoginPage, LoadingScreen și preloader)
export const MEDIA_CONFIG = MEDIA_GROUPS.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    groupId: group.id,
    groupTitle: group.title,
    groupNumber: group.chapterNumber,
  }))
)
