// Turns the design tokens (tokens/) into CSS variables (public/css/tokens.css).
export default {
  source: ['tokens/**/*.tokens.json'],

  hooks: {
    transforms: {
      // Dimensions and durations arrive as { value: 24, unit: 'px' };
      // writes them as 24px (or 80ms).
      'value/with-unit': {
        type: 'value',
        transitive: true,
        filter: (token) => ['dimension', 'duration'].includes(token.$type),
        transform: (token) => {
          const value = token.$value;
          return typeof value === 'object'
            ? `${value.value}${value.unit}`
            : value;
        },
      },

      // Figma has no font-weight variable: weights are exported as
      // dimensions (700px), which is invalid CSS. Writes the bare number.
      'font-weight/number': {
        type: 'value',
        filter: (token) => token.path[0] === 'font' && token.path[1] === 'weight',
        transform: (token) => {
          const value = token.$value;
          return typeof value === 'object' ? value.value : value;
        },
      },
    },
  },

  platforms: {
    css: {
      // Explicit list instead of transformGroup: 'css', which would turn px into rem.
      // font-weight/number goes before value/with-unit so the weight never gets a unit.
      transforms: [
        'attribute/cti',
        'name/kebab',
        'color/css',
        'font-weight/number',
        'value/with-unit',
      ],
      buildPath: 'public/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          options: { outputReferences: true },
        },
      ],
    },
  },
};
