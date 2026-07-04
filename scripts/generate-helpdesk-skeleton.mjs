#!/usr/bin/env node
/**
 * Generates the helpdesk-api module skeleton and frontend structure.
 * Run: node scripts/generate-helpdesk-skeleton.mjs
 */
import { mkdirSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const API = join(ROOT, 'services/helpdesk-api');
const APP = join(ROOT, 'apps/helpdesk-saas');

function ensureDir(path) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true });
}

function write(path, content) {
  ensureDir(dirname(path));
  if (!existsSync(path)) writeFileSync(path, content, 'utf8');
}

const BACKEND_MODULES = [
  { name: 'auth', entity: 'AuthSession', route: 'auth' },
  { name: 'users', entity: 'User', route: 'users' },
  { name: 'organizations', entity: 'Organization', route: 'organizations' },
  { name: 'workspaces', entity: 'Workspace', route: 'workspaces' },
  { name: 'teams', entity: 'Team', route: 'teams' },
  { name: 'permissions', entity: 'Permission', route: 'permissions' },
  { name: 'roles', entity: 'Role', route: 'roles' },
  { name: 'customers', entity: 'Customer', route: 'customers' },
  { name: 'contacts', entity: 'Contact', route: 'contacts' },
  { name: 'tickets', entity: 'Ticket', route: 'tickets' },
  { name: 'messages', entity: 'Message', route: 'messages' },
  { name: 'channels', entity: 'Channel', route: 'channels' },
  { name: 'automations', entity: 'Automation', route: 'automations' },
  { name: 'knowledge-base', entity: 'KnowledgeArticle', route: 'knowledge-articles', moduleClass: 'KnowledgeBase' },
  { name: 'ai', entity: 'AiContext', route: 'ai' },
  { name: 'notifications', entity: 'Notification', route: 'notifications' },
  { name: 'settings', entity: 'Setting', route: 'settings' },
  { name: 'audit', entity: 'AuditLog', route: 'audit-logs' },
  { name: 'files', entity: 'File', route: 'files' },
  { name: 'dashboard', entity: 'Dashboard', route: 'dashboard' },
  { name: 'analytics', entity: 'Analytics', route: 'analytics' },
  { name: 'search', entity: 'Search', route: 'search' },
];

function pascal(str) {
  return str
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');
}

