.. include:: ../Includes.txt

=================================
Configure the backend input forms
=================================

In our sample application, the data of our extension should be editable in the
Backend by the editors of the youth club organization and - within certain
limitations - in the Frontend as well to provide functionalities for creation,
update and deletion of the organization's data. In this chapter, we first
configure the Backend's form inputs for easy access to the database's contents.
The forms that provide the management functionalities are stored in a
PHP-Array called `Table Configuration Array (TCA)`.
The TCA is stored in a file with the database table name suffixed with `.php` in the directory :file:`Configuration/TCA/`.
Example: The TCA for the database table tx_sjroffers_domain_model_organization is therefore in the
file :file:`Configuration/TCA/tx_sjroffers_domain_model_organization.php`.

.. note::

   The configuration options that can be set in the TCA are very extensive and
   a broad description of them would cause the book to burst at its
   seams. However, each and every option is well documented in the
   Online-documentation :ref:`TCA Reference <t3tca:start>`

First, you should dip into the top layer of the TCA hierarchy. The TCA
for table *tx_sjroffers_domain_model_organization* is in the
file :file:`Configuration/TCA/tx_sjroffers_domain_model_organization.php` and has this structure:

.. code-block:: php

   <?php
   return [
       'ctrl' => [
           // …
       ],
       'columns' => [
           // …
       ],
       'types' => [
           // …
       ],
   ];

The structure for the other tables like tx_sjroffers_domain_model_offer and tx_sjroffers_domain_model_person are the same.

The returned arrays will be added to one big array :php:`$GLOBALS['TCA']`. You can debug the configuration
for the table `tx_sjroffers_domain_model_organization` in the TYPO3 backend module `System -> Configuration -> $GLOBALS['TCA'] (Table configuration array) -> tx_sjroffers_domain_model_organization`

The associative array that is returned contains all information of all the tables of the TYPO3
instance. Thus, we use the key `tx_sjroffers_domain_model_organization,` and as
the value, we use another nested Array that holds the configurations of the
corresponding table. Then again, this array is separated into several parts
with names that are the keys of the nested array.

.. code-block:: php

   <?php
   return [
      'ctrl' => [
         // …
      ],
      'interface' => [
         // …
      ],
      'types' => [
         // …
      ]
      'palettes' => [
         // …
      ],
      'columns' => [
         'first_fieldname' => [
            // …
         ],
         'second_fieldname' => [
            // …
         ],
      ],
   ];


Below, you find the names of the parts and their meaning.

