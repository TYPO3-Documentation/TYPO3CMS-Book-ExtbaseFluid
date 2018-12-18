.. include:: ../Includes.txt

Configuring and embedding Frontend Plugins
================================================================================================

The action should be called on by a frontend-plugin. We've already addressed the
configuration of a simple frontend-plugin in chapter 4 in the section
Configuring the plugin. For the purpose of our example a rudimentary plugin is
enough. To place a plugin from the backend on a page, two steps are necessary:
The plugin must be registered as a content type (plugin) and its behavior must
be configured. Both steps are resolved by two Extbase API-methods. These calls
are located in two different files.

In the file :file:`EXT:sjr_offers/ext_tables.php` you have to register every plugin as
a content element with TYPO3 using the static method registerPlugin().

.. code-block:: php

   \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
        $_EXTKEY,
        'List',
        'The Inventory List'
   );

The method `registerPlugin()` expects three arguments. The first argument is the
extension key (sjr_offers in our example). This key is the same as the directory
name of the extension.
The second parameter is a freely selectable name of the plugin (a short,
meaningful name in UpperCamelCase). The plugin name plays a significant role in
the allocation of GET- and POST parameters to the appropriate plugin:
http://localhost/index.php?id=123&ts_sjroffers_list[offer]=3. The third argument
is the label by which the plugin appears in the list of plugin in the backend.
Now the plugin is made available in the backend, we can add a plugin with the
name _Offers_ to our example.

For the second step we have to configure the behaviour of the plugin in the file
:file:`EXT:sjr_offers/ext_localconf.php`  with the static method `configurePlugin()`.
Beside the actions that have to be called on by the plugin, you also have to
specify which content will be stored in cache.

.. code-block:: php

   <?php
   if (!defined ('TYPO3_MODE')) die ('Access denied.');

   \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
        $_EXTKEY,
        'List',
        ['Inventory' => 'list']
   );

The method expects 4 arguments. The first argument is, just like the one used in
the registration process, the extension key. With the second argument, the
plugin name, Extbase can assign the configuration to the appropriate plugin.

The third argument is an array which contains all controller-action combinations
which the plugin is authorized to execute. The specification
`['Offer' => 'index']` authorizes the plugin to perform the method `indexAction()`
 in
:php:`\MyVendor\SjrOffers\Controller\OfferController`. Be aware that the name of the
controller is written without the suffix Controller and the name of the action
method without the suffix Action.

The fourth, optional argument is also an array which is composed as the previous
one. This one however contains the Controller-Action combinations which are
_not_ stored in cache. These are especially those actions that issue a form. The
methods `createAction()`  or the `updateAction()` shouldn't be explicitly used here,
because they don't produce any result code that must be stored in cache.

