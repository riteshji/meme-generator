export interface MemeTemplate {
  id: string;
  name: string;
  imageUrl: string;
  textBoxes: number; // 1-3
  textPositions: ('top' | 'middle' | 'bottom')[];
}

export const memeTemplates: MemeTemplate[] = [
  {
    id: 'drake',
    name: 'Drake Pointing',
    imageUrl: 'https://i.imgflip.com/30b1gx.jpg',
    textBoxes: 2,
    textPositions: ['top', 'bottom']
  },
  {
    id: 'distracted-boyfriend',
    name: 'Distracted Boyfriend',
    imageUrl: 'https://i.imgflip.com/1ur9b0.jpg',
    textBoxes: 3,
    textPositions: ['top', 'middle', 'bottom']
  },
  {
    id: 'doge',
    name: 'Doge',
    imageUrl: 'https://i.imgflip.com/4t0m5.jpg',
    textBoxes: 1,
    textPositions: ['middle']
  },
  {
    id: 'expanding-brain',
    name: 'Expanding Brain',
    imageUrl: 'https://i.imgflip.com/1jhl7s.jpg',
    textBoxes: 3,
    textPositions: ['top', 'top', 'top']
  },
  {
    id: 'change-my-mind',
    name: 'Change My Mind',
    imageUrl: 'https://i.imgflip.com/24y43o.jpg',
    textBoxes: 1,
    textPositions: ['bottom']
  },
  {
    id: 'two-buttons',
    name: 'Two Buttons',
    imageUrl: 'https://i.imgflip.com/1g8my4.jpg',
    textBoxes: 2,
    textPositions: ['top', 'bottom']
  },
  {
    id: 'left-exit-12',
    name: 'Left Exit 12',
    imageUrl: 'https://i.imgflip.com/22bdq6.jpg',
    textBoxes: 2,
    textPositions: ['top', 'bottom']
  },
  {
    id: 'running-away',
    name: 'Running Away Balloon',
    imageUrl: 'https://i.imgflip.com/261o3j.jpg',
    textBoxes: 2,
    textPositions: ['top', 'bottom']
  }
];

