#!/usr/bin/env node
/**
 * Fixes DTOs and controllers to avoid decorator type issues in scaffold.
 */
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
  if (file.endsWith('.dto.ts')) {
    const name = file.match(/(\w+)\.dto\.ts$/)?.[1];
    if (!name) continue;
    const pascal = name
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

  if (file.endsWith('.controller.ts')) {
    const content = readFileSync(file, 'utf8');
    const match = content.match(/export class (\w+)Controller/);
    const entityMatch = content.match(/@Controller\('([^']+)'\)/);
    if (!match || !entityMatch) continue;

    const className = match[1];
    const route = entityMatch[1];
    const dtoImport = content.match(/import \{ (\w+) \} from '([^']+)'/)?.[1] ?? `${className}ResponseDto`;
    const dtoPath = content.match(/from '([^']+\.dto)'/)?.[1] ?? '../../application/dto/unknown.dto';

    writeFileSync(
      file,
      `import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import type { ${dtoImport} } from '${dtoPath}';

@ApiTags('${route}')
@Controller('${route}')
export class ${className}Controller {
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

  if (file.endsWith('.use-case.ts')) {
    const content = readFileSync(file, 'utf8');
    const classMatch = content.match(/export class (\w+)/);
    const entityMatch = content.match(/from '\.\.\/\.\.\/domain\/entities\/([^']+)'/);
    const portMatch = content.match(/from '\.\.\/ports\/([^']+)'/);
    if (!classMatch || !entityMatch || !portMatch) continue;

    const entityFile = entityMatch[1];
    const entityName = entityFile
      .split('-')
      .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
      .join('');
    const portFile = portMatch[1];
    const token = entityName.toUpperCase() + '_REPOSITORY';

    writeFileSync(
      file,
      `import { Inject, Injectable } from '@nestjs/common';
import type { ${entityName} } from '../../domain/entities/${entityFile}';
import {
  ${token},
  type ${entityName}RepositoryPort,
} from '../ports/${portFile}';

@Injectable()
export class ${classMatch[1]} {
  constructor(
    @Inject(${token})
    private readonly repository: ${entityName}RepositoryPort,
  ) {}

  execute(id: string): Promise<${entityName} | null> {
    return this.repository.findById(id);
  }
}
`,
      'utf8',
    );
  }
}

console.log('DTO and controller fixes applied.');
