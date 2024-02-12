import log from 'tailwindcss/lib/util/log';
import plugin from 'tailwindcss/plugin';
import { CSSRuleObject, PluginAPI } from 'tailwindcss/types/config';
import { calculateFluidSizing } from './calculateFluidSizing';
import evaluateTailwindFunctions from './evaluateTailwindFunctions';
import { parseInput } from './parseInput';
import { sizingUtilities } from './sizingUtilities';

const defaultOptions = {
  screens: {},
  rootFontSizePixel: 16,
};

const fluidSizing = plugin.withOptions<{
  screens?: Record<string, string>;
  rootFontSize?: number;
}>(
  (options_) => {
    const options = {
      ...defaultOptions,
      ...options_,
    };

    return (api) => {
      const { matchUtilities, theme, config } = api;

      function createUtilityRule(
        classPrefix: string,
        propertiesOrTransformer:
          | (string | [string, string | CSSRuleObject])[]
          | ((api: PluginAPI) => (value: string) => CSSRuleObject),
      ) {
        return (value_: string | string[]) => {
          let value = Array.isArray(value_) ? value_.join(',') : value_;

          try {
            value = evaluateTailwindFunctions(config())(value);
          } catch (error) {
            // Show a warning
            return { '--': value } as CSSRuleObject;
          }

          // FIXME: If the `value` is passed from a configured theme, it is not possible to accurately compute the classname.
          const candidate = `fluid-${classPrefix}-[${value.replaceAll(' ', '_')}]`;

          const parsed = parseInput(value, options.screens);

          if (!parsed.success) {
            log.warn('fluidsizing-parsed', [
              `The utility \`${candidate}\` contains an invalid value and was not generated.`,
              parsed.error,
            ]);

            return {};
          }

          const calculated = calculateFluidSizing(parsed.value, options.rootFontSizePixel);

          if (!calculated.success) {
            log.warn('fluidsizing-calculated', [
              `The utility \`${candidate}\` contains an invalid value and was not generated.`,
              calculated.error,
            ]);

            return {};
          }

          const transform =
            typeof propertiesOrTransformer === 'function'
              ? propertiesOrTransformer
              : (_api: PluginAPI) => (value: string) =>
                  Object.fromEntries(
                    propertiesOrTransformer.map((property) =>
                      Array.isArray(property) ? property : [property, value],
                    ),
                  );

          return transform(api)(calculated.value);
        };
      }

      for (const [themeKey, utilityVariations] of Object.values(sizingUtilities)) {
        for (let utilityVariation of utilityVariations) {
          matchUtilities(
            Object.fromEntries(
              utilityVariation.map(([classPrefix, propertiesOrTransformer]) => [
                `fluid-${classPrefix}`,
                createUtilityRule(classPrefix, propertiesOrTransformer),
              ]),
            ),
            { values: themeKey != null ? theme(`fluidSizing.${themeKey}`) : {} },
          );
        }
      }
    };
  },
  (_options) => ({
    fluidSizing: {},
  }),
);

export = fluidSizing;
