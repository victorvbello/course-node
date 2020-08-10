const path = require('path');
const fs = require('fs');

const VALID_MIMETYPE = ['image/gif', 'image/jpeg', 'image/webp', 'image/png'];

const isValidImage = (file = {}) => {
  const { mimetype = '' } = file;

  let error = '';
  if (!VALID_MIMETYPE.includes(mimetype)) {
    error = `invalid file type, only accept (${VALID_MIMETYPE.join(', ')})`;
  }
  return { error };
};

const moveFileToLocal = async (type = '', file = {}) => {
  const { name: fileName = '' } = file;
  if (!type || !fileName) {
    return { error: 'type or filename invalid' };
  }
  const fileNamePart = fileName.split('.');
  const finalName = `${new Date().getTime()}.${fileNamePart[1] || 'jpg'}`;
  const uploadPath = `uploads/${type}/${finalName}`;

  return file
    .mv(uploadPath)
    .then(() => {
      return { name: finalName };
    })
    .catch((error) => {
      return { error };
    });
};

const removeLocalFile = (type = '', fileName = '') => {
  if (!type || !fileName) {
    return { error: 'type or filename invalid' };
  }

  const finalPath = path.resolve(
    __dirname,
    `../../uploads/${type}/${fileName}`,
  );
  if (fs.existsSync(finalPath)) {
    fs.unlinkSync(finalPath);
  }
  return { error: 'cant not remove file' };
};

module.exports = {
  VALID_MIMETYPE,
  isValidImage,
  moveFileToLocal,
  removeLocalFile,
};
