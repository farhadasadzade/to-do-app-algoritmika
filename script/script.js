const addBtn = document.querySelector('.wrapper-addtaskbtn')
const clearInput = document.querySelector('.wrapper-delete')
const sortBtn = document.querySelector('.wrapper-sortbtn')

const newTask = document.querySelector('.wrapper-newtask')
const input = document.querySelector('.wrapper-input')
const taskList = document.querySelector('.wrapper-displaytasks')

let allTasks = document.querySelectorAll('.wrapper-taskitem')

let canAdd = true
addBtn.addEventListener('click', () => {
    if(canAdd){
        if(input.value.length != 0){
          const task = document.createElement('div')
          task.classList.add('wrapper-taskitem')
          taskList.appendChild(task)
          task.setAttribute('draggable', 'true')
          task.innerHTML = `<p>${input.value}</p>
          <div class="wrapper-btns">
            <button class="wrapper-taskedit">E</button>
            <button class="wrapper-taskdelete">X</button>
          </div>`
          input.value = ''
          canAdd = false
          newTask.style.display = 'none'

          allTasks = document.querySelectorAll('.wrapper-taskitem')
        }else {
          alert('Task boshdur')
        }
    }else {
      newTask.style.display = 'flex'
      canAdd = true
    }

    allTasks.forEach((e) => {
      e.querySelector('.wrapper-btns .wrapper-taskdelete').addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        event.target.parentNode.parentNode.remove()
        allTasks = document.querySelectorAll('.wrapper-taskitem')
        if(allTasks.length == 0){
          newTask.style.display = 'flex'
          canAdd = true
          sortBtn.querySelector('img').src = 'icons/asc-gray.png'
        }
      })

      e.querySelector('.wrapper-btns .wrapper-taskedit').addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        let name = e.querySelector('p')
        const newInput = document.createElement('input')
        
        if(event.target.innerHTML == 'E'){
          let oldName = name.innerHTML
          name.remove()
          newInput.value = oldName
          e.insertBefore(newInput, e.querySelector('.wrapper-btns'))
          event.target.innerHTML = '✓'
        }else {
          const newName = document.createElement('p')
          newName.innerHTML = e.querySelector('input').value
          e.insertBefore(newName, e.querySelector('.wrapper-btns'))
          e.querySelector('input').remove()
          event.target.innerHTML = 'E'
        }
      })

      e.addEventListener('dragstart', (e) => {
        // console.log("dragstart event has been fired");
        e.target.classList.add('dragging');
      })
      e.addEventListener('dragend', (e) => {
        e.target.classList.remove('dragging');
        // console.log("dragend event has been fired too");
      })
    })
})

clearInput.addEventListener('click', (event) => {
  input.value = ''
})

let positionObj = { offset: Number.NEGATIVE_INFINITY }

function distanceBetweenItemPositionAndDroppedPosition(item, droppedPosition) {
    const rect = item.getBoundingClientRect();
    return (droppedPosition - (rect.top + rect.height / 2));
}

taskList.addEventListener('dragover', (e) => {
    e.preventDefault()
})
taskList.addEventListener('drop', (e) => {
        e.preventDefault();
        // console.log("items has been dropped")
        const newDraggables = Array.from(document.querySelectorAll('.wrapper-taskitem:not(.dragging'));
        positionObj = { offset: Number.NEGATIVE_INFINITY }
        newDraggables.forEach(item => {
            let offset = distanceBetweenItemPositionAndDroppedPosition(item, e.clientY);
            if (offset < 0 && offset > positionObj.offset) {
                positionObj.offset = offset;
                positionObj.element = item;
            }
        })
        const dragging = document.querySelector('.dragging');
        taskList.insertBefore(dragging, positionObj.element)
})

sortBtn.addEventListener('click', (event) => {
  var rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
  switching = true;

  dir = "asc";

  while (switching) {

    switching = false;
    rows = taskList.childNodes;
    for (i = 1; i < (rows.length - 1) ; i++) {
      shouldSwitch = false;
      x = rows[i].querySelector('p');
      y = rows[i + 1].querySelector('p');
      if (dir == "asc") {
        if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          sortBtn.querySelector('img').src = 'icons/asc-black.png'
          break;
        }
      } else if (dir == "desc") {
        if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
          shouldSwitch = true;
          sortBtn.querySelector('img').src = 'icons/desc-black.png'
          break;
        }
      }
    }
    if (shouldSwitch) {
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
      switchcount ++;
    } else {
      if (switchcount == 0 && dir == "asc") {
        dir = "desc";
        switching = true;
      }
    }
  }
})
