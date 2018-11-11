let {File} = require("./file");

new File(__dirname).getAllSubFilePaths().then(files => files.forEach(file => console.log(file)))