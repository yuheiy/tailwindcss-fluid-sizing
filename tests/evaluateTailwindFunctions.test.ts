import resolveConfig from 'tailwindcss/resolveConfig';
import { expect, test } from 'vitest';
import evaluateTailwindFunctions from '../src/evaluateTailwindFunctions';

const config = resolveConfig({ content: [] });

test('evaluate theme()', () => {
  expect(
    evaluateTailwindFunctions(config)(
      'theme(screens.md) theme(spacing.16), theme(screens.lg) theme(spacing.24)',
    ),
  ).toBe('768px 4rem, 1024px 6rem');
});

test('evaluate incorrect theme path', async () => {
  expect(() =>
    evaluateTailwindFunctions(config)(
      'theme(screens.m) theme(spacing.16), theme(screens.lg) theme(spacing.24)',
    ),
  ).toThrowErrorMatchingInlineSnapshot(
    `[CssSyntaxError: <css input>:1:1: 'screens.m' does not exist in your theme config. 'screens' has the following valid keys: 'sm', 'md', 'lg', 'xl', '2xl']`,
  );
});
