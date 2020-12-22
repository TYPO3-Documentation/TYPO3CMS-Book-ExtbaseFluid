.. include:: ../Includes.txt

==========================================
Configuring and embedding frontend plugins
==========================================

A frontend-plugin should call the action. We've already addressed the
configuration of a simple frontend-plugin in chapter 4 in the section
Configuring the plugin. For our example, a rudimentary plugin is
enough. To place a plugin on a page in the TYPO3 backend, two steps are necessary:
The plugin must be registered as a content type (plugin), and its behavior must
be configured. Two Extbase API-methods resolve both steps. These calls
are located in two different files.

In the file :file:`EXT:extension_key/ext_tables.php` you have to register every plugin as
a content element with TYPO3 using the static method :php:`registerPlugin()`.

.. this isn't text for the srj example - correct?

.. code-block:: php

   \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
        'ExtensionKey',
        'List',
        'The Inventory List'
   );

The method :php:`registerPlugin()` expects three arguments. The first argument is the
extension key in UpperCamelCase notation (`ExtensionKey` in our example). This key is the same as the directory
name of the extension.
The second parameter is a freely selectable name of the plugin (a short,
meaningful name in UpperCamelCase). The plugin name plays a significant role in
the allocation of GET- and POST parameters to the appropriate plugin:
http://localhost/index.php?id=123&tx_extensionkey_list[offer]=3. The third argument
is the plugin label in the list of plugins in the backend.
Now that the plugin is made available in the backend, we can add a plugin with the
name `List` to our example.

For the second step, we have to configure the behavior of the plugin in the file
:file:`EXT:example_extension/ext_localconf.php` with the static method :php:`configurePlugin()`.
Besides the actions that have to be called on by the plugin, you also have to
specify which content will be stored in the cache.

.. code-block:: php

   \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
       'ExampleExtension',
       'List',
       [\Vendor\ExampleExtension\Controller\InventoryController::class => 'list,detail'],
       [\Vendor\ExampleExtension\Controller\InventoryController::class => 'detail']
   );

The method expects four arguments. The first argument is, just like the one used in
the registration process, the extension key in UpperCamelCase notation. With the second argument, the
plugin name, Extbase can assign the configuration to the appropriate plugin.

The third argument is an array which contains all controller-action combinations
which the plugin is authorized to execute. The specification
:php:`[\Vendor\ExampleExtension\Controller\InventoryController::class => 'list,detail']`
authorizes the plugin to call the action methods :php:`listAction()` and :php:`detailAction()`
in :php:`\MyVendor\ExampleExtension\Controller\InventoryController`.

.. important::

   While all action methods in the controllers need the suffix `Action`, the list of actions,
   defined with :php:`configurePlugin`, do not.

The fourth, optional argument is also an array that is composed as the previous
one. However, this one contains the controller-action combinations, which are
_not_ stored in the cache. These are especially those actions that issue a form. The
methods :php:`createAction()` or the :php:`updateAction()` shouldn't be explicitly used here
because they don't produce any result code that must be stored in the cache.

