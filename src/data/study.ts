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

export const seriesIntro = 'Short visual lessons on what Flutter does behind the scenes. Simple words. Things you can click.';

export const episodes: Episode[] = [
  {
    slug: 'setstate',
    number: 1,
    title: 'What happens when you call setState()?',
    summary: 'What triggers a rebuild, what gets rebuilt, and build() vs a new Element.',
    questions: [
      'What triggers a rebuild? Which widgets rebuild?',
      'Whole app, whole screen, or a subtree?',
    ],
    slides: 8,
  },
];
