.. include:: /Includes.rst.txt
.. _using-foreign-data-sources:

Using Foreign Data Sources
==========================

In real projects many times data from different sources has to be ordered. One target of Extbase is
to normalize the access to this data sources and to abstract it from the concrete technical solution.
These "foreign" data sources could be tables from the same TYPO3 database or a web service.

Extbase building-up strongly of the rule "Convention over Configuration" (see also the appendix A for this).
Foreign database tables rarely correspond with the conventions of Extbase. Therefore the assignment
of the class to a given table as well as the assignment of field names to property names of the classes
must be configured via PHP. This assignment is also called *mapping*. The following configuration
enables the storage of the object data of a class :php:`\MyVendor\MyExtension\Domain\Model\Person` in the table
`tt_address`, which is available in most TYPO3 installations.

:file:`EXT:extension/Configuration/Extbase/Persistence/Classes.php`::

   <?php
   declare(strict_types = 1);

   return [
       \MyVendor\MyExtension\Domain\Model\Person::class => [
           'tableName' => 'tt_address',
           'recordType' => \MyVendor\MyExtension\Domain\Model\Person::class,
           'properties' => [
               'dateOfBirth' => [
                   'fieldName' => 'birthday',
               ],
               'thoroughfare' => [
                   'fieldName' => 'street',
               ],
           ],
       ],
   ];

The configuration file must return an array with a configuration for each class that needs to be mapped to a database
table. The configuration is quite straight forward. The :php:`tableName` obviously defines the table the class is mapped
to. When using single table inheritance, the type of record can be set via :php:`recordType`. The :php:`properties` key
defines a set of class properties that should be mapped onto fields that don't comply with the naming convention.

.. note::

    Regard in each case that the field type fits the data type of your property. Additional information
    you will find in "Preparing the tables of the Domain Objects" above in this chapter.

This configuration causes Extbase to use the table ``tt_address`` when reconstructing or persisting of
objects of the class :php:`\MyVendor\MyExtension\Domain\Model\Person`. Thereby the values of the properties
``dateOfBirth`` and ``thoroughfare`` are stored in the fields ``birthday`` and ``street``. If the
configuration option ``tableName`` is not set, Extbase searches for a table that corresponds to the lower
case class name, in our case: ``tx_myextension_domain_model_person``. If for a property
there is no mapping defined, the property name, translated in lower case with underscores,
is expected as field name. The property name `dateOfBirth` would result in a field name `date_of_birth`.
