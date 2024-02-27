/**
 * This file contains code licensed under MIT from the Tailwind CSS project:
 *
 *   https://github.com/tailwindlabs/tailwindcss/blob/v3.4.1/src/corePlugins.js
 *
 * And is covered by the following license:
 *
 *   Copyright (c) Tailwind Labs, Inc.
 *
 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 *
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 *
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */

import { flagEnabled } from 'tailwindcss/lib/featureFlags';
import { CSSRuleObject, PluginAPI } from 'tailwindcss/types/config';

const cssTransformValue = [
  'translate(var(--tw-translate-x), var(--tw-translate-y))',
  'rotate(var(--tw-rotate))',
  'skewX(var(--tw-skew-x))',
  'skewY(var(--tw-skew-y))',
  'scaleX(var(--tw-scale-x))',
  'scaleY(var(--tw-scale-y))',
].join(' ');

const cssFilterValue = [
  'var(--tw-blur)',
  'var(--tw-brightness)',
  'var(--tw-contrast)',
  'var(--tw-grayscale)',
  'var(--tw-hue-rotate)',
  'var(--tw-invert)',
  'var(--tw-saturate)',
  'var(--tw-sepia)',
  'var(--tw-drop-shadow)',
].join(' ');

const cssBackdropFilterValue = [
  'var(--tw-backdrop-blur)',
  'var(--tw-backdrop-brightness)',
  'var(--tw-backdrop-contrast)',
  'var(--tw-backdrop-grayscale)',
  'var(--tw-backdrop-hue-rotate)',
  'var(--tw-backdrop-invert)',
  'var(--tw-backdrop-opacity)',
  'var(--tw-backdrop-saturate)',
  'var(--tw-backdrop-sepia)',
].join(' ');

