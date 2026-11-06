// The study series. To add an episode, add an object here and a page in src/pages/study/.

export type Episode = {
  slug: string;
  number: number;
  title: string;
  summary: string;
  questions: string[];
  slides: number;
};

export const seriesName = 'Flutter Under the Hood';

export const seriesIntro =
  'Visual, step by step lessons on what Flutter really does behind the scenes. Simple words, flow diagrams, and things you can click.';

export const episodes: Episode[] = [
  {
    slug: 'setstate',
    number: 1,
    title: 'What really happens when you call setState()?',
    summary:
      'From the first idea to the last pixel: what triggers a rebuild, which parts of the tree rebuild, and the difference between build() running and an Element being recreated.',
    questions: [
      'What exactly triggers a rebuild, and which parts of the widget tree get rebuilt?',
      'Does setState() rebuild the whole app, the whole screen, or only one subtree? What is the difference between build() being called and an Element being recreated?',
    ],
    slides: 19,
  },
];
