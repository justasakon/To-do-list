import './style.css';
// an array of objects with some simple to do task
const task = [
  {
    id: 0,
    description: 'wash the dishes',
    completed: false,
  },
  {
    id: 1,
    description: 'complete To Do list project',
    completed: false,
  },
];
// functions to eterate over task arrays
function displayTask() {
  const Container = document.getElementById('root');
  const addedTask = document.createElement('div');
  const addContainer = document.createElement('span');
  addContainer.classList.add('add-container');
  addedTask.classList.add('added-task');
  const input = document.createElement('input');
  input.type = 'text';
  input.placeholder = 'Add to your list...';
  input.classList.add('input-task');
  const addIcon = document.createElement('span');
  addIcon.innerHTML = '&#x21bb;';
  addIcon.classList.add('add-icon');
  addedTask.appendChild(input);
  addedTask.appendChild(addIcon);
  addContainer.appendChild(addedTask);
  Container.appendChild(addContainer);
  const taskList = document.createElement('ul');
  taskList.classList.add('task-list');
  task.forEach((taskItem) => {
    const listItem = document.createElement('li');
    listItem.classList.add('task-item');
    const group = document.createElement('span');
    group.classList.add('task-group');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = taskItem.completed;
    checkbox.classList.add('task-checkbox');
    group.appendChild(checkbox);
    const listDescription = document.createElement('p');
    listDescription.textContent = taskItem.description;
    group.appendChild(listDescription);
    listItem.appendChild(group);
    taskList.appendChild(listItem);
    const itemMenu = document.createElement('span');
    itemMenu.innerHTML = '&#8942;';
    itemMenu.classList.add('item-menu');
    listItem.appendChild(itemMenu);
  });
  Container.appendChild(taskList);
  const clearButton = document.createElement('button');
  clearButton.textContent = 'Clear all completed';
  clearButton.classList.add('clear-button');
  Container.appendChild(clearButton);
}
document.addEventListener('DOMContentLoaded', displayTask);