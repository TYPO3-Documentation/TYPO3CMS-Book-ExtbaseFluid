Create Folder Structure And Configuration Files
================================================================================================

Before we write the first line of code, we must arrange the
infrastructure of the extension. Beside the folder structure there are some
minimum needed configuration files counting. We put the unique identifier of
our extension (extension-key) as ``inventory``, and thus
we specify at the same time the name of the extension as
*Inventory*.

.. tip::

	The name of an extension is always written in
	*UpperCamelCase* (beginning with a capital letter, then
	upper and lower letters; no underscore), while the extension key may only
	contain small letters and underscore (lower_underscore). You will find an
	overview of the name conventions in appendix A, *Coding
	Guidelines*.

Extensions can be stored at different places in TYPO3. Locally
installed extensions are the rule. These are in the folder
:file:`typo3conf/ext/`. Globally installed extensions are
available to all websites using the same installation. They are stored in
:file:`typo3/ext/`. System extensions are delivered with the
TYPO3-distribution and are in the folder *typo3/sysext/*.
Extbase or Fluid are examples of system extensions. All three paths are
below the installation folder of TYPO3, in which also lies the file
index.php.

Then, in the folder for local extensions
:file:`typo3conf/ext/` we create the folder
:file:`inventory`. The name of this folder
must be written like the extension key and therefore in lower-case letters,
and where appropriate, with underscores. On the uppermost level lie the
folders *Classes* and *Resources*. The
folder :file:`Classes` contains all PHP
classes, with the exception of external PHP libraries. The folder
:file:`Resources` contains all other files
that are also processed by our extension (e.g. HTML templates) or delivered
directly to the front end (e.g. icons,javascript). Within the folder
:file:`Classes` are the folders
:file:`Controller` and
*Domain*. In our example, the folder
*Controller* contains only one class that will control
the entire process of listing creation later. The folder
*Domain* again contains the two folders
:file:`Model` and
:file:`Repository`. Resulting from all
this, the folder structure within the extension folder
*inventory/* should look as in image 4-1.

.. figure:: /Images/4-FirstExtension/figure-4-1.png
	:align: center

	Figure 4-1: The simplest directory structure with the basic files

So that the extension can be loaded by TYPO3, we require two
configuration files. These are discarded into the extension folder
:file:`inventory/` on the uppermost level. You can copy and
adapt these files from an existing extension. Later you will let them be
created by the kickstarter.

The file :file:`ext_emconf.php` contains the meta
information for the extension, e.g. the title, a description, the status,
the name of the author etc.. It does not differ to conventional extensions.
It is recommended to indicate the dependence to Extbase and Fluid (if
appropriate, also a certain version).


|	``<?php``
|	``$EM_CONF[$_EXTKEY] = array(``
|	 ``'title' => 'Inventory List',``
|	 ``'description' => 'An extension to manage a stock.',``
|	 ``'category' => 'plugin',``
|	 ``'author' => 'Jochen Rau',``
|	 ``'author_company' => '',``
|	 ``'author_email' => '',``
|	 **'dependencies' => 'extbase,fluid'**
|	 ``'state' => 'alpha',``
|	 ``'clearCacheOnLoad' => '1',``
|	 ``'version' => '0.0.0',``
|	 ``'constraints' => array(``
|	  ``'depends' => array(``
|		``'typo3' => '4.3.0-4.3.99',``
|		**'extbase' => '1.0.0-0.0.0',**
|		**'fluid' => '1.0.0-0.0.0',**
|	  ``)``
| 	 ``)``
|	``);``
|	``?>``

The file :file:`ext_icon.gif` contains the icon of the
extension. For this you can use any graphic stored in GIF format. It should
not exceed a width of 18 pixels and a height of 16 pixels. The icon appears
in the extension manager and in the extension repository (TER).

After the basic structure was constructed, the extension can already
be shown in the extension manager and can be installed. But first we turn to
our domain.

