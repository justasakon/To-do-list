// src/Task.test.js
// NOTE (2026-02-13): Test file updated to make assertions and mocks
// compatible with the refactored Task class.
// Changes made:
// - `localStorage` is mocked with `jest.fn()` spies so expectations like
//   `toHaveBeenCalledWith` work correctly.
// - Added an assertion to verify a task's `completed` status before
//   calling `clearCompleted()` to ensure the test verifies the precondition.
// - Small DOM-interaction helpers (click/replace) are used to simulate
//   editing tasks; the source `Task` class was adjusted to support these
//   simulated interactions.

import Task from '../modules/tasks.js';

describe('Task Class', () => {
  let taskList;

  beforeAll(() => {
    // Mocking localStorage with jest.fn() spies
    const store = {};
    const localStorageMock = {
      getItem: jest.fn((key) => (store[key] === undefined ? null : store[key])),
      setItem: jest.fn((key, value) => {
        store[key] = value.toString();
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((k) => delete store[k]);
      }),
    };

    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });
  });

  beforeEach(() => {
    localStorage.clear(); // Clear mock localStorage before each test
    document.body.innerHTML = '<div id="app"></div>'; // Create a root element
    taskList = new Task('app'); // Initialize Task class
    // Add mock tasks
  });
  test('should create a Task instance', () => {
    expect(taskList).toBeInstanceOf(Task);
  });

  test('should start with an empty task list', () => {
    expect(taskList.tasks).toEqual([]);
    expect(taskList.tasks.length).toBe(0);
  });
  test('should render input field and list container on initialization', () => {
    const input = document.querySelector('.input-task');
    const list = document.querySelector('.task-list');
    const clearButton = document.querySelector('.clear-button');

    expect(input).toBeInTheDocument();
    expect(list).toBeInTheDocument();
    expect(clearButton).toBeInTheDocument();
  });

  test('should initialize with empty task list', () => {
    expect(taskList.tasks).toEqual([]);
  });

  test('should add a new task to the list', () => {
    taskList.addTask('Learn Jest');
    expect(taskList.tasks.length).toBe(1);
    expect(taskList.tasks[0].description).toBe('Learn Jest');
    expect(localStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(taskList.tasks));
  });
  test('should add a single task correctly', () => {
    taskList.addTask('Learn Jest');

    expect(taskList.tasks.length).toBe(1);
    expect(taskList.tasks[0].description).toBe('Learn Jest');
    expect(taskList.tasks[0].completed).toBe(false);
  });

  test('should assign index 1 to the first task', () => {
    taskList.addTask('First Task');

    expect(taskList.tasks[0].index).toBe(1);
  });

  test('should not add a task if the description is empty', () => {
    expect(() => taskList.addTask('')).toThrow('Todo must be a non-empty string');
  });
  test('should assign index 1 to the first task', () => {
    taskList.addTask('First Task');

    expect(taskList.tasks[0].index).toBe(1);
  });
  test('should add multiple tasks correctly', () => {
    taskList.addTask('Task 1');
    taskList.addTask('Task 2');
    taskList.addTask('Task 3');

    expect(taskList.tasks.length).toBe(3);

    expect(taskList.tasks[0].description).toBe('Task 1');
    expect(taskList.tasks[1].description).toBe('Task 2');
    expect(taskList.tasks[2].description).toBe('Task 3');
  });
  test('should assign correct index numbers to multiple tasks', () => {
    taskList.addTask('Task 1');
    taskList.addTask('Task 2');
    taskList.addTask('Task 3');

    expect(taskList.tasks[0].index).toBe(1);
    expect(taskList.tasks[1].index).toBe(2);
    expect(taskList.tasks[2].index).toBe(3);
  });

  test('should render tasks to the DOM', () => {
    taskList.addTask('Learn Jest');
    taskList.renderTasks();
    const taskItems = document.querySelectorAll('.task-item');
    expect(taskItems.length).toBe(1);
    expect(taskItems[0].textContent).toContain('Learn Jest');
  });
  test('should render multiple task descriptions correctly', () => {
    taskList.addTask('Task 1');
    taskList.addTask('Task 2');

    const descriptions = document.querySelectorAll('.task-item p');

    expect(descriptions.length).toBe(2);
    expect(descriptions[0].textContent).toBe('Task 1');
    expect(descriptions[1].textContent).toBe('Task 2');
  });

  test('should remove a task from the list', () => {
    taskList.addTask('Learn Jest');

    const deleteButton = document.querySelector('.item-menu'); // Select the delete button
    deleteButton.click(); // Trigger the click event
    expect(taskList.tasks.length).toBe(0); // Ensure task is removed
    expect(document.querySelectorAll('.task-item').length).toBe(0); // Check DOM
  });
  test('should display input field', () => {
    const input = document.querySelector('.input-task');

    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Add to your list...');
  });

  test('should display checkbox and description when task is added', () => {
    taskList.addTask('Learn Jest');

    const checkbox = document.querySelector('.task-checkbox');
    const description = document.querySelector('.task-item p');

    expect(checkbox).toBeInTheDocument();
    expect(checkbox.type).toBe('checkbox');

    expect(description).toBeInTheDocument();
    expect(description.textContent).toBe('Learn Jest');
  });

  test('should display the correct description for a single task', () => {
    taskList.addTask('Learn Jest');

    const description = document.querySelector('.task-item p');

    expect(description).toBeInTheDocument();
    expect(description.textContent).toBe('Learn Jest');
  });

  test('should display correct descriptions for multiple tasks', () => {
    taskList.addTask('Task 1');
    taskList.addTask('Task 2');
    taskList.addTask('Task 3');

    const descriptions = document.querySelectorAll('.task-item p');

    expect(descriptions.length).toBe(3);

    expect(descriptions[0].textContent).toBe('Task 1');
    expect(descriptions[1].textContent).toBe('Task 2');
    expect(descriptions[2].textContent).toBe('Task 3');
  });

  test('should clear completed tasks from the list', () => {
    taskList.addTask('Task 1');
    taskList.addTask('Task 2'); // Add tasks

    const checkbox = document.querySelector('.task-checkbox');
    checkbox.click(); // Mark as completed
    expect(taskList.tasks[0].completed).toBe(true);
    taskList.clearCompleted(); // Clear completed tasks

    expect(taskList.tasks.length).toBe(1); // Only Task 2 should remain
    expect(taskList.tasks[0].description).toBe('Task 2');
  });

  test('should update a task description', () => {
    taskList.addTask('Original Task');
    taskList.renderTasks();

    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = 'Updated Task';

    // Simulate editing the task directly in the DOM
    const listDescription = document.querySelector('p');
    listDescription.click(); // Activate edit mode
    listDescription.replaceWith(editInput);

    // Handle save action
    editInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    expect(taskList.tasks[0].description).toBe('Updated Task'); // Ensure task is updated
    expect(localStorage.setItem).toHaveBeenCalledWith('tasks', JSON.stringify(taskList.tasks)); // Ensure save
  });
});
// task delect functionalities
describe('Task Class - Delete Functionality', () => {
  let taskList;

  beforeEach(() => {
    // Mock localStorage
    const store = {};
    global.localStorage = {
      getItem: jest.fn(() => JSON.stringify([])),
      setItem: jest.fn((key, value) => {
        store[key] = value;
      }),
      clear: jest.fn(() => {
        Object.keys(store).forEach((k) => delete store[k]);
      }),
    };

    document.body.innerHTML = '<div id="app"></div>';
    taskList = new Task('app');
  });

  test('delete button removes a task from the array and DOM', () => {
    // Add tasks
    taskList.addTask('Task 1');
    taskList.addTask('Task 2');

    // Confirm initial state
    expect(taskList.tasks.length).toBe(2);
    let taskItems = document.querySelectorAll('.task-item');
    expect(taskItems.length).toBe(2);

    // Click delete button of first task
    const deleteButtons = document.querySelectorAll('.item-menu');
    deleteButtons[0].click();

    // After delete
    expect(taskList.tasks.length).toBe(1);
    expect(taskList.tasks[0].description).toBe('Task 2');

    taskItems = document.querySelectorAll('.task-item');
    expect(taskItems.length).toBe(1);
    expect(taskItems[0].textContent).toContain('Task 2');
  });

  test('delete updates localStorage correctly', () => {
    taskList.addTask('Task 1');
    taskList.addTask('Task 2');

    const deleteButtons = document.querySelectorAll('.item-menu');
    deleteButtons[1].click(); // Delete second task

    // localStorage should be updated with remaining task
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'tasks',
      JSON.stringify(taskList.tasks),
    );

    // Only Task 1 should remain
    expect(taskList.tasks.length).toBe(1);
    expect(taskList.tasks[0].description).toBe('Task 1');
  });
  // clear button functionalities
  test('should clear only completed tasks from the list', () => {
    // Add multiple tasks
    taskList.addTask('Task 1');
    taskList.addTask('Task 2');
    taskList.addTask('Task 3');

    // Mark Task 1 and Task 3 as completed
    taskList.tasks[0].completed = true;
    taskList.tasks[2].completed = true;

    // Simulate clicking the "Clear all completed" button
    const clearButton = document.querySelector('.clear-button');
    clearButton.click();

    // Only incomplete task should remain
    expect(taskList.tasks.length).toBe(1);
    expect(taskList.tasks[0].description).toBe('Task 2');

    // DOM should reflect only remaining task
    const taskItems = document.querySelectorAll('.task-item');
    expect(taskItems.length).toBe(1);
    expect(taskItems[0].textContent).toContain('Task 2');

    // localStorage should be updated
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'tasks',
      JSON.stringify(taskList.tasks),
    );
  });

  test('should do nothing if no tasks are completed', () => {
    // Add tasks
    taskList.addTask('Task 1');
    taskList.addTask('Task 2');

    // Click clear completed (no task completed)
    const clearButton = document.querySelector('.clear-button');
    clearButton.click();

    // All tasks remain
    expect(taskList.tasks.length).toBe(2);
    expect(taskList.tasks[0].description).toBe('Task 1');
    expect(taskList.tasks[1].description).toBe('Task 2');

    // DOM still contains all tasks
    const taskItems = document.querySelectorAll('.task-item');
    expect(taskItems.length).toBe(2);
  });
  // edit task functionalities
  test('should update a task description when edited', () => {
    // Add a task
    taskList.addTask('Original Task');

    // Simulate clicking the description <p> to edit
    const descriptionP = document.querySelector('.task-item p');
    descriptionP.click();

    // Replace <p> with an input element (simulating user input)
    const group = descriptionP.parentElement;
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = 'Updated Task';
    editInput.classList.add('edit-task-input');

    group.replaceChild(editInput, descriptionP);

    // Simulate pressing Enter to save edit
    editInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    // Task array should be updated
    expect(taskList.tasks[0].description).toBe('Updated Task');

    // DOM should update
    const updatedDescription = document.querySelector('.task-item p');
    expect(updatedDescription.textContent).toBe('Updated Task');

    // localStorage should be updated
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'tasks',
      JSON.stringify(taskList.tasks),
    );
  });

  test('should not update if input is empty', () => {
    taskList.addTask('Task to Edit');

    const descriptionP = document.querySelector('.task-item p');
    descriptionP.click();

    const group = descriptionP.parentElement;
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.value = ''; // empty input
    editInput.classList.add('edit-task-input');

    group.replaceChild(editInput, descriptionP);

    editInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));

    // Task description should remain unchanged
    expect(taskList.tasks[0].description).toBe('Task to Edit');
  });
  test('should mark a task as completed when checkbox is clicked', () => {
    taskList.addTask('Task 1');

    const checkbox = document.querySelector('.task-checkbox');

    // Initially, task should not be completed
    expect(taskList.tasks[0].completed).toBe(false);
    expect(checkbox.checked).toBe(false);

    // Simulate clicking checkbox
    checkbox.click(); // triggers change event

    expect(taskList.tasks[0].completed).toBe(true);
    expect(checkbox.checked).toBe(true);
  });

  test('should remove completed status when checkbox is unchecked', () => {
    taskList.addTask('Task 1');

    const checkbox = document.querySelector('.task-checkbox');

    // Mark as completed
    checkbox.click();
    expect(taskList.tasks[0].completed).toBe(true);

    // Uncheck
    checkbox.click();
    expect(taskList.tasks[0].completed).toBe(false);
    expect(checkbox.checked).toBe(false);
  });

  test('should add line-through class to completed task', () => {
    taskList.addTask('Task 1');

    const checkbox = document.querySelector('.task-checkbox');
    const description = document.querySelector('.task-item p');

    // Before completing
    expect(description).not.toHaveClass('completed');

    // Check task
    checkbox.click();

    // After completing
    expect(description).toHaveClass('completed');

    // Uncheck
    checkbox.click();
    expect(description).not.toHaveClass('completed');
  });
});
