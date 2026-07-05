import { databaseEnvSchema, postgresConnectionUrlSchema } from './database';

describe('postgresConnectionUrlSchema', () => {
  it('accepts standard postgresql URLs', () => {
    expect(
      postgresConnectionUrlSchema.parse('postgresql://user:pass@db.example.com:5432/novadesk'),
    ).toBe('postgresql://user:pass@db.example.com:5432/novadesk');
  });

  it('accepts postgres:// scheme', () => {
    expect(postgresConnectionUrlSchema.parse('postgres://user:pass@localhost:5432/app')).toBe(
      'postgres://user:pass@localhost:5432/app',
    );
  });

  it('accepts passwords with special characters rejected by z.string().url()', () => {
    expect(
      postgresConnectionUrlSchema.parse(
        'postgresql://novadesk:p%23ss/w%3Frd@postgres:5432/auth_db',
      ),
    ).toBe('postgresql://novadesk:p%23ss/w%3Frd@postgres:5432/auth_db');
  });

  it('trims surrounding whitespace', () => {
    expect(postgresConnectionUrlSchema.parse('  postgresql://user:pass@host:5432/db  ')).toBe(
      'postgresql://user:pass@host:5432/db',
    );
  });

  it('rejects empty strings', () => {
    expect(() => postgresConnectionUrlSchema.parse('')).toThrow();
  });

  it('rejects non-postgres URLs', () => {
    expect(() => postgresConnectionUrlSchema.parse('mysql://user:pass@host:3306/db')).toThrow(
      /Must start with postgresql:\/\/ or postgres:\/\//,
    );
  });
});

describe('databaseEnvSchema', () => {
  it('parses DATABASE_SSL from string and boolean', () => {
    expect(
      databaseEnvSchema.parse({
        DATABASE_URL: 'postgresql://user:pass@host:5432/db',
        DATABASE_SSL: 'true',
      }).DATABASE_SSL,
    ).toBe(true);

    expect(
      databaseEnvSchema.parse({
        DATABASE_URL: 'postgresql://user:pass@host:5432/db',
        DATABASE_SSL: false,
      }).DATABASE_SSL,
    ).toBe(false);
  });
});
