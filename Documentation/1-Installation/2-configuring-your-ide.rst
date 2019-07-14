.. ---------------------------------------------------
.. Review information for this page:
.. Review Status: ok
.. Last reviewed: July 14 2019 for TYPO3 version 9.5.7
.. ---------------------------------------------------

.. include:: ../Includes.txt

====================
Configuring your IDE
====================

An Extension based on Extbase consists of many files, so it is helpful
to use a PHP development environment (IDE) instead of a simple editor. Along with
syntax highlighting, an IDE offers code completion and a
direct view of the code documentation. Some development environments also
have an integrated debugger, which makes detecting errors easier and faster.

For extension development with Extbase and Fluid, we recommend that your IDE
has the following minimal features:

* syntax highlighting
* code completion
* jump to definition of a class, function
* view function signature as hint
* error detection
* Live templates (aka live snippets) to configure some reusable code templates
* support for Coding Guidelines (use PSR-2)
* integrated debugger
* support for TYPO3 specific formats, such as Fluid or TypoScript. This is available
  as add-on for some IDEs (PhpStorm, Visual Studio Code)



PhpStorm
========

There are some TYPO3 plugins available for PhpStorm. You can find a list of
recommended plugins and tips for setting up PhpStorm for TYPO3 development
in :ref:`t3contrib:phpstorm-setup` of the Core Contribution Guide. The
recommended setup can be used for the development of third party extensions
based on Extbase / Fluid as well.


Visual Studio Code
==================

There are also several `TYPO3 extensions <https://marketplace.visualstudio.com/search?term=typo3&target=VSCode&category=All%20categories&sortBy=Relevance>`__
available for Visual Studio Code.