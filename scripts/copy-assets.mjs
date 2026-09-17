import { cp, mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const source = 'src/persistence/migrations';
const destination = 'dist/persistence/migrations';
await mkdir(dirname(destination), { recursive: true });
await cp(source, destination, { recursive: true });
console.log(`Copied migration assets from ${source} to ${destination}`);
