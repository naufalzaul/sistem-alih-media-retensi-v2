import { writable } from 'svelte/store';

function createPersistedStore(key, initialValue) {
  const store = writable(initialValue);

  if (typeof window !== 'undefined') {
    const stored = sessionStorage.getItem(key);
    if (stored) {
      try {
        store.set(JSON.parse(stored));
      } catch (e) {
        console.error("Failed to parse stored data", e);
      }
    } else {
      const match = document.cookie.match(new RegExp(key + '=([^;]+)'));
      if (match) {
        try {
          store.set(JSON.parse(decodeURIComponent(match[1])));
        } catch (e) {
          console.error("Failed to parse cookie data", e);
        }
      }
    }

    store.subscribe((val) => {
      if (val !== null) {
        const json = JSON.stringify(val);
        sessionStorage.setItem(key, json);
        document.cookie = `${key}=${encodeURIComponent(json)}; path=/`;
      } else {
        sessionStorage.removeItem(key);
        document.cookie = `${key}=; Max-Age=0; path=/`;
      }
    });
  }

  return store;
}

export const localData = createPersistedStore("localData", {
  dataTemp: null,
  pasien: null,
  kasus: null,
});
