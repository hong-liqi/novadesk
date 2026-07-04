const MULTIPLIERS: Record<string, number> = {
  s: 1000,
  m: 60_000,
  h: 3_600_000,
  d: 86_400_000,
};

export function parseDuration(ttl: string): number {
  const match = /^(\d+)([smhd])$/.exec(ttl.trim());
  if (!match) {
    throw new Error(`Invalid duration format: ${ttl}`);
  }

  const value = Number.parseInt(match[1] ?? '0', 10);
  const unit = match[2] ?? 's';
  const multiplier = MULTIPLIERS[unit];

  if (!multiplier) {
    throw new Error(`Invalid duration unit: ${unit}`);
  }

  return value * multiplier;
}
