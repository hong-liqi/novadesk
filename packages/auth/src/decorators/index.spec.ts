import { IS_PUBLIC_KEY, Public } from './index';

describe('auth decorators', () => {
  it('should set isPublic metadata key', () => {
    class TestController {
      @Public()
      handler(): void {
        return undefined;
      }
    }

    const metadata = Reflect.getMetadata(IS_PUBLIC_KEY, TestController.prototype.handler);
    expect(metadata).toBe(true);
  });
});
