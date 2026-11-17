import { readdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

const output = process.argv[2] ?? 'dist';
const mapDirective = /(?:\/\/[#@]|\/\*[#@])\s*sourceMappingURL\s*=/;
const builtEntry = /<script\b[^>]*\ssrc=["']\/assets\/([A-Za-z0-9_.-]+\.js)["']/i;

async function check(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const filename = join(directory, entry.name);
    if (entry.isDirectory()) {
      await check(filename);
    } else if (!entry.isFile() || /\.(?:map|jsx|tsx|ts)$/i.test(entry.name)) {
      throw new Error('The Pages artifact contains a non-file asset, source file or source map.');
    } else if (/\.(?:html|js|css)$/i.test(entry.name) &&
               mapDirective.test(await readFile(filename, 'utf8'))) {
      throw new Error('The Pages artifact contains a source map directive.');
    }
  }
}

try {
  const html = await readFile(join(output, 'index.html'), 'utf8');
  const entry = builtEntry.exec(html)?.[1];
  if (!entry || /\bsrc=["'](?:\.\/|\/)?src\//i.test(html)) {
    throw new Error('index.html must reference a built asset in /assets/, not the JSX source.');
  }
  if (!(await readFile(join(output, 'assets', entry))).length) {
    throw new Error('The Pages entry asset is empty.');
  }
  await check(output);
  console.log('Verified built Pages output.');
} catch (error) {
  console.error('Pages artifact check failed:', error.message);
  process.exitCode = 1;
}
