'use strict';

// ----------------------------------- tooltip 

$(function () {
    $('[data="tooltip"]').tooltip();
});

// -----------------------------------  localStorage

let createLocalStorage = () => {
    if (localStorage.getItem('Tasks')) {
        taskArray = JSON.parse(localStorage.getItem('Tasks')); 
    } else {
        localStorage.setItem('Tasks', JSON.stringify(taskArray)); 
    }

    return taskArray;
};

let setData = () => {
    let data = JSON.stringify(taskArray);
    localStorage.setItem('Tasks', data); 
};

let getData = () => { 
    let data = JSON.stringify(taskArray);
    localStorage.getItem('Tasks', data);
};

let updateStorageData = () => {
    setData();
    getData();
};

let setAjaxDataToLocalStorage = () => {
    
    fetch('data.json') 

    .then(function(res) {
        return res.json();
    })
    .then(function(res) {
        localStorage.setItem('Data file', JSON.stringify(res)); 
    });
};

let getAjaxDataFromStorage = () => {
    let resArray = JSON.parse(localStorage.getItem('Data file')); 

    return resArray;
};

// ----------------------------------------------------------->

let createSelectPriorityInput = (array, parent) => {
    $('<select>', {
        class: 'form-control select-priority-input',
            id: "exampleFormControlSelect2",
        }).appendTo(parent);

        array.priorities.forEach(function(element) {
            $('<option>', {
                text: element,
                class: element,
            }).appendTo('#exampleFormControlSelect2');
        });
};

let createSelectStatusInput = (array) => {
    $('<select>', {
        class: 'form-control select-status-input',
            id: "exampleFormControlSelect1",
        }).appendTo('.select-status');

        array.statuses.forEach(function(element) {
            $('<option>', {
                text: element,
                class: element,
            }).appendTo('#exampleFormControlSelect1');
        });
};

let createButton = (parent, attr, value) => {
    $('<button>', {
        class: attr,
        text: value,
        }).appendTo(parent);
};

let checkTasks = () => {
    addTaskTable();
    if (taskArray.length !== 0) {
        createTableRows();
    } 
};

let addPriorities = () => {
    document.querySelector('.btn-success').addEventListener('click', function() {
        
        const checked = checValue();
        const data = getAjaxDataFromStorage();

        if (checked) {
            $('.select-priority').empty();
            $('.error-of-task').remove();
            $('.new-task-btn').toggleClass('hidden');

            $('<div>', {
                class: 'select-priority', 
                text: "Add priority",
            }).appendTo('.modal-footer');

            createSelectPriorityInput(data, '.modal-footer');
            addNewTaskButton();
            addListenerToAddNewTask();
        } else {
            return;
        }
    });
};

let checValue = () => {
    const form = document.forms.addTask;

    while (!form.elements['add-task'].value) {
        $('.error-of-task').remove();

        $('<p>', {
            class: 'error-of-task',
            html: `Put some info to this input`
        }).appendTo(form);
        return;
    } 
    return true;
};
        
let addNewTaskButton = () => {
    $('<button>', {
        class: 'add-new-task btn btn-success',
        type: "button",
        text: 'Add new task'
    }).appendTo('.modal-footer');
    
};

let addTaskTable = () => {
    $('<table>', {
        class: 'list-group list-group-flush hidden',
    }).appendTo('.wrapper');
};

let createTableRows = () => {
  $('.list-group').removeClass('hidden');

    taskArray.forEach(function(element) {
        let closeBtn = addCloseButton(element.id);
        let doneBtn = addDoneButton(element.id);
        let editBtn = addEditButton(element.id);
        let time = addTime(element.date);

        $('<div>', {
            class: 'list-group-item',
            'data-id': element.id,
            html: `<p class="inner-value">${element.value}</p>`,
        }).appendTo('.list-group'); 

        $(`.list-group-item[data-id="${element.id}"]`).append(closeBtn);
        $(`.list-group-item[data-id="${element.id}"]`).append(doneBtn);
        $(`.list-group-item[data-id="${element.id}"]`).append(editBtn);

        checkData(element);

        if (element.status === "Done" && !element.error) {
            setDoneToTask(element.id);
        } 
        
        $(`.list-group-item[data-id="${element.id}"]`).append(time);
    });
};

let checkData = (element) => {
    let data = getAjaxDataFromStorage();

    data.priorities.forEach(function(item) {
        if (item === element.priority) {
             setPriorityColor(element.priority, `.list-group-item[data-id="${element.id}"]`);
        } else {
            $(element).css("color", "black");
        }
    });
    
    for (let value of data.statuses) {
        if (value === element.status) {
             $(`.status-${element.id}`).remove();
             delete element.error;
            $(`.list-group-item[data-id="${element.id}"]`).append(createStatusBlock(element.status, element.id));
            break;
        } else {
            $(`.status-${element.id}`).remove();
            $(`.list-group-item[data-id="${element.id}"]`).append(createStatusBlock("Status is not found", element.id));
            element.error = "error";
        }
    }
};

