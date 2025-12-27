const BACKGROUND_IMAGES = [
  '1.jpg',
  '2.jpg',
  '3.jpg',
  '4.jpg',
  '5.jpg'
];

export const getRandomBackground = () => {
  if (BACKGROUND_IMAGES.length === 0) {
    return null;
  }
  
  const randomIndex = Math.floor(Math.random() * BACKGROUND_IMAGES.length);
  return `/backgrounds/${BACKGROUND_IMAGES[randomIndex]}`;
};

export const getBackgroundImages = () => {
  return BACKGROUND_IMAGES;
};

