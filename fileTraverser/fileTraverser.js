function xmlTraverser(){
var fs = require('graceful-fs');
var fileExists = require('file-exists');
var readlineSync = require('readline-sync');
var DOMParser = require('xmldom').DOMParser;
var os = require("os");
var mkdirp = require('mkdirp');
var path = require('path');



var allContent = [];
var contentarr = [];

function traverse(dir) {        
    if(fs.lstatSync(dir).isDirectory()){ //typed in directory exists
    readFolder(dir);
        
    }
    }

// readFolder(dir) reads all the xml files that currently exists inside the folder and creates 
//an approprieate data structure to store all the xml object 


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
       checker(allContent); 
       contentarr = allContent;
    });
} 



function nsExists(allContent, nameSpaceTitle){
  var len = allContent.length;
  for(var i = 0; i < len; i++){
    if(allContent[i].name === nameSpaceTitle){
      return true;
    }
  }
  return false;
}

function getIndex(allContent, nameSpace){
  var len = allContent.length;
  for(var k = 0; k < len; k++){
    if(allContent[k].name === nameSpace){
      return k;
    }
  }
}


function readOneFile(fileLocation){
  //var len = allContent.length;
     var metadataFileName = path.basename(fileLocation, '.xml'); //name of the metaData file i.e. cmap_itemAction WITHOUT .xml
     var nameSpaceTitle = 'cwa_ecm';
     var xmlDoc = fs.readFileSync(fileLocation, 'utf8');
     var doc = new DOMParser().parseFromString(xmlDoc, 'text/xml'); //doc stores xml metadata file content
    // this "metadata" should be declared as a class outside of the function
     var metadata = {
              fileName: metadataFileName,
              xmlContent: doc
            };

     if(!(nsExists(allContent, nameSpaceTitle))){ //namespace doesn't exists
        //// this "nspace" should be declared as a class outside of the function
          var nspace = {
              name: nameSpaceTitle, 
              metadataArray: []
            };

          nspace.metadataArray.push(metadata);
          allContent.push(nspace);
     }

      else{ //namespace exists already in the allcontent array
        //console.log(allContent.length);
          var index = getIndex(allContent, nameSpaceTitle); 
          allContent[index].metadataArray.push(metadata); 
          //console.log(allcontent[index].)
      }

}


function checker(allContent){
     console.log(allContent.length);  // number of namespaces

     console.log(allContent[0].name); // name of the nameSpace

     console.log(allContent[0].metadataArray.length); // metadata files of cwa_ecm
     
     var data = allContent[0].metadataArray[23].xmlContent;
     var xmlData = '';
     xmlData += data;
     
     //console.log(xmlData);

      var methods = data.getElementsByTagName('method'); 
      var scrDataVal = data.getElementsByTagName('script');

      console.log(allContent[0].metadataArray[4].fileName); 
      console.log(methods.length);
      console.log(scrDataVal.length);
    
}
return {
    traverse: traverse
};

}

module.exports = xmlTraverser;
