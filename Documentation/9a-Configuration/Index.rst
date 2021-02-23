.. include:: /Includes.rst.txt
.. index:: Configuration
.. _configuration:

=============
Configuration
=============

There are several possibilities to make your extension configurable. The
various options described here each differs in:

* the scope to what the configuration applies (extension, pages,
  plugin)
* the access level required to make the change (editor, admin)



.. index::
   TypoScript
   Configuration; TypoScript

TypoScript and constants
========================

You can define configuration options using TypoScript.
These options can be changed via TypoScript constants in the backend.
The changes apply to the current page and all subpages.

.. seealso::

   * :ref:`typoscript_configuration`

   * :ref:`t3tsref:typoscript-syntax-what-are-constants`


.. index::
   Configuration; Extension configuration
   Files; ext_conf_template.txt

Extension configuration
=======================

Extension Configuration is defined in the file :file:`ext_conf_template.txt`
using TypoScript constant syntax.

The configuration options you define in this file can be changed in the
backend :guilabel:`ADMIN TOOLS > Settings > Extension Configuration`.

Use this for general options that should be globally applied to the extension.

.. seealso::

   * :ref:`t3coreapi:extension-options`


.. index:: FlexForms

FlexForms
=========

FlexForms can be configured in the backend by editors. With FlexForms, you can
configure each plugin or content element individually.

.. seealso::

   * :ref:`t3coreapi:flexforms`

FlexForms are handled in "TYPO3 Explained".
Here, we only cover options that are specific to Extbase.


Access settings
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
