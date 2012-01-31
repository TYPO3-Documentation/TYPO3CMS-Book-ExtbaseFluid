Make Products Persistent
================================================

From the class
:class:`Tx_Inventory_Domain_Model_Product`, now we already can
generate instances – therefore concrete products with individual properties
– at script run time. These are available however only in volatile form in
the memory and are deleted by PHP after the page was produced completely by TYPO3.
So that the products are available over a longer time, we must
make it "durable". Usually this happens in that they are stored into a
database. Therefore first of all we create the database table necessary for
that.

.. tip::

	The creating of the database tables can be done by the Kickstarter.
	In TYPO3 V5, these steps are completely omitted.

TYPO3 will do this for us if we register the corresponding SQL
command in the file :file:`EXT:inventory/ext_tables.sql`::

    CREATE TABLE tx_inventory_domain_model_product ( 
		uid int(11) unsigned DEFAULT '0' NOT NULL auto_increment,
		pid int(11) DEFAULT '0' NOT NULL, 

		name varchar(255) DEFAULT '' NOT NULL, 
		description text NOT NULL, 
		quantity int(11) DEFAULT '0' NOT NULL, 

		PRIMARY KEY (uid), 
		KEY parent (pid), 
	);

This SQL command designs a new table with the corresponding columns.
The columns ``uid`` and ``pid`` serve to the internal administration. Our product
characteristics ``name``, ``description`` and ``quantity`` appear as columns again.

The entries in the database are accessed by the Backend of
TYPO3. The forms of the Backend are produced on the basis of a
configuration, that is stored in a PHP array, the so-called
*Table-Configuration-Array* (shortly *TCA*).

Within the Extension we can access the data transparently by the repositories.
"Transparently" means that we don't have to thought about the *type*
of the storage of the data when accessing the repositories.

So that the Backend now, how it should show the product data
in a form, we must configure this for the table in the file
:file:`EXT:inventory/ext_tables.php`. This is stored in the Array ``$TCA`` under the
table name as a key in the configuration. This comprises several sections. In
the section ``ctrl``, basic characteristics are how the table name or the
statement which table column the label is supposed to be taken for the
entries. In the section ``columns`` is described for each table column how this
in that is supposed to be shown in the Backend. The section type defines, in
which sequence the table columns are indicated, and like this where
appropriate arranged.

.. tip::

	The possibilities to impact the TCA the edition in that
	Backend, are immense. In the frame these beeches we only can tear this. You
	find a fully permanent listing of all option online at
	:file:`http://typo3.org/documentation/document-library/core-documentation/doc_core_api/4.3.0/view/4/1/`.
	In more extensive Extensions, one would evacuate the sections ``columns`` and
	``type`` out of performance reasons also into an own file :file:`tca.php`. In our
	example, this minimal configuration should suffice however. 

::

	<?php
	if (!defined ('TYPO3_MODE')) die ('Access denied.');

	$TCA['tx_inventory_domain_model_product'] = array (
	'ctrl' => array (
		'title' => 'Inventory',
		'label' => 'name',
	),
	'columns' => array(
		'name' => array(
		'label' => 'Item Label',
			'config' => array(
				'type' => 'input',
				'size' => '20',
				'eval' => 'trim,required'
			)
		),
		'description' => array(
			'label' => 'Item Description',
			'config' => array(
				'type' => 'text',
				'eval' => 'trim'
			)
		),
		'quantity' => array(
			'label' => 'Stock Quantity',
			'config' => array(
				'type' => 'input',
				'size' => '4',
				'eval'=> 'int'
			)
		),
	),
	'types' => array(
		'0' => array('showitem' => 'name, description, quantity')
	)
	);
	?>

After we installed the Extension, we can create our first products in the
backend. Like shown in image 4-2, we create a sys folder that takes the products (see 1 in figure 4-2).
In this, we put some few new inventory data (see 2 in figure 4-2).

.. figure:: /Images/4-FirstExtension/figure-4-2.png
	:align: center

	Figure 4-2: Create a new product

In this section we create a copy (or a model) of the reality, as we
transferred only a part of the properties of the real products in software,
that play a role in our domain. This model, which is abstracted of the real
world, is completely designed with this.

In order to access the objects created in the backend, we create
a Repository for the products. The
``Tx_Inventory_Domain_Repository_ProductRepository`` is an
object, in that the products are discarded. We can request a Repository to find all (or
certain) products and deliver it to us. The Repository class is very short
in our case::

	<?php
	class Tx_Inventory_Domain_Repository_ProductRepository
	extends Tx_Extbase_Persistence_Repository {}
	?>

Our ``ProductRepository`` must be derived by
``Tx_Extbase_Persistence_Repository`` and inherits by this all methods. It can
remain empty therefore in our simple example. We put the class file
:file:`ProductRepository.php` into the directory :file:`EXT:inventory/Classes/Domain/Repository/`.

