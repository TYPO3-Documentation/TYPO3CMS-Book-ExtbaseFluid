.. include:: /Includes.rst.txt

.. _configuration:

=============
Configuration
=============

There are several possibilities to make your extension configurable. The
various options described here each differ in:

* the scope to what the configuration applies (extension, pages,
  plugin)
* the access level required to make the change (editor, admin)

TypoScript and Constants
========================

You can define configuration options using TypoScript.
These options can be changed via TypoScript constants in the backend.
The changes apply to the current page and all subpages.

.. seealso::

   * :ref:`typoscript_configuration`

Extension Configuration
=======================

Extension Configuration is defined in the file :file:`ext_conf_template.txt`
using TypoScript constant syntax.

The configuration options you define in this file can be changed in the
backend :guilabel:`ADMIN TOOLS > Settings > Extension Configuration`.

Use this for general options that should be globally applied to the extension.

.. seealso::

   * :ref:`t3coreapi:extension-options`

FlexForms
=========

FlexForms can be configured in the backend by editors. With FlexForms you can
configure each plugin or content element individually.

.. seealso::

   * :ref:`t3coreapi:flexforms`

FlexForms are handled in "TYPO3 Explained".
Here, we only cover options that are specific to Extbase.

Access Settings
---------------

.. important::

    If you wish to access a setting set via FlexForm from your controller via
    :php:`$this->settings`, the name of the setting must begin with **settings**
    directly followed by a dot (`.`).

.. code-block:: xml

    <settings.includeCategories>
        <TCEforms>
            <label>LLL:EXT:example/Resources/Private/Language/Backend.xlf:settings.registration.includeCategories</label>
            <config>
                <type>check</type>
                <default>0</default>
                <items type="array">
                    <numIndex index="0" type="array">
                        <numIndex index="0">LLL:EXT:bootstrap_package/Resources/Private/Language/Backend.xlf:setting.registration.includeCategories.title</numIndex>
                    </numIndex>
                </items>
            </config>
        </TCEforms>
    </settings.includeCategories>

The settings can be read using :php:`$this->settings` in an
Extbase controller action. And via :html:`{settings}` within Fluid.

.. code-block:: php

   $includeCategories = (bool) ($this->settings['includeCategories'] ?? false);


switchableControllerActions
---------------------------

With **switchableControllerActions** you can define which controller action
will be used as default action for the plugin.

.. code-block:: xml

    <switchableControllerActions>
        <TCEforms>
            <label>LLL:EXT:EXTKEY/Resources/Private/Language/Backend.xlf:settings.registration.action.title</label>
            <config>
                <type>select</type>
                <items type="array">
                    <numIndex index="0">
                        <numIndex index="0">LLL:EXT:EXTKEY/Resources/Private/Language/Backend.xlf:settings.registration.action.list</numIndex>
                        <!-- Controller -> action -->
                        <numIndex index="1">Registration->list</numIndex>
                    </numIndex>
                    <numIndex index="1">
                        <numIndex index="0">LLL:EXT:EXTKEY/Resources/Private/Language/Backend.xlf:settings.registration.action.register</numIndex>
                        <numIndex index="1">Registration->register</numIndex>
                    </numIndex>
                </items>
                <size>1</size>
            </config>
        </TCEforms>
    </switchableControllerActions>
