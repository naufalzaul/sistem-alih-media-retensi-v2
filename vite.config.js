import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';


export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	resolve: {
		alias: {
			$src: path.resolve('./src/'),
			$static: path.resolve('./static/'),
			$components: path.resolve('./src/lib/components'),
			$stores: path.resolve('./src/lib/stores'),
			$views: path.resolve('./src/lib/views'),
			$utils: path.resolve('./src/lib/utils'),
			$data: path.resolve('./src/lib/data'),
			$route: path.resolve('./src/lib/route'),
		}
	},
});