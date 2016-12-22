/*
*
*                     XML Parser
*
*/
-------------------------------------------------------------------
-------------------------------------------------------------------

1. what is Xml parser:

parsexml.js parses all the metaData files that exists in the given directory and creates new folders, each containing well-formatted JavaScript/sql files. These .js/.sql files contains the script values found from their corresponding metaData (xml) file.

------------------------------------------------------------------
2. How to use:

STEP 1: run the xml_install.sh script. 
   -This will install all the required npm packages and start the parsexml.js file.

STEP 2: Input 'file' if only one single file has to be parsed
      	Input 'folder' if the whole folder has to be parsed
    -Type the path to the desired folder/file directory and click Enter to start parsing.

STEP 3: On the completion of the program, a new folder with name: "allScriptFiles" could be found inside the directory which contained the metadata files. 
    - allScriptFiles contains folders with the name of their corresponding metaData files containing well-formatted JavaScript/Sql script files.

-----------------------------------------------------------------
