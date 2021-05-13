.. ---------------------------------------
.. Review information for this page:
.. * Review Status: ok
.. * Last reviewed: May 17th, 2019 for TYPO3 version 9.5.7
.. ----------------------------------------

.. include:: /Includes.rst.txt

====================
Installation & setup
====================

To follow this documentation, you must have TYPO3 up-and-running.

Check out the "Installation & upgrade guide" for how to
:ref:`setup a TYPO3 installation with Composer <t3install:install-via-composer>`

The system extensions **extbase** and **fluid** are required.

.. index:: Extension builder

Extension builder
=================

Extension key: extension_builder

The `Extension Builder <https://extensions.typo3.org/extension/extension_builder>`__
helps you build and manage your Extbase
based TYPO3 CMS extensions - it provides a GUI to kickstart
your extension - however, note that you should still familiarize
yourself with the files generated and their uses.

The extension can be installed via composer, traditionally or
by cloning the source.

Via composer:

.. code-block:: bash

   composer require friendsoftypo3/extension-builder

To install the extension in the "traditional" way, go to the
extension manager and get the extension "extension_builder" from TER.

To install this extension by cloning the source, open the terminal
and go to the directory :file:`typo3conf/ext/` and enter:

.. code-block:: bash

   git clone https://github.com/FriendsOfTYPO3/extension_builder.git

To install this extension by downloading the source, open the url 
`Extension Builder <https://extensions.typo3.org/extension/extension_builder>`__. There you can
download a ZIP file, which you can import directly into the *Extension Manager*. Alternatively
you copy the unpacked extension folder to the directory :file:`typo3conf/ext/`.

Then you can use the *Extension Manager* to activate the Extension Builder.


