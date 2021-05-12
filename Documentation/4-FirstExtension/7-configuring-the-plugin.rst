.. include:: /Includes.rst.txt
.. index::
   Frontend plugin;
   Plugin
.. _configuring-the-plugin:

======================
Configuring the plugin
======================

A plugin is a content element, that can be placed on a page
like any other element (like a text element or an image).
It is a "virtual" collection of one or more actions.
In our example there is only one controller action combination,
namely ``StoreInventory->list``.

.. index::
   Plugin; Configuration
   ExtensionUtility; configurePlugin()
   \TYPO3\CMS\Extbase; Utility\ExtensionUtility
   Files; ext_localconf.php

Plugin Configuration: :php:`ExtensionUtility::configurePlugin()`
==================================================================

To register a plugin, the following code must be inserted into the file
:file:`ext_localconf.php`, which resides in the top level of
the extension directory.

.. code-block:: php

   <?php
   // Prevent script from being called directly
   
   defined('TYPO3') or die();

   // encapsulate all locally defined variables
   call_user_func(
      function ()
      {
      \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
         'StoreInventory',
         'Pi1',
         [
            \T3docs\StoreInventory\Controller\StoreInventoryController::class => 'list',
         ],
         // non-cacheable actions
         [
            \T3docs\StoreInventory\Controller\StoreInventoryController::class => '',
         ]
      );
     }
   );


The first line prevents a calling of the PHP code in this file outside of the TYPO3 context.
The php closure and anonymous function is used to encapsulate the code and its variables.
These are a small security measures.
The static method :php:`\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin()`
is used to configure the plugin for use in TYPO3.

*  The first parameter denotes the extension name in UpperCamelCase (StoreInventory). 
   Instead of this also the extension key in lower case with underscores can be given (store_inventory).
*  With the second argument :php:`'Pi1'` (short for plugin no. 1), a unique name called **plugin name** 
   is given for the plugin (also in UpperCamelCase notation and with less than 32 characters).
   The plugin name is used to identify the plugin clearly.
*  The third argument is an array with all allowed controller action combinations.
   The array key is the fully-qualified controller class name. 
   Alternatively it would be sufficient to use the table name qualifier, which is StoreInventory in this example.
   The array value is a comma-separated list of all allowed actions.
   In this case there is only the ``list`` action (also without the suffix ``Action``).
   Thus the array :php:`[\Vendor\StoreInventory\Controller\StoreInventoryController::class -> 'list']`
   registers the method :php:`listAction()`
   in the :php:`\T3docs\StoreInventory\Controller\StoreInventoryController`.
   All actions are cached by default.
*  If an uncached action is required, an additional controller/action combination must be added as the fourth parameter.
   This array has the same format as the third parameter. 
   It must list all actions whose results should not be stored in the cache.

The first action in the action list of the first line of the configuration parameter is the default action of the plugin.
This determines the first template and its generated result to be shown in the frontend when no action 
parameter is present.

.. _registrating-the-plugin:

=======================
Registrating the plugin
=======================

.. index::
   Plugin; registration
   ExtensionUtility::registerPlugin()
   Files; Configuration/TCA/Overrides/tt_content.php

Plugin registration: :php:`ExtensionUtility::registerPlugin()`
==============================================================

The plugin must be registered to have it appear as a selectable element in the backend. 
The **plugin name** must be the same as it has been used in the plugin configuration. 
To achieve this, the following line must be inserted into the file :file:`Configuration/TCA/Overrides/tt_content.php`:

.. code-block:: php

   <?php

   call_user_func(
      function ()
      {
      \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
          'StoreInventory',
          'Pi1',
          'The Store Inventory List',
          'EXT:store_inventory/Resources/Public/Icons/Extension.svg'
      );
      }
   );


*  The first argument is like in the method :php:`configurePlugin()` again the
extension key. 
*  The second argument is the plugin name :php:`Pi1` (short for plugin no. 1).
*  The third argument is the title of the plugin used in the select box of the content element and elsewhere.
*  The forth argument is a scalable vector graphic icon.

After activating the extension (and clearing the cache), the plugin can be inserted on a page.
Don't forget to set the sys_folder, where the products are stored as the starting point
(in this case, "Inventory"). This can be done at the end of the plugin entry form in the backend and 
globally in the page configuration TSConfig::

   TCEFORM.tt_content.pages.PAGE_TSCONFIG_ID = 2

Otherwise, your products are not found (see figure 4-4).

.. figure:: Images/PluginInBackend.png
   :align: center

   Figure 4-4: Our plugin appears in the selection box of the content element.

The next call of the page with the plugin shows the inventory as a table (figure 4-5).

.. figure:: Images/PluginInFrontend.png
   :align: center

   Figure 4-5: The output of the inventory in the frontend

This marks the end of this little Extbase extension.
This example gives a small glimpse of TYPO3 programming.
It illustrates all important steps and conventions.
