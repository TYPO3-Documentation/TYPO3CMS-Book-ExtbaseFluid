Coding Guidelines
==================================

h1. Coding Guidelines

Extbase and Fluid follow the principle of @Convention over Configuration@ (as 
does FLOW3). That means that lots of task will work automatically if you respect 
the given (naming) conventions for classes, files and method names. Furtermore, 
this principle improves the consistency and readability of your code. Thus it is 
much easier for you and others to understand how extbase-based extensions work, 
because the structure is always the same und common tasks are solved the same 
way.

With Extbase, fluid and FLOW3 we set quite an emphasis on the intuitive and 
logical naming scheme of classes, methods and variables. Our goal is to provide 
the source code as readable as possible, because the names are already 
reflecting  what the code does. It even happens that we change a name or 
identifier several times during development for having it intuitive for as many 
programmers as possible.

You will notice that this is a big difference to the previous TYPO3 v4, where 
the names often are or have been abbreviated and inconclusive, making the dayly 
work and understanding of the code much easier. 

Generally, classes are written in upper camel case and methods and variables in 
lower camel case wrote. Underscores (@) are only used in class names for the 
separation of the namespace, in methods and variables they are generally not 
used. In addition, the name must be detailed and meaningful; abbreviations are
to avoid.

h2. Folder structure

Every Extbase-based extension contains certain folders in the main directory:

@Classes@

> Here resides the complete source code for the extension. Only PHP-files are allowed, each one containing exacly on class or interface. All classes (or interfaces) are loaded via the autoloader mechanism when needed.

@Configuration@
> Here is the configuration of the extension located, that means flexform-configuration, TCA-definitions and TypoScript-files. Subfolder can be created when they are needed or helpful.

@Documentation@
> Contains the documentation of the extension. The subfolders are named with the following schema: [name of the document]/[format]/[language]. Therefore you will find the extension manual normally either in the folder Manual/DocBook/en or in Manual/OpenOffice/en/manual.sxw

@Resources@
> Here there are the static resources of the extension. This means all files which are not PHP-files but are necessary for the conduction of the extension. This might be code from libraries, template-files, images, css-files and so on.
It is distinguished between public (@Public@) and private (@Private@) resources. In the folder Private/ there in an .htaccess-file, which is blocking direct access to non-public files.

@Resources/Private@
> Contains non-public resources of the extension.

@Resources/Public@
> Contains public resources of the extension.

Within these two folder the authors of the extension can choose the structure freely, but we recommend the following:

@Resources/Public/Media@
> This is a good place for images, css-files or media-files, which are delivered directly to the client.

@Resources/Private/Templates@
> Here there are the standard fluid-templates for the extension (see also chapter 8).

@Resources/Private/PHP@
> Contains PHP-Code, which is not compatible to the naming conventions like external PHP-libraries, procedural code and so on. You need to use @require@once@ manually to include the code. You are free to add additional folders as needed.

@Tests@
> All unit tests are found here. The structure should be the same as in @Classes@. All test-classes should end with @Test@.

@ext@emconf.php@
> Contains the configuration for the extension manager of TYPO3 like metadata as the name, the description and the author of the extension.

@ext@icon.gif@
> The icon of the extension, which will be visible in the Extension Manager. It should have a size of 18 x 16 px.

@ext@localconf.php@
> In this file there is the configuration of the Frontend Plugins, which are offered by the extension, see appendix B, configuration of Frontend Plugins.

@ext@tables.php@
> In this file there is the TCA-configuration and the configuration for the backend, see appendix B, configuration of Frontend Plugins.

@ext@tables.sql@
> This is a file with SQL-commands for the definition of the database tables.

h2. file- and classnames
Classnames in Extbase are composed with the following parts:

# the prefix Tx@
# the name of the extension in @UpperCamelCase@. For example, if the extension-key is blog@example, then this part of the classname is @BlogExample@.
# the path within the @Classes/@-folder down to the folder, where the file containing the class resides. / is replaced with @.

In table A-1 you see some naming-examples for file- and classnames.

classname | extension key | folder
Tx_Extbase_Dispatcher | extbase | extbase/Classes/Dispatcher.php
Tx_Extbase_MVC_Controller_ActionController | extbase | Extbase/Classes/MVC/Controller/ActionController.php
Tx_BlogExample_Domain_Model_Post | blog_example | blog_example/Classes/Domain/Model/Post.php

Interfaces end with @Interface@, for example Tx_Extbase_MVC_RequestInterface. 
With abstract classes the last part of the name always begins with @Abstract@, 
for example @Tx_Extbase_MVC_Controller_AbstractController@.