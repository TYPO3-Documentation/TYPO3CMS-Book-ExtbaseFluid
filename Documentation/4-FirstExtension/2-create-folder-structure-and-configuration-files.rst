.. include:: /Includes.rst.txt
.. index::
   Extensions; Folder structure
   Extensions; Configuration files

===============================================
Create folder structure and configuration files
===============================================


Before we write the first line of code, we need to create the extension's basic infrastructure.
To allow TYPO3 to load the extension, we need some default configuration files.
Let's start by creating a folder ``store_inventory`` in the folder :file:`typo3conf/ext/`
- the folder name `store_inventory` corresponds to the unique identifier of our extension
(also known as "extension key").

.. tip::

   The extension key may only contain small letters and underscores (lower_underscore).

.. hint::

    Extensions can be stored at different places in TYPO3.
    Locally installed extensions are the rule.
    These are in the folder :file:`typo3conf/ext/`.
    System extensions are in the folder :file:`typo3/sysext/`.
    Extbase or Fluid are examples of system extensions.


The folder structure
====================

In our folder `store_inventory` we create the sub folders :file:`Classes` and :file:`Resources`.
The folder :file:`Classes` will contain all of our PHP classes.
In the folder :file:`Resources` we create two directories named :file:`Private` and :file:`Public`.
The folder :file:`Resources/Private/` will contain subfolders like
:file:`Templates`, :file:`Layouts`, :file:`Partials` and :file:`Language`.
These files are not accessible via the web browser. They are mostly used via PHP.
The folder :file:`Resources/Public/` contains subfolders like :file:`Icons`,
:file:`Css`, :file:`Js`. These files can be accessed through the web browser.

Within the folder :file:`Classes` we create the folders :file:`Controller` and :file:`Domain`.
In our example, the folder :file:`Controller` contains only one class
that will control the entire process of listing creation later.
The folder *domain* contains the two folders :file:`Model` and :file:`Repository`.
Resulting from all this, the folder structure within the extension folder
:file:`store_inventory` should look as in image 4-1.


.. figure:: /Images/4-FirstExtension/figure-4-1.png
   :align: center

   Figure 4-1: The default directory structure with the important files for the extension manager


.. index:: Files; ext_emconf.php

Configuration file :file:`ext_emconf.php`
=========================================

A single configuration file named :file:`ext_emconf.php` is required by TYPO3
to allow loading the extension. The file is located in the extension's
top-level folder (:file:`store_inventory/`). You can copy and adapt this file
from an existing extension.

The file :file:`ext_emconf.php` contains the meta-information for the
extension like title, description, status, name of the author, and more.
It is not special in any way and does not differ from the one of any other
extension. Find a complete reference in chapter :ref:`t3coreapi:extension-declaration`
of the *Core Api Reference* manual.

.. code-block:: php

   <?php

   $EM_CONF[$_EXTKEY] = [
       'title' => 'Store Inventory',
       'description' => 'An extension to manage a stock.',
       'category' => 'plugin',
       'author' => 'John Doe',
       'author_company' => 'John Doe Inc.',
       'author_email' => 'john.doe@example.com',
       'state' => 'alpha',
       'clearCacheOnLoad' => true,
       'version' => '0.0.0',
       'constraints' => [
           'depends' => [
               'typo3' => '9.5.0-9.5.99',
           ],
       ],
   ];


.. index:: Files; Resources/Public/Icons/Extension.svg

In previous versions of TYPO3, the extension icon was named :file:`ext_icon.gif`.
Starting with TYPO3 8, you can choose between PNG or SVG format.
It is recommended to call the file :file:`Extension.png` or
:file:`Extension.svg` and store it in the directory :file:`Resources/Public/Icons/`.
The icon will be displayed in the extension manager and in the TYPO3 extension repository (TER).


.. index:: Files; composer.json

Configuration file :file:`composer.json`
========================================


Next to the `ext_emconf.php` you should add a :file:`composer.json` file:

.. code-block:: php

    {
        "name": "myvendor/store-inventory",
        "authors": [
            {
               "name": "TYPO3 Core Team",
               "role": "Developer"
            }
        ],
        "type": "typo3-cms-extension",
        "description": "A Store Inventory Example for Programming with Extbase.",
        "license": "GPL-2.0-or-later",
        "autoload": {
            "psr-4": {
               "MyVendor\\StoreInventory\\": "Classes/"
            }
        },
        "require": {
            "typo3/cms-core": ">=9.5 <10.0.0"
        }
    }

The :file:`composer.json` allows loading the extension with the PHP package manager composer.

After the basic structure has been created, the extension can now
be installed in the extension manager. But first, we turn to our domain.

