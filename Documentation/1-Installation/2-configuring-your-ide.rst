.. include:: /Includes.rst.txt

Configuring your IDE
====================

An Extension based on Extbase consists of many files, so it is helpful
to use a PHP development environment (IDE) instead of a simple editor. Along with
syntax highlighting, an IDE offers code completion and a
direct view of the code documentation. Some development environments also
have an integrated debugger, which makes detecting errors easier and faster.
To give you an example we'll show you how to set up NetBeans and Eclipse for
Extension development. Both IDEs have comparable functionalities, so it
depends on your personal preferences which one you should use.

.. sidebar:: Sources

   The NetBeans IDE is offered for Windows, Linux and Mac OS X. We use
   NetBeans PHP, which you can download from
   *http://netbeans.org*.

   Eclipse is also available for all important Operating Systems. The
   PHP IDE is called Eclipse PDT, which you can download from
   *http://eclipse.org/pdt*.

In general you should create projects for Extbase and Fluid in NetBeans,
Eclipse or PhpStorm. You will be able to have a look at the
Extbase and Fluid source code and the documentation whenever you need
it.

Using NetBeans, in the *File* menu select
*New Project* and choose *PHP* as
category and then the entry *PHP Application with Existing
Sources*. On the next page of the wizard you can select the
Extension folder of Fluid or Extbase. If you use the development version of
Extbase or Fluid you should select the directory
*/path-to-your-typo3-installation/typo3conf/ext/extbase/*
(or *.../fluid/*). If you want to use the version shipped
with TYPO3, you'll find it at
*/path-to-your-typo3-installation/typo3/sysext/extbase/*
(or *.../fluid/*).

.. tip::

   By default NetBeans uses space chars for code indentation. And also
   the TYPO3 Coding Guidelines follow the PSR-2-standard and demand tabs for indentation.
   Make sure to configure NetBeans accordingly. Open the preferences dialog of NetBeans
   and choose the entry *Editor*. Now, in the section
   *Formatting*, make sure the option *Expand Tabs to Spaces*
   is activated and adjust the options *Number of
   Spaces per Indent* and *Tab Size* to the same
   values (e.g. 4).

In Eclipse creating projects for Extbase and Fluid will work like
this: Click on *File* → *New Project*
and choose *Create project from existing source*. Then
choose the according folder for Extbase or Fluid and provide a name for the
project. Click on *Finish* to create the project with
your settings.

In PhpStorm creating projects for Extbase and Fluid will also work like
this: Click on *File* → *New Project from Existing Files...* and
follow the create project wizard.

When developing an Extension by yourself you should also create a
dedicated project for it in NetBeans, Eclipse or PhpStorm.
