var fs = require('graceful-fs');
var fileExists = require('file-exists');
var readlineSync = require('readline-sync');
var DOMParser = require('xmldom').DOMParser;
var os = require("os");
var mkdirp = require('mkdirp');


function readItemMap(container, itemMapVal, fileName, scrDataVal){ 
  var itemLength = itemMapVal.length;
  var itemLocation = container+'/itemMap-'+fileName;
  var scriptsInItemFile = scrDataVal;
  if(scriptsInItemFile.length != 0){ //only make directory if script tag exists inside the metaData
      mkdirp(itemLocation);
      for(var k = 0; k < itemLength; k++){
          var itemName = itemMapVal[k].getAttribute('name');
          var methods = itemMapVal[k].getElementsByTagName('method');
          var scriptDataInItem = itemMapVal[k].getElementsByTagName('script');
          if(methods.length != 0){
               var specificItemDir = itemLocation+'/'+itemName;
               mkdirp(specificItemDir);
               var itemMethodName = itemName+'_';
               makeMethodFiles(specificItemDir, methods, itemMethodName);
           }
           else if(scriptDataInItem.length != 0){
              // no method tags but script tags
              mkdirp(specificItemDir);
              makeFilesWoMethod(specificItemDir, scriptDataInItem, itemName);
           }
           else{
              continue;
           }
      }
  }
}
exports.readItemMap = readItemMap;

function makeMethodFiles(itemDir, methods, itemFileName){
  var methodLength = methods.length;
  for(var i=0; i < methodLength; i++){
    var scriptDataValue = methods[i].getElementsByTagName('script');
    if(scriptDataValue == 0){
         continue;
    }
    var methodName = methods[i].getAttribute('name');
    var name = itemFileName+methodName; 
    var paramList = methods[i].getElementsByTagName('parameter');
     if((name === 'cwOnFinderSQLGet') || ( name === 'cwOnFinderSQLSel')){ //create .sql File
              var sqlData = methods[i].getElementsByTagName('script')[0].firstChild.nodeValue;
              fs.writeFile(itemDir+'/'+name+'.sql', sqlData, function(err){
                    if(err){
                    console.log('Error Message: ' + err);
                  }
                  else{
                    console.log('sql File Saved.');
                    }
               })
      }
      else{ //create .js file
            var scriptVal = methods[i].getElementsByTagName('script')[0].firstChild.nodeValue;
            //Parameters...
            if(paramList.length === 0){ //there are no parameters 
              var jsDataWoParam = 'function ' +methodName+ '(){ '+os.EOL +'   '+scriptVal +os.EOL+ '}';
              fs.writeFile(itemDir+'/'+name+'.js', jsDataWoParam, function(err) {
                       if (err) {  
                          console.log("Error message: " + err);
                     } else {
                          console.log('js File Saved.');
                     }
                })
            } 
           else { //there are parameters 
            console.log(itemFileName);
             var plength = paramList.length;
             var jsData = 'function ' +methodName+'(' ;
             for(var k = 0; k < plength; ++k){
                if(k === plength-1){
                  jsData += paramList[k].getAttribute('name');
                }
                else{
                  jsData += paramList[k].getAttribute('name') + ', ';
                }
              }
                jsData += '){'+os.EOL +'    ' +scriptVal+os.EOL +'}';   
                fs.writeFile(itemDir+'/'+name+'.js', jsData, function(err){
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

function makeFilesWoMethod(dir, scriptData, itemName){ //when there are no <method> tags but only <script> tags in metadata
  var length = scriptData.length;
  for(var i = 0; i < length; i++){
       var dataScr = scriptData[i].firstChild.nodeValue;
       dataScr = dataScr.trim();
       if(dataScr.length != 0){
         var dataVal = 'function (){ '+ os.EOL + '   ' +dataScr+os.EOL;
         fs.writeFile(dir+itemName+'_script'+[i]+'.js', dataVal, function(err){
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

