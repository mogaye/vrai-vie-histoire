export interface BookItem {
  id: string;
  title: string;
  author: string;
  category: 'hero' | 'spotlight' | 'bestseller' | 'continue';
  year: string;
  pages: string;
  genre: string;
  rating: string;
  matchScore: number;
  description: string;
  coverImage: string;
  progressPercent?: number;
  currentPage?: number;
  totalPages?: number;
  readTimeRemaining?: string;
  chapters: { title: string; content: string }[];
}

export const HERO_BOOK: BookItem = {
  id: 'dune',
  title: 'DUNE',
  author: 'Frank Herbert',
  category: 'hero',
  year: '1965',
  genre: 'Science-Fiction · Épopée',
  pages: '688 pages',
  rating: '4.9 ★',
  matchScore: 99,
  description: 'Dans un futur lointain où des maisons nobles se disputent le contrôle de la galaxie, le jeune Paul Atréides est envoyé avec sa famille sur Arrakis, une planète désertique hostile recelant l\'Épice, la substance la plus convoitée de l\'univers.',
  coverImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=1200&q=85',
  chapters: [
    {
      title: 'Chapitre 1 : L\'Épreuve du Gom Jabbar',
      content: `Un commencement est un moment d'une délicatesse extrême. Sachez donc que nous sommes en l'an 10191 de la Guilde. Le monde est Arrakis, la planète des sables, appelée aussi Dune.

Dans la fraîcheur précédant l'aube, Paul Atréides s'éveilla dans sa chambre du château de Caladan. Une vieille femme aux yeux d'ambre l'attendait, vêtue de la robe sombre des Bene Gesserit.

— Entre, Paul, dit-elle. Pose ta main droite dans cette boîte. Et souviens-toi : si tu retires ta main, tu meurs.

Paul sentit une douleur indicible naître au bout de ses doigts, comme une morsure de braise vive...`
    },
    {
      title: 'Chapitre 2 : L\'Arrivée sur Arrakis',
      content: `Les frégates de la Maison Atréides fendaient le ciel ocre d'Arrakeen. Paul contemplait à travers les hublots blindés l'immensité du grand désert. Là-bas régnaient les vers géants, Shai-Hulud, et les Fremen aux yeux d'un bleu pur sans blanc.`
    }
  ]
};

export const SPOTLIGHT_BOOKS: BookItem[] = [
  {
    id: '1984',
    title: '1984',
    author: 'George Orwell',
    category: 'spotlight',
    year: '1949',
    genre: 'Dystopie · Politique',
    pages: '376 pages',
    rating: '4.8 ★',
    matchScore: 98,
    description: 'À Londres, en Océania, Winston Smith tente de résister à la surveillance omnipotente de Big Brother et de la Police de la Pensée.',
    coverImage: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&w=600&q=80',
    chapters: [
      {
        title: 'Chapitre 1 : Big Brother vous regarde',
        content: `C'était une journée d'avril froide et claire. Les horloges sonnaient treize heures. Winston Smith, le menton enfoui dans son cou pour échapper au vent glacial, se glissa rapidement à l'intérieur des Manoirs de la Victoire...`
      }
    ]
  },
  {
    id: 'le-petit-prince',
    title: 'Le Petit Prince',
    author: 'Antoine de Saint-Exupéry',
    category: 'spotlight',
    year: '1943',
    genre: 'Poésie · Conte',
    pages: '120 pages',
    rating: '5.0 ★',
    matchScore: 97,
    description: 'Perdu dans le désert du Sahara après une panne d\'avion, un aviateur rencontre un mystérieux petit bonhomme venu d\'une minuscule planète.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    chapters: [
      {
        title: 'Chapitre 1 : S\'il vous plaît... dessine-moi un mouton',
        content: `J'ai ainsi vécu seul, sans personne avec qui parler véritablement, jusqu'à une panne dans le désert du Sahara, il y a six ans. Quelque chose s'était cassé dans mon moteur.`
      }
    ]
  },
  {
    id: 'le-seigneur-des-anneaux',
    title: 'La Communauté de l\'Anneau',
    author: 'J.R.R. Tolkien',
    category: 'spotlight',
    year: '1954',
    genre: 'High Fantasy',
    pages: '528 pages',
    rating: '4.9 ★',
    matchScore: 96,
    description: 'Le jeune hobbit Frodon Sacquet hérite de l\'Anneau Unique forgé par le Seigneur Sombre Sauron et doit entreprendre un périlleux voyage vers le Mordor.',
    coverImage: 'https://images.unsplash.com/photo-1476275466078-4007374efbbe?auto=format&fit=crop&w=600&q=80',
    chapters: [
      {
        title: 'Chapitre 1 : Une réception depuis longtemps attendue',
        content: `Quand M. Bilbon Sacquet annonça qu'il fêterait sous peu son cent onzième anniversaire par une fête d'une somptuosité particulière, la rumeur et l'excitation gagnèrent toute la Comté.`
      }
    ]
  }
];

