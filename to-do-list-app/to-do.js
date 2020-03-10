const fs = require('fs');
const colors = require('colors');

const toDoLis = [];

const saveDB = data => {
  const dataToSave = JSON.stringify(data);
  fs.writeFile('./db.json', dataToSave, error => {
    if(error) {
      throw new Error('Error on save task', error);
    }
  })
}

const create = description => {
  const toDo = {
    description,
    complete: false,
  };
  toDoLis.push(toDo);
  saveDB(toDoLis);
};

module.exports = {
  create,
};
