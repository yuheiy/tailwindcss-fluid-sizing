import { Result } from './types';

export class UnitValue {
  _unitValueBrand: any;

  constructor(
    public value: number,
    public unit: 'px' | 'rem',
  ) {}

  toString() {
    return `${this.value}${this.unit}`;
  }
}

export function parseUnitValueString(input: string): Result<UnitValue, true> {
  const pattern = /^([+-]?[0-9]*\.?[0-9]+)(px|rem)$/;
  const match = input.match(pattern);

  if (!match) {
    return {
      success: false,
      error: true,
    };
  }

  const value = parseFloat(match[1]!);
  const unit = match[2] as 'px' | 'rem';

  return {
    success: true,
    value: new UnitValue(value, unit),
  };
}
