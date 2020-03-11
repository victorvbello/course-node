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

const all = () => {
  return loadDB();
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

const update = (descriptionToUpdate, complete) => {
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

module.exports = {
  all,
  create,
  update,
};