export const BESTSELLER_BOOKS: BookItem[] = [
  {
    id: 'les-miserables',
    title: 'Les Misérables',
    author: 'Victor Hugo',
    category: 'bestseller',
    year: '1862',
    genre: 'Classique · Drame',
    pages: '1462 pages',
    rating: '4.9 ★',
    matchScore: 97,
    description: 'L\'odyssée de Jean Valjean, ancien forçat en quête de rédemption, poursuivi sans relâche par l\'implacable inspecteur Javert au cœur de la France du XIXe siècle.',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80',
    chapters: [
      {
        title: 'Livre I : Un Juste',
        content: `En 1815, M. Charles-François-Bienvenu Myriel était évêque de Digne. C'était un vieillard d'environ soixante-quinze ans ; il occupait le siège de Digne depuis 1806.`
      }
    ]
  },
  {
    id: 'l-etranger',
    title: 'L\'Étranger',
    author: 'Albert Camus',
    category: 'bestseller',
    year: '1942',
    genre: 'Philosophie · Roman',
    pages: '184 pages',
    rating: '4.8 ★',
    matchScore: 95,
    description: 'À Alger, Meursault apprend la mort de sa mère. Un jour, sur une plage brûlante de soleil, un coup de feu absurde scelle son destin.',
    coverImage: 'https://images.unsplash.com/photo-1495640388908-05fa85288e61?auto=format&fit=crop&w=600&q=80',
    chapters: [
      {
        title: 'Première Partie : Chapitre 1',
        content: `Aujourd'hui, maman est morte. Ou peut-être hier, je ne sais pas. J'ai reçu un télégramme de l'asile : « Mère décédée. Enterrement demain. Sentiments distingués. » Cela ne veut rien dire. C'était peut-être hier.`
      }
    ]
  },
  {
    id: 'le-comte-de-monte-cristo',
    title: 'Le Comte de Monte-Cristo',
    author: 'Alexandre Dumas',
    category: 'bestseller',
    year: '1844',
    genre: 'Aventure · Vengeance',
    pages: '1276 pages',
    rating: '5.0 ★',
    matchScore: 99,
    description: 'Trahie à la veille de son mariage, Edmond Dantès est enfermé au château d\'If. Après quatorze ans de captivité, il s\'évade, découvre un trésor fabuleux et entreprend sa vengeance.',
    coverImage: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=600&q=80',
    chapters: [
      {
        title: 'Chapitre 1 : Marseille – L\'Arrivée',
        content: `Le 24 février 1815, la vigie de Notre-Dame de la Garde signala le trois-mâts le Pharaon, venant de Smyrne, Trieste et Naples.`
      }
    ]
  },
  {
    id: 'fondation',
    title: 'Fondation',
    author: 'Isaac Asimov',
    category: 'bestseller',
    year: '1951',
    genre: 'Science-Fiction',
    pages: '320 pages',
    rating: '4.9 ★',
    matchScore: 94,
    description: 'Le psychohistorien Hari Seldon prévoit la chute inéluctable de l\'Empire Galactique et met au point un plan millénaire pour abréger les siècles de barbarie à venir.',
    coverImage: 'https://images.unsplash.com/photo-1516979187457-637abb4f9353?auto=format&fit=crop&w=600&q=80',
    chapters: [
      {
        title: 'Les Psychohistoriens',
        content: `Hari Seldon... né la 11 988e année de l'Ère Galactique, mort en 12 069. Les détails biographiques le concernant sont rares...`
      }
    ]
  }
];

