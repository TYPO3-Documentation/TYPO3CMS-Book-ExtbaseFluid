.. include:: ../Includes.txt

.. _modeling-the-class-hierarchy:

Modeling the Class Hierarchy
============================

In chapter 5 in "Use inheritance in class hierarchies" we have already used class hierarchies.
A relational database doesn't know about some concepts of object oriented programming - also not
the concept of class hierarchies. Therefore there is a mismatch between the object oriented
domain model and the relational model of the database (object-relational impedance mismatch).
However there are some technical options to represent the class hierarchies. Let us look for
these with a simplified class hierarchy detached from our sample extension (see figure 6-14).

.. figure:: /Images/6-Persistence/figure-6-14.png

   Figure 6-14: A simple class hierarchy

The classes `Organization` and `Person` are specializations of the class `Party` (not a
jollification, but a party in not political manner). The class `Organization` is again a
generalization of the sub classes `Company` and `ScientificInstitution`. Now assume that
in our extension data from instances of the classes `Organization`, `Company`,
`ScientificInstitution` and `Person` (the so called *concrete classes*) have to be stored.
The class `Party` is initially used as a container for properties and behaviour that should
be available in the concrete classes without mention them also there (to avoid redundancies is
the whole purpose of a class hierarchy). For saving the data there a some options available:

* For every concrete class an own database table will be created (*Concrete Table Inheritance*).
  The table contains fields for all own and inherited properties. For the class `Company`
  in this case a table `company` is created, which contains the fields `name`, `number_of_employees`
  and `type_of_business`. The table `person` only contains the fields `name` and
  `date_of_birth`.
* For all classes of a class hierarchy only one table is created (*Single Table Inheritance*).
  This table is assigned to the class which contains all sub classes which data has to be stored
  inside. In our case this would be the table `party` with fields for all properties of all
  sub clases: `name`, `number_of_employees`, `type_of_business`, `research_focus`
  and `date_of_birth`.
* For every class of the class hierarchy an own table is created in which only the properties
  are stored which are defined in the class (*Class Table Inheritance*).
  The table `party` in this case contains the field `name`, the table `organization`
  only the field `number_of_employees` and the table `company` accordingly the field
  `type_of_business`:

This time Extbase and the backend of TYPO3 are supporting the first two options. For the first
option *Concrete Table Inheritance* you have only to create the tables and configure them as
described in the TCA. No additional configuration for the class hierarchy is needed.

For the second case of *Single Table Inheritance* beside creation of the table there is an
additional configuration effort needed. Furthermore the table must have an additional field,
that contains the type of the stored database tupel. The table definition schematically looks
like this:

.. code-block:: guess

   CREATE TABLE tx_myextension_domain_model_party {
      uid int(11) unsigned DEFAULT '0' NOT NULL auto_increment,
      pid int(11) DEFAULT '0' NOT NULL,
      record_type varchar(255) DEFAULT '' NOT NULL,

      name varchar(255) DEFAULT '' NOT NULL,
      number_of_employees int(11) unsigned DEFAULT '0' NOT NULL,
      date_of_birth int(11) unsigned DEFAULT '0' NOT NULL,
      type_of_business varchar(255) DEFAULT '' NOT NULL,
      research_focus varchar(255) DEFAULT '' NOT NULL,

      PRIMARY KEY (uid),
      KEY parent (pid)
   }

The name of the field that contains the type can be choosen freely. In our case it is the field
`record_type`. The field name must be specified in the `ctrl` section of the TCA as `type`:

.. code-block:: php
   :caption: Configuration/TCA/tx_myextension_domain_model_party.php

   // …
   'ctrl' => [
      'title' => 'Party',
      'label' => 'name',
      'type' => 'record_type',
      // …
   ]
   // …

In your TypoScript template you have to tell Extbase for every concrete class in which table the
data of the instances are stored and with which type they should be stored.

.. code-block:: typoscript

    config.tx_extbase.persistence.classes {
        MyVendor\MyExtension\Domain\Model\Organization {
            mapping {
                tableName = tx_myextension_domain_model_party
                recordType = MyVendor\MyExtension\Domain\Model\Organization
            }
            subclasses {
                \MyVendor\MyExtension\Domain\Model\Company = MyVendor\MyExtension\Domain\Model\Company
                \MyVendor\MyExtension\Domain\Model\ScientificInstitution = MyVendor\MyExtension\Domain\Model\ScientificInstitution
            }
        }
        MyVendor\MyExtension\Domain\Model\Person {
            mapping {
                tableName = tx_myextension_domain_model_party
                recordType = \MyVendor\MyExtension\Domain\Model\Person
            }
        }
        MyVendor\MyExtension\Domain\Model\Company {
            mapping {
                tableName = tx_myextension_domain_model_party
                recordType = \MyVendor\MyExtension\Domain\Model\Company
            }
        }
        MyVendor\MyExtension\Domain\Model\ScientificInstitution {
            mapping {
                tableName = tx_myextension_domain_model_party
                recordType = \MyVendor\MyExtension\Domain\Model\ScientificInstitution
            }
        }
    }

