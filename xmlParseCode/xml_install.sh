#!/bin/bash

# Finds all required npm modules and installs them
	egrep -o "require.*" parsexml.js | egrep -o "'.*'" | egrep -o "[a-z].*[a-z]" | egrep -v "[./\]" | while read line
	do
		echo "Installing: $line"
		npm install $line 
	done

# starts parsexml.js
node parsexml.js

# end of script