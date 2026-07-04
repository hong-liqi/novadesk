import assert from 'node:assert/strict';
import baseConfig from '../base.js';
import nodeConfig from '../node.js';
import reactConfig from '../react.js';
import nestjsConfig from '../nestjs.js';

for (const [name, config] of [
  ['base', baseConfig],
  ['node', nodeConfig],
  ['react', reactConfig],
  ['nestjs', nestjsConfig],
]) {
  assert.ok(Array.isArray(config), `${name} preset should export a flat config array`);
  assert.ok(config.length > 0, `${name} preset should not be empty`);
}