let getDataId = () => {
     if (taskArray[taskArray.length - 1] !== undefined) {
        dataId = taskArray[taskArray.length - 1].id + 1;
    }   else {
        dataId++;
    }
   
    return dataId;
};

let setPriorityColor = (select, element) => {
    if (select === 'Minor') {
        $(element).addClass('green');
    } else if (select === "Major") {
        $(element).addClass('yellow');
    } else if (select === "High") {
        $(element).addClass('red');
    }
};

let createStatusBlock = (value, dataId) => {
    return $('<div>', {
        class: `status status-${dataId}`,
        text: `Status: ${value}`
    });
};

let setDefaultStatus = () => {
    let data = getAjaxDataFromStorage();

    data.statuses.find(function(elem) {
        if (elem === "Open (default)") {
            return "Open (default)";
        } else {
            return "There is no status";
        }
    });
    return "Open (default)";
};

let addNewTask = () => {
    const form = document.forms.addTask;
    const defaultStatus = setDefaultStatus();

    dataId = getDataId();
    let time = moment().format('LLL');

    let closeBtn = addCloseButton(dataId);
    let doneBtn = addDoneButton(dataId);
    let editBtn = addEditButton(dataId);
    let timeBlock = addTime(time);
    let statusBlock = createStatusBlock(defaultStatus, dataId);

    $('.list-group').removeClass('hidden');

    $('<div>', {
        class: 'list-group-item',
        'data-id': dataId,
        html: `<p class="inner-value">${form.elements['add-task'].value}</p>
`,
    }).appendTo('.list-group');

    setPriorityColor(document.querySelector('.select-priority-input').value, `.list-group-item[data-id="${dataId}"]`);

    $(`.list-group-item[data-id="${dataId}"]`).append(closeBtn);
    $(`.list-group-item[data-id="${dataId}"]`).append(doneBtn);
    $(`.list-group-item[data-id="${dataId}"]`).append(editBtn);
    
    $(`.list-group-item[data-id="${dataId}"]`).append(statusBlock);
    $(`.list-group-item[data-id="${dataId}"]`).append(timeBlock);

    let newTask = {
        id: dataId,
        value: form.elements['add-task'].value,
        priority: document.querySelector('.select-priority-input').value,
        status: defaultStatus,
        date: time,
    };

    taskArray.push(newTask);

    form.elements['add-task'].value = '';

    $('.select-priority').remove();
    updateStorageData();

    return dataId;
};

let addTime = (time) => {
    return $('<span>', {
        class: 'date-added',
        text: `Date and time added: ${time}`,
    });
};

let addListenerToAddNewTask = () => {
    $('.add-new-task').click(function() {
        addNewTask(); 
         
        $('.add-new-task').remove();
        $('.new-task-btn').toggleClass('hidden');
        $('select').remove();
        $('.select-priority').remove();  
    });
};

let addCloseButton = (dataId) => {
    return $('<button>', {
        type: "button",
        class: "close",
        append: `<img src="images/times-solid.svg" data-id="${dataId}" class="close-btn", width="20" height="20" alt="image close">`,
    });
};

let addDoneButton = (dataId) => {
    return $('<button>', {
        type: "button",
        class:"done",
        append: `<img src="images/check-solid.svg" data-id="${dataId}" class="done-btn" width="20" height="20" alt="image done">`,
    });
};

let addEditButton = (dataId) => {
    return $('<button>', {
        type: "button",
        class: "edit",
        append: `<img src="images/pencil-alt-solid.svg" data-id="${dataId}" class="edit-btn" width="20" height="20" alt="image edit">`,
    });
};

let getId = (element, attributeName) => {
    let value = element.getAttribute(attributeName);

    if (!value) {
        value = element.parentNode.getAttribute(attributeName);
    
          if (!value) {
              return null;
          }
      }
    
    return value;
};

// --------------------------------------------- complete an action with a task

let addListenerToActionsWithTasks = () => {
    $(document).ready(function() {

    $('.list-group').click(function(e) {

        let selectedId = parseInt(getId(e.target, 'data-id'));

        if ($(e.target).hasClass('done-btn')) {
            taskArray.find(function(element) {
                if (selectedId === element.id) {
                    setDoneToTask(selectedId);
                    return;
                }
            });
        }

        if ($(e.target).hasClass('close-btn')) {
            taskArray.find(function(element) {
                if (selectedId === element.id) {
                    setCloseToTask(selectedId);
                    return;
                }
            });
        }

        if ($(e.target).hasClass('edit-btn')) {
            taskArray.find(function(element) {
                if (selectedId === element.id) {
                    setEditToTask(selectedId, document.querySelector(`.list-group-item[data-id="${selectedId}"] .inner-value`).innerText);
                    return;
                }
            });
        }

    });
});
};

