const fs = require('fs');
const colors = require('colors');

const saveDB = data => {
  const dataToSave = JSON.stringify(data);
  fs.writeFile('./db.json', dataToSave, error => {
    if (error) {
      throw new Error('Error on save task', error);
    }
  });
};

const loadDB = () => {
  try {
    return require('./db.json');
  } catch {
    return [];
  }
};

const all = (complete = false) => {
  const list = loadDB();
  const listFiltered = list.filter(task => {
    const { complete: taskCompleted } = task;
    return taskCompleted === complete;
  });
  return listFiltered;
};

const create = description => {
  const toDoLis = loadDB();
  const toDo = {
    description,
    complete: false,
  };
  toDoLis.push(toDo);
  saveDB(toDoLis);
};

const update = (descriptionToUpdate, complete = false) => {
  const toDoLis = loadDB();
  const updateIndex = toDoLis.findIndex(item => {
    const { description } = item;
    return description.toLowerCase() === descriptionToUpdate.toLowerCase();
  });
  if (updateIndex < 0) {
    return false;
  }
  toDoLis[updateIndex].complete = complete;
  saveDB(toDoLis);
  return true;
};

const remove = descriptionToUpdate => {
  const toDoLis = loadDB();
  const newList = toDoLis.filter(item => {
    const { description } = item;
    return description.toLowerCase() !== descriptionToUpdate.toLowerCase();
  });
  if (toDoLis.length !== newList.length) {
    saveDB(newList);
    return true;
  }
  return false;
};

module.exports = {
  all,
  create,
  update,
  remove,
};
