import path from 'node:path';
import postcss from 'postcss';
import tailwind, { Config } from 'tailwindcss';
import { expect } from 'vitest';

export function run(input: string, config: Config) {
  const { currentTestName } = expect.getState();

  return postcss(tailwind(config)).process(input, {
    from: `${path.resolve(__filename)}?test=${currentTestName}`,
  });
}
