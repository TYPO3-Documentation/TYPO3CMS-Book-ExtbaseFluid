Make Products Persistent
================================================

From the class
<classname>Tx_Inventory_Domain_Model_Product</classname>, now we already can
generate instances – therefore concrete products with individual properties
– at script run time. These are available however only in volatile form in
the memory and are deleted after the side was produced completely by TYPO3,
by PHP again. So that the products are available over a longer time, we must
make it "durable". Usually this happens in that one stores it into a
database. Therefore we design first of all the database table necessary for
that.

.. tip::
	The designing of the database tables can be done by the Kickstarter.
	In the TYPO3 V5, these steps completely are omitted.

TYPO3 will do this for us if we register the corresponding SQL
proclamation in the file
<filename>EXT:inventory/ext_tables.sql</filename>::

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
The columns uid and pid serve to the internal administration. Our product
characteristics name, description and quantity emerge as columns again.


On the entries in the database take action then over that baking by
TYPO3. The forms of the Backends are produced on the basis of a
configuration, that is discarded in a PHP Array, the so-called
Table-Configuration-Array (shortly TCA). 

Within the Extension take action then over Repositories transparently
on these data. "Transparently" means that one must make himself in the
access to Repositories around the type of the storage of the data no
thoughts. 

So that that knows baking now, how it should indicate the product data
in a form, we must configure this for the table in the file
EXT:inventory/ext_tables.php. There is discarded in the Array $TCA under the
table name as a key the configuration. This comprises several sections. In
the section ctrl, basic characteristics are how the table name or the
statement which table column the Label is supposed to be taken for the
entries. In the section columns is described for each table column how this
in that is supposed to be indicated baking. The section type defines, in
which sequence the table columns are indicated, and like this where
appropriate. Arranged become. 

.. tip::
	The possibilities to influence with the TCA the edition in that
	baking, are immense. In the frame these beeches we only can tear this. You
	find a fully permanent listing of all option Online under
	http://typo3.org/documentation/document-library/core-documentation/doc_core_api/4.3.0/view/4/1/.
	In more extensive Extensions, one would evacuate the sections columns and
	type out of Performance reasons also into an own file tca. php. In our
	example, this minimal configuration should suffice however. 

::

	&lt;?php
	if (!defined ('TYPO3_MODE')) die ('Access denied.');

	$TCA['tx_inventory_domain_model_product'] = array (
	'ctrl' =&gt; array (
		'title' =&gt; 'Inventory',
		'label' =&gt; 'name',
	),
	'columns' =&gt; array(
		'name' =&gt; array(
		'label' =&gt; 'Item Label',
			'config' =&gt; array(
				'type' =&gt; 'input',
				'size' =&gt; '20',
				'eval' =&gt; 'trim,required'
			)
		),
		'description' =&gt; array(
			'label' =&gt; 'Item Description',
			'config' =&gt; array(
				'type' =&gt; 'text',
				'eval' =&gt; 'trim'
			)
		),
		'quantity' =&gt; array(
			'label' =&gt; 'Stock Quantity',
			'config' =&gt; array(
				'type' =&gt; 'input',
				'size' =&gt; '4',
				'eval'=&gt; 'int'
			)
		),
	),
	'types' =&gt; array(
		'0' =&gt; array('showitem' =&gt; 'name, description, quantity')
	)
	);
	?&gt;

After we installed the Extension, we can design our first in that
baking per dukte. How in image 4-2 shown, let's produce receive becomes in
addition a system file, that the products 1: In this, we put some few new
Bestandsdaten at 2. 

<remark></remark>

<remark></remark>

<remark>ToDo: insert image 4-2 with replaced english version screenshot
</remark>

We created a copy (or a model) in this section reality in that we
translated only a cut at characteristics of the real products in software,
that play a role in our domain. This of the real world abstracted therewith
completely is designed model. 

In order take action on that in the baking designed object, design we
a Repository for products. The
Tx_Inventory_Domain_Repository_ProductRepository is "discarded" are an
object, in that the products. We can request a Repository to find all (or
certain) products and to deliver at us. The Repository class is very short
in our case::

	&lt;?php
	class Tx_Inventory_Domain_Repository_ProductRepository
	extends Tx_Extbase_Persistence_Repository {}
	?&gt;

Our ProductRepository must be diverted by
Tx_Extbase_Persistence_Repository and inherits by this all methods. It can
remain therefore in our simple example empty. We discard the class file
ProductRepository. php into the file
EXT:inventory/Classes/Domain/Repository/. 