`ctrl`
This part contains configuration options that are used in the scope of the
table. This covers the name of the table in the Backend, which table fields
contain which metadata and the behavior of the table on creation and movement
of its row sets. Metadata cover information about Visibility and Access
Control (e.g. `disabled`, `hidden`, `starttime`, `endtime`,
`fe_group`), data about the history of changes (e.g. `versioningWS`,
`crdate`, `tstamp` as well as data for the localization of data sets (e.g.
`languageField`).


`interface`
This part contains information about the representation of the table data in the
Backend's List Module. The key `showRecordFieldList` contains a
comma-separated list of field values that will be shown in the info
dialogue of the table. This dialogue may be reached through a right-click on the
icon of the row set through the `Info` option. The option
`maxDBListItems` allows you to set how many row sets will be shown in the List Module
without switching to the detail view of the database table. Then again, the
number of row sets shown on a page in this perspective may be set via
`maxSingleDBListItems`. If the option `always_description` is set to *true*,
the corresponding help texts always show up.



`types`
This section defines the appearance of the Input Form for the creation and update of
a row set. You can define several layout types by listing several elements in the
array `types`. The key of all those elements is their type (usually a number)
and their value is another nested array which itself usually contains one
element with `showItem` as key and a list of comma-separated field names that
should emerge at the Input Form. An example of the table
`tx_sjroffers_domain_model_organization` is:

.. code-block:: php

   'types' => [
      '0' => ['showitem' => 'hidden,status,name,address;;1;;description,contacts,offers,administrator'],
   ],

Even though the behavior and the appearance of the table fields are configured in
the section `columns`, it is required to list them explicitly here so that they show
up in the input form. This prevents trouble when commenting out
or moving code that is already configured, and a corresponding field should
just be hidden, or the overall order of the Input Form's table fields should be
changed.

The behavior and the appearance of a field may be altered through several
additional parameters - as well as with the field `address`. The notion
convention of those additional params may seem a bit unfamiliar since they are
appended behind the field name and separated through a semi-colon. At the first
position, there is the field name; at the second, an alternative name of the field name;
third place follows the number of the palette (refer to the next book
section); the fourth position holds extensive options which are separated
through colons, and the last place contains information about the appearance
(e.g., color and structure). The information at the fourth place allows the use of
the *Rich Text Editor*. For a full list of the options, refer to the already
mentioned TYPO3-Online documentation for the :ref:`TYPO3-Core API <t3coreapi:start>`.

`palettes`
Palettes are used to collect occasionally used fields and show them upon
demand. The Backend user has to choose the Extended View in the
Backend's List module to view these. Palettes are connected to a durable visible field. An
example from the table `tx_sjroffers_domain_model_organization` is:

.. code-block:: php

   'palettes' => [
      '1' => ['showitem' => 'telephone_number,telefax_number,url,email_address'],
   ],

The structure is the same as in the section *types* where `address;;1;;`
refers to the palette with the number 1.

`columns`
This array contains information about the behavior and the appearance in the
Input Form of every table field. The field name is the key, and, again, the value
is a nested array holding the field's corresponding configuration. The field
configuration for the input of the name of an organization would be as follows:

.. code-block:: php

   'name' => [
      'exclude' => false,
      'label' => 'LLL:EXT:sjr_offers/Resources/Private/Language/locallang_db.xml:tx_sjroffers_domain_model_organization.name',
      'config' => [
         'type' => 'input',
         'size' => 20,
         'eval' => 'trim,required',
         'max' => 256
      ],
   ],

The field name is *name*. First, we define some options that are independent
of the field's type. This contains foremostly the field label (*label*), the
conditions for the visibility of the field (`exclude`, `displayCond`) as
well as information for its localization (`l10n_mode`, `l10n_cat`). The
field name is, in our case, localized and will be taken from a language file
(head to Ch. 9).

The array connected to `config` contains the field type and its corresponding
configuration. TYPO3 provides a great range of pre-defined field types, e.g.
text fields, date fields, or selection fields. Each and every type has its own
presentation and procession options. Consecutively, you will find a list of all
the field types with their usual configuration:


Field type "input"
==================

The *input* field type accepts a one-line character string like names and
telephone numbers. The configuration of a name field (see Fig. 6-1) looks as
follows:

.. code-block:: php

   'name' => [
      'label' => 'Organization\'s name',
      'config' => [
         'type' => 'input',
         'size' => 20,
         'eval' => 'trim,required',
         'max' => 256
      ],
   ],

The given string will be truncated to 256 characters (`'max' => 256`), ending
spaces will be dropped (`trim`), and the status of this field being empty will be
prevented (`required`).

.. note::

   **Important:** When a field is defined as required, the Domain Model must have the
   annotation `@NotEmpty` for the validator.

.. figure:: /Images/6-Persistence/figure-6-1.png
   :align: center

   Figure 6-1: An example of the field type "input" used as a name field.

The field type `input` may be used for date and time inputs:

.. code-block:: php

   'minimum_value' => [
      'label' => 'valid since',
      'config' => [
         'type' => 'input',
         'size' => 8,
         'checkbox' => '',
         'eval' => 'date'
      ],
   ],

The value then will be tested for being given in an appropriate date format.
Simultaneously, this leads to the rendering of a collapsible calendar page with
an icon right to the input field, which is shown in Fig. 6-2:

.. figure:: /Images/6-Persistence/figure-6-2.png
   :align: center

   Figure 6-2: An example of the field type "input" used as a date field.

Field type "text"
=================

The `text` field type may contain multi-line formatted or unformatted texts
, e.g., product descriptions, addresses, or news items. The indication of the lines
(`rows`) and the columns (`cols`) specifies the area of the text input field.

.. code-block:: php

   'address' => [
      'label' => 'Address:',
      'config' => [
         'type' => 'text',
         'cols' => 20,
         'rows' => 3
      ],
   ],

.. figure:: /Images/6-Persistence/figure-6-3.png
   :align: center

   Figure 6-3: An example for the field type "text".


Field type "check"
==================

The field type `check` allows the definition of a single option (see Fig. 6-4)
 e.g., you can define whether a rowset should be hidden or not.

.. code-block:: php

   'hidden' => [
      'label' => 'Hide:',
      'config' => [
         'type' => 'check'
      ],
   ],

.. figure:: /Images/6-Persistence/figure-6-4.png
   :align: center

   Figure 6-4: An example for the field type "check" for a single option.

Several related options that can be individually selected can be grouped into a
field (see Fig. 6-5). This may be helpful, e.g., for a selection of valid weekdays
or recommended training levels of a certain exercise.

.. code-block:: php

   'level' => [
      'exclude' => true,
      'label' => 'Property for',
      'config' => [
         'type' => 'check',
         'eval' => 'required,unique',
         'cols' => 5,
         'default' => 31,
         'items' => [
            ['Level 1',''],
            ['Level 2',''],
            ['Level 3',''],
            ['Level 4',''],
            ['Level 5',''],
         ],
      ],
   ],

.. <!-- TODO: look, how math is being processed for the coming exp-value -->

The value that is written to the database is of type Integer. This will be
computed by the bitwise addition of the checkboxes states (which can be 1 or 0). The
first element (Level 1) is the least significant bit (= 2^0 = 1). The second
element is one level above (= 2^1 = 2), the third element will then be (= 2^2 =
4) etc. The selection in the following Figure (see Fig. 6-5) would lead to the
following Bit-Pattern (= binary-written number): 00101. This binary number is
equivalent to the integer value 5.

.. figure:: /Images/6-Persistence/figure-6-5.png
   :align: center

   Figure 6-5: An example of the field type "check" for several options that are grouped together.

Field type "radio"
==================

The field type radio is for choosing one unique value for a given property (see
Fig. 6-6), e.g., the sex of a person or the color of a product.

.. code-block:: php

   'gender' => [
      'label' => 'Sex',
      'config' => [
         'type' => 'radio',
         'default' => 'm',
         'items' => [
            ['male', 'm'],
            ['female', 'f'],
         ],
      ],
   ],

The options (*items*) are given in an array and each option is an array itself
containing the label and the key used to persist the selected option in the
database.

.. figure:: /Images/6-Persistence/figure-6-6.png
   :align: center

   Figure 6-6: An example of the field type "radio".

Field type "select"
===================

The field type "select" provides a space-saving way to render multiple values
(see Fig. 6-7). Examples could be a member status, a product color, or a region.

.. code-block:: php

   'status' => [
      'exclude' => false,
      'label' => 'Status',
      'config' => [
         'type' => 'select',
         'foreign_table' => 'tx_sjroffers_domain_model_status',
         'maxitems' => 1
      ],
   ],

The options are taken from another database table (*foreign_table*) and by
setting *maxitems* to 1 (which is standard), the selection box will be limited to
exactly one showed item.

.. figure:: /Images/6-Persistence/figure-6-7.png
   :align: center

   Figure 6-7: An example for the field type "select" showing a selection box.

The type `select` may also be used to select a whole subset of values. This is
used for categories, tags, or contact persons (see Fig. 6-8).

.. code-block:: php

   'categories' => [
      'exclude' => true,
      'label' => 'Categories',
      'config' => [
         'type' => 'select',
         'size' => 10,
         'minitems' => 0,
         'maxitems' => 9999,
         'autoSizeMax' => 5,
         'multiple' => 0,
         'foreign_table' => 'tx_sjroffers_domain_model_category',
         'MM' => 'tx_sjroffers_offer_category_mm'
      ],
   ],

Again, this takes the options of another table, but it holds the references in a
temporary table *tx_sjroffers_offer_category_mm*.

.. figure:: /Images/6-Persistence/figure-6-8.png
   :align: center

   Figure 6-8: An example for the field type "select".

Field type "group"
==================

The "group" field type is very flexible in its use. It can be used to manage
references to resources of the filesystem or rowsets of a database (see Fig. 6-9).

.. code-block:: php

   'pages' => [
      'label' => 'Pages',
      'config' => [
            'type' => 'group',
            'internal_type' => 'db',
            'allowed' => 'pages',
            'size' => 3,
            'maxitems' => 50,
            'minitems' => 0
      ]
   ],

The combination of `type` and `internal_type` specifies the field's type.

Field type "none"
=================

Fields of this type show the raw data values which cannot be edited (see Fig. 6-10).

.. code-block:: php

   'date' => [
      'label' => 'Datum (Timestamp)',
      'config' => [
         'type' => 'none'
      ],
   ],

In contrast to the date field with the type `input`, there is no evaluation as
with `'eval' => 'date'`. The timestamp which is set in the database will be
shown as a raw number.

.. figure:: /Images/6-Persistence/figure-6-10.png
   :align: center

   Figure 6-10: An example for the field type "none" for a date field.

Field type "passthrough"
========================

The field type "passthrough" is for data that is processed internally but cannot
be edited or viewed in the form. An example of that would be information to
references (foreign keys).

.. code-block:: php

   'organization' => [
      'config' => [
         'type' => 'passthrough'
      ],
   ],

This field configuration in the database table
`tx_sjroffers_domain_model_offer` has the effect that the property
`organization` of the `Offer`-object will be filled with the correct object.


Field type "user"
=================

A user generates free definable form fields that can be processed by any PHP
function. For further information, refer to the documentation which is available
online and to the :ref:`TYPO3-Core API <t3coreapi:start>`.


Field type "flex"
=================

The field type "flex" manages complex inline form fields (*FlexForms*). The
form data will be saved as an XML data structure in the database fields.
Extbase uses FlexForms for persisting plugin configuration but not to save
domain data. If your plugin data are rather complex, we encourage you to
design your own backend module for them (refer to Ch. 10).


Field type "inline"
===================

The field type "inline" is for saving complex Aggregates of the Domain (see Fig.
6-11). The basis of this field type is the so-called *Inline Relational Record
Editing (IRRE)* which powers the creation, update, and deletion of Domain-objects
of whole Aggregates in a single Input Form. Without *IRRE* the Domain-objects
must be edited and connected each by itself, which would require an intermediate
save. This technique is a comfortable tool for managing complex Aggregates. All
the possibilities provided by IRRE are well documented, refer to :ref:`the TYPO3
TCA Reference <t3tca:columns-inline>`.


.. code-block:: php

   'offers' => [
      'label' => 'Offers',
      'config' => [
         'type' => 'inline',
         'foreign_table' => 'tx_sjroffers_domain_model_offer',
         'foreign_field' => 'organization',
         'maxitems' => 9999
      ],
   ],

The configuration is almost identical to the field type "select". However, there
are several more possibilities for the configuration of the management and the
representation of the connected objects.

.. figure:: /Images/6-Persistence/figure-6-11.png
   :align: center

   Figure 6-11: An example for the field type "inline".

Extbase supports the most important aspects of *IRRE* with only one exception:
*IRRE* allows a temporary table of an `m:n-relationship` to be enhanced by
additional fields that can hold Domain data. An example: Assume that we want to
connect a CD to it's containing music tracks, whereas a CD can contain multiple
tracks and one track can be present on several CD's. Thus, we can derive the
following temporary table:

`CD --1:n-- Temporary-Table --n:1-- Title`



The corresponding *IRRE*-Configuration looks as follows::

   'titles' => [
      'label' => 'Track Title',
      'config' => [
         'type' => 'inline',
         'foreign_table' => 'tx_myext_cd_title_mm',
         'foreign_field' => 'uid_local',
         'foreign_selector' => 'uid_foreign'
      ],
   ],

The *IRRE*-Tutorial describes this configuration as "state-of-the-art" for
m:n-relationships. The option `foreign_selector` leads to a selection box for
the music titles. Currently, *IRRE* only supports this option for
m:n-relationships.

Every music track on the CD is given a unique track number. However, the track
number is neither a property of the CD nor that of a track. It semantically
corresponds to the relationship *between* them. Thus, IRRE provides the option
to persist them within the temporary table, and this can always be modeled into
the Domain model, which gets the following structure: `CD --1:n-- Track --n:1--Title`.

Let's change the configuration of the table `tx_myext_domain_model_track` to a
simple 1:n-relationship with `cd` as a foreign key.

.. code-block:: php

   'tracks' => [
      'label' => 'Track',
      'config' => [
         'type' => 'inline',
         'foreign_table' => 'tx_myext_domain_model_track',
         'foreign_field' => 'cd'
      ],
   ],

However, Extbase does not support the persistence of additional Domain data in
the temporary table because the corresponding Domain object does not exist.
Nevertheless, the Online documentation of the :ref:`TYPO3-Core API <t3coreapi:start>` describes the
second, more correct option for configuring m:n-relationships within IRRE. It
depends on a plain temporary table. The following example shows off the
configuration of products with their according categories:

.. code-block:: php

   'categories' => [
      'label' => 'Categories',
      'config' => [
         'type' => 'inline',
         'foreign_table' => 'tx_myext_domain_model_category',
         'MM' => 'tx_myext_product_category_mm'
      ],
   ],

This second option deserves some additional kudos because it does not need a
TCA-configuration for the temporary table *tx_myext_product_category_mm*.
You don't need to show up or edit the whole table or parts of it in the Backend -
the SQL definition is sufficient.

Those are the summarized configuration possibilities within the TCA. As you see,
the huge count of options can be overwhelming for the novice. But in the future,
they can be auto-generated by the Extension Builder (refer to Ch. 10).


As already mentioned, the TCA is stored in a file with the database table name as filename suffixed with `.php` in the directory :file:`Configuration/TCA/Overrides`

.. code-block:: php
   :caption: tx_sjroffers_domain_model_organization.php
   :name: tca-tx-sjroffers-domain-model-organization-php

   <?php
   return [
      'ctrl' => [
         'title' => 'LLL:EXT:sjr_offers/Resources/Private/Language/locallang_db.xlf:tx_sjroffers_domain_model_organization',
         'label' => 'name',
         'tstamp' => 'tstamp',
         'crdate' => 'crdate',
         'languageField' => 'sys_language_uid',
         'transOrigPointerField' => 'l18n_parent',
         'transOrigDiffSourceField'  => 'l18n_diffsource',
         'prependAtCopy' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.xlf:LGL.prependAtCopy',
         'copyAfterDuplFields' => 'sys_language_uid',
         'useColumnsForDefaultValues' => 'sys_language_uid',
         'delete' => 'deleted',
         'enablecolumns' => [
            'disabled' => 'hidden'
         ],
         'iconfile' => 'EXT:sjr_offers/Resources/Public/Icons/Icon_tx_sjroffers_domain_model_organization.svg'
      ],
      'interface' => [
         'showRecordFieldList' => 'status,name,address,telephone_number,telefax_number,url,email_address,description,contacts,offers,administrator'
      ],
      'types' => [
         '0' => ['hidden,status,name,address;;1;;,description, contacts,offers,administrator']
      ],
      'palettes' => [
         '1' => ['showitem' => 'telephone_number,telefax_number,url,email_address']
      ],
      'columns' => [
         'sys_language_uid' => […],
         'l18n_parent' => […],
         'l18n_diffsource' => […],
         'hidden' => […],
         'status' => […],
         'name' => […],
         'address' => […],
         'telephone_number' => […],
         'telefax_number' => […],
         'url' => […],
         'email_address' => […],
         'description' => […],
         'contacts' => […],
         'offers' => […],
         'administrator' => […],
      ],
   ];

The tables of all the Domain objects are defined like this.

Now we can create a directory (*SysDirectory*), which will contain all the data
sets. Let's create our first organization (see Fig. 6-12).

.. figure:: /Images/6-Persistence/figure-6-12.png
   :align: center

   Figure 6-12: The input form for creating an organization with all its offers.

Now you can set up the whole data structure. In our project, this allows the
offer-provider to set up some example data, and thus we could do some early
integration tests. However, we can not access the given data because we still
miss the repositories that will be defined in the following section.


