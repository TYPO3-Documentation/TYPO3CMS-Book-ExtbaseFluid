Create The Domain Model
================================================

The domain of our first extension is very simple. The essential
concept of our domain is the "product". All the important properties for us
of a product and its "behavior" are defined in a class with the name
:class:`Tx_Inventory_Domain_Model_Product`. The code of this
class is stored in a file with the name :file:`Product.php`.
The name of the file arises through supplements of :file:`.php`
at the last word, to count after the last underscore, of the class name.
This class file is stored in the folder
:file:`EXT:inventory/Classes/Domain/Model/`.

.. tip::

	The labels of the classes always must reflect the folder structure.
	For example extbase expects the class
	:class:`Tx_MyExtension_FirstFolder_SecondFolder_File` in the
	folder
	:file:`my_extension/Classes/FirstFolder/SecondFolder/File.php`.
	Pay attention to the corresponding upper case of the folder names.

Below we have a view into this file, note that the class
:class:`Tx_Inventory_Domain_Model_Product` must be derivated
from the extbase class
:class:`Tx_Extbase_DomainObject_AbstractEntity`.

::

	<?php
	class Tx_Inventory_Domain_Model_Product extends Tx_Extbase_DomainObject_AbstractEntity {
	/**
	 * @var string
	 **/
	protected $name = '';

	/**
	 * @var string
	 **/
	protected $description = '';

	/**
	 * @var int
	 **/
	protected $quantity = 0;

	public function __construct($name = '', $description = '', $quantity = 0) {
		$this->setName($name);
		$this->setDescription($description);
		$this->setQuantity($quantity);
	}

	public function setName($name) {
		$this->name = (string)$name;
	}

	public function getName() {
		return $this->name;
	}

	public function setDescription($description) {
		$this->description = (string)$description;
	}

	public function getDescription() {
		return $this->description;
	}

	public function setQuantity($quantity) {
		$this->quantity = (int)$quantity;
	}

	public function getQuantity() {
		return $this->quantity;
	}

	}
	?>

The product properties are designed as class variable
``$name``, ``$description`` and ``$quantity`` and
protected (*encapsulated*) against direct access from
outside by the keyword ``protected`` . The property values can be
set and/or read only by the methods :code:`setProperty()`
and :code:`getProperty()` declared as ``public``.
Methods in this form are used very frequently and therefore they are
generically named Getter and Setter for short.

.. tip::

	At a first view, the methods appear to be cumbersome for accessing
	the class variables. However, they have several advantages: The Internals
	of the processing can be added or changed at a later time, without needing
	to make changes to the calling object. Also, for example, the reading can
	be permitted, without simultaneously allowing writing access. Later on,
	the tedious work needed to code these methods will be made for you by the
	Kickstarter. Moreover, most development environments offer macros or
	snippets for this purpose. Note that in different moments Extbase
	internally tries to fill a property ``$name`` over a method
	``setName()``.

The method :code:`__construct()` serves to guarantee
a well defined state at the beginning of the life cycle of the object. Here
the properties of the product are set with their respectively preset
values.

.. warning::
	In the declaration of the constructor, the argument
	``$name`` is set with a default value (empty string) and
	thereupon optional. That is necessary so that Extbase can instantiate the
	class "empty" without a name must be delivered. With this Extbase offends
	against the pure doctrine because the constructor actually should
	guarantee the minimal configuration of the object
	*Organization*. In Extbase, This however better is done
	with so-called validators (see the section "validating domain objects" in
	chapter 9).
