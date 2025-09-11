import { goto } from '$app/navigation';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

const icons = {
  success: 'https://api.iconify.design/heroicons:check-circle-20-solid.svg?color=%2310b981',
  error: 'https://api.iconify.design/heroicons:exclamation-circle-20-solid.svg?color=%23ef4444',
  info: 'https://api.iconify.design/heroicons:information-circle-20-solid.svg?color=%233b82f6',
  close: 'https://api.iconify.design/heroicons:x-mark-20-solid.svg?color=%239ca3af'
};

export function showToast(message, type = 'info', redirect = null, options = {}) {
  const toastNode = document.createElement('div');
  toastNode.className = 'flex items-center bg-white p-4 rounded-lg shadow-lg min-w-[280px]';

  toastNode.innerHTML = `
    <img src="${icons[type]}" class="w-5 h-5 mr-3" />
    <div class="text-gray-800 flex-1">${message}</div>
    <button class="ml-3">
      <img src="${icons.close}" class="w-5 h-5 opacity-60 hover:opacity-90" />
    </button>
  `;

  const toast = Toastify({
    node: toastNode,
    duration: options.duration || 3000,
    close: false,
    gravity: 'top',
    position: 'center',
    stopOnFocus: true,
    style: {
      background: 'transparent',
      padding: '0',
      boxShadow: 'none'
    }
  });

  toast.showToast();

  toastNode.querySelector('button').addEventListener('click', () => {
    toast.hideToast();
  });

  if (redirect) {
    setTimeout(() => {
      goto(redirect, { invalidateAll: true });
    }, options.delay || 1000);
  }
}
