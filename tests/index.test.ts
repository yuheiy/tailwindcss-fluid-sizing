import colors from 'picocolors';
import { MockInstance, afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import fluidSizing from '../src';
import { run } from './run';

test('basic', async () => {
  const config = {
    content: [
      {
        raw: `
          <div class="fluid-mt-[32px,64px]"></div>
          <div class="fluid-space-y-[32px,64px]"></div>
          <div class="fluid-mt-[2rem,4rem]"></div>
          <div class="fluid-mt-[768px_32px,1280px_64px]"></div>
          <div class="fluid-mt-[lg_32px,2xl_64px]"></div>
          <div
            class="fluid-mt-[theme(screens.lg)_theme(spacing.8),theme(screens.2xl)_theme(spacing.16)]"
          ></div>
        `,
      },
    ],
    theme: {
      fluidSizing: {},
    },
    plugins: [
      fluidSizing({
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
          DEFAULT_FROM: '768px',
          DEFAULT_TO: '1280px',
        },
      }),
    ],
  };

  const input = `
    @tailwind utilities;
  `;

  const result = await run(input, config);

  expect(result.css).toMatchInlineSnapshot(`
    ".fluid-mt-\\[2rem\\2c 4rem\\] {
        margin-top: clamp(2rem, 6.25vw - 1rem, 4rem)
    }
    .fluid-mt-\\[32px\\2c 64px\\] {
        margin-top: clamp(32px, 6.25vw - 16px, 64px)
    }
    .fluid-mt-\\[768px_32px\\2c 1280px_64px\\] {
        margin-top: clamp(32px, 6.25vw - 16px, 64px)
    }
    .fluid-mt-\\[lg_32px\\2c 2xl_64px\\] {
        margin-top: clamp(32px, 6.25vw - 32px, 64px)
    }
    .fluid-mt-\\[theme\\(screens\\.lg\\)_theme\\(spacing\\.8\\)\\2c theme\\(screens\\.2xl\\)_theme\\(spacing\\.16\\)\\] {
        margin-top: clamp(2rem, 6.25vw - 2rem, 4rem)
    }
    .fluid-space-y-\\[32px\\2c 64px\\] > :not([hidden]) ~ :not([hidden]) {
        --tw-space-y-reverse: 0;
        margin-top: calc(clamp(32px, 6.25vw - 16px, 64px) * calc(1 - var(--tw-space-y-reverse)));
        margin-bottom: calc(clamp(32px, 6.25vw - 16px, 64px) * var(--tw-space-y-reverse))
    }
      "
  `);
});

test('using configured theme', async () => {
  const config = {
    content: [
      {
        raw: `
          <div class="fluid-mt-array"></div>
          <div class="fluid-mt-string"></div>
        `,
      },
    ],
    theme: {
      fluidSizing: {
        margin: {
          array: ['md 32px', 'xl 64px'],
          string: 'md 32px, xl 64px',
        },
      },
    },
    plugins: [
      fluidSizing({
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1536px',
        },
      }),
    ],
  };

  const input = `
    @tailwind utilities;
  `;

  const result = await run(input, config);

  expect(result.css).toMatchInlineSnapshot(`
    ".fluid-mt-array {
        margin-top: clamp(32px, 6.25vw - 16px, 64px)
    }
    .fluid-mt-string {
        margin-top: clamp(32px, 6.25vw - 16px, 64px)
    }
      "
  `);
});

describe('log warnings', () => {
  let logSpy: MockInstance;

  beforeEach(() => {
    logSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    logSpy.mockRestore();
  });

  test('error in parseInput()', async () => {
    const config = {
      content: [
        {
          raw: `<div class="fluid-mt-[64px,96px,128px]"></div>`,
        },
      ],
      plugins: [fluidSizing],
    };

    const input = `
      @tailwind utilities;
    `;

    await run(input, config);

    expect(logSpy).toHaveBeenCalledWith(
      colors.bold(colors.yellow('warn')),
      '-',
      'The utility `fluid-mt-[64px,96px,128px]` contains an invalid value and was not generated.',
    );

    expect(logSpy).toHaveBeenCalledWith(
      colors.bold(colors.yellow('warn')),
      '-',
      "'64px,96px,128px' contains too many argument.",
    );
  });

  test('error in calculateFluidSizing()', async () => {
    const config = {
      content: [
        {
          raw: `<div class="fluid-mt-[768px_32px,1280px_4rem]"></div>`,
        },
      ],
      plugins: [fluidSizing],
    };

    const input = `
      @tailwind utilities;
    `;

    await run(input, config);

    expect(logSpy).toHaveBeenCalledWith(
      colors.bold(colors.yellow('warn')),
      '-',
      'The utility `fluid-mt-[768px_32px,1280px_4rem]` contains an invalid value and was not generated.',
    );

    expect(logSpy).toHaveBeenCalledWith(
      colors.bold(colors.yellow('warn')),
      '-',
      "The both 'size's must have same unit.",
    );
  });
});
