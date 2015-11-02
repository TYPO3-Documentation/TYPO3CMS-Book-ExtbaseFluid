.. include:: ../Includes.txt

More helpful Extensions
=======================


In the following we short want to present some helpful extensions which are helpful by the development of extensions. Some extensions of these (like the first four presented) are maintained by the extbase team and others are developed by own teams.

blog_example
------------

This blog example is described in this book in detail. It's an introductory example which has many Facets and Features of Extbase and Fluid. It's found in TER with the extension key *blog_example* or in the subversion *https://svn.typo3.org/TYPO3v4/CoreProjects/MVC/blog_example/trunk/*.

viewhelpertest
--------------

This extension all Fluid-ViewHelper and its usage is demonstrated. It will be used for testing for fluid distribution by the fluid developer team. It's also helpful to understand the usage of ViewHelpers in practical examples. It's found in the subversion repository under *https://svn.typo3.org/TYPO3v4/CoreProjects/MVC/viewhelpertest/*.

extension_builder
-----------------

The Extension Builder helps you build and manage your Extbase-based TYPO3 CMS extensions.
It's available from the TER with the extension key *extension_builder*.

doc_extbase
-----------

The extension *doc_extbase* consists of a documentation of extbase and a API reference. Also this extension can be found in TER or in subversion *https://svn.typo3.org/TYPO3v4/CoreProjects/MVC/doc_extbase/*.

devlog
------

The extension *devlog* (in TER available) can used for logging the program sequence. All log messages are clear structured in the backend module. This extension is especially helpful if no debug output is allowed in the frontend, eq. live systems.

To log data you can use the method *t3lib_div::devlog($message, $extensionKey, $severity, $data)*. At this *$message* is the message which sould logged, *$extensionKey* is the extension key of the running extension, *$severity* is a number between -1 and 3 which specify the severity of an error and *$data* is an optional array which can also be logged.

More information can be found in the online documentation of the extension *devlog* in TER.

PHPUnit
-------

This extension enabled the running of automatic unit test in TYPO3 backend. In TER it can be found with the extension key *phpunit*. In the section *test driven development* in chapter 2 *The Basics* there is the usage of this extension in greater details.
