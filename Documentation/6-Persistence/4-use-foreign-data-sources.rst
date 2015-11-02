.. include:: ../Includes.txt

Using Foreign Data Sources
================================================

In real projects many times data from different sources has to be ordered. One target of Extbase is
to normalize the access to this data sources and to abstract it from the concrete technical solution.
These "foreign" data sources could be tables from the same TYPO3 database or a web service.

Extbase building-up strongly of the rule "Convention over Configuration" (see also the appendix A for this).
Foreign database tables correspond in rare cases the conventions of Extbase. Therefore the assignment
of the class to a given table as well as the assignment of field names to property names of the classes
must be configured via TypoScript. This assignment is also called *mapping*. The following configuration
enables the storage of the object data of a class ``Tx_MyExtension_Domain_Model_Person`` in the table
``tt_address``, which is available in most TYPO3 installations.

::

    plugin.tx_myextension {
        persistence {
            classes {
                Tx_MyExtension_Domain_Model_Person {
                    mapping {
                        tableName = tt_address
                        recordType = Tx_MyExtension_Domain_Model_Person
                        columns {
                            birthday.mapOnProperty = dateOfBirth
                            street.mapOnProperty = thoroughfare
                        }
                    }
                }
            }
        }
    }

The options for the persistence can be set beneath the TypoScript path ``plugin.tx_myextension.persistence``
for the extension or beneath ``config.tx_extbase.persistence`` globally for all extensions. Inside of
``classes`` for every class the mapping is defined. With ``tableName`` the name of the table is given
in which the object data is to be stored. The option ``recordType`` is used in a table, that is used for
the storage of different classes, to assign the record of "his" class. With ``columns`` the separate
assignments of the field names (left) to the corresponding properties (right) is done.

.. note::

    Regard in each case that the field type fits the data type of your property. Additional information
    you will find in "Preparing the tables of the Domain Objects" above in this chapter.

This configuration causes Extbase to use the table ``tt_address`` when reconstructing or persisting of
objects of the class ``Tx_MyExtension_Domian_Model_Person``. Thereby the values of the properties
``dateOfBirth`` and ``thoroughfare`` are stored in the fields ``birthday`` and ``street``. If the
configuration option ``tableName`` is not set, Extbase searches for a table that corresponds to the lower
cased cased class name, in our case: ``tx_myextension_domain_model_person``. If for a property
none rule for the mapping is defined, the property name, translated in lower case with underscores,
is expected as field name. The property name ``dateOfBirth`` would result in a field name ``date_of_birth``.
