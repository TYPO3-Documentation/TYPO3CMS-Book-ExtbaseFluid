.. include:: ../Includes.txt

Create The Domain Model
=======================

The domain of our first extension is very simple. The essential
concept of our domain is the "product". All the important properties for us
of a product and its "behavior" are defined in a class with the name
:php:`MyVendor\StoreInventory\Domain\Model\Product`. The code of this
class is stored in a file with the name :file:`Product.php`.
The name of the file arises through the class name and the supplements of the file extension :file:`.php`.
This class file is stored in the folder :file:`EXT:store_inventory/Classes/Domain/Model/`.

.. tip::

    The labels of the classes always must reflect the folder structure.
    For example extbase expects the class
    :php:`MyVendor\MyExtension\FirstFolder\SecondFolder\File` in the
    folder
    :file:`my_extension/Classes/FirstFolder/SecondFolder/File.php`.
    Pay attention to the corresponding upper case of the folder names.

Below we have a view into this file, note that the class
:php:`\MyVendor\StoreInventory\Domain\Model\Product` must be derivated
from the extbase class
:php:`\TYPO3\CMS\Extbase\DomainObject\AbstractEntity`.

.. code-block:: php
   :caption: File: Classes/Domain/Model/Product.php
   :name: product-php

    <?php

    namespace MyVendor\StoreInventory\Domain\Model;

    use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;

    class Product extends AbstractEntity
    {

        /**
         * The name of the product
         *
         * @var string
         **/
        protected $name = '';

        /**
         * The description of the product
         *
         * @var string
         **/
        protected $description = '';

        /**
         * The quantity in the store inventory
         *
         * @var int
         **/
        protected $quantity = 0;

        /**
         * Product constructor.
         *
         * @param string $name
         * @param string $description
         * @param int $quantity
         */
        public function __construct($name = '', $description = '', $quantity = 0)
        {
            $this->setName($name);
            $this->setDescription($description);
            $this->setQuantity($quantity);
        }

        /**
         * Sets the name of the product
         *
         * @param string $name
         */
        public function setName(string $name)
        {
            $this->name = $name;
        }

        /**
         * Gets the name of the product
         *
         * @return string
         */
        public function getName()
        {
            return $this->name;
        }

        /**
         * Sets the description of the product
         *
         * @param string $description
         */
        public function setDescription(string $description)
        {
            $this->description = $description;
        }

        /**
         * Gets the description of the product
         *
         * @return string
         */
        public function getDescription()
        {
            return $this->description;
        }

        /**
         * Sets the quantity in the store inventory of the product
         *
         * @param int $quantity
         */
        public function setQuantity(int $quantity)
        {
            $this->quantity = $quantity;
        }

        /**
         * Gets the quantity in the store inventory of the product
         *
         * @return int
         */
        public function getQuantity()
        {
            return $this->quantity;
        }

    }



The product properties are designed as class variable :php:`$name`, :php:`$description` and :php:`$quantity` and
protected (*encapsulated*) against direct access from outside by the keyword `protected`.
The property values can be set and/or read only by the methods :php:`setProperty()`
and :php:`getProperty()` declared as `public`.
Methods in this form are used very frequently and therefore they are
generically named Getter and Setter for short.

.. tip::

    At a first view, the methods appear to be cumbersome for accessing
    the class variables. However, they have several advantages: The Internals
    of the processing can be added or changed at a later time, without needing
    to make changes to the calling object. Also, for example, the reading can
    be permitted, without simultaneously allowing writing access. Later on,
    the tedious work needed to code these methods will be made for you by the
    *Extension Builder*. Moreover, most development environments offer macros or
    snippets for this purpose. Note that in different moments Extbase
    internally tries to fill a property ``$name`` over a method
    ``setName()``.

The method `__construct()` serves to guarantee
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
    *Organization*. In Extbase, this however is done
    with so-called validators (see the section "validating domain objects" in
    chapter 9).
