export const hero = {
  label: 'STRUCTURE / CURIOSITY / EXPRESSION',
  headline: 'BETWEEN SIGNAL AND NOISE.',
  intro: 'Mich faszinieren die Strukturen hinter den Dingen. Die Muster, die Verbindungen und die Fragen, auf die es noch keine Antworten gibt.',
  topics: ['IT-ARCHITEKTUR', 'KI', 'MUSIK', 'VISUELLE KUNST'],
};

export const about = [
  'Komplexität verstehen. Zusammenhänge erkennen. Aus einzelnen Elementen etwas Neues entstehen lassen.',
  'Mein professioneller Schwerpunkt liegt in der Gestaltung komplexer IT-Landschaften. Besonders spannend sind dabei die Strukturen, Abhängigkeiten und das Zusammenspiel ihrer Komponenten – und die Möglichkeiten, die daraus entstehen.',
  'Darüber hinaus eröffnen künstliche Intelligenz, elektronische Musik und visuelle Kunst immer wieder neue Perspektiven.',
  'Unterschiedliche Welten, die nicht zwangsläufig zusammengehören müssen. Was sie verbindet, ist die Neugier auf das Unbekannte und die Freude am Experimentieren.',
  'Denn wirklich spannend wird es dort, wo Bekanntes hinterfragt wird und neue Möglichkeiten entstehen.',
];

export const topics = [
  {
    id: 'systems', title: 'SYSTEMS.', subtitle: 'Finding order in complexity.', category: '01 / STRUCTURE',
    body: 'Komplexe IT-Landschaften sind mehr als die Summe ihrer Komponenten. Entscheidend sind die Verbindungen dazwischen – und die Frage, wie aus Strukturen tragfähige Lösungen entstehen.',
    image: '/art/systems.svg',
  },
  {
    id: 'lab', title: 'LAB.', subtitle: 'What if? Why not?', category: '02 / EXPERIMENT',
    body: 'Neue Technologien eröffnen neue Möglichkeiten. Künstliche Intelligenz, digitale Werkzeuge und eigene Experimente bieten Raum, Ideen auszuprobieren, Grenzen zu entdecken und aus Ergebnissen zu lernen.',
    image: '/art/lab.svg',
  },
  {
    id: 'frequencies', title: 'FREQUENCIES.', subtitle: 'Beyond words. Beyond logic.', category: '03 / EXPRESSION',
    body: 'Elektronische Musik, Klangwelten und visuelle Kunst. Manches muss nicht analysiert werden, um seine Wirkung zu entfalten. Rhythmus, Atmosphäre und Emotionen eröffnen eine andere Form der Wahrnehmung.',
    image: '/art/frequencies.svg',
  },
  {
    id: 'perspectives', title: 'PERSPECTIVES.', subtitle: 'Question the obvious.', category: '04 / CURIOSITY',
    body: 'Beobachtungen, Gedanken und neue Blickwinkel. Nicht jede Frage braucht sofort eine Antwort. Manchmal liegt der eigentliche Wert darin, Gewohntes zu hinterfragen und eine andere Perspektive einzunehmen.',
    image: '/art/perspectives.svg',
  },
];

export const signals = [
  { title: 'CINDER HAZE.', category: '01 / VISUAL ART', body: 'Abstrakte visuelle Experimente.', image: '/art/cinder.svg' },
  { title: 'ON REPEAT.', category: '02 / MUSIC', body: 'Musik, Einflüsse und persönliche Notizen.', image: '/art/repeat.svg', href: '/on-repeat/' },
  { title: 'FREQUENCIES.', category: '03 / SONIC EXPERIMENTS', body: 'Audiovisuelle Klangexperimente.', image: '/art/frequencies.svg', href: '/frequencies/' },
];

export interface SonicExperiment {
  id: string;
  title: string;
  tool: string;
  category: string;
  audioSrc: string;
  description: string;
  emerged: string;
}

export const sonicExperiments: SonicExperiment[] = [
  {
    id: '001',
    title: 'Orbit of Defiance',
    tool: 'Strudel',
    category: 'Reactive Soundscape',
    audioSrc: '/audio/orbit-of-defiance.mp3',
    description: 'Ein erster Versuch mit Strudel. Kein klassischer Track-Release, sondern ein Experiment zwischen Struktur, Impuls und kontrollierter Unruhe.',
    emerged: 'Entstanden aus Neugier: Was passiert, wenn Rhythmus nicht nur gespielt, sondern programmiert wird? Aus wiederkehrenden Mustern entwickeln sich Bewegung, Spannung und neue Strukturen.',
  },
];

export interface MusicStory {
  number: string;
  category: string;
  artist: string;
  track: string;
  paragraphs: string[];
  spotifyUrl: string;
}

export const musicStories: MusicStory[] = [
  {
    number: '01',
    category: 'STILL RESONATING.',
    artist: 'LINKIN PARK',
    track: 'IN THE END',
    paragraphs: [
      'Manche Songs bleiben, weil sie etwas berühren, das sich nur schwer in Worte fassen lässt.',
      '„In the End“ ist für mich einer dieser Songs.',
      'Nicht jeder Weg war einfach. Manche Erfahrungen hinterlassen Spuren, andere begleiten einen ein Leben lang. All das hat mich geprägt und gehört zu dem Menschen, der ich heute bin.',
      'Mit meinen Stärken. Mit meinen Schwächen.',
      'Und mit allem dazwischen.',
    ],
    spotifyUrl: 'https://open.spotify.com/track/60a0Rd6pjrkxjPbaKzXjfq',
  },
  {
    number: '02',
    category: 'BEYOND THE BEAT.',
    artist: 'EMMANUEL TOP',
    track: 'ACID PHASE',
    paragraphs: [
      'Musik braucht keine Worte. Sie kann eine Wucht entfalten, der man sich kaum entziehen kann.',
      'Ein treibender Rhythmus. Eine Bassline. Wiederholungen, die sich langsam verändern und eine ganz eigene Dynamik entwickeln.',
      '„Acid Phase“ von Emmanuel Top ist für mich genau das. Wenige Elemente, die sich überlagern, verändern und eine hypnotische Wirkung entfalten.',
      'Was zunächst einfach erscheint, entwickelt mit jedem Takt eine neue Intensität.',
      'Musik, die nicht nur gehört, sondern erlebt wird.',
    ],
    spotifyUrl: 'https://open.spotify.com/track/3096gFW9ESHwrlesPicxBu',
  },
  {
    number: '03',
    category: 'NEW FREQUENCIES.',
    artist: 'ECCA VANDAL',
    track: 'CRUISING TO SELF SOOTHE',
    paragraphs: [
      'Die Energie war zuerst da.',
      '„Cruising to Self Soothe“ von Ecca Vandal ist roh, direkt und voller Bewegung. Ein Sound, der vom ersten Moment an mitreißt und keine große Erklärung braucht.',
      'Doch hinter dieser Energie steckt mehr. Der Gedanke, durch Bewegung wieder zu sich selbst zu finden, Unsicherheit zu überwinden und dem eigenen Weg zu vertrauen, gibt dem Song eine weitere Dimension.',
      'Zuerst hat mich die Musik gepackt. Die Bedeutung dahinter macht das Ganze noch intensiver.',
      'Eine Entdeckung, die bleibt.',
    ],
    spotifyUrl: 'https://open.spotify.com/track/43YEV5eMkQYdkk27WV1Bkv',
  },
];