Every class is assigned with `tableName = tx_myextension_domain_model_party` to this table.
In `recordType` inside the table an unique identifier is expected (even the *Record Type*).
It is advisable to use the class name for this. For every super class additional all subclasses
have to be declared under `subclasses`. In our example `Party` and `Organization` are
super classes, but only the class `Organization` should could be instantiated. For this it is
enough to configure these class. The two subclasses `Company` and `ScientificInstitution` are
specified. First it looks weird that at both sides of the equation sign the same class name stands.
On the right side the really the name of the sub class must be given. On the left side only an
unique identifier inside TYPO3 is expected, so that this configuration can be extended by other
extensions without any risk if necessary. Once again it is recommend to use the class name.

You can create new objects of the classes `Person`, `Organization`, `Company` or
`ScientificInstitution` in the frontend as normal. Extbase will store them in the table
`party` and put the class name in the type field. During reconstruction, when the object
is transported from the database to the memory, Extbase identifies the class on the basis of
the type field and instantiated a corresponding object.

Normally objects also should be created and edited in the backend. But the backend doesn't
know the concept of classes. For this you must provide a select field in the form with this
the backend user can choose the class in terms of the *Record Type*. This can be done with
including the following configuration to your TCA:

.. code-block:: php
   :caption: Configuration/TCA/tx_myextension_domain_model_party.php

    // …
   'types' => [
      '0' => [
         'showitem' => 'record_type, name'
      ],
      '\MyVendor\MyExtension\Domain\Model\Organization' => [
         'showitem' => 'record_type, name, numberOfEmployees'
      ],
      '\MyVendor\MyExtension\Domain\Model\Person' => [
         'showitem' => 'record_type, name, dateOfBirth'
      ],
      '\MyVendor\MyExtension\Domain\Model\Company' => [
         'showitem' => 'record_type, name, numberOfEmployees, typeOfBusiness'
      ],
      '\MyVendor\MyExtension\Domain\Model\ScientificInstitution' => [
         'showitem' => 'record_type, name, numberOfEmployees, researchFocus'
      ]
   ],
   'columns' => [
      // …
      'record_type' => [
         'label' => 'Domain Object',
         'config' => [
            'type' => 'select',
            'items' => [
               ['undefined', '0'],
               ['Organization', '\MyVendor\MyExtension\Domain\Model\Organization'],
               ['Person', '\MyVendor\MyExtension\Domain\Model\Person'],
               ['Company', '\MyVendor\MyExtension\Domain\Model\Company'],
               ['ScientificInstitution', '\MyVendor\MyExtension\Domain\Model\ScientificInstitution']
            ],
            'default' => '\MyVendor\MyExtension\Domain\Model\Person'
         ]
      ],
      // …
   ],
   // …

In the section `ctrl` the type field `record_type` is configured as selection list.
With this the desired domain object respectively the class name can be chosen. This impacts the
display of the form fields. In the section `types` for every *Record Type* (in our case the class name)
the fields to be displayed are defined; when the *Record Type* changes the new set of form fields
are displayed after a confirmation by TYPO3.

You can access the objects via repositories as normal. In your controller the corresponding lines
can look like this:

.. code-block:: php

    /**
     * @var CompanyRepository
     */
    private $companyRepository;

    /**
     * Inject the company repository
     *
     * @param \MyVendor\MyExtension\Domain\Repository\CompanyRepository $companyRepository
     */
    public function injectCompanyRepository(CompanyRepository $companyRepository)
    {
        $this->companyRepository = $companyRepository;
    }

    /**
     * List Action
     *
     * @return void
     */
    public function listAction()
    {
        $companies = $this->companyRepository->findAll();
        $this->view->assign('companies', $companies);
    }


You can also find straightforward all concrete classes of a super class:

.. todo remove makeInstance

.. code-block:: php

    $organizationRepository = \TYPO3\CMS\Core\Utility\GeneralUtility::makeInstance('\MyVendor\MyExtension\Domain\Repository\OrganizationRepository');
    $organizations = $organizationRepository->findAll();

In the result set :php:`$organizationRepository` there are domain objects of the class
`\MyVendor\MyExtension\Domain\Model\Organization` and all configured subclasses :php:`\MyVendor\MyExtension\Domain\Model\Company`
and :php:`\MyVendor\MyExtension\Domain\Model\ScientificInstitution` are included. The query of a super class
is only possible for *Single Table Inheritance* this time. In the future this should also be possible
for *Concrete Table Inheritance*.

.. note::

    A prominent example for the *Single Table Inheritance* is the table `tt_content`, in which all
    types of content elements are stored. Every extension can enhance the table with own fields.
    Accordingly big is the amount of columns of this table. The type of the content elements is
    stored in the field `CType`.

With this chapter we close the work on the domain model and whose storage firstly. During the process
of real development projects this process naturally is not linear. Again and again we come back
to the domain model for enhance something or to optimize. In the following chapters we will dedicate
to the "Flow" through the extension. In the so called *Controllers* we define the sequences
inside the extension.
