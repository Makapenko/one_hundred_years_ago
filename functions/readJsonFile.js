const fs = require('fs');

async function readJsonFile(filePath) {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        reject(err);
      } else {
        try {
          const jsonArray = JSON.parse(data);
          resolve(jsonArray);
        } catch (parseError) {
          reject(parseError);
        }
      }
    });
  });
}

module.exports = { readJsonFile }
