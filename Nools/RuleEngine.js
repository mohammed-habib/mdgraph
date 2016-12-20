    "use strict";
    var nools = require("nools");
    var filetraverser = require('./fileTraverser');
    var readlineSync = require('readline-sync');
    //asking for the directory and the file name of the .xml file to parse
   var dir = readlineSync.question('Enter the Path to the file directory: ');
   filetraverser.readAll(dir);
   
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
               console.log(start + '  ' + end + '  [tag: source]');        
        });

        this.rule("Target", [Message, "m", "m.xmlContent.getElementsByTagName('target').length == 1"], function (facts) {
            var start = facts.m.fileName;
            var end = facts.m.xmlContent.getElementsByTagName('target')[0].childNodes[0].nodeValue;
            console.log(start + '  ' + end + '  [tag: target]');  
        });
    });
   var session = flow.getSession();
//assert your different messages
        for (var i = 0; i < filetraverser.allContent.length; ++i) {
            session.assert(new Message(filetraverser.allContent[i].nameSpace, filetraverser.allContent[i].fileName, filetraverser.allContent[i].xmlContent));
        }
    //console.log(session.getFacts());
    session.match();
  }, 2200);

   

