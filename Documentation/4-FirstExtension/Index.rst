.. include:: /Includes.rst.txt
.. index:: Extension store_inventory
.. _creating-a-first-extension:

============================
Creating the first extension
============================

In this chapter, you learn the basics of an extension based on Extbase and Fluid.
You build a minimalistic extension, which is reduced to the necessary structures.
So you can get a first overview without being confused by details.
In the following chapters, we will turn to a more complex example,
to cover all fundamental attributes of Extbase and Fluid exhaustively.

You can download the extension from the `TYPO3 Extension Repository: store_inventory
<https://extensions.typo3.org/extension/store_inventory/>`__ or install it via composer:

.. code-block:: shell

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
