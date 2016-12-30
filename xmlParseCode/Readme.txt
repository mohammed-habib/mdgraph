# XML Metadata Parser

1. what is Xml parser:

parsexml.js parses all the metaData files that exists in the given directory and creates new folders, each containing well-formatted JavaScript/sql files. These .js/.sql files contains the script values found from their corresponding metaData (xml) file.

------------------------------------------------------------------
2. How to use:

STEP 1: run the xml_install.sh script. 
   -This will install all the required npm packages and start the parsexml.js file.

STEP 2: 
    -Type the path to the desired folder/file directory and click Enter to start parsing.

STEP 3: On the completion of the program, a new folder with name: "allScriptFiles" could be found inside the directory whose path was typed in during the start of the program (metadata files directory). 
    - allScriptFiles contains folders with the name of their corresponding metaData files containing well-formatted JavaScript/Sql script files.

-----------------------------------------------------------------

-> Stucture of allScriptFiles Folder: 
  The stucture will be the same as that of the metadata directory given but in place of a metadata file (.xml) file, a folder will be created consisting of either one or both of 'js-files' folder & 'sql-files' fodler which has .js files and .sql files respectively. 
  
  A folder is only created when it finds atleast one <script></script> tag inside a metadata file to avoid the empty subfolders. 
  
  
