.. include:: ../Includes.txt


=============================
Appendix A: Coding Guidelines
=============================

Extbase and Fluid follow the principle of *Convention over Configuration*.
That means that many tasks will work automatically if you respect
certain naming conventions for classes, files and method names. Furthermore,
this principle improves the consistency and readability of your code. Thus it is
much easier for extension developers to understand how unknown extensions (based
on Extbase) work, because the structure is always the same und common tasks are
solved the same way.

With Extbase and Fluid we set quite an emphasis on the intuitive and
logical naming scheme of classes, methods and variables. Our goal is to provide
the source code as readable as possible, because the names are already
reflecting what the code does. It even happens that we change a name or
identifier several times during development for having it intuitive for as many
developers as possible.

You will notice that this is a big difference to the previous TYPO3 v4 (where
the names are often abbreviated and inconclusive) making the daily
work and understanding of the code much easier.

Generally, classes are written in ``UpperCamelCase`` and methods and variables are
written in ``lowerCamelCase``. Underscores (_) are only used in class names for the
separation of the namespace, in methods and variables they are generally not
used. In addition, the name must be detailed and meaningful; abbreviations are
to avoid.

Folder structure
----------------

Every extension based on Extbase contains certain folders in the main directory:

:file:`Classes`
   Here resides the complete source code for the extension. Only PHP files are
   allowed, each one containing exactly one class or interface. All classes (or
   interfaces) are loaded via the autoloader mechanism when needed.

:file:`Configuration`
   Here is the configuration of the extension located, that means
   flexform configuration, TCA definitions and TypoScript files. Subfolder can
   be created when they are needed or helpful.

:file:`Documentation`
   Contains the documentation of the extension. The subfolders are named according to
   the following schema: *[name of the document]/[format]/[language]*. Therefore
   you will find the extension manual normally either in the folder
   *Manual/DocBook/en* or in *Manual/OpenOffice/en/manual.sxw*.

:file:`Resources`
   Here there are the static resources of the extension. This means all files
   which are not PHP files but are necessary for the conduction of the
   extension. This might be code from libraries, template files, images,
   css files and so on.

   It is distinguished between public (:file:`Public/`) and private (:file:`Private/`)
   resources. In the folder :file:`Private/` there is a :file:`.htaccess` file,
   which is blocking direct access to non public files.

:file:`Resources/Private`
   Contains non public resources of the extension.

:file:`Resources/Public`
   Contains public resources of the extension.

   Within these two folder the authors of the extension can choose the
   structure freely, but we recommend the following structure:

:file:`Resources/Public/Media`
   This is a good place for images, CSS files or media files, which are delivered directly to the client.

:file:`Resources/Private/Templates`
   Here are the default Fluid templates for the extension (see also chapter 8).

:file:`Resources/Private/PHP`
   Contains PHP code, which is not compatible to the naming conventions like
   external PHP libraries, procedural code and so on. If you run TYPO3 in
   composer mode, you should define the autoloading for said folder in the
   `composer.json` of your extension.

   If you don't run TYPO3 in composer mode, the autoloader of TYPO3 will
   automatically search for php files in all extensions and you don't
   need to act yourself.

:file:`Tests`
   All unit tests are found here. The structure should be the same as in :file:`Classes`.
   All test classes should end with ``Test``.

:file:`ext_emconf.php`
   Contains the configuration for the extension manager of TYPO3 like metadata
   as the name, the description and the author of the extension.

:file:`ext_icon.gif`
   The icon of the extension, which will be visible in the Extension Manager.
   It should have a size of 18 x 16 px.

:file:`ext_localconf.php`
   In this file there is the configuration of the Frontend Plugins, which are
   offered by the extension (see appendix B, "Configuration of Frontend Plugins").

:file:`ext_tables.php`
   In this file you will put configuration regarding the backend.
   For more see appendix B, "Configuration of Frontend Plugins".

:file:`ext_tables.sql`
   This is a file with SQL commands for the definition of the database tables.

File and class names
--------------------

Class names in Extbase are composed with the following parts:

#. the vendor prefix. For example, if your name is ``Example``, then this part could
   be `Ex`.
#. the name of the extension in ``UpperCamelCase``. For example, if the extension-key
   is ``blog_example``, then this part of the classname is ``BlogExample``.
#. the path within the :file:`Classes/` folder down to the folder, where the file
   containing the class resides.

In table A-1 you see some naming examples for file and class names.

*Table A-1: Examples for class names*

+--------------------------------------------------------+---------------+-----------------------------------------------------+
| classname                                              | extension key | folder                                              |
+========================================================+===============+=====================================================+
| TYPO3\\CMS\\Extbase\\Exception                         | extbase       | extbase/Classes/Exception.php                       |
+--------------------------------------------------------+---------------+-----------------------------------------------------+
| TYPO3\\CMS\\Extbase\\Mvc\\Controller\\ActionController | extbase       | extbase/Classes/Mvc/Controller/ActionController.php |
+--------------------------------------------------------+---------------+-----------------------------------------------------+
| Ex\\BlogExample\\Domain\\Model\\Post                   | blog_example  | blog_example/Classes/Domain/Model/Post.php          |
+--------------------------------------------------------+---------------+-----------------------------------------------------+

Interfaces end with ``Interface``, for example ``TYPO3\CMS\Extbase\Mvc\RequestInterface``.
With abstract classes the last part of the name always begins with ``Abstract``,
for example ``TYPO3\CMSExtbase\Mvc\Controller\AbstractController``.
