import './style.css';

class Task {
  constructor(root) {
    this.tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    this.root = document.getElementById(root);

    this.renderInput();
    this.renderTasks();

    this.input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && this.input.value.trim() !== '') {
        this.addTask(this.input.value.trim());
        this.input.value = '';
      }
    });

    this.clearButton.addEventListener('click', () => this.clearCompleted());
  }

  renderInput = () => {
    const addContainer = document.createElement('span');
    addContainer.classList.add('add-container');

    const addedTask = document.createElement('div');
    addedTask.classList.add('added-task');

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'Add to your list...';
    this.input.classList.add('input-task');
    this.input.id = 'input-task';

    const addIcon = document.createElement('span');
    addIcon.innerHTML = '&#x21bb;';
    addIcon.classList.add('add-icon');

    addedTask.appendChild(this.input);
    addedTask.appendChild(addIcon);
    addContainer.appendChild(addedTask);
    this.root.appendChild(addContainer);

    this.list = document.createElement('ul');
    this.list.classList.add('task-list');
    this.list.id = 'task-list';
    this.root.appendChild(this.list);

    this.clearButton = document.createElement('button');
    this.clearButton.textContent = 'Clear all completed';
    this.clearButton.classList.add('clear-button');
    this.root.appendChild(this.clearButton);
  }

  addTask = (description) => {
    const task = {
      id: Date.now(),
      description,
      completed: false,
      index: this.tasks.length,
    };
    this.tasks.push(task);
    this.save();
    this.renderTasks();
  }

  save =() => {
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
  }

  renderTasks =() => {
    this.list.innerHTML = '';

    this.tasks.forEach((taskItem) => {
      const listItem = document.createElement('li');
      listItem.classList.add('task-item');

      const group = document.createElement('span');
      group.classList.add('task-group');

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = taskItem.completed;
      checkbox.classList.add('task-checkbox');

      const listDescription = document.createElement('p');
      listDescription.textContent = taskItem.description;
      checkbox.addEventListener('change', () => {
        taskItem.completed = checkbox.checked;
        this.save();
        if (checkbox.checked) {
          listDescription.classList.add('completed');
        } else {
          listDescription.classList.remove('completed');
        }
      });
      listDescription.addEventListener('click', () => {
        const editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = taskItem.description;
        editInput.classList.add('edit-task-input');
        group.replaceChild(editInput, listDescription);
        editInput.focus();

        const saveEdit = () => {
          if (editInput.value.trim() !== '') {
            taskItem.description = editInput.value.trim();
          }
          this.save();
          this.renderTasks();
        };

        editInput.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') saveEdit();
        });
        editInput.addEventListener('blur', saveEdit);
      });

      group.appendChild(checkbox);
      group.appendChild(listDescription);
      listItem.appendChild(group);

      const itemMenu = document.createElement('span');
      itemMenu.innerHTML = '&#128465;';
      itemMenu.classList.add('item-menu');
      itemMenu.style.cursor = 'pointer';
      itemMenu.title = 'Delete task';
      itemMenu.addEventListener('click', () => {
        this.tasks = this.tasks.filter((t) => t.id !== taskItem.id);
        this.save();
        this.renderTasks();
      });

      listItem.appendChild(itemMenu);
      this.list.appendChild(listItem);
    });
  }

  clearCompleted =() => {
    this.tasks = this.tasks.filter((task) => !task.completed);
    this.save();
    this.renderTasks();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  // eslint-disable-next-line no-new
  new Task('root');
});
