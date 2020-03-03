const fs = require('fs');

const makeTable = (base = 1, limit = 10) => {
  let data = '';

  for (let i = 1; i <= limit; i++) {
    data += `${base} * ${i} = ${base * i}\n`;
  }

  return data;
};

const listeTable = (base = 1, limit = 10) => {
  const data =  makeTable(base, limit);
  console.log(data);
};

const createFileTable = (base = 1, limit = 10) => {
  return new Promise((resolve, reject) => {

    if(!Number(base)){
      reject('La base no es valida');
    }

    const data =  makeTable(base, limit);

    fs.writeFile(`files/table-${base}-limit-${limit}.txt`, data, error => {
      if (error) {
        reject(error);
        return;
      }
      resolve(`table-${base}-limit-${limit}.txt`);
    });
  });
};

module.exports = {
  createFileTable,
  listeTable,
};
