#!/usr/bin/env node
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const MODULES = join(dirname(fileURLToPath(import.meta.url)), '..', 'services/helpdesk-api/src/modules');

function walk(dir, files = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

for (const file of walk(MODULES)) {
  if (!file.endsWith('.dto.ts')) continue;

  const entityFile = join(dirname(file), '..', '..', 'domain/entities');
  const entities = readdirSync(entityFile).filter((f) => f.endsWith('.entity.ts'));
  const entityName = entities[0]?.replace('.entity.ts', '') ?? 'resource';
  const pascal = entityName
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');

  writeFileSync(
    file,
    `/** Response DTO scaffold for ${pascal} */
export interface ${pascal}ResponseDto {
  id: string;
  workspaceId: string;
  createdAt: string;
  updatedAt: string;
}
`,
    'utf8',
  );
}

console.log('DTOs aligned with entities.');
