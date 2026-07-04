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
  if (!file.endsWith('.use-case.ts')) continue;

  const portFile = file.replace('/use-cases/', '/ports/').replace(/get-[\w-]+\.use-case\.ts$/, (m) => {
    const entityKebab = m.replace('get-', '').replace('.use-case.ts', '');
    return `${entityKebab}.repository.port.ts`;
  });

  const portContent = readFileSync(portFile, 'utf8');
  const entityMatch = portContent.match(/import type \{ (\w+) \}/);
  const tokenMatch = portContent.match(/export const (\w+) = Symbol/);
  const portInterfaceMatch = portContent.match(/export interface (\w+)/);
  const classMatch = readFileSync(file, 'utf8').match(/export class (\w+)/);

  if (!entityMatch || !tokenMatch || !portInterfaceMatch || !classMatch) continue;

  const entityName = entityMatch[1];
  const token = tokenMatch[1];
  const portInterface = portInterfaceMatch[1];
  const className = classMatch[1];
  const entityKebab = portFile.match(/\/([\w-]+)\.repository\.port\.ts$/)?.[1];

  writeFileSync(
    file,
    `import { Inject, Injectable } from '@nestjs/common';
import type { ${entityName} } from '../../domain/entities/${entityKebab}.entity';
import {
  ${token},
  type ${portInterface},
} from '../ports/${entityKebab}.repository.port';

@Injectable()
export class ${className} {
  constructor(
    @Inject(${token})
    private readonly repository: ${portInterface},
  ) {}

  execute(id: string): Promise<${entityName} | null> {
    return this.repository.findById(id);
  }
}
`,
    'utf8',
  );
}

console.log('Use-case files fixed.');
