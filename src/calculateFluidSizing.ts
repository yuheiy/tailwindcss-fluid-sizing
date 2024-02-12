import { UnitValue } from './UnitValue';
import { Result } from './types';

function truncate(n: number) {
  return Number(n.toFixed(3));
}

// https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/
export function calculateFluidSizing(
  {
    from,
    to,
  }: {
    from: {
      screen: UnitValue;
      size: UnitValue;
    };
    to: {
      screen: UnitValue;
      size: UnitValue;
    };
  },
  rootFontSizePixel: number = 16,
): Result<string, string> {
  if (from.screen.value <= 0) {
    return {
      success: false,
      error: `'from.screen' must larger than 0, but got '${from.screen}'.`,
    };
  }

  if (to.screen.value <= 0) {
    return {
      success: false,
      error: `'to.screen' must larger than 0, but got '${to.screen}'.`,
    };
  }

  if (from.screen.unit !== to.screen.unit) {
    return {
      success: false,
      error: `The both 'screen's must have same unit.`,
    };
  }

  if (from.size.unit !== to.size.unit) {
    return {
      success: false,
      error: `The both 'size's must have same unit.`,
    };
  }

  if (from.size.value === to.size.value) {
    return {
      success: true,
      value: from.size.toString(),
    };
  }

  if (from.screen.value === to.screen.value) {
    return {
      success: false,
      error: `The 'value's for both 'screen's must be different.`,
    };
  }

  const [fromScreen, toScreen, fromSize, toSize] = [from.screen, to.screen, from.size, to.size].map(
    ({ unit, value }) => (unit === 'rem' ? value * rootFontSizePixel : value),
  );

  const min = Math.min(fromSize!, toSize!);
  const max = Math.max(fromSize!, toSize!);

  const v = (100 * (toSize! - fromSize!)) / (toScreen! - fromScreen!);
  const r = (fromScreen! * toSize! - toScreen! * fromSize!) / (fromScreen! - toScreen!);

  function withUnit(value: number) {
    switch (from.size.unit) {
      case 'px':
        return `${truncate(value)}px`;

      case 'rem':
        return `${truncate(value / rootFontSizePixel)}rem`;
    }
  }

  let clampValue = `${truncate(v)}vw`;
  if (r !== 0) {
    clampValue += ` ${Math.sign(r) >= 0 ? '+' : '-'} ${withUnit(Math.abs(r))}`;
  }

  return {
    success: true,
    value: `clamp(${[withUnit(min), clampValue, withUnit(max)].join(', ')})`,
  };
}
