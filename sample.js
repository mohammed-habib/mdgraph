"use strict";
var readlineSync = require('readline-sync');


var nools = require("nools");
 
var Message = function (message) {
    this.text = message;
};
 
var flow = nools.flow("Hello World", function (flow) {
 
    //find any message that is exactly hello world 
    flow.rule("Hello", [Message, "m", "m.text =~ /^hello\\sworld$/"], function (facts) {
        facts.m.text = facts.m.text + " goodbye";
        this.modify(facts.m);
    });
 
    //find all messages then end in goodbye 
    flow.rule("Goodbye", [Message, "m", "m.text =~ /.*goodbye$/"], function (facts) {
        console.log(facts.m.text);
    });
});

var session = flow.getSession(new Message("hello"));

session.match(function(err) {
	if (err) {
		console.error(err.stack);
	} else {
		console.log("done");
	}
	session.dispose();
})