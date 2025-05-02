class Task {
  id;
  name;
  deadLine;
  state;

  constructor(id, name, deadLine, state) {
    this.id = id;
    this.name = name;
    this.deadLine = deadLine;
    this.state = state;
  }};

class TaskManager{
  constructor(){
    const tasksFromStorage = JSON.parse(localStorage.getItem('tasks')) || [];
    this.tasks = tasksFromStorage.map(task => new Task(task.id, task.name, new Date(task.deadLine), task.state));
  };
  printTasks() {
    let tasksHTML = ``;
    this.tasks.forEach(task => {
      tasksHTML += `        
      <tr>
          <td>${task.id}</td>
          <td>${task.name}</td>
          <td>${task.deadLine.toLocaleDateString()}</td>
          <td>${task.state}</td>
          <td>
            <div class="task-buttons">
              <button class="task-delete-button" onclick="taskManager.showDeletePopup(1,${task.id});">Delete</button>
              <button class="task-edit-button" onclick="taskManager.showEditPopup(${task.id});">edit</button>
            </div>
          </td>
        </tr>
      `
    });
    document.querySelector('.js-table-body').innerHTML = tasksHTML;
  };
  addTask(){
    const taskID = this.tasks.length + 1;
    const taskState = 'In Progress';
    const taskDeadLine = document.querySelector('.add-popup-deadLine-input').value;
    const taskName = document.querySelector('.add-popup-task-input').value;
    if(taskName === '' || taskDeadLine === '') {
      alert('the task deadline and task details are required');
    }  
    else{
      this.tasks.push(new Task(taskID, taskName, new Date(taskDeadLine), taskState));
      document.querySelector('.add-popup-section').style.display ='none';
      document.querySelector('.add-popup-deadLine-input').value = '';
      document.querySelector('.add-popup-task-input').value= '';
    }
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.printTasks();
  };
  showAddPopup(){
    document.querySelector('.add-popup-section').style.display ='flex';
  };
  closeAddPopup(){
    document.querySelector('.add-popup-section').style.display ='none';
  };
  showEditPopup(taskID){
    const taskIndex = this.tasks.findIndex(item => item.id === taskID);
    document.querySelector('.edit-popup-section').style.display ='flex';
    const task = this.tasks[taskIndex]
    document.querySelector('.edit-popup-task-input').value = task.name;
    document.querySelector('.edit-popup-state-input').value = task.state;
    document.querySelector('.edit-popup-deadLine-input').value = task.deadLine.toISOString().slice(0, 10);
    
    const submitButton = document.querySelector('.edit-popup-submit-button');
    submitButton.onclick = () => {
      this.editTask(taskIndex);
    };  
  };
  editTask(taskIndex){
    const newName = document.querySelector('.edit-popup-task-input').value;
    if (newName === ''){
      alert('the task details are required');
    }
    else{
      this.tasks[taskIndex].name = newName;
      this.tasks[taskIndex].deadLine = new Date(document.querySelector('.edit-popup-deadLine-input').value);
      this.tasks[taskIndex].state = document.querySelector('.edit-popup-state-input').value;
      document.querySelector('.edit-popup-task-input').value = null;
      document.querySelector('.edit-popup-deadLine-input').value = null;
      document.querySelector('.edit-popup-state-input').value = null;
      document.querySelector('.edit-popup-section').style.display ='none';
      localStorage.setItem('tasks', JSON.stringify(this.tasks));
      this.printTasks();
    }
  }
  closeEditPopup(){
    document.querySelector('.edit-popup-section').style.display ='none';
  };
  showDeletePopup(taskNumber , taskID = ''){
    const taskIndex = this.tasks.findIndex(item => item.id === taskID);
    document.querySelector('.delete-popup-section').style.display ='flex';
    document.querySelector('.delete-popup-message').innerHTML=`Are You Sure That You Want to Delete ${taskNumber} of tasks!`
    const submitButton = document.querySelector('.delete-popup-submit-button');
    submitButton.onclick = () => {
      this.deleteTask(taskIndex);
    };  
  }
  deleteTask(taskindex = ''){
    document.querySelector('.delete-popup-section').style.display ='none';
    if (taskindex === -1 || taskindex === '') {
      this.tasks.splice(0, this.tasks.length);
    }
    else{
      this.tasks.splice(taskindex, 1);
    };
    localStorage.setItem('tasks', JSON.stringify(this.tasks));
    this.printTasks();
  }
  closeDeletePopup(){
    document.querySelector('.delete-popup-section').style.display ='none';
  }
};

const taskManager = new TaskManager();
taskManager.printTasks();

