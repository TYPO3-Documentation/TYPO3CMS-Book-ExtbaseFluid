.. include:: /Includes.rst.txt
.. index::
   Extbase; Domain model
   Extbase; Model

=======================
Create the domain model
=======================

The domain of our first extension is straightforward. The essential
concept of our domain is the "product". All important properties
of a product and its behavior are defined in the model
:php:`MyVendor\StoreInventory\Domain\Model\Product` which is stored
in a file with the name :file:`Product.php`.
The name of the file corresponds to the name of the model.
The file itself is stored in the folder
:file:`EXT:store_inventory/Classes/Domain/Model/`.

.. tip::

    The class names must reflect the folder structure to ensure that class loading is working.
    For example the class :php:`MyVendor\MyExtension\FirstFolder\SecondFolder\File` should be in the folder
    :file:`my_extension/Classes/FirstFolder/SecondFolder/File.php`.
    Pay attention to the corresponding upper casing of the folder names.

Let's take a deeper look at the model :php:`\MyVendor\StoreInventory\Domain\Model\Product`.

.. index:: \TYPO3\CMS\Extbase; DomainObject\AbstractEntity

The model :php:`Product` in our extension denotes the aggregate root and
represents an entity (as opposed to a :php:`ValueObject`) and
should extend :php:`\TYPO3\CMS\Extbase\DomainObject\AbstractEntity`.

.. code-block:: php
    :caption: File: Classes/Domain/Model/Product.php
    :name: product-php

    <?php

    namespace MyVendor\StoreInventory\Domain\Model;

    use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;

    class Product extends AbstractEntity
    {
        protected $name = '';

        protected $description = '';

        protected $quantity = 0;

        public function __construct(string $name = '', string $description = '', int $quantity = 0): void
        {
            $this->setName($name);
            $this->setDescription($description);
            $this->setQuantity($quantity);
        }

        public function setName(string $name): void
        {
            $this->name = $name;
        }

        public function getName(): string
        {
            return $this->name;
        }

        public function setDescription(string $description): void
        {
            $this->description = $description;
        }

        public function getDescription(): string
        {
            return $this->description;
        }

        public function setQuantity(int $quantity): void
        {
            $this->quantity = $quantity;
        }

        public function getQuantity(): int
        {
            return $this->quantity;
        }
    }

.. index:: Model; Properties

The product properties are designed as properties :php:`$name`,
:php:`$description` and :php:`$quantity` and protected (*encapsulated*)
against direct access from outside by using the keyword :php:`protected`.
The property values can be set and/or read-only by the corresponding getters and setters.


.. index:: Model; Getters and setters

.. tip::

    At first glance, the methods may appear to be cumbersome for accessing
    the class variables. However, they have several advantages:
    The internals of processing can be added or changed at a later time,
    without needing to make changes to the calling object.
    Additionally, fine-grained access control is possible as, for example, the reading can be permitted,
    without simultaneously allowing writing access.
    Most modern IDEs can create getters and setters automatically.


.. index:: Model; Constructor

The method :php:`__construct()` serves to guarantee
a well-defined state at the beginning of the life cycle of the object.
The properties of the product are set with their respective default
values.

