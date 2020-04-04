'use strict';

let dataId = 0;
let taskArray = [];

setAjaxDataToLocalStorage();
createLocalStorage();

addPriorities();
checkTasks();

addListenerToActionsWithTasks();


getAjaxDataFromStorage();
setAjaxDataToLocalStorage();

