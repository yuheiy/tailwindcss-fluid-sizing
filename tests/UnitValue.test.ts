import { describe, expect, test } from 'vitest';
import { UnitValue, parseUnitValueString } from '../src/UnitValue';

describe('UnitValue', () => {
  test('toString()', () => {
    expect(new UnitValue(1, 'px').toString()).toBe('1px');
  });
});

describe('parseUnitValueString', () => {
  test.each([
    ['1px', { value: 1, unit: 'px' }],
    ['1rem', { value: 1, unit: 'rem' }],
    ['01px', { value: 1, unit: 'px' }],
    ['0.1px', { value: 0.1, unit: 'px' }],
    ['.1px', { value: 0.1, unit: 'px' }],
    ['-1px', { value: -1, unit: 'px' }],
    ['-0.1px', { value: -0.1, unit: 'px' }],
    ['-.1px', { value: -0.1, unit: 'px' }],
  ])("parsed '%s' should be %o", (input, expected) => {
    const parsed = parseUnitValueString(input);
    if (!parsed.success) throw new Error('Invariant failed');
    expect(parsed.value).toEqual(expected);
  });

  test.each(['0.0.1px', '1PX', '1', '1em', 'md'])(
    "parsing '%s' should fail with %s error",
    (input) => {
      const parsed = parseUnitValueString(input);
      expect(parsed.success).toBe(false);
    },
  );
});
