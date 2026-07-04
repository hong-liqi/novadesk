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
  if (!file.endsWith('.controller.ts')) continue;

  const content = readFileSync(file, 'utf8');
  const classMatch = content.match(/export class (\w+)Controller/);
  const routeMatch = content.match(/@Controller\('([^']+)'\)/);
  if (!classMatch || !routeMatch) continue;

  writeFileSync(
    file,
    `import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('${routeMatch[1]}')
@Controller('${routeMatch[1]}')
export class ${classMatch[1]}Controller {
  @Get(':id')
  @ApiOperation({ summary: 'Get resource by ID (scaffold)' })
  findOne(@Param('id', ParseUUIDPipe) _id: string): never {
    throw new Error('Not implemented — architecture scaffold only');
  }
}
`,
    'utf8',
  );
}

console.log('Controllers cleaned.');