let setDoneToTask = (selectedId) => {
   if ($(`.list-group-item[data-id="${selectedId}"] .inner-value`).hasClass('line-through')) {

        $(`.list-group-item[data-id="${selectedId}"] .inner-value`).toggleClass('line-through');
         
        taskArray.find(function(element) {
            if (element.id === selectedId) {
                element.status = "In progress";
                $(`.status-${element.id}`).empty();
                $(`.status-${element.id}`).text("Status: In progress");
            }
        });
    
    } else {
        $(`.list-group-item[data-id="${selectedId}"] .inner-value`).toggleClass('line-through');
    
        taskArray.find(function(element) {
            if (element.id === selectedId) {
                element.status = "Done";
                $(`.status-${element.id}`).empty();
                $(`.status-${element.id}`).text("Status: Done");
            }
        });

    }
   updateStorageData();
};


let setCloseToTask = (selectedId) => {
    if (document.querySelector('.delete-popup')) {
        $('.delete-popup').remove();
    }

    $('<div>', {class: 'delete-popup'}).insertAfter('.list-group');
    $('<p>', {class: 'list-items', text: 'Are you sure?'}).appendTo('.delete-popup');
    createButton($('.delete-popup'), `${taskArray} cancel btn btn-success`, 'Cancel');
    createButton($('.delete-popup'), `${taskArray} confirm btn btn-danger`, 'Confirm');

    $('.delete-popup').click(function(e) {
        $('.delete-popup').empty();
        if ($(e.target).hasClass('cancel')) {
            $('.delete-popup').remove();
        } else if ($(e.target).hasClass('confirm')) {
            deleteData(selectedId); 
            $('.delete-popup').remove();
        }
        updateStorageData();
    });
};

let setEditToTask = (selectedId, value) => {

    const data = getAjaxDataFromStorage();

    $(`.list-group-item[data-id="${selectedId}"]`).empty();
    $(`.close`).remove();
    $(`.edit`).remove();
    $(`.done`).remove();

    $('<input>', {
        type: 'text', 
        class: 'edit-input',
        value: value,
        name: "edit-task"
    }).appendTo($(`.list-group-item[data-id="${selectedId}"]`));

    $('<div>', {
        class: 'select-priority', 
        text: "Edit priority",
    }).insertAfter('.edit-input');
    
    $('<div>', {
        class: 'select-status', 
        text: "Edit status",
    }).insertAfter('.edit-input');
    

    createSelectPriorityInput(data, '.select-priority');
    createSelectStatusInput(data);
    createButton($(`.list-group-item[data-id="${selectedId}"]`), 'confirm-btn');
    $(`.list-group-item[data-id="${selectedId}"] button.confirm-btn`).append(`<img src="images/check-solid.svg" data-id="${selectedId}" class="confirm-btn-img" width="20" height="20" alt="image done">`);
    
    editData(selectedId);
};

let deleteData = (selectedId) => {
    taskArray.forEach(function(element, index) {
        if (selectedId === element.id) {
            $(`.list-group-item[data-id="${selectedId}"]`).remove();
            taskArray.splice(index, 1); 
            updateStorageData();
            return;
        }
    });
};

let createInnerValue = () => {
    return $('<p>', {
            class: 'inner-value',
            text: $('.edit-input').val()
        });
};

let editData = (selectedId) => {

    $(`.list-group-item[data-id="${selectedId}"] img`).click(function() {
        
        taskArray.forEach(function(element) {
            if (selectedId === element.id) {
                element.value = $('.edit-input').val();
                element.priority = document.querySelector('.select-priority-input').value;
                element.status = document.querySelector('.select-status-input').value;
                updateStorageData();
            };
            
            setPriorityColor(element.priority, `.list-group-item[data-id="${element.id}"]`);
            
            let closeBtn = addCloseButton(element.id);
            let doneBtn = addDoneButton(element.id);
            let editBtn = addEditButton(element.id);
            let timeBlock = addTime(element.date);
            let statusBlock = createStatusBlock(element.status, element.id);

            $(`.list-group-item[data-id="${element.id}"]`).html(`<p class="inner-value">${element.value}</p>`);
            
            $(`.list-group-item[data-id="${element.id}"]`).append(closeBtn);
            $(`.list-group-item[data-id="${element.id}"]`).append(doneBtn);
            $(`.list-group-item[data-id="${element.id}"]`).append(editBtn);

            $(`.list-group-item[data-id="${element.id}"]`).append(statusBlock);
            $(`.list-group-item[data-id="${element.id}"]`).append(timeBlock);

            if (element.status === "Done") {
                $(`.list-group-item[data-id="${element.id}"] .inner-value`).toggleClass('line-through');
            }
            
        });
    });  
};