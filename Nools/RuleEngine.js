    "use strict";
    var nools = require("nools");
    var filetraverser = require('./fileTraverser');
    var readlineSync = require('readline-sync');
    var fs = require('fs');
    //asking for the directory and the file name of the .xml file to parse
   var dir = readlineSync.question('Enter the Path to the file directory: ');
   filetraverser.readAll(dir);
   var dependencyObj = new Array;

   function dependencyNode(file, dependentFile, tag){

    this.file = file;
    this.dependOn = dependentFile;
    this.tag = tag;
}

   function addDependency(start, end, tag) {
        var dependency = new dependencyNode(start, end, tag);
        dependencyObj.push(dependency);
}
   
    setTimeout(function(){
        //console.log(filetraverser.allContent[0].nameSpace);
        //console.log(filetraverser.allContent[0].fileName);
        //console.log(filetraverser.allContent[0].xmlContent);
        //var parsed = new DOMParser().parseFromString(filetraverser.allContent[0].xmlContent, 'text/xml')
    //console.log(filetraverser.allContent[0].xmlContent.getElementsByTagName('source')[0].childNodes[0].nodeValue);
       // console.log(filetraverser.allContent[0].xmlContent.getElementsByTagName('source').length);
     var Message = function (nameSpace, fileName, xmlContent) {
        this.nameSpace = nameSpace;
         this.fileName = fileName;
         this.xmlContent = xmlContent;
    };   
    var flow = nools.flow("Graph Generator", function (flow) {
        

        this.rule("Source", [Message, "m", "m.xmlContent.getElementsByTagName('source').length == 1"], function (facts) {
            var start = facts.m.fileName;
            var end = facts.m.xmlContent.getElementsByTagName('source')[0].childNodes[0].nodeValue;
            var tag = 'source';
               //console.log(start + '  ' + end + '  [tag: source]');        
               addDependency(start, end, tag);
        });

        this.rule("Target", [Message, "m", "m.xmlContent.getElementsByTagName('target').length == 1"], function (facts) {
            var start = facts.m.fileName;
            var end = facts.m.xmlContent.getElementsByTagName('target')[0].childNodes[0].nodeValue;
            var tag = 'target';
            //console.log(start + '  ' + end + '  [tag: target]'); 
            addDependency(start, end, tag); 
        });
        

        this.rule("EventhandlerToEvent", [Message, "m", "m.xmlContent.getElementsByTagName('event__handler').length == 1"], function (facts) {
            var start = facts.m.fileName;
            var end = facts.m.xmlContent.getElementsByTagName('event')[0].childNodes[0].nodeValue;
            var tag = 'EventhandlerToEvent';
            //console.log(start + '  ' + end + '  [tag: target]'); 
            addDependency(start, end, tag); 
        });

    });
   var session = flow.getSession();
//assert your different messages
        for (var i = 0; i < filetraverser.allContent.length; ++i) {
            session.assert(new Message(filetraverser.allContent[i].nameSpace, filetraverser.allContent[i].fileName, filetraverser.allContent[i].xmlContent));
        }
        session.match();
        setTimeout(function(){
            //console.log(dependencyObj);
            var filePath = './dependency.json';
            var allData = JSON.stringify(dependencyObj, null, 4);
            fs.writeFileSync(filePath, allData); 
            console.log(filetraverser.allContent.length + " files were searched.")
            console.log(dependencyObj.length + " dependencies were found.");
        }, 1000);
    //console.log(session.getFacts());
  }, 1500);

   

