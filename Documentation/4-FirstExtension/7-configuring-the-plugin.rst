.. include:: ../Includes.txt

.. _configuring-the-plugin:

======================
Configuring the plugin
======================

A plugin is a content element, that can be placed on a page
like any other element (like a text element or an image).
It is a "virtual" collection of one or more actions.
In our example there is only one controller action combination,
namely ``StoreInventory->list``.
To register a plugin, we need the following code in the file
:file:`ext_localconf.php`, that we create in the top level of
our extension directory.

.. code-block:: php

    <?php
    defined('TYPO3') || die('Access denied.');

    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
        'StoreInventory',
        'InventoryList',
        [
            \Vendor\StoreInventory\Controller\StoreInventoryController::class => 'list',
        ],
        // non-cacheable actions
        [
            \Vendor\StoreInventory\Controller\StoreInventoryController::class => '',
        ]
    );

With the first line we prevent calling the PHP code in this file without TYPO3 context
(this is basically a small security measure).
The static method :php:`\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin()`
is used to configure the plugin for use in TYPO3.
The first parameter denotes the extension key in UpperCamelCase (ExtensionKey).
With the second argument, we give a unique name for the plugin (also in UpperCamelCase notation).
This is later used to identify the plugin clearly.
The third argument is an array with all allowed controller action combinations.
The array key is the fully-qualified controller class name
and the array value is a comma-separated list of all allowed actions.
In our case, this is the ``list`` action (also without the suffix ``Action``).
Thus the array :php:`[\Vendor\StoreInventory\Controller\StoreInventoryController::class -> 'list']`
allows to execute the method :php:`listAction()`
in the :php:`\MyVendor\StoreInventory\Controller\StoreInventoryController`.
All actions are cached by default. If you need to have an uncached action,
specify the controller/action combination as the fourth parameter.
In an array with the same format as the previous.
Now all actions are listed whose results should not be stored in the cache.

This concludes the configuration of the plugin.
We need to register the plugin to have it actually appear as a selectable element in the backend plugin list.
To achieve this, insert the following line into a new file :file:`Configuration/TCA/Overrides/tt_content.php`:

.. code-block:: php

    <?php

    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
        'StoreInventory',
        'InventoryList',
        'The Store Inventory List',
        'EXT:store_inventory/Resources/Public/Icons/Extension.svg'
    );


The first argument is like the method :php:`configurePlugin()` again the
extension key, and the second is the name of the plugin.
The third argument is the title of the plugin used in the select box of the content element.
After installing the extension (and clearing the cache), we can insert the plugin on a page.
Don't forget to set the sys_folder, where the products are stored as the starting point
(in our case, "Inventory") in the plugin.
Otherwise, your products are not found (see figure 4-4).

.. figure:: /Images/4-FirstExtension/figure-4-4.png
   :align: center

   Figure 4-4: Our plugin appears in the selection box of the content element.

The next call of the page with the plugin shows the inventory as a table (figure 4-5).

.. figure:: /Images/4-FirstExtension/figure-4-5.png
   :align: center

   Figure 4-5: The output of the inventory in the front end

This marks the end of our first little Extbase extension.
This example was intentionally simple to get you started.
It illustrates all the important steps and the conventions.
