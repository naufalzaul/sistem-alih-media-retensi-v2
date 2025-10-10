import adapter from '@sveltejs/adapter-node';
import { preprocessMeltUI, sequence } from "@melt-ui/pp";
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  preprocess: sequence([preprocess(), preprocessMeltUI()]),
  kit: {
    adapter: adapter(),
    env: {
      publicPrefix: 'PUBLIC_'
    }
  },
  // compilerOptions: {
  // dev: true,
  // css: 'injected',
  // enableSourcemap: true,
  // }
};


export default config;
