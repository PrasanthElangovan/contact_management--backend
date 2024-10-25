// jest.config.js
require('dotenv').config({ path: './.env.test' });

module.exports = {
  testEnvironment: 'node',
  transform: {
    '^.+\\.jsx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  testPathIgnorePatterns: ['/node_modules/', '/.next/'],
};

module.exports = {
    testEnvironment: 'node',
    preset: 'ts-jest/presets/default-esm',
    globals: {
      'ts-jest': {
        useESM: true
      }
    },
    transform: {},
  };
  