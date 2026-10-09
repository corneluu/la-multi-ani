// =========================================================================
// 🌸 CONFIGURARE GALERIE POZE ȘI VIDEOCLIPURI PE GRUPURI CU DEBLOCARE TEMPORIZATĂ 🌸
// =========================================================================
//
// 📌 CUM FUNCȚIONEAZĂ GRUPURILE ȘI DEBLOCAREA AUTOMATĂ:
// 1. "unlockAt: null" -> Grupul este DEBLOCAT IMEDIAT pentru oricine intră pe site.
// 2. "unlockAt: 'YYYY-MM-DDTHH:mm:ss'" (ex: '2026-10-26T20:00:00') ->
//    - Până la data/ora setată: Grupul este COMPLET ASCUNS pentru vizitatorii normali.
//    - Pentru tine (conectat cu codul secret "maria"): Grupul este VIZIBIL,
//      având eticheta 🔒 cu data și ora exactă când se va debloca public.
//    - La data și ora setată: Grupul se DEBLOCHEAZĂ AUTOMAT în timp real pentru toți!
//
// 💡 Poți schimba oricând datele de deblocare (unlockAt), titlurile sau ordinea fișierelor.
// =========================================================================

const BASE_URL = import.meta.env.BASE_URL || '/'

export const MEDIA_GROUPS = [
  // ── CAPITOLUL 1: DEBLOCAT IMEDIAT ──
  {
    id: 'group-1',
    chapterNumber: 1,
    title: 'Primele Noastre Amintiri 🌸',
    subtitle: 'Momentele magice și zâmbetele de început',
    unlockAt: null, // Deblocat permanent
    items: [
      {
        id: 'photo-1',
        mediaType: 'image',
        src: `${BASE_URL}media/1noi.jpg`,
        name: 'Zâmbetul Tău Strălucitor ✨',
      },
      {
        id: 'photo-2',
        mediaType: 'image',
        src: `${BASE_URL}media/2noi.png`,
        name: 'Momente Magice Împreună 🌸',
      },
      {
        id: 'photo-3',
        mediaType: 'image',
        src: `${BASE_URL}media/3noi.jpg`,
        name: 'Privirea Care Mă Oprește 💖',
      },
      {
        id: 'photo-4',
        mediaType: 'image',
        src: `${BASE_URL}media/4noi.jpg`,
        name: 'Zile Însorite Cu Tine ☀️',
      },
      {
        id: 'photo-5',
        mediaType: 'image',
        src: `${BASE_URL}media/5noi.jpg`,
        name: 'Amintiri De Neuitat 🌿',
      },
      {
        id: 'photo-6',
        mediaType: 'image',
        src: `${BASE_URL}media/6noi.jpg`,
        name: 'Lumina Mea Preferată 💫',
      },
      {
        id: 'photo-7',
        mediaType: 'image',
        src: `${BASE_URL}media/7noi.jpg`,
        name: 'Cea Mai Frumoasă Poveste 💕',
      },
      {
        id: 'photo-8',
        mediaType: 'image',
        src: `${BASE_URL}media/8noi.jpg`,
        name: 'O Clipă De Fericire Pură 🌷',
      },
      {
        id: 'photo-9',
        mediaType: 'image',
        src: `${BASE_URL}media/9noi.jpg`,
        name: 'Surpriză De Necrezut 📸',
      },
      {
        id: 'photo-10',
        mediaType: 'image',
        src: `${BASE_URL}media/10noi.png`,
        name: 'Sufletul Meu Drag ❤️',
      },
    ],
  },

  // ── CAPITOLUL 2: PROGRAMAT PENTRU DEBLOCARE ──
  {
    id: 'group-2',
    chapterNumber: 2,
    title: 'Zâmbete & Aventuri ☀️',
    subtitle: 'Zile pline de soare, bucurie și râsete',
    unlockAt: '2026-10-15T12:00:00', // Modifică data/ora de deblocare aici
    items: [
      {
        id: 'photo-11',
        mediaType: 'image',
        src: `${BASE_URL}media/1.1.jpg`,
        name: 'Raze De Fericire 🌹',
      },
      {
        id: 'photo-12',
        mediaType: 'image',
        src: `${BASE_URL}media/1.2.jpg`,
        name: 'Farmecul Tău Unic 💖',
      },
      {
        id: 'video-1',
        mediaType: 'video',
        src: `${BASE_URL}media/1.3.mp4`,
        name: 'Clipe Magice Cu Tine ✨',
      },
      {
        id: 'video-2',
        mediaType: 'video',
        src: `${BASE_URL}media/1.4.mp4`,
        name: 'Dulceață Și Iubire 🌸',
      },
    ],
  },

  // ── CAPITOLUL 3: AMINTIRI ÎN MIȘCARE ──
  {
    id: 'group-3',
    chapterNumber: 3,
    title: 'Momente În Mișcare 💫',
    subtitle: 'Fiecare secundă alături de tine e o sărbătoare',
    unlockAt: '2026-10-20T18:00:00', // Modifică data/ora de deblocare aici
    items: [
      {
        id: 'video-3',
        mediaType: 'video',
        src: `${BASE_URL}media/2.1.mp4`,
        name: 'Plimbarea Noastră În Grădină 🎥',
      },
      {
        id: 'video-4',
        mediaType: 'video',
        src: `${BASE_URL}media/2.2.mp4`,
        name: 'Râsete Știute Doar De Noi 💕',
      },
      {
        id: 'video-5',
        mediaType: 'video',
        src: `${BASE_URL}media/2.3.mp4`,
        name: 'Cadoul Perfect 🎁',
      },
      {
        id: 'video-6',
        mediaType: 'video',
        src: `${BASE_URL}media/2.4.mp4`,
        name: 'Momentul Nostru Preferat 🌸',
      },
      {
        id: 'video-7',
        mediaType: 'video',
        src: `${BASE_URL}media/2.5.mp4`,
        name: 'O Zi Plină De Bucurie ✨',
      },
      {
        id: 'video-8',
        mediaType: 'video',
        src: `${BASE_URL}media/2.6.mp4`,
        name: 'Amintiri În Mișcare 💫',
      },
    ],
  },

  // ── CAPITOLUL 4: MARELE CADOU ──
  {
    id: 'group-4',
    chapterNumber: 4,
    title: 'Marele Cadou & Iubire Pură 🎁',
    subtitle: 'Cele mai speciale clipe dedicate ție',
    unlockAt: '2026-10-26T20:00:00', // Modifică data/ora de deblocare aici
    items: [
      {
        id: 'video-9',
        mediaType: 'video',
        src: `${BASE_URL}media/3.1.mp4`,
        name: 'O Poveste Fără Sfârșit 🌹',
      },
      {
        id: 'video-10',
        mediaType: 'video',
        src: `${BASE_URL}media/4.1.mp4`,
        name: 'Clipul Nostru Special 🎬',
      },
    ],
  },

  // ── CAPITOLUL 5: CLIPE DE VIS & IUBIRE ETERNĂ ──
  {
    id: 'group-5',
    chapterNumber: 5,
    title: 'Clipe De Vis & Iubire Eternă 💖',
    subtitle: 'Cele mai noi și prețioase amintiri împreună',
    unlockAt: '2026-10-26T23:59:59', // Modifică data/ora de deblocare aici
    items: [
      {
        id: 'photo-13',
        mediaType: 'image',
        src: `${BASE_URL}media/5.1.jpg`,
        name: 'Zâmbetul Care Mă Încântă 🌸',
      },
      {
        id: 'photo-14',
        mediaType: 'image',
        src: `${BASE_URL}media/5.2.jpg`,
        name: 'Frumusețe Fără Seamăn ✨',
      },
      {
        id: 'photo-15',
        mediaType: 'image',
        src: `${BASE_URL}media/5.3.webp`,
        name: 'Priviri Plinede Magie 💖',
      },
      {
        id: 'photo-16',
        mediaType: 'image',
        src: `${BASE_URL}media/5.4.webp`,
        name: 'Strălucirea Ta Unică 🌟',
      },
      {
        id: 'photo-17',
        mediaType: 'image',
        src: `${BASE_URL}media/5.5.jpg`,
        name: 'O Rază De Fericire ☀️',
      },
      {
        id: 'photo-18',
        mediaType: 'image',
        src: `${BASE_URL}media/5.6.jpg`,
        name: 'Inima Mea E La Tine ❤️',
      },
      {
        id: 'video-11',
        mediaType: 'video',
        src: `${BASE_URL}media/5.7.mp4`,
        name: 'Râsete și Bucurie Pură 💕',
      },
      {
        id: 'video-12',
        mediaType: 'video',
        src: `${BASE_URL}media/5.8.mp4`,
        name: 'Momentul Nostru Magic 🎥',
      },
      {
        id: 'video-13',
        mediaType: 'video',
        src: `${BASE_URL}media/5.9.mp4`,
        name: 'O Poveste De Neuitat 🌷',
      },
      {
        id: 'video-14',
        mediaType: 'video',
        src: `${BASE_URL}media/5.10.mp4`,
        name: 'Pentru Totdeauna Împreună 💫',
      },
    ],
  },
]

// Toate elementele aplatizate (pentru compatibilitate deplină cu LoginPage, LoadingScreen și preloader)
export const MEDIA_CONFIG = MEDIA_GROUPS.flatMap((group) =>
  group.items.map((item) => ({
    ...item,
    groupId: group.id,
    groupTitle: group.title,
    groupSubtitle: group.subtitle,
    groupNumber: group.chapterNumber,
    unlockAt: item.unlockAt !== undefined ? item.unlockAt : group.unlockAt,
  }))
)
