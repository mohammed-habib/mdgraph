var fs = require('graceful-fs');
var fileExists = require('file-exists');
var readlineSync = require('readline-sync');
var DOMParser = require('xmldom').DOMParser;
var os = require("os");
var mkdirp = require('mkdirp');
var itemMap = require('./itemMap.js');

//asking for the directory and the file name of the .xml file to parse
//
var parseWhat = readlineSync.question('Parse only one file or the whole folder containing xml files? (file / folder): ');
var dir = readlineSync.question('Enter the path to the file directory: ');

// container is the location to write all the folders/files to
var container = dir+'/allScriptFiles';

if(parseWhat == 'file'){
    var container = dir+'/allScriptFiles';
    var file = readlineSync.question('Enter the File Name: ');
    readOneFile(dir, file, container);
 }
else if(parseWhat == 'folder'){ 
    var container = dir+'/allScriptFiles';
    readFolder(dir, container);
}

var fileName; //stores fileName. e.g. cmap_ItemAction

// readFolder(dir) reads all the xml files that currently exists inside the folder and parse the metadat 
//of each file and make their respective sql and js folder containing .js and .sql files
function readFolder(dir, container){
  mkdirp(container, function(err){
   if(err){
     console.log('Error Message: ' +err);
    }
  }); 
  fs.readdir(dir, (err, files) => {
     files.forEach(file => {
       var fileLen = file.length; 
       var suffix = file.substr(fileLen-4, fileLen-1); 
       if(suffix == '.xml'){ // checks for xml files 
           readOneFile(dir, file, container);
       }
       else if((fs.lstatSync(dir+'/'+file).isDirectory()) && (file != 'allScriptFiles')) {
           readFolder(dir+'/'+file, container+'/'+file); 
       } 
     });
   }) 
}


function readOneFile(dir, file, container){    
   //fileLocation is the exact location of the xml file
   var fileLocation = getFileLocation(dir, file);
   startParsing(fileLocation, container);
}

//getFileLocation returns the exact fileLocation. C://../../cmap_Iac.xml
function getFileLocation(dir, file){
   var fileLen = file.length;
   //xmlCheck is used to check if the last 4 characters of the file input are '.xml' or not
   var xmlCheck = file.substr(fileLen-4, fileLen-1);
  if(xmlCheck === '.xml'){   //if the user typed in the file name with .xml already attached at the back
      fileName = file.substring(0, fileLen-4);
      return dir + '/'+file;
    }
    else {
      fileName=file;
      return dir + '/' + file + '.xml';
    } 
}

// startParsing reads the metaData file and calls makeFiles if there exists a method tag
// or makeFilesWithoutMethod is there are no methos tags but only script tags
function startParsing(fileLocation, container){
    if(fileExists(fileLocation)){
        var xmldoc = fs.readFileSync(fileLocation, 'utf8');
        var doc = new DOMParser().parseFromString(xmldoc, 'text/xml');
        if(doc === undefined) {
	   return;
	}
	var methods = doc.getElementsByTagName('method'); 
        var scrDataVal = doc.getElementsByTagName('script');
        var itemMapVal = doc.getElementsByTagName('itemMap');
        var scrLength = scrDataVal.length;
        if(scrLength != 0){
          var cntName = container+'/File-'+fileName;
          mkdirp(cntName);
           var scrName = scrDataVal[0].getAttribute('name');
           scrName = scrName.trim(); //removes empty spaces from scrName 
           if(itemMapVal.length !== 0){ // there are itemMap tags 
                itemMap.readItemMap(cntName, itemMapVal, fileName, scrDataVal);
                //makeFiles(container, methods);
            }
            else if (methods.length !== 0){ //there are method tags
              makeFiles(cntName, methods);
            }
            else { // no method tags but script tags
               if(scrName.length != 0){ //if name exists, there can be a script tag within this script tag. i.e. metadata files with prefix 'script_'
                   makeFiles(cntName, scrDataVal);
               }
               else{
                   makeFilesWithoutMethod(cntName, scrDataVal);
               }
         }
       }
     }
     else { //file location doesn't exist
       console.log('File not found at '+fileLocation);
    }
}

