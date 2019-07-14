.. ---------------------------------------------------
.. Review information for this page:
.. Review Status: ok
.. Last reviewed: July 14 2019 for TYPO3 version 9.5.7
.. ---------------------------------------------------

.. include:: ../Includes.txt

.. _extension-builder-installation:

==============================
Extension Builder Installation
==============================

The `Extension Builder <https://extensions.typo3.org/extension/extension_builder/>`__
(extkey: extension_builder) helps you build and
manage your Extbase-based TYPO3 CMS extensions.

Without Composer
================

.. important::

   The version for TYPO3 9 and above is currently not available via the
   TYPO3 Extension Repository (TER) and should not be installed using
   the Extension Manager. That is why we recommend to install it via
   `git clone`.


To install this extension open the terminal, go to the directory
:file:`typo3conf/ext/` and enter:

.. code-block:: bash

   git clone https://github.com/FriendsOfTYPO3/extension_builder.git

Then you can use the *Extension Manager* to activate the Extension Builder.

With Composer
=============

You can also install this extension via Composer (if you already used Composer to setup
your TYPO3 installation)::

   composer require friendsoftypo3/extension-builder
   ./vendor/bin/typo3 extension:activate extension_builder


For more information, see:

* :ref:`t3install:extension-installation` in "TYPO3 Explained"
* `Extension Builder <https://github.com/FriendsOfTYPO3/extension_builder>`__

