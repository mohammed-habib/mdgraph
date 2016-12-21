var fs = require('graceful-fs');
var fileExists = require('file-exists');
var readlineSync = require('readline-sync');
var DOMParser = require('xmldom').DOMParser;
var os = require("os");
var mkdirp = require('mkdirp');
var path = require('path');

//asking for the directory and the file name of the .xml file to parse
//
var dir = readlineSync.question('Enter the Path to the file directory: ');
//var file = readlineSync.question('file: ');

var allContent = new Array; //stores all the metadata files


if(fs.lstatSync(dir).isDirectory()){ //typed in directory exists
    readAll(dir);
}

// readFolder(dir) reads all the xml files that currently exists inside the folder and creates 
//an approprieate data structure to store all the xml object 
function readAll(dir){
  readFolder(dir);
  //checker(allContent);
  setTimeout(function(){
    //console.log(allContent.length);
    checker(allContent);
    //return 3;
  }, 1500);
}

exports.readAll = readAll;

function readFolder(dir){
 //readOneFile(dir+'/'+file);
   fs.readdir(dir, (err, files) => {
     files.forEach(file => {
       var pathMerge = path.join(dir, file);
       if(path.extname(pathMerge) === '.xml'){  
           readOneFile(pathMerge);
           //console.log(file);
       }

       else {

           if(fs.lstatSync(pathMerge).isDirectory()) {
               readFolder(pathMerge); 
           }
       } 
     }); 

    });
} 


function readOneFile(fileLocation){

    var dirName = path.dirname(fileLocation);
    var nameSpaceTitle = path.basename(dirName);
    //console.log(nameSpaceTitle)
    var metadataFileName = path.basename(fileLocation, '.xml'); //gives the name of the metadata file i.e. cmap_itemaction
    var xmlDoc = fs.readFileSync(fileLocation, 'utf8'); 
    var xmlData = xmlDoc.toString();
    /*var xmlToJson = parseString(xmlData, function(err, result){
        allContent.push({
        nameSpace: nameSpaceTitle, 
        fileName: metadataFileName,
        xmlContent: result
      });

    })*/

    xmlData = xmlData.replace(/\r\n/g, " ");
    allContent.push({
        nameSpace: nameSpaceTitle, 
        fileName: metadataFileName,
        xmlContent: xmlData
    });
}


function checker(allContent){
      //console.log(JSON.stringify(allContent));
      //console.log(allContent[1].xmlContent);
    content
      var filePath = path.join(dir, 'content.json');
      var allData = JSON.stringify(allContent, null, 4);
      fs.writeFileSync(filePath, allData); // writes a file 'content.json' inside the directory given above by the user
      console.log('done!');
      var len = allContent.length;
}



