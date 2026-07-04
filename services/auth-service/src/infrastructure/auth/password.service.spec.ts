import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  it('hashes and verifies passwords with bcrypt cost 12', async () => {
    const password = 'SecurePass1';
    const hash = await service.hash(password);

    expect(hash).not.toBe(password);
    expect(hash.startsWith('$2b$12$')).toBe(true);
    await expect(service.verify(password, hash)).resolves.toBe(true);
    await expect(service.verify('WrongPass1', hash)).resolves.toBe(false);
  });

  it('produces different hashes for the same password', async () => {
    const password = 'SecurePass1';
    const first = await service.hash(password);
    const second = await service.hash(password);

    expect(first).not.toBe(second);
    await expect(service.verify(password, first)).resolves.toBe(true);
    await expect(service.verify(password, second)).resolves.toBe(true);
  });
});
