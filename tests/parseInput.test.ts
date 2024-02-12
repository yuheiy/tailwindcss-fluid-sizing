import { expect, test } from 'vitest';
import { parseInput } from '../src/parseInput';

test('basic', () => {
  const screens = {};

  expect(parseInput('768px 64px, 1280px 96px', screens)).toMatchInlineSnapshot(`
    {
      "success": true,
      "value": {
        "from": {
          "screen": UnitValue {
            "unit": "px",
            "value": 768,
          },
          "size": UnitValue {
            "unit": "px",
            "value": 64,
          },
        },
        "to": {
          "screen": UnitValue {
            "unit": "px",
            "value": 1280,
          },
          "size": UnitValue {
            "unit": "px",
            "value": 96,
          },
        },
      },
    }
  `);
});

test('invalid list count', () => {
  const screens = {};

  expect(parseInput('768px 64px, 1024px 96px, 1280px 128px', screens)).toMatchInlineSnapshot(`
    {
      "error": "'768px 64px, 1024px 96px, 1280px 128px' contains too many argument.",
      "success": false,
    }
  `);
});

test('invalid pair count', () => {
  const screens = {};

  expect(parseInput('768px 64px, 1280px 96px 128px', screens)).toMatchInlineSnapshot(`
    {
      "error": "'1280px 96px 128px' contains too many value in '768px 64px, 1280px 96px 128px'.",
      "success": false,
    }
  `);
});

test('fallback to default screens', () => {
  const screens = {
    DEFAULT_FROM: '768px',
    DEFAULT_TO: '1280px',
  };

  expect(parseInput('64px, 96px', screens)).toMatchInlineSnapshot(`
    {
      "success": true,
      "value": {
        "from": {
          "screen": UnitValue {
            "unit": "px",
            "value": 768,
          },
          "size": UnitValue {
            "unit": "px",
            "value": 64,
          },
        },
        "to": {
          "screen": UnitValue {
            "unit": "px",
            "value": 1280,
          },
          "size": UnitValue {
            "unit": "px",
            "value": 96,
          },
        },
      },
    }
  `);
});

test('failed to fallback to default screens', () => {
  const screens = {};

  expect(parseInput('64px, 96px', screens)).toMatchInlineSnapshot(`
    {
      "error": "Screen is omitted, but no default screen is set.",
      "success": false,
    }
  `);
});

test('using screen keyword', () => {
  const screens = {
    md: '768px',
    lg: '1024px',
  };

  expect(parseInput('md 64px, lg 96px', screens)).toMatchInlineSnapshot(`
    {
      "success": true,
      "value": {
        "from": {
          "screen": UnitValue {
            "unit": "px",
            "value": 768,
          },
          "size": UnitValue {
            "unit": "px",
            "value": 64,
          },
        },
        "to": {
          "screen": UnitValue {
            "unit": "px",
            "value": 1024,
          },
          "size": UnitValue {
            "unit": "px",
            "value": 96,
          },
        },
      },
    }
  `);
});

test('nullish screen theme', () => {
  const screens = {
    md: null,
    lg: null,
  };

  expect(parseInput('md 64px, lg 96px', screens as any)).toMatchInlineSnapshot(`
    {
      "error": "The 'md' screen does not exist in 'screens' option.",
      "success": false,
    }
  `);
});

test('invalid screen key', () => {
  const screens = {
    '768px': '768px',
  };

  expect(parseInput('768px 64px, 1280px 96px', screens)).toMatchInlineSnapshot(`
    {
      "error": "The '768px' is an invalid key for 'screens' option.",
      "success": false,
    }
  `);
});

test('invalid screen format', () => {
  const screens = {};

  expect(parseInput('48em 64px, 80em 96px', screens)).toMatchInlineSnapshot(`
    {
      "error": "The '48em' screen does not exist in 'screens' option.",
      "success": false,
    }
  `);
});

test('invalid size format', () => {
  const screens = {};

  expect(parseInput('768px 4em, 1280px 6em', screens)).toMatchInlineSnapshot(`
    {
      "error": "Failed to parse '4em' in '768px 4em, 1280px 6em'.",
      "success": false,
    }
  `);
});