export const sizingUtilities = {
  inset: [
    'inset',
    [
      [['inset', ['inset']]],
      [
        ['inset-x', ['left', 'right']],
        ['inset-y', ['top', 'bottom']],
      ],
      [
        ['start', ['inset-inline-start']],
        ['end', ['inset-inline-end']],
        ['top', ['top']],
        ['right', ['right']],
        ['bottom', ['bottom']],
        ['left', ['left']],
      ],
    ],
  ],

  margin: [
    'margin',
    [
      [['m', ['margin']]],
      [
        ['mx', ['margin-left', 'margin-right']],
        ['my', ['margin-top', 'margin-bottom']],
      ],
      [
        ['ms', ['margin-inline-start']],
        ['me', ['margin-inline-end']],
        ['mt', ['margin-top']],
        ['mr', ['margin-right']],
        ['mb', ['margin-bottom']],
        ['ml', ['margin-left']],
      ],
    ],
  ],

  size: ['size', [[['size', ['width', 'height']]]]],

  height: ['height', [[['h', ['height']]]]],
  maxHeight: ['maxHeight', [[['max-h', ['maxHeight']]]]],
  minHeight: ['minHeight', [[['min-h', ['minHeight']]]]],

  width: ['width', [[['w', ['width']]]]],
  minWidth: ['minWidth', [[['min-w', ['minWidth']]]]],
  maxWidth: ['maxWidth', [[['max-w', ['maxWidth']]]]],

  flexBasis: ['flexBasis', [[['basis', ['flex-basis']]]]],

  borderSpacing: [
    'borderSpacing',
    [
      [
        [
          'border-spacing',
          [
            '--tw-border-spacing-x',
            '--tw-border-spacing-y',
            ['@defaults border-spacing', {}],
            ['border-spacing', 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)'],
          ],
        ],
      ],
      [
        [
          'border-spacing-x',
          [
            '--tw-border-spacing-x',
            ['@defaults border-spacing', {}],
            ['border-spacing', 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)'],
          ],
        ],
        [
          'border-spacing-y',
          [
            '--tw-border-spacing-x',
            ['@defaults border-spacing', {}],
            ['border-spacing', 'var(--tw-border-spacing-x) var(--tw-border-spacing-y)'],
          ],
        ],
      ],
    ],
  ],

  translate: [
    'translate',
    [
      [
        [
          'translate-x',
          [['@defaults transform', {}], '--tw-translate-x', ['transform', cssTransformValue]],
        ],
        [
          'translate-y',
          [['@defaults transform', {}], '--tw-translate-y', ['transform', cssTransformValue]],
        ],
      ],
    ],
  ],

  scrollMargin: [
    'scrollMargin',
    [
      [['scroll-m', ['scroll-margin']]],
      [
        ['scroll-mx', ['scroll-margin-left', 'scroll-margin-right']],
        ['scroll-my', ['scroll-margin-top', 'scroll-margin-bottom']],
      ],
      [
        ['scroll-ms', ['scroll-margin-inline-start']],
        ['scroll-me', ['scroll-margin-inline-end']],
        ['scroll-mt', ['scroll-margin-top']],
        ['scroll-mr', ['scroll-margin-right']],
        ['scroll-mb', ['scroll-margin-bottom']],
        ['scroll-ml', ['scroll-margin-left']],
      ],
    ],
  ],

  scrollPadding: [
    'scrollPadding',
    [
      [['scroll-p', ['scroll-padding']]],
      [
        ['scroll-px', ['scroll-padding-left', 'scroll-padding-right']],
        ['scroll-py', ['scroll-padding-top', 'scroll-padding-bottom']],
      ],
      [
        ['scroll-ps', ['scroll-padding-inline-start']],
        ['scroll-pe', ['scroll-padding-inline-end']],
        ['scroll-pt', ['scroll-padding-top']],
        ['scroll-pr', ['scroll-padding-right']],
        ['scroll-pb', ['scroll-padding-bottom']],
        ['scroll-pl', ['scroll-padding-left']],
      ],
    ],
  ],

  columns: ['columns', [[['columns', ['columns']]]]],

  gap: [
    'gap',
    [
      [['gap', ['gap']]],
      [
        ['gap-x', ['columnGap']],
        ['gap-y', ['rowGap']],
      ],
    ],
  ],

  space: [
    'space',
    [
      [
        [
          'space-x',
          ({ config }) =>
            (value) => {
              if (flagEnabled(config(), 'logicalSiblingUtilities')) {
                return {
                  '& > :not([hidden]) ~ :not([hidden])': {
                    '--tw-space-x-reverse': '0',
                    'margin-inline-end': `calc(${value} * var(--tw-space-x-reverse))`,
                    'margin-inline-start': `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`,
                  },
                };
              }

              return {
                '& > :not([hidden]) ~ :not([hidden])': {
                  '--tw-space-x-reverse': '0',
                  'margin-right': `calc(${value} * var(--tw-space-x-reverse))`,
                  'margin-left': `calc(${value} * calc(1 - var(--tw-space-x-reverse)))`,
                },
              };
            },
        ],
        [
          'space-y',
          () => (value) => ({
            '& > :not([hidden]) ~ :not([hidden])': {
              '--tw-space-y-reverse': '0',
              'margin-top': `calc(${value} * calc(1 - var(--tw-space-y-reverse)))`,
              'margin-bottom': `calc(${value} * var(--tw-space-y-reverse))`,
            },
          }),
        ],
      ],
    ],
  ],

  divideWidth: [
    'divideWidth',
    [
      [
        [
          'divide-x',
          ({ config }) =>
            (value) => {
              if (flagEnabled(config(), 'logicalSiblingUtilities')) {
                return {
                  '& > :not([hidden]) ~ :not([hidden])': {
                    '@defaults border-width': {},
                    '--tw-divide-x-reverse': '0',
                    'border-inline-end-width': `calc(${value} * var(--tw-divide-x-reverse))`,
                    'border-inline-start-width': `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`,
                  },
                };
              }

              return {
                '& > :not([hidden]) ~ :not([hidden])': {
                  '@defaults border-width': {},
                  '--tw-divide-x-reverse': '0',
                  'border-right-width': `calc(${value} * var(--tw-divide-x-reverse))`,
                  'border-left-width': `calc(${value} * calc(1 - var(--tw-divide-x-reverse)))`,
                },
              };
            },
        ],
        [
          'divide-y',
          () => (value) => ({
            '& > :not([hidden]) ~ :not([hidden])': {
              '@defaults border-width': {},
              '--tw-divide-y-reverse': '0',
              'border-top-width': `calc(${value} * calc(1 - var(--tw-divide-y-reverse)))`,
              'border-bottom-width': `calc(${value} * var(--tw-divide-y-reverse))`,
            },
          }),
        ],
      ],
    ],
  ],

  borderRadius: [
    'borderRadius',
    [
      [['rounded', ['border-radius']]],
      [
        ['rounded-s', ['border-start-start-radius', 'border-end-start-radius']],
        ['rounded-e', ['border-start-end-radius', 'border-end-end-radius']],
        ['rounded-t', ['border-top-left-radius', 'border-top-right-radius']],
        ['rounded-r', ['border-top-right-radius', 'border-bottom-right-radius']],
        ['rounded-b', ['border-bottom-right-radius', 'border-bottom-left-radius']],
        ['rounded-l', ['border-top-left-radius', 'border-bottom-left-radius']],
      ],
      [
        ['rounded-ss', ['border-start-start-radius']],
        ['rounded-se', ['border-start-end-radius']],
        ['rounded-ee', ['border-end-end-radius']],
        ['rounded-es', ['border-end-start-radius']],
        ['rounded-tl', ['border-top-left-radius']],
        ['rounded-tr', ['border-top-right-radius']],
        ['rounded-br', ['border-bottom-right-radius']],
        ['rounded-bl', ['border-bottom-left-radius']],
      ],
    ],
  ],

  borderWidth: [
    'borderWidth',
    [
      [['border', [['@defaults border-width', {}], 'border-width']]],
      [
        ['border-x', [['@defaults border-width', {}], 'border-left-width', 'border-right-width']],
        ['border-y', [['@defaults border-width', {}], 'border-top-width', 'border-bottom-width']],
      ],
      [
        ['border-s', [['@defaults border-width', {}], 'border-inline-start-width']],
        ['border-e', [['@defaults border-width', {}], 'border-inline-end-width']],
        ['border-t', [['@defaults border-width', {}], 'border-top-width']],
        ['border-r', [['@defaults border-width', {}], 'border-right-width']],
        ['border-b', [['@defaults border-width', {}], 'border-bottom-width']],
        ['border-l', [['@defaults border-width', {}], 'border-left-width']],
      ],
    ],
  ],

  padding: [
    'padding',
    [
      [['p', ['padding']]],
      [
        ['px', ['padding-left', 'padding-right']],
        ['py', ['padding-top', 'padding-bottom']],
      ],
      [
        ['ps', ['padding-inline-start']],
        ['pe', ['padding-inline-end']],
        ['pt', ['padding-top']],
        ['pr', ['padding-right']],
        ['pb', ['padding-bottom']],
        ['pl', ['padding-left']],
      ],
    ],
  ],

  textIndent: ['textIndent', [[['indent', ['text-indent']]]]],
  verticalAlign: [undefined, [[['align', ['vertical-align']]]]],
  fontSize: ['fontSize', [[['text', ['font-size']]]]],
  lineHeight: ['lineHeight', [[['leading', ['line-height']]]]],
  letterSpacing: ['letterSpacing', [[['tracking', ['letterSpacing']]]]],

  textDecorationThickness: [
    'textDecorationThickness',
    [[['decoration', ['text-decoration-thickness']]]],
  ],
  textUnderlineOffset: ['textUnderlineOffset', [[['underline-offset', ['text-underline-offset']]]]],

  outlineWidth: ['outlineWidth', [[['outline', ['outline-width']]]]],
  outlineOffset: ['outlineOffset', [[['outline-offset', ['outline-offset']]]]],

  ringWidth: [
    'ringWidth',
    [
      [
        [
          'ring',
          () => (value) => ({
            '@defaults ring-width': {},
            '--tw-ring-offset-shadow': `var(--tw-ring-inset) 0 0 0 var(--tw-ring-offset-width) var(--tw-ring-offset-color)`,
            '--tw-ring-shadow': `var(--tw-ring-inset) 0 0 0 calc(${value} + var(--tw-ring-offset-width)) var(--tw-ring-color)`,
            'box-shadow': [
              `var(--tw-ring-offset-shadow)`,
              `var(--tw-ring-shadow)`,
              `var(--tw-shadow, 0 0 #0000)`,
            ].join(', '),
          }),
        ],
      ],
    ],
  ],

  ringOffsetWidth: ['ringOffsetWidth', [[['ring-offset', ['--tw-ring-offset-width']]]]],

  blur: [
    'blur',
    [
      [
        [
          'blur',
          () => (value) => ({
            '--tw-blur': `blur(${value})`,
            '@defaults filter': {},
            filter: cssFilterValue,
          }),
        ],
      ],
    ],
  ],

  backdropBlur: [
    'backdropBlur',
    [
      [
        [
          'backdrop-blur',
          () => (value) => ({
            '--tw-backdrop-blur': `blur(${value})`,
            '@defaults backdrop-filter': {},
            'backdrop-filter': cssBackdropFilterValue,
          }),
        ],
      ],
    ],
  ],
} as const satisfies Record<
  string,
  [string | undefined, [string, SizingProperties | SizingTransformer][][]]
>;

export type SizingProperties = (string | [string, string | CSSRuleObject])[];
export type SizingTransformer = (api: PluginAPI) => (value: string) => CSSRuleObject | null;
