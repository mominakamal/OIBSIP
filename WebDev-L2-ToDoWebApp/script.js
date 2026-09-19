const taskInput = document.getElementById('taskInput');
const addBtn = document.getElementById('addBtn');
const pendingList = document.getElementById('pendingList');
const completedList = document.getElementById('completedList');
const pendingCount = document.getElementById('pendingCount');
const completedCount = document.getElementById('completedCount');
const pendingEmpty = document.getElementById('pendingEmpty');
const completedEmpty = document.getElementById('completedEmpty');

let tasks = JSON.parse(localStorage.getItem('todoTasks')) || [];

function saveTasks() {
  localStorage.setItem('todoTasks', JSON.stringify(tasks));
}

function formatTime(ts) {
  const d = new Date(ts);
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function render() {
  pendingList.innerHTML = '';
  completedList.innerHTML = '';

  const pending = tasks.filter(t => !t.completed);
  const completed = tasks.filter(t => t.completed);

  pendingCount.textContent = `${pending.length} pending`;
  completedCount.textContent = `${completed.length} completed`;

  pendingEmpty.style.display = pending.length === 0 ? 'block' : 'none';
  completedEmpty.style.display = completed.length === 0 ? 'block' : 'none';

  pending.forEach(task => pendingList.appendChild(createTaskEl(task)));
  completed.forEach(task => completedList.appendChild(createTaskEl(task)));
}

function createTaskEl(task) {
  const li = document.createElement('li');
  li.className = 'task-item' + (task.completed ? ' completed' : '');

  const textWrap = document.createElement('div');
  textWrap.className = 'task-text';
  textWrap.textContent = task.text;

  const timeSpan = document.createElement('span');
  timeSpan.className = 'timestamp';
  timeSpan.textContent = task.completed
    ? `Completed: ${formatTime(task.completedAt)}`
    : `Added: ${formatTime(task.createdAt)}`;
  textWrap.appendChild(timeSpan);

  const completeBtn = document.createElement('button');
  completeBtn.className = 'complete-btn';
  completeBtn.textContent = task.completed ? '↩ Undo' : '✓ Done';
  completeBtn.addEventListener('click', () => toggleComplete(task.id));

  const editBtn = document.createElement('button');
  editBtn.className = 'edit-btn';
  editBtn.textContent = '✎ Edit';
  editBtn.addEventListener('click', () => editTask(task.id));

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'delete-btn';
  deleteBtn.textContent = '🗑';
  deleteBtn.addEventListener('click', () => deleteTask(task.id));

  li.appendChild(textWrap);
  li.appendChild(completeBtn);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  return li;
}

function addTask() {
  const text = taskInput.value.trim();
  if (text === '') return;

  tasks.push({
    id: Date.now(),
    text: text,
    completed: false,
    createdAt: Date.now(),
    completedAt: null
  });

  taskInput.value = '';
  saveTasks();
  render();
}

function toggleComplete(id) {
  tasks = tasks.map(t => {
    if (t.id === id) {
      const completed = !t.completed;
      return { ...t, completed, completedAt: completed ? Date.now() : null };
    }
    return t;
  });
  saveTasks();
  render();
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  const newText = prompt('Edit task:', task.text);
  if (newText !== null && newText.trim() !== '') {
    task.text = newText.trim();
    saveTasks();
    render();
  }
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

addBtn.addEventListener('click', addTask);
taskInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') addTask();
});

render();
