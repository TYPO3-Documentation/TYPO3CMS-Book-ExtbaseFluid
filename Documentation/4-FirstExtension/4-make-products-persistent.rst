.. include:: ../Includes.txt

.. _persisting_products:

Make Products Persistent
========================

Now we can already create instances – therefore concrete products with individual properties
– from the class
:php:`\MyVendor\StoreInventory\Domain\Model\Product` at script run time. However, these are only available in volatile form in the memory and are deleted by PHP after the page has been created completely by TYPO3.
To have the products available over a longer time, we must
make them "permanent". Usually this happens by storing them into a
database. Therefore, first of all we create the necessary database table.

.. tip::

   Creating the database tables can also be done by the Extension Builder.

TYPO3 CMS will do this for us if we register the corresponding SQL
command in the file :file:`EXT:store_inventory/ext_tables.sql`:

.. code-block:: mysql

   CREATE TABLE tx_storeinventory_domain_model_product (
      uid int(11) unsigned DEFAULT '0' NOT NULL auto_increment,
      pid int(11) DEFAULT '0' NOT NULL,

      name varchar(255) DEFAULT '' NOT NULL,
      description text NOT NULL,
      quantity int(11) DEFAULT '0' NOT NULL,

      PRIMARY KEY (uid),
      KEY parent (pid)
   );

This SQL command creates a new table with the corresponding columns.
The columns ``uid`` and ``pid`` are used for internal administration purposes. Our product
characteristics ``name``, ``description`` and ``quantity`` appear as columns too.

The entries in the database are accessed by the backend of
TYPO3. The forms of the backend are produced on the basis of a
configuration, which is stored in a PHP array - the so-called
*Table-Configuration-Array* (shortly *TCA*).

.. tip::
   You find the documentation for the *Table-Configuration-Array* in the :ref:`TCA Reference <t3tca:start>`

Within the Extension we can access the data transparently by the repositories.
"Transparently" means that we don't have to think about the *type*
of the data's storage when accessing the repositories.

To make the backend show the product data
in a form, we must configure it for the table in the file
:file:`EXT:store_inventory/Configuration/TCA/tx_storeinventory_domain_model_product.php`.

The file returns an array with all the information TYPO3 needs to render the list and detail view for the records of this extension.

.. code-block:: php

   <?php
   return [
      'ctrl' => [
         'title' => 'LLL:EXT:store_inventory/Resources/Private/Language/locallang_db.xlf:tx_storeinventory_domain_model_product',
         'label' => 'name',
         'iconfile' => 'EXT:store_inventory/Resources/Public/Icons/Product.svg'
      ],
      'columns' => [
         'name' => [
            'label' => 'LLL:EXT:store_inventory/Resources/Private/Language/locallang_db.xlf:tx_storeinventory_domain_model_product.item_label',
            'config' => [
               'type' => 'input',
               'size' => '20',
               'eval' => 'trim'
            ],
         ],
         'description' => [
            'label' => 'LLL:EXT:store_inventory/Resources/Private/Language/locallang_db.xlf:tx_storeinventory_domain_model_product.item_description',
            'config' => [
               'type' => 'text',
               'eval' => 'trim'
            ],
         ],
         'quantity' => [
            'label' => 'LLL:EXT:store_inventory/Resources/Private/Language/locallang_db.xlf:tx_storeinventory_domain_model_product.stock_quantity',
            'config' => [
               'type' => 'input',
               'size' => '4',
               'eval' => 'int'
            ],
         ],
      ],
      'types' => [
         '0' => ['showitem' => 'name, description, quantity'],
      ],
   ];


This file comprises several sections:

* In the section ``ctrl`` we can set some basic characteristics, like the title
  or which table column is to be used as label.
* The section ``columns`` defines how each table field is diplayed and how it behaves
  in the backend.
* The section ``types`` defines in which sequence the table columns are displayed.

.. tip::

   The possibilities to impact the TCA are immense.
   You can find a complete listing of all options at :ref:`TYPO3 Core APIs <t3coreapi:start>`.

.. attention::

   In TYPO3 7 the configuration was stored in the Array ``$GLOBALS['TCA']``
   in the file :file:`EXT:store_inventory/ext_tables.php`, but the TCA configuration was
   moved to a file with the database table name suffixed with the file extension *.php* as filename.
   So here the *Coding Guidelines* can't be applied, which say filenames has to be in *UpperCamelCase*.

   If you want to overwrite the TCA of an existing database table later on, you must use the file :file:`EXT:store_inventory/Configuration/TCA/Overrides/[tablename].php`.

To define the group name for the wizard for new records of this extension you have to use a language file
in the directory :file:`EXT:store_inventory/Resources/Private/Language/`. The identifier **extension.title** is
hard-coded in the TYPO3 core and you have to use it to define your own text.

.. code-block:: xml

   <?xml version="1.0" encoding="UTF-8"?>
   <xliff version="1.0">
      <file source-language="en" datatype="plaintext" original="messages" date="2017-11-27T17:38:32Z"
           product-name="store_inventory">
         <header/>
         <body>
            <trans-unit id="extension.title">
               <source>Store Inventory Records</source>
            </trans-unit>
            <trans-unit id="tx_storeinventory_domain_model_product">
               <source>Product</source>
            </trans-unit>
            <trans-unit id="tx_storeinventory_domain_model_product.item_label">
               <source>Item Label</source>
            </trans-unit>
            <trans-unit id="tx_storeinventory_domain_model_product.item_description">
               <source>Item Description</source>
            </trans-unit>
            <trans-unit id="tx_storeinventory_domain_model_product.stock_quantity">
               <source>Stock Quantity</source>
            </trans-unit>
         </body>
      </file>
   </xliff>

After installing the extension we can create our first products in the backend.

Like shown in image 4-2, we create a sys folder that holds the products (see 1 in figure 4-2).
In this, we put a few new inventory items (see 2 in figure 4-2 and 3 in 4-3).

.. figure:: /Images/4-FirstExtension/figure-4-2.png
   :align: center

   Figure 4-2: Create a new product

.. figure:: /Images/4-FirstExtension/figure-4-3.png
   :align: center

   Figure 4-3: The new record wizard.

In this section we created a copy (or a model) of the reality, as we
transferred only a part of the properties of the real products in software,
that play a role in our domain. This model, which is abstracted of the real
world, is completely designed with this.

In order to access the objects created in the backend, we create
a repository for the products. The
``MyVendor\StoreInventory\Domain\Repository\ProductRepository`` is an
object, in wich the products are discarded. We can request a repository to find all (or
certain) products and deliver them to us. The repository class is very short
in our case:

.. code-block:: php

   <?php

   namespace MyVendor\StoreInventory\Domain\Repository;

   use TYPO3\CMS\Extbase\Persistence\Repository;

   /**
    * Class ProductRepository
    *
    * @package MyVendor\StoreInventory\Domain\Repository
    */
   class ProductRepository extends Repository
   {

   }

Our ``ProductRepository`` must be derived from
``\TYPO3\CMS\Extbase\Persistence\Repository`` and therefore inherits all methods from it. It can
remain empty in our simple example. We save the class file
:file:`ProductRepository.php` in the directory :file:`EXT:store_inventory/Classes/Domain/Repository/`.

