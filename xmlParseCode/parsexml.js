var fs = require('graceful-fs');
var fileExists = require('file-exists');
var readlineSync = require('readline-sync');
var DOMParser = require('xmldom').DOMParser;
var os = require("os");
var path = require('path');
var itemMap = require('./itemMap.js');

//asking for the directory and the file name of the .xml file to parse
//
//var parseWhat = readlineSync.question('Parse only one file or the whole folder containing xml files? (file / folder): ');
var dir = readlineSync.question('Enter the path to the file directory: ');



if(fs.existsSync(dir)){
  var container = path.join(dir, 'allScriptFiles');
  readFolder(dir, container);
}

var fileName; //stores fileName. e.g. cmap_ItemAction

// readFolder(dir) reads all the xml files that currently exists inside the folder and parse the metadat 
//of each file and make their respective sql and js folder containing .js and .sql files

function readFolder(dir, container){
  
    if(!(fs.existsSync(container))){
        fs.mkdirSync(container);
    }
    else if(fs.existsSync(container)){
        console.log('Error: '+container+' already exists. ');
        return;
    }

    fs.readdir(dir, (err, files) => {
  
      files.forEach(function(file) {
          if(file != 'allScriptFiles') {
              
              if(fs.lstatSync(path.join(dir, file)).isDirectory()){
                  return readFolder(path.join(dir, file) , path.join(container, file)); 
              }
              
              else if(path.extname(file) === '.xml') { // checks for xml files 
                  return readOneFile(dir, file, container);
              }
          } 
      });
   }) 
}


function readOneFile(dir, file, container){    
    
    fileName = file;
    var fileLocation = path.join(dir, file);
    startParsing(fileLocation, container);

}


// startParsing reads the metaData file and calls makeFiles if there exists a method tag
// or makeFilesWithoutMethod is there are no methos tags but only script tags
function startParsing(fileLocation, container){
    
    if(fileExists(fileLocation)){   
    
        var doc = new DOMParser().parseFromString(fs.readFileSync(fileLocation, 'utf8'), 'text/xml');
        if(doc === undefined){
            return;
        }
        var methods = doc.getElementsByTagName('method'); 
        var scrDataVal = doc.getElementsByTagName('script');
        var itemMapVal = doc.getElementsByTagName('itemMap');
        var scrLength = scrDataVal.length;
        
        if(scrLength != 0){
          var cntName = container+'/MD-'+fileName;
          
          if(!(fs.existsSync(cntName))){
            fs.mkdirSync(cntName);
          }
          
          var scrName = scrDataVal[0].getAttribute('name'); //for script_files 
          //scrName = scrName.trim(); //removes empty spaces from scrName 
          
          if(itemMapVal.length !== 0){ // there are itemMap tags 
                itemMap.readItemMap(cntName, itemMapVal, fileName, scrDataVal);
                //makeFiles(container, methods);
          }
          else if (methods.length !== 0){ //there are method tags
              makeFiles(cntName, methods);
          }
          else { // no method tags but script tags
              
              if(scrName !== undefined){ //if name exists, there can be a script tag within this script tag. i.e. metadata files with prefix 'script_'
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
        return;
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
      
         if(!(fs.existsSync(sqlDir))){
              fs.mkdirSync(sqlDir);
              var sqlData = methods[i].getElementsByTagName('script')[0].firstChild.nodeValue;
              var reqPath = path.join(sqlDir, name+'.sql');
               fs.writeFileSync(reqPath, sqlData, 'utf8');
               console.log('sql file saved.');
          }
      
      }  
      
      else{ //create .js file
         var jsDir = dir+'/jsFiles-'+fileName;
         
         if(!(fs.existsSync(jsDir))){
            fs.mkdirSync(jsDir);
         }
         
         var scriptVal = methods[i].getElementsByTagName('script')[0].firstChild.nodeValue; //script value within the script tag
         //Parameters...
          
          if(paramList.length === 0){ //there are no parameters 
            var noParamJsData = 'function ' +name+ '(){ '+os.EOL +'   '+scriptVal +os.EOL+  '}';
            fs.writeFileSync(path.join(jsDir, name+'.js'), noParamJsData, 'utf8');
            console.log('js file saved.');
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
              fs.writeFileSync(jsDir+'/'+name+'.js', jsData, 'utf8');
              console.log('js file saved.');
          }
      } 
  }
}

function makeFilesWithoutMethod(dir, scriptData){ //when there are no <method> tags but only <script> tags in metadata
    var scriptDir = dir+'/jsFiles-'+fileName;
    var length = scriptData.length;
  
    if(!(fs.existsSync(scriptDir))){
     fs.mkdirSync(scriptDir);
    }  
   
    for(var i = 0; i < length; i++){
        var checkXML = scriptData[i].firstChild
        if(checkXML === null) {
            continue;
        }
        var dataScr = checkXML.nodeValue;
        dataScr = dataScr.trim();
        
        if(dataScr.length != 0){
            var dataVal = 'function script() {' + os.EOL + '   ' +dataScr + os.EOL+ '}';
            fs.writeFileSync(scriptDir+'/script'+[i]+'.js', dataVal, 'utf8');
            console.log('js file saved.');
         }
    
    }
}
