
/* LOCAL STORAGE */

const getTasksFromLocalStorage = () => {
    const localTasks = JSON.parse(window.localStorage.getItem('tasks'))
    return localTasks ? localTasks : [];
}

const setTasksInLocalStorage = (tasks) => {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
}

/* SHOW TASKS */

const createTaskListItem = (task) => {
    const list = document.getElementById('tasks-list');

    const box = document.createElement('div');
    box.id = task.id;
    box.classList.add("task-box");

    const box_texts = document.createElement('div');
    box_texts.classList.add("task-box-texts");

    const box_texts_h1 = document.createElement('h1');
    box_texts_h1.id = `${task.id}-box_texts_h1`;

    const box_itens = document.createElement('div');
    box_itens.classList.add("task-box-itens");

    const box_itens_tag = document.createElement('p');
    box_itens_tag.classList.add("tasks-box-itens-tag");

    const box_texts_p = document.createElement('p');

    const box_button = document.createElement('button');
    box_button.id = `${task.id}-box-button`;
    box_button.classList.add("task-box-button");
    box_button.classList.add("task-btn");
    box_button.addEventListener('click', onCheckedClick);

    const img = document.createElement('img');
    img.id = `${task.id}-img`;

    box_texts_h1.textContent = task.name;
    box_itens_tag.textContent = task.tag;
    box_texts_p.textContent = "Criado em: " + task.date;
    box_button.textContent = "Concluir";
    img.src = "assets/checked.svg";

    box_itens.appendChild(box_itens_tag);
    box_itens.appendChild(box_texts_p);
    box_texts.appendChild(box_texts_h1);
    box_texts.appendChild(box_itens);
    box.appendChild(box_texts);
    box.appendChild(box_button);
    box.appendChild(img);
    if (task.checked) {
        box_button.style.display = 'none';
        box_texts_h1.classList.add('task-checked');
    } else {
        img.style.display = 'none';
        box_texts_h1.classList.remove('task-checked');
    }

    list.appendChild(box);

    return list;
}

/* CHECKED */

const onCheckedClick = (event) => {
    const id = event.target.id.split('-')[0];
    const tasks = getTasksFromLocalStorage();
    
    const updatedTasks = tasks.map((task) => {
        return (parseInt(id) === parseInt(task.id)) 
            ? {...task, checked: true }
            : task;
    });
    setTasksInLocalStorage(updatedTasks);

    document.getElementById(`${id}-box-button`).style.display = 'none';
    document.getElementById(`${id}-img`).style.display = 'block';
    document.getElementById(`${id}-box_texts_h1`).classList.add('task-checked');

    updateCheckedTasks();
}

const updateCheckedTasks = () => {
    const tasks = getTasksFromLocalStorage();
    let checkedTasks = 0;
    tasks.forEach((task) => {
        if (task.checked) {
            checkedTasks++;
        }
    });
    
    if(checkedTasks === 1) {
        document.getElementById('tasks-checked-total').innerHTML = (checkedTasks + " tarefa concluída");
    } else {
        document.getElementById('tasks-checked-total').innerHTML = (checkedTasks + " tarefas concluídas");
    }

}

/* CREATE TASK */

const getNewTaskId = () => {
    const tasks = getTasksFromLocalStorage();
    const lastId = tasks[tasks.length - 1]?.id;
    return lastId ? lastId + 1 : 1;
}

const getNewTaskData = (event) => {
    const id = getNewTaskId();
    const name = event.target.elements.name.value;
    const tag = event.target.elements.tag.value;
    const now = new Date();
    const date = now.toLocaleDateString();
    const checked = false;

    return { id, name, tag, date, checked}
}

const createTask = (event) => {
    event.preventDefault();
    document.getElementById('checked').setAttribute('disabled', true);
    const newTaskData = getNewTaskData(event);

    createTaskListItem(newTaskData);

    const tasks = getTasksFromLocalStorage();
    const updatedTasks = [
        ...tasks, 
        {id: newTaskData.id, name: newTaskData.name, tag: newTaskData.tag, date: newTaskData.date, checked: false}
    ]
    setTasksInLocalStorage(updatedTasks);

    document.getElementById('name').value = '';
    document.getElementById('tag').value = '';
    
    updateCheckedTasks();
    
    document.getElementById('checked').removeAttribute('disabled');
}

/* ON LOAD */

window.onload = function() {
    const form = document.getElementById('tasks-form');
    form.addEventListener('submit', createTask );

    const tasks = getTasksFromLocalStorage();
    tasks.forEach((task) => {
        createTaskListItem(task);
    });
    updateCheckedTasks();
}
