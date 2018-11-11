let Path = require("path");
let {File} = require("./file");

// new File(__dirname).getAllSubFilePaths().then(files => files.forEach(file => console.log(file)))
// new File(Path.resolve(__dirname, "./package-lock.json")).read().then(c => console.log(c));
// new File(Path.resolve(__dirname, "./tt.json")).write(JSON.stringify({aa: "aa"})).then(t => {
//     return t.append(JSON.stringify({bb: "bb"}));
// }).then(f=>{
//     return f.rename('ee.json');
// }).then(f => {
//     console.log(f);
//     return f.hash();
// }).then(code => {
//     console.log('--->',code);
// });

// new File(Path.resolve(__dirname,"./ee.json")).remove().then(()=>console.log('====='));

// new File(Path.resolve(__dirname, "./node_modules/colors")).copyTo(Path.resolve(__dirname, "./aa")).then(f => console.log(f)).catch(e => console.log(e));
new File(Path.resolve(__dirname, "./node_modules/colors")).moveTo(Path.resolve(__dirname, "./aa/bb")).then(f => console.log(f)).catch(e => console.log(e));