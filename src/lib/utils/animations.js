export const fadeIn = (element) => {
  if (element) {
    element.style.opacity = '0';
    element.style.transition = 'opacity 0.5s ease-out';

    setTimeout(() => {
      element.style.opacity = '1';
    }, 50);
  }
};