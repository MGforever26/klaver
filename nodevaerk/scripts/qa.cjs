const fs=require('node:fs');
if(process.argv.includes('--clean')){for(const f of ['__qa.html','__qa.js'])fs.rmSync(f,{force:true});}
else{fs.copyFileSync('tests/browser.html','__qa.html');fs.copyFileSync('tests/browser.js','__qa.js');console.log('Open /__qa.html in the Sites preview. QA fixtures are excluded from release.');}
