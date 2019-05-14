.. include:: ../Includes.txt

.. _extension-builder-installation:

==============================
Extension Builder Installation
==============================

The Extension Builder (extkey: extension_builder) helps you build and
manage your Extbase-based TYPO3 CMS extensions.

To install this extension open the terminal, go to the directory
:file:`typo3conf/ext/` and enter:

.. code-block:: bash

   git clone https://github.com/FriendsOfTYPO3/extension_builder.git

Then you can use the *Extension Manager* to install the Extension Builder.

You can also install this extension via Composer (if you already used Composer to setup
your TYPO3 installation)::

   composer require friendsoftypo3/extension-builder
   ./vendor/bin/typo3 extension:activate extension_builder


For more information, see:

* :ref:`t3install:extension-installation` in "TYPO3 Explained"
* `Extension Builder <https://github.com/FriendsOfTYPO3/extension_builder>`__

