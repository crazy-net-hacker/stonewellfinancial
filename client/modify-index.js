const fs = require('fs');

const filePath = './build/index.html';

fs.readFile(filePath, 'utf8', (err, data) => {
  if (err) {
    console.error(err);
    return;
  }

  const modifiedData = data.replace(
    /<script src="main.js"/g,
    '<script src="main.js"></script><script src="other.js"></script>'
  );

  fs.writeFile(filePath, modifiedData, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }

    console.log('Successfully modified index.html');
  });
});
