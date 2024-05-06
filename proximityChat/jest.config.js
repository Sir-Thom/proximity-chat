/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    preset: 'jest-expo',

    transformIgnorePatterns: [
        "node_modules/(?!@ngrx|(?!deck.gl)|ng-dynamic)"
    ],

    moduleFileExtensions: ['ts', 'tsx', 'js'],
    collectCoverage: true,
};
