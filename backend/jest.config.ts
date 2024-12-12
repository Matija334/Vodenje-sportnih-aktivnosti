import type { Config } from 'jest';

const config: Config = {
    collectCoverage: true,
    coverageDirectory: 'coverage',
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': 'ts-jest', // Pove jestu, da uporablja ts-jest za TypeScript datoteke
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    coverageReporters: ['lcov', 'text-summary'],
};

export default config;
