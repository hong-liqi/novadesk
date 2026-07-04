import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const packageDir = new URL('.', import.meta.url);

function readJson(file) {
  return JSON.parse(readFileSync(resolve(fileURLToPath(packageDir), '..', file), 'utf8'));
}

const base = readJson('base.json');
const node = readJson('node.json');
const react = readJson('react.json');
const nestjs = readJson('nestjs.json');

assert.equal(base.compilerOptions.strict, true);
assert.equal(node.compilerOptions.module, 'CommonJS');
assert.equal(react.compilerOptions.jsx, 'react-jsx');
assert.equal(nestjs.compilerOptions.experimentalDecorators, true);
