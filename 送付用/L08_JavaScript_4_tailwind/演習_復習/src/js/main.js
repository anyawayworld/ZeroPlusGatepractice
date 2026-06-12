'use strict';
const doingBtn = document.getElementById('js-doing-btn');
const doneBtn = document.getElementById('js-done-btn');
const addTaskBtn = document.getElementById('js-add-task-btn');

const doingDisplay = document.getElementById('js-doing-display');
const doneDisplay = document.getElementById('js-done-display');

const doingTasks = document.getElementById('js-doing-tasks');
const doneTasks = document.getElementById('js-done-tasks');

const taskTitle = document.getElementById('js-task-title');

let todoTasks = [
  { id: 1, title: '買い物', isDone: false },
  { id: 2, title: '掃除', isDone: false },
  { id: 3, title: '会議', isDone: false },
  { id: 4, title: '勉強', isDone: true },
  { id: 5, title: '朝の運動', isDone: true },
  { id: 6, title: '横幅を超えた時の挙動用のテキスト', isDone: false },
];

window.addEventListener('load', () => {
  showTasks();
});

// タブの切り替え
doingBtn.addEventListener('click', () => {
  doneDisplay.style.display = 'none';
  doingDisplay.style.display = 'block';
  doingBtn.classList.add('tab-active');
  doneBtn.classList.remove('tab-active');
});
doneBtn.addEventListener('click', () => {
  doingDisplay.style.display = 'none';
  doneDisplay.style.display = 'block';
  doingBtn.classList.remove('tab-active');
  doneBtn.classList.add('tab-active');
});

// タスクの追加
addTaskBtn.addEventListener('click', () => {
  let newId = 1;
  if (todoTasks.length > 0) {
    newId = Math.max(...todoTasks.map((task) => task.id)) + 1;
  }

  const task = {
    id: newId,
    title: taskTitle.value,
    isDone: false,
  };
  todoTasks = [...todoTasks, task];
  showTasks();

  taskTitle.value = '';
});

/**
 * タスクの生成
 */
const createTasks = () => {
  let doingTasksEl = '';
  let doneTasksEl = '';

  todoTasks.forEach((task) => {
    const taskEl = `
			<label 
				id="js-task-${task.id}" 
				class="flex items-center justify-between p-2 md:py-3 md:px-4 shadow-md rounded-xl cursor-pointer"
			>
				<div class="flex items-center gap-2 md:gap-3 ">
					<input 
						type="checkbox"
						class="checkbox checkbox-xs md:checkbox-sm border ${
              task.isDone ? '' : 'border-accent'
            } js-check-task"
						${task.isDone ? 'checked="checked"' : ''}
					/>
					<span class="${task.isDone ? 'line-through' : ''} line-clamp-1">
						${task.title}
					</span>
				</div>
				<button
					class="text-red-500 js-delete-task-btn"
				>
					<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 md:size-7">
						<path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
					</svg>
				</button>
			</label>`;

    if (task.isDone) {
      doneTasksEl += taskEl;
    } else {
      doingTasksEl += taskEl;
    }
  });

  return { doingTasksEl, doneTasksEl };
};

/**
 * タスクの表示
 */
const showTasks = () => {
  doingTasks.innerHTML = createTasks().doingTasksEl;
  doneTasks.innerHTML = createTasks().doneTasksEl;
};
