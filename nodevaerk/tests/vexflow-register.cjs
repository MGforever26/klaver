const Module=require('node:module'),path=require('node:path'),resolve=Module._resolveFilename;
Module._resolveFilename=function(request,...args){return request==='vexflow'?path.resolve(__dirname,'../vendor/vexflow.js'):resolve.call(this,request,...args);};
