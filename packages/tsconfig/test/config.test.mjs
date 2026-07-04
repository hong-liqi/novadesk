import test from 'node:test';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';

const packageDir = new URL('.', import.meta.url);
const basePath = resolve(fileURLToPath(packageDir), '..', 'base.json');
const nodePath = resolve(fileURLToPath(packageDir), '..', 'node.json');

test('base tsconfig is strict', () => {
  const base = JSON.parse(readFileSync(basePath, 'utf8'));
  assert.equal(base.compilerOptions.strict, true);
});

test('node tsconfig targets commonjs', () => {
  const node = JSON.parse(readFileSync(nodePath, 'utf8'));
  assert.equal(node.compilerOptions.module, 'CommonJS');
});
