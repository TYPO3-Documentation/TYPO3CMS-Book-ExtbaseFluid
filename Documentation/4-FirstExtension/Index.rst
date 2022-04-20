.. include:: /Includes.rst.txt
.. index:: Extension store_inventory
.. _creating-store-inventory-extension:

======================================
Creating the store inventory extension
======================================

In this chapter, you learn the basics of an extension based on Extbase and Fluid.
You build a minimalistic extension, which is reduced to the necessary structures.
So you can get a first overview without being confused by details.
In the following chapters, you will learn about a more complex example,
which covers all fundamental features of Extbase and Fluid exhaustively.

You can download the extension from the TYPO3 Extension Repository:
:t3ext:`store_inventory/` or install it via composer:

.. code-block:: shell
   :caption: Execute in TYPO3 root directory

   composer req t3docs/store-inventory

.. toctree::
   :hidden:

   1-the-example-extension
   2-create-folder-structure-and-configuration-files
   3-create-the-domain-model
   4-make-products-persistent
   5-controlling-the-flow
   6-adding-the-template
   7-configuring-the-plugin