//nameExists returns true if the name exists in nameArr, false otherwise
function nameExists(nameArr, name){
   var lengthArr = nameArr.length; 
   for(var j =0 ; j < lengthArr; j++){
    if(nameArr[j] == name){
      return true;
    }
   }
   return false;
}

//makeFiles(methods) reads the metadata file and creates the appropriate .js and.sql files
//methods is a list of all the method tags found inside the metadata file
function makeFiles(dir, methods){
  var length = methods.length; 
  var nameArr = [];
  for(var i = 0; i < length; ++i){ 
      var scriptDataValue = methods[i].getElementsByTagName('script');
      if(scriptDataValue.length == 0){
         continue;
      } 
      var name = methods[i].getAttribute('name');
      name = name.replace('.', "_"); 
      if(nameExists(nameArr, name)){ //if nameExists(arr, name) returns true
          name = name+i;
      }
      nameArr.push(name);
      var paramList = methods[i].getElementsByTagName('parameter');
      var sqlDir = dir+'/sqlFiles-'+fileName;
      if((name === 'cwOnFinderSQLGet') || ( name === 'cwOnFinderSQLSel')){ //create .sql File
         if(!(fileExists(sqlDir))){
              mkdirp(sqlDir);
         }
         var sqlData = methods[i].getElementsByTagName('script')[0].firstChild.nodeValue;
         fs.writeFile(sqlDir+'/'+name+'.sql', sqlData, function(err){
              if(err){
                console.log('Error Message: ' + err);
              }
              else{
                console.log('sql File Saved.');
                }
          })
       }
      else{ //create .js file
         var jsDir = dir+'/jsFiles-'+fileName;
         mkdirp(jsDir, function(err){
            if(err){
              console.log('Error Message: ' +err);
            }
         });
         var scriptVal = methods[i].getElementsByTagName('script')[0].firstChild.nodeValue; //script value within the script tag
         //Parameters...
         if(paramList.length === 0){ //there are no parameters 
            var noParamJsData = 'function ' +name+ '(){ '+os.EOL +'   '+scriptVal +os.EOL+  '}';
            fs.writeFile(jsDir+'/'+name+'.js', noParamJsData, function(err) {
                   if (err) {  
                       console.log("Error message: " + err);
                   } else {
                       console.log('js File Saved.');
                   }
             })
          } 
          else { //there are parameters 
              var plength = paramList.length;
              var jsData = 'function ' +name+'(' ;
              for(var k = 0; k < plength; ++k){
                  if(k === plength-1){
                      jsData += paramList[k].getAttribute('name');
                  }
                  else{
                      jsData += paramList[k].getAttribute('name') + ', ';
                  }
              }
              jsData += '){'+os.EOL +'    ' +scriptVal +os.EOL+ '}';   
              fs.writeFile(jsDir+'/'+name+'.js', jsData, function(err){
               if(err){
                  console.log('Error Message: ' + err);
               }
                 else{
                  console.log('js File Saved.');
               }
              })
          }
      } 
  }
}

function makeFilesWithoutMethod(dir, scriptData){ //when there are no <method> tags but only <script> tags in metadata
  var scriptDir = dir+'/jsFiles-'+fileName;
  var length = scriptData.length;
  mkdirp(scriptDir, function(err){
          if(err){
              console.log('Error Message: ' +err);
          }
    });
   for(var i = 0; i < length; i++){
   	var checkXML = scriptData[i].firstChild 
	if(checkXML === null) {
	   continue;
	}
        var dataScr = checkXML.nodeValue;
        dataScr = dataScr.trim();
        if(dataScr.length != 0){
           var dataVal = 'function script() {' + os.EOL + '   ' +dataScr + os.EOL+ '}';
           fs.writeFile(scriptDir+'/script'+[i]+'.js', dataVal, function(err){
                  if(err){
                    console.log('Error Message: ' + err);
                  }
                  else{
                    console.log('js File Saved.');
                  }
           })
         }
    }
}
