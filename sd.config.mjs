// Convierte los tokens de Figma (tokens/) en variables CSS (public/css/tokens.css).
export default {
  source: ['tokens/**/*.tokens.json'],

  hooks: {
    transforms: {
      // Las medidas llegan como { value: 24, unit: 'px' }; las escribe como 24px.
      'dimension/unidad': {
        type: 'value',
        transitive: true,
        filter: (token) => token.$type === 'dimension',
        transform: (token) => {
          const valor = token.$value;
          return typeof valor === 'object'
            ? `${valor.value}${valor.unit}`
            : valor;
        },
      },
    },
  },

  platforms: {
    css: {
      // Lista explícita en lugar de transformGroup: 'css', que convertiría px a rem.
      transforms: [
        'attribute/cti',
        'name/kebab',
        'color/css',
        'dimension/unidad',
      ],
      buildPath: 'public/css/',
      files: [
        {
          destination: 'tokens.css',
          format: 'css/variables',
          filter: (token) => ['color', 'dimension'].includes(token.$type),
          options: { outputReferences: true },
        },
      ],
    },
  },
};