function kebab(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

for (const mod of BACKEND_MODULES) {
  const moduleName = mod.name;
  const moduleClass = mod.moduleClass ?? pascal(moduleName);
  const entity = mod.entity;
  const entityKebab = kebab(entity);
  const route = mod.route;
  const base = join(API, 'src/modules', moduleName);

  write(
    join(base, `${moduleName}.module.ts`),
    `import { Module } from '@nestjs/common';
import { ${entity}Controller } from './presentation/controllers/${entityKebab}.controller';
import { ${entity}Repository } from './infrastructure/persistence/${entityKebab}.repository';
import { ${entity.toUpperCase()}_REPOSITORY } from './application/ports/${entityKebab}.repository.port';

@Module({
  controllers: [${entity}Controller],
  providers: [
    {
      provide: ${entity.toUpperCase()}_REPOSITORY,
      useClass: ${entity}Repository,
    },
  ],
  exports: [${entity.toUpperCase()}_REPOSITORY],
})
export class ${moduleClass}Module {}
`,
  );

  write(
    join(base, 'domain/entities', `${entityKebab}.entity.ts`),
    `/**
 * Domain entity — ${entity}
 * Business rules are not implemented at this stage.
 */
export interface ${entity}Props {
  id: string;
  workspaceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ${entity} {
  constructor(readonly props: ${entity}Props) {}
}
`,
  );

  write(
    join(base, 'application/ports', `${entityKebab}.repository.port.ts`),
    `import type { ${entity} } from '../../domain/entities/${entityKebab}.entity';

export const ${entity.toUpperCase()}_REPOSITORY = Symbol('${entity.toUpperCase()}_REPOSITORY');

export interface ${entity}RepositoryPort {
  findById(id: string): Promise<${entity} | null>;
}
`,
  );

  write(
    join(base, 'application/dto', `${entityKebab}.dto.ts`),
    `import { ApiProperty } from '@nestjs/swagger';

export class ${entity}ResponseDto {
  @ApiProperty({ format: 'uuid' })
  id!: string;

  @ApiProperty({ format: 'uuid' })
  workspaceId!: string;

  @ApiProperty()
  createdAt!: string;

  @ApiProperty()
  updatedAt!: string;
}
`,
  );

  write(
    join(base, 'application/use-cases', `get-${entityKebab}.use-case.ts`),
    `import { Inject, Injectable } from '@nestjs/common';
import type { ${entity} } from '../../domain/entities/${entityKebab}.entity';
import {
  ${entity.toUpperCase()}_REPOSITORY,
  type ${entity}RepositoryPort,
} from '../ports/${entityKebab}.repository.port';

@Injectable()
export class Get${entity}UseCase {
  constructor(
    @Inject(${entity.toUpperCase()}_REPOSITORY)
    private readonly repository: ${entity}RepositoryPort,
  ) {}

  async execute(id: string): Promise<${entity} | null> {
    return this.repository.findById(id);
  }
}
`,
  );

  write(
    join(base, 'infrastructure/persistence', `${entityKebab}.repository.ts`),
    `import { Injectable } from '@nestjs/common';
import type { ${entity} } from '../../domain/entities/${entityKebab}.entity';
import type { ${entity}RepositoryPort } from '../../application/ports/${entityKebab}.repository.port';

@Injectable()
export class ${entity}Repository implements ${entity}RepositoryPort {
  async findById(_id: string): Promise<${entity} | null> {
    return null;
  }
}
`,
  );

  write(
    join(base, 'presentation/controllers', `${entityKebab}.controller.ts`),
    `import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ${entity}ResponseDto } from '../../application/dto/${entityKebab}.dto';

@ApiTags('${route}')
@Controller('${route}')
export class ${entity}Controller {
  @Get(':id')
  @ApiOperation({ summary: 'Get ${entity} by ID (scaffold)' })
  findOne(@Param('id', ParseUUIDPipe) _id: string): ${entity}ResponseDto {
    throw new Error('Not implemented — architecture scaffold only');
  }
}
`,
  );

  write(
    join(base, 'presentation/validators', `${entityKebab}.validator.ts`),
    `/**
 * Request validators for ${entity} — to be wired with class-validator.
 */
export const ${entity}Validators = {};
`,
  );
}

// Shared presentation layer
const presentationShared = [
  [
    'middlewares/request-context.middleware.ts',
    `import { Injectable, NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction): void {
    req.headers['x-request-id'] ??= crypto.randomUUID();
    next();
  }
}
`,
  ],
  [
    'guards/workspace.guard.ts',
    `import { CanActivate, Injectable } from '@nestjs/common';

@Injectable()
export class WorkspaceGuard implements CanActivate {
  canActivate(): boolean {
    return true;
  }
}
`,
  ],
  [
    'decorators/current-workspace.decorator.ts',
    `import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentWorkspace = createParamDecorator(
  (_data: unknown, _ctx: ExecutionContext): string | undefined => undefined,
);
`,
  ],
  [
    'filters/domain-exception.filter.ts',
    `import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

@Catch(DomainException)
export class DomainExceptionFilter implements ExceptionFilter {
  catch(exception: DomainException, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    response.status(HttpStatus.UNPROCESSABLE_ENTITY).json({
      statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
      message: exception.message,
    });
  }
}
`,
  ],
];

for (const [file, content] of presentationShared) {
  write(join(API, 'src/presentation', file), content);
}

// Frontend features
const FRONTEND_FEATURES = [
  'layout',
  'dashboard',
  'authentication',
  'tickets',
  'inbox',
  'knowledge-base',
  'settings',
  'administration',
  'analytics',
  'profile',
  'search',
  'notifications',
];

for (const feature of FRONTEND_FEATURES) {
  const pascalFeature = pascal(feature);
  const base = join(APP, 'src/features', feature);

  write(
    join(base, 'index.ts'),
    `export * from './types';
`,
  );

  write(
    join(base, 'types/index.ts'),
    `/** Public types for ${feature} feature */
export type ${pascalFeature}FeatureState = 'idle';
`,
  );

  write(
    join(base, 'hooks', `use${pascalFeature}.ts`),
    `'use client';

/** Hook scaffold for ${feature} */
export function use${pascalFeature}() {
  return { status: 'idle' as const };
}
`,
  );

  write(
    join(base, 'api', `${feature}.service.ts`),
    `/** API service scaffold for ${feature} */
export const ${pascalFeature}Service = {
  basePath: '/api/v1/${feature}',
};
`,
  );

  write(
    join(base, 'components', `${pascalFeature}Placeholder.tsx`),
    `/** Placeholder component — no UI implementation */
export function ${pascalFeature}Placeholder() {
  return null;
}
`,
  );
}

// Frontend shared
const sharedFiles = {
  'providers/app-providers.tsx': `'use client';

import type { ReactNode } from 'react';

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return <>{children}</>;
}
`,
  'providers/index.ts': `export { AppProviders } from './app-providers';
`,
  'hooks/use-workspace.ts': `'use client';

export function useWorkspace() {
  return { workspaceId: null as string | null };
}
`,
  'hooks/index.ts': `export { useWorkspace } from './use-workspace';
`,
  'stores/workspace.store.ts': `/** Client state scaffold — replace with chosen store when implementing */
export type WorkspaceStore = {
  workspaceId: string | null;
};
`,
  'stores/index.ts': `export type { WorkspaceStore } from './workspace.store';
`,
  'services/api-client.ts': `/** Typed API client — uses @portfolio/sdk when implemented */
export const helpdeskApiClient = {
  baseUrl: process.env.NEXT_PUBLIC_HELPDESK_API_URL ?? '/api/v1',
};
`,
  'services/index.ts': `export { helpdeskApiClient } from './api-client';
`,
  'lib/routes.ts': `export const routes = {
  home: '/',
  dashboard: '/dashboard',
  tickets: '/tickets',
  inbox: '/inbox',
  knowledgeBase: '/knowledge-base',
  settings: '/settings',
  administration: '/administration',
  analytics: '/analytics',
  profile: '/profile',
  search: '/search',
  notifications: '/notifications',
  login: '/login',
} as const;
`,
};

for (const [file, content] of Object.entries(sharedFiles)) {
  write(join(APP, 'src/shared', file), content);
}

// Widgets
write(
  join(APP, 'src/widgets/sidebar/Sidebar.tsx'),
  `/** Sidebar scaffold — layout shell only */
export function Sidebar() {
  return <aside aria-label="Sidebar" />;
}
`,
);

write(
  join(APP, 'src/widgets/header/Header.tsx'),
  `/** Header scaffold — layout shell only */
export function Header() {
  return <header />;
}
`,
);

write(
  join(APP, 'src/widgets/footer/Footer.tsx'),
  `/** Footer scaffold — layout shell only */
export function Footer() {
  return <footer />;
}
`,
);

write(
  join(APP, 'src/widgets/app-shell/AppShell.tsx'),
  `import { Footer } from '../footer/Footer';
import { Header } from '../header/Header';
import { Sidebar } from '../sidebar/Sidebar';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </div>
  );
}
`,
);

// Entities
const entities = ['ticket', 'user', 'organization', 'workspace', 'customer', 'message'];
for (const entity of entities) {
  write(
    join(APP, 'src/entities', entity, 'model.ts'),
    `/** Entity model scaffold for ${entity} */
export interface ${pascal(entity)}Model {
  id: string;
}
`,
  );
  write(join(APP, 'src/entities', entity, 'index.ts'), `export type { ${pascal(entity)}Model } from './model';
`);
}

console.log('Skeleton files generated.');
