import { describe, expect, test } from 'vitest';
import { UnitValue } from '../src/UnitValue';
import { calculateFluidSizing } from '../src/calculateFluidSizing';

describe('normal cases', () => {
  test.each([
    [
      'basic',
      {
        // prettier-ignore
        from: { screen: new UnitValue( 768, 'px'), size: new UnitValue(32, 'px') },
        // prettier-ignore
        to:   { screen: new UnitValue(1280, 'px'), size: new UnitValue(64, 'px') },
      },
      'clamp(32px, 6.25vw - 16px, 64px)',
    ],
    [
      "using smaller 'size' in 'to'",
      {
        // prettier-ignore
        from: { screen: new UnitValue( 768, 'px'), size: new UnitValue(64, 'px') },
        // prettier-ignore
        to:   { screen: new UnitValue(1280, 'px'), size: new UnitValue(32, 'px') },
      },
      'clamp(32px, -6.25vw + 112px, 64px)',
    ],
    [
      "using negative number for 'size'",
      {
        // prettier-ignore
        from: { screen: new UnitValue( 768, 'px'), size: new UnitValue( 32, 'px') },
        // prettier-ignore
        to:   { screen: new UnitValue(1280, 'px'), size: new UnitValue(-64, 'px') },
      },
      'clamp(-64px, -18.75vw + 176px, 32px)',
    ],
    [
      "using smaller 'screen' in 'to'",
      {
        // prettier-ignore
        from: { screen: new UnitValue(1280, 'px'), size: new UnitValue(32, 'px') },
        // prettier-ignore
        to:   { screen: new UnitValue( 768, 'px'), size: new UnitValue(64, 'px') },
      },
      'clamp(32px, -6.25vw + 112px, 64px)',
    ],
    [
      "using same 'screen's and same 'size's",
      {
        // prettier-ignore
        from: { screen: new UnitValue(768, 'px'), size: new UnitValue(32, 'px') },
        // prettier-ignore
        to:   { screen: new UnitValue(768, 'px'), size: new UnitValue(32, 'px') },
      },
      '32px',
    ],
    [
      "using different 'screen's and same 'size's",
      {
        // prettier-ignore
        from: { screen: new UnitValue( 768, 'px'), size: new UnitValue(32, 'px') },
        // prettier-ignore
        to:   { screen: new UnitValue(1280, 'px'), size: new UnitValue(32, 'px') },
      },
      '32px',
    ],
    [
      "using rem unit for 'screen's",
      {
        // prettier-ignore
        from: { screen: new UnitValue(48, 'rem'), size: new UnitValue(32, 'px') },
        // prettier-ignore
        to:   { screen: new UnitValue(80, 'rem'), size: new UnitValue(64, 'px') },
      },
      'clamp(32px, 6.25vw - 16px, 64px)',
    ],
    [
      "using rem unit for 'size's",
      {
        // prettier-ignore
        from: { screen: new UnitValue( 768, 'px'), size: new UnitValue(2, 'rem') },
        // prettier-ignore
        to:   { screen: new UnitValue(1280, 'px'), size: new UnitValue(4, 'rem') },
      },
      'clamp(2rem, 6.25vw - 1rem, 4rem)',
    ],
    [
      "using rem unit for 'screen's and 'size's",
      {
        // prettier-ignore
        from: { screen: new UnitValue(48, 'rem'), size: new UnitValue(2, 'rem') },
        // prettier-ignore
        to:   { screen: new UnitValue(80, 'rem'), size: new UnitValue(4, 'rem') },
      },
      'clamp(2rem, 6.25vw - 1rem, 4rem)',
    ],
    [
      "omit '0px' from second argument",
      {
        // prettier-ignore
        from: { screen: new UnitValue( 768, 'px'), size: new UnitValue(24, 'px') },
        // prettier-ignore
        to:   { screen: new UnitValue(1024, 'px'), size: new UnitValue(32, 'px') },
      },
      'clamp(24px, 3.125vw, 32px)',
    ],
  ])('%s', (_name, input, expected) => {
    const calculated = calculateFluidSizing(input);
    if (!calculated.success) throw new Error('Invariant failed');
    expect(calculated.value).toEqual(expected);
  });

  test("change 'rootFontSize'", () => {
    const calculated = calculateFluidSizing(
      {
        // prettier-ignore
        from: { screen: new UnitValue( 768, 'px'), size: new UnitValue(2, 'rem') },
        // prettier-ignore
        to:   { screen: new UnitValue(1280, 'px'), size: new UnitValue(4, 'rem') },
      },
      10,
    );
    if (!calculated.success) throw new Error('Invariant failed');
    expect(calculated.value).toBe('clamp(2rem, 3.90625vw - 1rem, 4rem)');
  });

  test("change 'rootFontSize' and using rem unit for 'screen's", () => {
    const calculated = calculateFluidSizing(
      {
        // prettier-ignore
        from: { screen: new UnitValue( 76.8, 'rem'), size: new UnitValue(2, 'rem') },
        // prettier-ignore
        to:   { screen: new UnitValue(128  , 'rem'), size: new UnitValue(4, 'rem') },
      },
      10,
    );
    if (!calculated.success) throw new Error('Invariant failed');
    expect(calculated.value).toBe('clamp(2rem, 3.90625vw - 1rem, 4rem)');
  });
});

describe('abnormal cases', () => {
  test.each([
    [
      "using negative number for 'screen' in 'from'",
      {
        // prettier-ignore
        from: { screen: new UnitValue(-768, 'px'), size: new UnitValue(32, 'px') },
        // prettier-ignore
        to:   { screen: new UnitValue(1280, 'px'), size: new UnitValue(64, 'px') },
      },
      "'from.screen' must larger than 0, but got '-768px'.",
    ],
    [
      "using negative number for 'screen' in 'to'",
      {
        // prettier-ignore
        from: { screen: new UnitValue(  768, 'px'), size: new UnitValue(32, 'px') },
        // prettier-ignore
        to:   { screen: new UnitValue(-1280, 'px'), size: new UnitValue(64, 'px') },
      },
      "'to.screen' must larger than 0, but got '-1280px'.",
    ],
    [
      "using difference unit for 'screen's",
      {
        // prettier-ignore
        from: { screen: new UnitValue(768, 'px'),  size: new UnitValue(32, 'px') },
        // prettier-ignore
        to:   { screen: new UnitValue( 80, 'rem'), size: new UnitValue(64, 'px') },
      },
      "The both 'screen's must have same unit.",
    ],
    [
      "using difference unit for 'size's",
      {
        // prettier-ignore
        from: { screen: new UnitValue( 768, 'px'), size: new UnitValue(32, 'px') },
        // prettier-ignore
        to:   { screen: new UnitValue(1280, 'px'), size: new UnitValue( 4, 'rem') },
      },
      "The both 'size's must have same unit.",
    ],
    [
      "using same 'screen's and difference 'size's",
      {
        // prettier-ignore
        from: { screen: new UnitValue(768, 'px'), size: new UnitValue(32, 'px') },
        // prettier-ignore
        to:   { screen: new UnitValue(768, 'px'), size: new UnitValue(64, 'px') },
      },
      "The 'value's for both 'screen's must be different.",
    ],
  ])('%s', (_name, input, expected) => {
    const calculated = calculateFluidSizing(input);
    if (calculated.success) throw new Error('Invariant failed');
    expect(calculated.error).toBe(expected);
  });
});
