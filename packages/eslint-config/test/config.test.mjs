import assert from 'node:assert/strict';
import test from 'node:test';
import baseConfig from '../base.js';
import reactConfig from '../react.js';

test('base preset enables TypeScript strict rules', () => {
  const ruleBlock = baseConfig.find(
    (entry) => entry.rules?.['@typescript-eslint/no-explicit-any'] === 'error',
  );
  assert.ok(ruleBlock);
  assert.equal(ruleBlock.rules['@typescript-eslint/no-explicit-any'], 'error');
});

test('react preset enables browser globals', () => {
  const globalsBlock = reactConfig.find((entry) =>
    Object.hasOwn(entry.languageOptions?.globals ?? {}, 'window'),
  );
  assert.ok(globalsBlock);
  assert.ok(Object.hasOwn(globalsBlock.languageOptions.globals, 'document'));
});
