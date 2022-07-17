const fs = require('fs');
const path = require('path');

async function createList(src, listName, filename) {
  const list = [];

  await readDirs(src, list);

  const output = `export const ${listName} = ${JSON.stringify(list)}`;

  fs.writeFileSync(path.resolve(__dirname, '../src/Game') + '/' + filename + '.js', output);

  // console.log('finish')
}

async function readDirs(dir, list) {
  const dirPath = path.resolve(__dirname, '../static/' + dir);
  const files = fs.readdirSync(dirPath);

  for (const file of files) {
    const stat = fs.statSync(dirPath + '/' + file);
    if (stat.isFile()) {
      if (!(/\.jpg|\.png/).test(path.extname(dirPath + file))) continue;
      let prefix = dir;
      prefix = prefix.split(dir).join('');
      const url = dir + file;
      list.push({name: prefix + file.split('.')[0], url});
    }
    if (stat.isDirectory()) {
      await readDirs(dir + file + '/', list);
    }
  }
}

createList('', 'resources', 'resources');
