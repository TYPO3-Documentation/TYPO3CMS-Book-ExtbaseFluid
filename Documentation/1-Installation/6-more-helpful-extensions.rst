.. include:: ../Includes.txt

More helpful Extensions
=======================


In the following we want to present some extensions which are helpful for the development of extensions. Some of these extensions (like the first four presented) are maintained by the extbase team and others are developed by their own teams.

blog_example
------------

This blog example is described in this book in detail. It's an introductory example which has many Facets and Features of Extbase and Fluid. It's found in TER with the extension key *blog_example* or in the git repository at *https://git.typo3.org/TYPO3CMS/CoreProjects/MVC/blog_example.git*.

viewhelpertest
--------------

This extension all Fluid-ViewHelper and its usage is demonstrated. It will be used for testing for fluid distribution by the fluid developer team. It's also helpful to understand the usage of ViewHelpers in practical examples. It's found in the git repository under *https://git.typo3.org/TYPO3CMS/CoreProjects/MVC/viewhelpertest.git*.

extension_builder
-----------------

The Extension Builder helps you build and manage your Extbase-based TYPO3 CMS extensions.
It's available from the TER with the extension key *extension_builder*.

doc_extbase
-----------

The extension *doc_extbase* consists of a documentation of extbase and an API reference. Also this extension can be found in TER or in subversion *https://svn.typo3.org/TYPO3v4/CoreProjects/MVC/doc_extbase/*.

devlog
------

The extension *devlog* (available in TER) can used for logging the program sequence. All log messages are clearly structured in the backend module. This extension is especially helpful if no debug output is allowed in the frontend, eq. live systems.

To log data you can use the method *GeneralUtility::devlog($message, $extensionKey, $severity, $data)*, where *$message* is the message which should be logged, *$extensionKey* is the extension key of the running extension, *$severity* is a number between -1 and 3 which specifies the severity of an error, and *$data* is an optional array which can also be logged.

More information can be found in the online documentation of the extension *devlog* in TER.

PHPUnit
-------

This extension enables the running of automatic unit tests in the TYPO3 backend. In TER it can be found with the extension key *phpunit*. In chapter 2 *Basic Principles*, the section *Test-Driven Development*  covers the usage of this extension in greater detail.
