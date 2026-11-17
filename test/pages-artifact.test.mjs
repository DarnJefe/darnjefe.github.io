import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const checker = new URL('../scripts/check-pages-artifact.mjs', import.meta.url);

for (const scenario of ['built', 'raw-jsx', 'missing-entry', 'sidecar-map', 'inline-map']) {
  test(`Pages output: ${scenario}`, async () => {
    const directory = await mkdtemp(join(tmpdir(), 'portfolio-artifact-'));
    try {
      await mkdir(join(directory, 'assets'));
      await writeFile(join(directory, 'index.html'), scenario === 'raw-jsx'
        ? '<div id="root"></div><script type="module" src="/src/main.jsx"></script>'
        : '<div id="root"></div><script type="module" src="/assets/app.js"></script>');
      if (scenario !== 'missing-entry') {
        await writeFile(join(directory, 'assets/app.js'), scenario === 'inline-map'
          ? 'console.log("built");\n//# sourceMappingURL=data:application/json;base64,e30='
          : 'console.log("built");');
      }
      if (scenario === 'sidecar-map') await writeFile(join(directory, 'assets/app.js.map'), '{}');
      const result = spawnSync(process.execPath, [fileURLToPath(checker), directory], { encoding: 'utf8' });
      assert.equal(result.status, scenario === 'built' ? 0 : 1, result.stdout + result.stderr);
      if (scenario !== 'built') assert.match(result.stderr, /Pages artifact check failed:/);
    } finally {
      await rm(directory, { recursive: true, force: true });
    }
  });
}
