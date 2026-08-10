import { describe, expect, it } from 'vitest';

import { Registry } from './registry.js';

describe('Registry', () => {
  it('registers and retrieves entries', () => {
    const registry = new Registry<string>('ComponentRegistry');
    const entry = 'ButtonRenderer';

    registry.register('Button', entry);

    expect(registry.get('Button')).toBe(entry);
    expect(registry.has('Button')).toBe(true);
  });

  it('throws on duplicate registration, including the name in the message', () => {
    const registry = new Registry<string>('ComponentRegistry');
    registry.register('Button', 'a');

    expect(() => registry.register('Button', 'b')).toThrow(/Button/);
  });

  it('returns undefined for unknown entries instead of throwing', () => {
    const registry = new Registry<string>();

    expect(registry.get('Missing')).toBeUndefined();
    expect(registry.has('Missing')).toBe(false);
  });

  it('unregisters entries and reports whether they existed', () => {
    const registry = new Registry<string>();
    registry.register('Button', 'a');

    expect(registry.unregister('Button')).toBe(true);
    expect(registry.get('Button')).toBeUndefined();
    expect(registry.unregister('Button')).toBe(false);
  });

  it('lists all registered names', () => {
    const registry = new Registry<string>();
    registry.register('Button', 'a');
    registry.register('Table', 'b');

    expect(registry.list()).toEqual(['Button', 'Table']);
  });
});
