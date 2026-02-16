# To-do app
a web site which will help schedule and organize your day

## Testing and Recent Changes

This project includes a Jest test suite for the `Task` class. Recent edits were
made to support reliable unit testing and to improve input validation. Summary
of notable changes (2026-02-13):

- `jest.setup.js`
	- Updated import to `@testing-library/jest-dom` to fix a setup error where
		the previous import `@testing-library/jest-dom/extend-expect` could not
		be resolved by the test runner.

- `src/modules/tasks.js`
	- `addTask(description)` now validates input and throws `Todo must be a
		non-empty string` when the description is empty or not a string. This makes
		the API contract explicit and easier to test.
	- The DOM edit flow was adjusted so tests can simulate editing by replacing
		the description node with an input element. Specifically:
		- Delayed replacement of the description element on click (via `setTimeout`) so
			external test code can replace the node first.
		- Added group-level `keydown` (capture) and `focusout` listeners that detect
			Enter and blur events on input elements and save edits. This ensures
			keyboard events dispatched by tests are caught and processed.

- `src/Test/todo.test.js`
	- `localStorage` is mocked using `jest.fn()` spies so assertions like
		`expect(localStorage.setItem).toHaveBeenCalledWith(...)` work reliably.
	- Added an assertion that verifies a task's `completed` status is `true`
		before `clearCompleted()` is invoked to ensure the precondition is tested.

Running tests

Install dependencies and run the test suite with:

```bash
npm install
npm test
```
