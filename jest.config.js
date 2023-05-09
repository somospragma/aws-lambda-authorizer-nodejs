module.exports = {
    testEnvironment: 'node',
    testMatch: [
      '**/test/lambda/test.js'
    ],
    collectCoverage: true,
    coverageDirectory: 'coverage',
    coverageReporters: ['text', 'lcov'],
    moduleFileExtensions: ['js']
  }  