// Runs after `astro build`: the review layer (annotate.js) is for the local draft only.
// Removes it from dist so it is not published.
import { rm } from 'node:fs/promises';

await rm('dist/review-loader.js', { force: true });
await rm('dist/vendor', { recursive: true, force: true });
console.log('review layer removed from dist');
