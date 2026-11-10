export default {
  source: ['tokens/**/*.tokens.json'],
  platforms: {
    css: {
      transformGroup: 'css',
      buildPath: 'public/css/',
      files: [{
        destination: 'tokens.css',
        format: 'css/variables',
        filter: (token) => token.$type === 'color',
        options: { outputReferences: true }
      }]
    }
  }
};