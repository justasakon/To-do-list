// jest.setup.js
// NOTE (2026-02-13): Modified to import the current jest-dom entrypoint.
// Reason: Previous import '@testing-library/jest-dom/extend-expect' caused
// a module-not-found error in the test environment. Using '@testing-library/jest-dom'
// provides the same matchers and fixes the setup error.
import '@testing-library/jest-dom'; // Use the current jest-dom entrypoint