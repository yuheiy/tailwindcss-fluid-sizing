import { UnitValue, parseUnitValueString } from './UnitValue';
import { Result } from './types';

export function parseInput(
  input: string,
  { DEFAULT_FROM, DEFAULT_TO, ...screens }: Record<string, string>,
): Result<
  {
    from: {
      screen: UnitValue;
      size: UnitValue;
    };
    to: {
      screen: UnitValue;
      size: UnitValue;
    };
  },
  string
> {
  const list = input.split(',');

  if (list.length !== 2) {
    return {
      success: false,
      error: `'${input}' contains too many ${list.length - 2 === 1 ? 'argument' : 'arguments'}.`,
    };
  }

  const result: {
    screen: UnitValue;
    size: UnitValue;
  }[] = [];

  for (const [pair, defaultScreen] of [
    [list[0], DEFAULT_FROM],
    [list[1], DEFAULT_TO],
  ]) {
    const splitted = pair!.trim().split(/ +/);
    let screen;
    let size;

    switch (splitted.length) {
      case 1:
        if (defaultScreen == null) {
          return {
            success: false,
            error: `Screen is omitted, but no default screen is set.`,
          };
        }

        screen = defaultScreen;
        size = splitted[0];
        break;

      case 2:
        screen = splitted[0];
        size = splitted[1];
        break;

      default:
        return {
          success: false,
          error: `'${splitted.join(' ')}' contains too many ${splitted.length - 2 === 1 ? 'value' : 'values'} in '${input}'.`,
        };
    }

    let parsedScreen = parseUnitValueString(screen!);

    if (parsedScreen.success) {
      if (screen! in screens) {
        return {
          success: false,
          error: `The '${screen}' is an invalid key for 'screens' option.`,
        };
      }
    } else {
      const screenFromSettings = screens[screen!];

      if (screenFromSettings == null) {
        return {
          success: false,
          error: `The '${screen}' screen does not exist in 'screens' option.`,
        };
      }

      parsedScreen = parseUnitValueString(screenFromSettings);

      if (!parsedScreen.success) {
        return {
          success: false,
          error: `Failed to parse '${screenFromSettings}' of 'screens.${screen}'.`,
        };
      }
    }

    const parsedSize = parseUnitValueString(size!);

    if (!parsedSize.success) {
      return {
        success: false,
        error: `Failed to parse '${size}' in '${input}'.`,
      };
    }

    result.push({
      screen: parsedScreen.value,
      size: parsedSize.value,
    });
  }

  return {
    success: true,
    value: {
      from: result[0]!,
      to: result[1]!,
    },
  };
}
