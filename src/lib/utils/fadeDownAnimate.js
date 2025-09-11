/** 
 * @param {HTMLElement} el 
 * @param {Function} callback 
 * @param {number} [threshold=0.7] 
 */
export function observeVisible(el, callback, threshold = 0.7) {
  const check = () => {
    const rect = el?.getBoundingClientRect();
    if (rect && rect.top < window.innerHeight * threshold) {
      callback();
      window.removeEventListener("scroll", check);
    }
  };

  window.addEventListener("scroll", check);
  check();
}