export const CONTINUE_READING_BOOKS: BookItem[] = [
  {
    id: 'fahrenheit-451',
    title: 'Fahrenheit 451',
    author: 'Ray Bradbury',
    category: 'continue',
    year: '1953',
    genre: 'Dystopie',
    pages: '256 pages',
    rating: '4.7 ★',
    matchScore: 93,
    description: 'Guy Montag est pompier dans un monde où les livres sont interdits et brûlés à 451 degrés Fahrenheit.',
    coverImage: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=600&q=80',
    progressPercent: 68,
    currentPage: 174,
    totalPages: 256,
    readTimeRemaining: '45 min restantes',
    chapters: [
      {
        title: 'Le Foyer et la Salamandre',
        content: `C'était un plaisir de brûler. C'était un plaisir particulier de voir les choses se consumer, se noircir et se transformer.`
      }
    ]
  },
  {
    id: 'crime-et-chatiment',
    title: 'Crime et Châtiment',
    author: 'Fiodor Dostoïevski',
    category: 'continue',
    year: '1866',
    genre: 'Psychologie · Philosophie',
    pages: '672 pages',
    rating: '4.9 ★',
    matchScore: 96,
    description: 'À Saint-Pétersbourg, l\'étudiant Raskolnikov commet un crime impardonnable et plonge dans les tourments de sa propre conscience.',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=600&q=80',
    progressPercent: 42,
    currentPage: 282,
    totalPages: 672,
    readTimeRemaining: '2h 15m restantes',
    chapters: [
      {
        title: 'Première Partie : Chapitre 1',
        content: `Au commencement de juillet, par un temps excessivement chaud, un jeune homme sortit de sa petite chambre garnie, dans la ruelle S..., et s'avança lentement vers le pont K...`
      }
    ]
  },
  {
    id: 'le-nom-de-la-rose',
    title: 'Le Nom de la Rose',
    author: 'Umberto Eco',
    category: 'continue',
    year: '1980',
    genre: 'Mystère Historique',
    pages: '640 pages',
    rating: '4.8 ★',
    matchScore: 95,
    description: 'En 1327, dans une abbaye bénédictine isolée, le moine Guillaume de Baskerville enquête sur une série de morts suspectes autour d\'une mystérieuse bibliothèque labyrinthique.',
    coverImage: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?auto=format&fit=crop&w=600&q=80',
    progressPercent: 85,
    currentPage: 544,
    totalPages: 640,
    readTimeRemaining: '30 min restantes',
    chapters: [
      {
        title: 'Premier Jour : Prime',
        content: `C'était une belle matinée de fin novembre. La neige tombait faiblement, et une brume froide enveloppait la montagne où se dressait l'abbaye silencieuse.`
      }
    ]
  },
  {
    id: 'la-metamorphose',
    title: 'La Métamorphose',
    author: 'Franz Kafka',
    category: 'continue',
    year: '1915',
    genre: 'Fantastique · Absurde',
    pages: '96 pages',
    rating: '4.7 ★',
    matchScore: 92,
    description: 'Un matin, au sortir d\'un rêve agité, Gregor Samsa se réveille métamorphosé en un insecte monstrueux.',
    coverImage: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=600&q=80',
    progressPercent: 30,
    currentPage: 28,
    totalPages: 96,
    readTimeRemaining: '15 min restantes',
    chapters: [
      {
        title: 'Chapitre 1',
        content: `En se réveillant un matin après des rêves agités, Gregor Samsa se découvrit, dans son lit, métamorphosé en un monstrueux insecte. Il était sur le dos, un dos dur comme une cuirasse.`
      }
    ]
  }
];
