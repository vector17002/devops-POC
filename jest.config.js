/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^#config/(.*)\\.js$': '<rootDir>/src/config/$1',
    '^#utils/(.*)\\.js$': '<rootDir>/src/utils/$1',
    '^#routes/(.*)\\.js$': '<rootDir>/src/routes/$1',
    '^#models/(.*)\\.js$': '<rootDir>/src/models/$1',
    '^#db/(.*)\\.js$': '<rootDir>/src/models/$1',
    '^#services/(.*)\\.js$': '<rootDir>/src/services/$1',
    '^#middlewares/(.*)\\.js$': '<rootDir>/src/middlewares/$1',
    '^#controllers/(.*)\\.js$': '<rootDir>/src/controllers/$1',
    '^#validations/(.*)\\.js$': '<rootDir>/src/validations/$1',
    '^#src/(.*)\\.js$': '<rootDir>/src/$1',
    // Fallback for extensionless imports if any
    '^#config/(.*)$': '<rootDir>/src/config/$1',
    '^#utils/(.*)$': '<rootDir>/src/utils/$1',
    '^#routes/(.*)$': '<rootDir>/src/routes/$1',
    '^#models/(.*)$': '<rootDir>/src/models/$1',
    '^#db/(.*)$': '<rootDir>/src/models/$1',
    '^#services/(.*)$': '<rootDir>/src/services/$1',
    '^#middlewares/(.*)$': '<rootDir>/src/middlewares/$1',
    '^#controllers/(.*)$': '<rootDir>/src/controllers/$1',
    '^#validations/(.*)$': '<rootDir>/src/validations/$1',
    '^#src/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
      },
    ],
  },
};
