Configure the Backend Input Forms
================================================


In our sample application the data of our extension should be editable in the 
Backend by the editors of the youth club organisation and - within certain 
limitations - in the Frontend as well providing functionalities for creation, 
update and deletion of the organisation's data. In this chapter we firstly 
configure the Backend's form inputs for easy access to the database's contents. 
The forms providing the management functionalities are stored in a certain 
PHP-Array called ``Table Configuration Array (TCA)``. In bigger extensions, as 
ours is, this Array is usually separated into two different files. The file 
``EXT:sjr_offers/ext_tables.php`` contains the basic configuration of the table 
and refers to the second file which is, in our case, called 
``EXT:sjr_offers/Configuration/TCA/tca.php``. The latter file holds a copy of 
the basic properties of the referring configuration file as well as the 
configuration of the representation of all the table fields. Whereas the first 
file is loaded on every page load, the latter file is cached and loaded just on 
demand. That improves the performance.

.. note::

	The configuration options that can be set in the TCA are very extensive and 
	a broad description of them would cause the book being bursting at its 
	seams. However, each and every option is well documented in the 
	Online-documentation of the TYPO3-API which you can find at 
	*http://typo3.org/documenta- 
	tion/document-library/core-documentation/doc_core_api/current/*.


Firstly, you should dip into the top layer of the TCA hierarchy. The file 
``EXT:sjr_offers/ext_tables.php`` contains the following entries::

	$TCA['tx_sjroffers_domain_model_organization'] = array(
		...
	);

	$TCA['tx_sjroffers_domain_model_offer'] = array(
		...
	);

	$TCA['tx_sjroffers_domain_model_person'] = array(
		...
	);



The associative Array contains all informations of all the tables of the TYPO3 
instance. Thus, we use the key ``tx_sjroffers_domain_model_organization`` and as 
value we use another nested Array holding the configurations of the 
corresponding table. Then again, this Array is separated into several parts 
whose names are the key of the nested Array.

::

	$TCA['tx_sjroffers_domain_model_organization'] = array(
		'ctrl' => array(
			...
		),
		'interface' => array(
			...
		),
		'types' => array(
			...
		),
		'palettes' => array(
			...
		),
		'columns' => array(
			'first_fieldname' => array(
				...
			),
			'second_fieldname' => array(
				...
			),
		),
	);


Subsequently, you will find the names of the parts and their meaning.



``ctrl``
This area contains configuration options that are used overall the scope of the 
table. This covers the naming of the table in the Backend, which table fields 
contain which meta data and the behavior of the table on creation and movement 
of its row sets. Meta data cover informations about Visibility and Access 
Control (e.g. ``disabled``, ``hidden``, ``starttime``, ``endtime``, 
``fe_group``), data about the History of Changes (e.g. ``versioningWS``, 
``crdate``, ``tstamp`` as well as data for the Localization of Datasets (e.g. 
``languageField``).


``interface``
This part contains information about the representation of the table data in the 
Backend's List Module. The key ``showRecordFieldList`` contains a 
comma-separated list of field values whose values will be shown in the info 
dialogue of the table. This dialogue may be reached through a right-click on the 
icon of the rowset choosing the ``Info`` option. Altering the option 
``maxDBListItems`` you can set how many rowsets will be shown in the List Module 
without switching to the detail view of the database table. Then again, the 
number of rowsets shown on a page in this perspective may be set via 
``maxSingleDBListItems``. Setting the option ``always_description`` to *true* 
the corresponding helping texts always show up.



``types``
This section defines the appearance of the Input Form for creation and update of 
a rowset. You can define several Layout types by listing several elements in the 
Array ``types``. The key of all those elements is their type (usually a number) 
and their value is another nested Array which itself usually contains one 
element with ``showItem`` as key and a list of comma-separated fieldnames which 
should emerge at the Input Form. An example of the table 
``tx_sjroffers_domain_model_organization`` is::

	'types' => array(
	'1' => array('showitem' => 'hidden,status,name,address;;1;;description, contacts,offers,administrator')
	),

Even though the behavior and the appearance of the table fields is configured in 
the section ``columns`` they must be explicitly listed in here so that they show 
up in the Input Form. This spares the trouble you would have when commenting out 
or moving away code that is already configured and a corresponding field should 
just be hidden or the overall order of the Input Form's table fields should be 
changed.

The behaviour and the appearance of a field may be altered through several 
additional parameters - as well as with the field ``address``. The notion 
convention of those additional params may seem a bit unfamiliar since they are 
appended behind the fieldname and separated through a semi-colon. On first 
position there is the fieldname; on the second an alternative naming fieldname; 
at third place follows the number of the palette (refer to the next book 
section); the fourth position holds extensive options which are separated 
through colons and the last place contains informations about the appearance 
(e.g. color and strucure). The information at the fourth place allow the use of 
the *Richt Text Editore*. For a full list of the options refer to the already 
mentioned TYPO3-Online documentation for the TYPO3-Core API.



``palettes``
Palettes are used to collect occasionally used fields and show them up on 
demand. The Backend user therefore has to choose the Extended View in the 
Backend's List module. Palettes are connected to a durable visible field. An 
example from the table ``tx_sjroffers_domain_model_organization`` is::


	'palettes' => array(
		'1' => array('showitem' => 'telephone_number,telefax_number,url,email_address')
	),

The structure is the same as in the section *types* where ``address;;1;;`` 
refers to the palette with the number 1.



``columns``
This Array contains information about the behavior and the appearance in the 
Input Form of every table field. The fieldname is the key and, again, the value 
is a nested Array holding the field's corresponding configuration. The field 
configuration for the input of the name of an organisation would be as follows::

	'name' => array(
		'exclude' => 0,
		'label'	=> 'LLL:EXT:sjr_offers/Resources/Private/Language/locallang_db.xml:tx_sjroffers_domain_model_organization.name',
		'config' => array(
			'type' => 'input',
			'size' => 20,
			'eval' => 'trim,required',
			'max' => 256
		)
	),

The field name is *name*. Firstly, we define some options that are independent 
from the field's type. This contains foremostly the fieldlabel (*label*), the 
conditions for the visibility of the field (``exclude``, ``displayCond``) as 
well as informations for its localization (``l10n_mode``, ``l10n_cat``). The 
fieldname is, in our case, localized and will be taken from a language file 
(head to Ch. 9).

The Array connected to ``config`` contains the field type and its corresponding 
configuration. TYPO3 serves with a great range of pre-defined field types, e.g. 
text fields, date fields or selection fields. Each and every type has its own 
presentation and procession options. Consecutively, you will find a list of all 
the field types with their usual configurations:



Field type "input"
-------------------------------------------------

The *input* field type accepts one-line character strings like names and 
telephone numbers. The configuration of a name field (see Fig. 6-1) looks as 
follows::

	'name' => array(
		'label'	=> 'Organization's name',
		'config' => array(
			'type' => 'input',
			'size' => 20,
			'eval' => 'trim,required',
			'max' => 256
		)
	),

The given string will be truncated to 256 signs (``'max' => 256``), ending 
spaces will be dropped (``trim``) and the persistence of an empty field will be 
prevented (``required``).

.. figure:: /Images/6-Persistence/figure-6-1.png
	:align: center

	Figure 6-1: An example for the field type "input" used as a name field.

The field type ``input`` may be used for date and time inputs::

	'minimum_value' => array(
		'label'	=> 'valid since',
		'config' => array(
		'type'	=> 'input',
		'size' => 8,
		'checkbox' => '',
		'eval' => 'date'
		)
	),

The value then will be tested for being given in a sane date format. 
Simultaneously, this leads to the rendering of a collapsable calendar page in 
shape of an icon right to the input field which is shown in Fig. 6-2:

.. figure:: /Images/6-Persistence/figure-6-2.png
	:align: center

	Figure 6-2: An example for the field type "input" used as a date field.

Field type "text"
-------------------------------------------------

The ``text`` field type may contain multi-line formatted or unformatted texts 
e.g. product descriptions, addresses or news items. The indication of the lines 
(``rows``) and the columns (``cols``) specifys the area of the text input field.

::

	'address' => array(
		'label' => 'Address:',
		'config' => array(
			'type' => 'text',
			'cols' => 20,
			'rows' => 3
		)
	),

.. figure:: /Images/6-Persistence/figure-6-3.png
	:align: center

	Figure 6-3: An example for the field type "text".


Field type "check"
-------------------------------------------------

The field type ``check`` allows the definition of a single option (see Fig. 6-4)
 e.g. you can define whether a rowset should be hidden or not.

::

	'hidden' => array(
		'label'	=> 'Hide:',
		'config' => array(
			'type' => 'check'
		)
	),

.. figure:: /Images/6-Persistence/figure-6-4.png
	:align: center

	Figure 6-4: An example for the field type "check" for a single option.

Several related options which can be individually selected can be grouped to a 
field (see Fig. 6-5). This may be helpful e.g. for a selection of valid weekdays 
or recommended training levels of a certain exercise.

:: 

	'level' => array(
		'exclude' => 1,
		'label' => 'Property for',
		'config' => array(
			'type' => 'check',
			'eval' => 'required,unique',
			'cols' => 5,
			'default' => 31,
			'items' => array(
				array('Level 1',''),
				array('Level 2',''),
				array('Level 3',''),
				array('Level 4',''),
				array('Level 5',''),
			)
		)
	),


<!-- TODO: look, how math is being processed for the coming exp-value -->
The value that is written to the database is of type Integer. This will be 
computed by bitwise addition of the checkboxes states (which can be 1 or 0). The 
first element (Level 1) is the least significant Bit (= 2^0 = 1). The second 
element is one level above (= 2^1 = 2), the third element will then be (= 2^2 = 
4) etc. The selection in the following Figure (see Fig. 6-5) would lead to the 
following Bit-Pattern (= binary-written number): 00101. This binary number is 
equivalent to the Integer value 5.

.. figure:: /Images/6-Persistence/figure-6-5.png
	:align: center

	Figure 6-5: An example for the field type "check" for several options that are grouped together.

Field type "radio"
-------------------------------------------------

The field type radio is for choosing one unique value for a given property (see 
Fig. 6-6), e.g. the sex of a person or the color of a product.

::

	'gender' => array(
		'label' => 'Sex',
		'config' => array(
			'type'	=> 'radio',
			'default' => 'm',
			'items'	=> array(
				array("male", 'm'), array('female', 'f')
			)
		)
	),

The options (*items*) are given in an Array and each option is an Array itself 
containing the label and the key used for persist the selected option in the 
database.

.. figure:: /Images/6-Persistence/figure-6-6.png
	:align: center

	Figure 6-6: An example for the field type "radio".

Field type "select"
-------------------------------------------------

The field type "select" provides a space-saving way to render multiple values 
(see Fig. 6-7). Examples could be a member status, a product color or a region.

:: 

	'status' => array(
		'exclude' => 0,
		'label'	=> 'Status',
		'config' => array(
			'type' => 'select',
			'foreign_table' => 'tx_sjroffers_domain_model_status',
			'maxitems' => 1
		)
	),

The options are taken from another database table (*foreign_table*) and by 
setting *maxitems* to 1 (which is standard) the selection box will be limited to 
exactly one showed item.

.. figure:: /Images/6-Persistence/figure-6-7.png
	:align: center

	Figure 6-7: An example for the field type "select" showing a selection box.

The type ``select`` may also be used to select a whole subset of values. This is 
used for categories, tags or contact persons (see Fig. 6-8).

::

	'categories' => array(
		'exclude' => 1,
		'label'	=> 'Categories',
		'config' => array(
			'type' => 'select',
			'size' => 10,
			'minitems' => 0,
			'maxitems' => 9999,
			'autoSizeMax' => 5,
			'multiple' => 0,
			'foreign_table' => 'tx_sjroffers_domain_model_category',
			'MM' => 'tx_sjroffers_offer_category_mm'
		)
	),

Again, this takes the options of another table but it holds the references in a 
temporary table *tx_sjroffers_offer_category_mm*.

.. figure:: /Images/6-Persistence/figure-6-8.png
	:align: center

	Figure 6-8: An example for the field type "select".

Field type "group"
-------------------------------------------------

The "group" field type is very flexible in its use. It can be used to manage 
references to resources to the filesystem or rowsets of a database (see Fig. 6-9).

::

	'images' => array(
		'label' => 'Bilder',
		'config' => array(
			'type' => 'group',
			'internal_type' => 'file',
			'allowed' => 'gif,jpg',
			'max_size' => 1000,
			'uploadfolder' => 'uploads/pics/',
			'show_thumbs' => 1,
			'size' => 3,
			'minitems' => 0,
			'maxitems' => 200,
			'autoSizeMax' => 10
		)
	),

The combination of ``type`` and ``internal_type`` specifies the field's type. 
Besides of ``file`` there exist several other types like ``file_reference``, 
``folder`` and ``db``. While ``file`` leads to a copy of the original file which 
is then being referenced the type ``file_reference`` leads to a direct reference 
to the original file. ``db`` leads to a direct reference to a database rowset.

.. note::

	Extbase currently does not resolve relations to other rowsets since the 
	relations are currently persisted as comma-separated values in the database 
	field (pic1.jpg,pic2.jpg,pic3.jpg). However, this can be resolved in a 
	*ViewHelper* in Fluid when the data shows up (see the entry *f:image* in 
	Appendix C)

.. figure:: /Images/6-Persistence/figure-6-9.png
	:align: center

	Figure 6-9: An example for the field type "group".

Field type "none"
-------------------------------------------------

Fields of this type show up the raw data values which cannot be edited (see Fig. 6-10).

::

	'date' => array(
		'label'	=> 'Datum (Timestamp)',
		'config' => array(
			'type' => 'none'
		)
	),

In contrast to the date field with the type ``input`` there is no evaluation as 
with ``'eval' => 'date'``. The timestamp which is set in the database will be 
shown as a raw number.

.. figure:: /Images/6-Persistence/figure-6-10.png
	:align: center

	Figure 6-10: An example for the field type "none" for a date field.

Field type "passthrough"
-------------------------------------------------

The field type "passthrough" is for data which are processed internly but cannot 
be edited or viewed in the Form. An example for that would be informations to 
references (Foreign Keys).

::

	'organization' => array(
		'config' => array(
			'type'	=> 'passthrough'
		)
	),

This field configuration in the database table 
``tx_sjroffers_domain_model_offer`` has the effect that the property 
``organization`` of the ``Offer``-object will be filled with the correct object.


Field type "user"
-------------------------------------------------

User generates free definable form fields which can be processed by any PHP 
function. For further information, refer to the documentation which is available 
online and to the TYPO3-Code API.



Field type "flex"
-------------------------------------------------

The field type "flex" manages complex inline form fields (*FlexForms*). The 
formular data will be saved as XML data structure in the database fields. 
Extbase uses FlexForms for persisting Plugin configuration but not to save 
Domain data. If your Plugin data will be rather complex we encourage you to 
design an own Backend module for them (refer to Ch. 10).



Field type "inline"
-------------------------------------------------

The field type "inline" is for saving complex Aggregates of the Domain (see Fig. 
6-11). Basis of this field type is the so called *Inline Relational Record 
Editing (IRRE)* which powers the creation, update and deletion of Domain-objects 
of whole Aggregates in a single Input Form. Without *IRRE* the Domain-objects 
must be edited and connected each by itself which would require an intermediate 
save. This technique is a comfortable tool for managing complex Aggregates. All 
the possibilities provided by IRRE are well documented in the TYPO3-Core API 
(refer to *http://typo3.org/documentation/ 
document-library/core-documentation/doc_core_api/4.3.0/view/4/2/)*.

::

	'offers' => array(
		'label'	=> 'Offers',
		'config' => array(
			'type' => 'inline',
			'foreign_table' => 'tx_sjroffers_domain_model_offer',
			'foreign_field' => 'organization',
			'maxitems'	=> 9999
		)
	),

The configuration is almost identical to the field type "select". However, there 
are several more possibilities for the configuration of the management and the 
representation of the connected objects.

.. figure:: /Images/6-Persistence/figure-6-11.png
	:align: center

	Figure 6-11: An example for the field type "irre".

Extbase supports the most important aspects of *IRRE* with only one exception: 
*IRRE* allows a temporary table of an ``m:n-relationship`` to be enhanced by 
additional fields which can hold Domain data. An example: Assume that we want to 
connect a CD to it's containing music tracks, whereas a CD can contain multiple 
tracks and one track can be present on several CD's. Thus, we can derive the 
following temporary table:

``CD --1:n-- Temporary-Table --n:1-- Title``



The corresponding *IRRE*-Configuration looks as follows::

	'titles' => array(
		'label' => 'Track Title',
		'config' => array(
			'type' => 'inline',
			'foreign_table' => 'tx_myext_cd_title_mm',
			'foreign_field' => 'uid_local',
			'foreign_selector' => 'uid_foreign'
		)
	),

The *IRRE*-Tutorial describes this configuration as "state-of-the-art" for 
m:n-relationships. The option ``foreign_selector`` leads to a selection box for 
the music titles. Currently, *IRRE* only supports this option for 
m:n-relationships.

Every music track on the CD is given a unique track number. However, the track 
number is a neither a property of the CD nor that of a track. It's semantically 
corresponding to the relationship *between* them. Thus, IRRE provides the option 
to persist them within the temporary table and this can always be modelled into 
the Domain model which gets the following structure: ``CD --1:n-- Track --n:1-- 
Title``.

Let's change the configuration of the table ``tx_myext_domain_model_track`` to a 
simple 1:n-relationship with ``cd`` as a foreign key.

::

	'tracks' => array(
	'label' => 'Track',
	'config' => array(
	'type' => 'inline',
	'foreign_table' => 'tx_myext_domain_model_track',
	'foreign_field' => 'cd'
	)
	),

However, Extbase does not support the persistence of additional Domain data in 
the temporary table because the corresponding Domain object does not exist. 
Nevertheless, the Online documentation of the *TYPO3-Core API* describes the 
second, more correct option for configuring m:n-relationships within IRRE. It 
depends on a plain temporary table. The following example shows off the 
configuration of products with their according categories:

::

	'categories' => array(
		'label' => 'Categories',
		'config' => array(
			'type' => 'inline',
			'foreign_table' => 'tx_myext_domain_model_category',
			'MM' => 'tx_myext_product_category_mm'
		)
	),

This second option deserves some additional kudos because it does not need a 
TCA-configuration for the temporary table *tx_myext_product_category_mm* because 
you don't need to show up or edit the whole table or parts of it in the Backend; 
the SQL definition is sufficiently.

Those are the summarized configuration possibilities within the TCA. As you see, 
the huge count of options can be overwhelming for the novice. But in future, 
they can be auto-generated by the Kickstarter (refer to Ch. 10).

As already mentioned, the TCA is normally split into two different files due to 
performance reasons: The first part contains the general configurations of the 
table and is loaded with every page load compared to the second part which 
contains configurations for the table columns and are only loaded as necessary. 
In our example Extension the first part which is saved in ``ext_tables.php`` 
contains the following stuff::

	$TCA['tx_sjroffers_domain_model_organization'] = array(
		'ctrl' => array(
		'title'		=> 'LLL:EXT:sjr_offers/Resources/Private/Language/ locallang_db.xml:tx_sjroffers_domain_model_organization',
		'label'		=> 'name',
		'tstamp'	=> 'tstamp',
		'crdate'	=> 'crdate',
		'languageField' => 'sys_language_uid',
		'transOrigPointerField'		=> 'l18n_parent',
		'transOrigDiffSourceField'  => 'l18n_diffsource',
		'prependAtCopy'				=> 'LLL:EXT:lang/locallang_general.xml:LGL.prependAtCopy',
		'copyAfterDuplFields'		=> 'sys_language_uid',
		'useColumnsForDefaultValues' => 'sys_language_uid',
		'delete'	=> 'deleted',
		'enablecolumns' => array(
		'disabled'	=> 'hidden'
		),
		'dynamicConfigFile'		=> t3lib_extMgm::extPath($_EXTKEY) . 'Configuration/TCA/tca.php',
		'iconfile'	=> t3lib_extMgm::extRelPath($_EXTKEY) . 'Resources/Public/Icons/icon_tx_sjroffers_domain_model_organization.gif'
		)
	);



This file only contains the essential *ctrl* section. The value corresponding to 
the key *dynamicConfigFile* holds the filepath to the file which contains the 
second part of the TCA; whereby the filepath and the filename can be chosen 
freely. However, the file should resist in the directory *Configuration* (or any 
subdirectory). The corresponding second part of the file *TCA.php* is as 
follows::


	$TCA['tx_sjroffers_domain_model_organization'] = array(
		'ctrl' => $TCA['tx_sjroffers_domain_model_organization']['ctrl'],
		'interface' => array(
		'showRecordFieldList' => 'status,name,address,telephone_number,telefax_number,url,email_address,description,contacts,offers,administrator'),
		'types' => array(
		'1' => array('showitem' => 'hidden,status,name,address;;1;;,description, contacts,offers,administrator')
		),
		'palettes' => array(
		'1' => array('showitem' => 'telephone_number,telefax_number,url,email_address')
		),
		'columns' => array(
		'sys_language_uid' => array(...),
		'l18n_parent' => array(...),
		'l18n_diffsource' => array(...),
		'hidden' => array(...),
		'status' => array(...),
		'name' => array(...),
		'address' => array(...),
		'telephone_number' => array(...),
		'telefax_number' => array(...),
		'url' => array(...),
		'email_address' => array(...),
		'description' => array(...),
		'contacts' => array(...),
		'offers' => array(...),
		'administrator' => array(...),
		)
	);

On the top we can see the backreference to the TCA's first part *ctrl* and below 
all the residual parts of the configuration. The tables of all the Domain 
objects are defined like this.

Now we can create a directory (*SysDirectory*) which will contain all the data 
sets. Let's create our first organization (see Fig. 6-12).

.. figure:: /Images/6-Persistence/figure-6-12.png
	:align: center

	Figure 6-12: The input form for creating an organization with all its offers.

Now you can set up the whole data structure. In our project this allows the 
offer-provider to set up some example data and thus we could do some early 
integration tests. However, we can not access the given data because we still 
miss the Repositories that will be defined in the following section.


Creating the Repositories
-------------------------------------------------


We have already introduced the Repositories in Chapter 3. They serve with 
capabilities to save and reaccess our objects. We set up such a Repository 
object for every Aggregate-Root object which are, then again, used for accessing 
all the Aggregate-Root's corresponding objects. In our concrete example 
``Tx_SjrOffers_Domain_Model_Organization`` is such an Aggregate-Root object. The 
Repository's class name is derived from the class name of the Aggregate-Root 
object concatenated with the suffic *Repository*. The Repository needs to extend 
the class ``Tx_Extbase_Persistence_Repository``. The class file ``Tx_ 
SjrOffers_Domain_Repository_OrganizationRepository`` will be saved in the 
directory *EXT:sjr_ offers/Classes/Domain/Repository/*. Thus the directory 
*Repository* is on the same hierarchy-level as the direcory *Model*. In our 
case, the class body remains empty because all the important functionalities are 
already generically implemented in the super-class 
``Tx_Extbase_Persistence_Repository``.

::
	class Tx_SjrOffers_Domain_Repository_OrganizationRepository extends Tx_Extbase_Persistence_Repository {}

We create a ``Tx_SjrOffers_Domain_Repository_OfferRepository`` exactly the same 
way but we will later extend it with own methods for accessing offers. It's very 
likely that we have to access the other objects for categories, regions and 
update data of contact informations of certain persons independent of the offers 
or their organizations. Thus we define some additional Repositories for those 
objects for easier access from the Frontend.

.. note::

	You have to resist the urge to define Repositories for each object and limit 
	yourself to a minimal number of Repositories. Instead, you should define the 
	access methods within the Aggregate-Root objects as ``find`` methods.

``Tx_Extbase_Persistence_Repository`` serves with the following methods which 
are of course accessable and overwritable in the extending child derivations:



``add($object)``
-------------------------------------------------

Adds an object to the Repository which is then persistent in the sense of 
Domain-Driven Design. But be careful, it will not written (and enhanced with an 
``UID``) to the database before finishing the loop through the Extension, to be 
precise after the call of the method ``persistAll()`` of the 
``PersistenceManager``.


``remove($object)`` and ``removeAll()``
-------------------------------------------------

The opponent of ``add()``. An object will be removed from the Repository and is 
gonna be deleted from the database after finishing the Extension's loop. The 
method ``removeAll()`` empties the whole Repository.

``replace($existingObject, $newObject)``
-------------------------------------------------

Replaces an existing object with a new object. Instead of the combination of 
``add()`` and ``remove()`` this method keeps the existing object in the 
database.



``update($modifiedObject)``
-------------------------------------------------

An existing object in the Repository will be updated with the properties of the 
given object. Extbase finds the to-be-updated object by the uid of the given 
object and throws an exception if it does not exist.


``findAll()`` and ``countAll()``
--------------------------------------------------------------------------------------------------

Returns all the Repository's objects that are currently persisted in the 
database. However, this slightly confusing behaviour is intended. Whereas 
``findAll()`` returns an Array of objects the method ``countAll()`` only counts 
the currently persisted objects (if the database backend is of type SQL it just 
executes the query ``SELECT COUNT``) and returns an Integer number.



``findByProperty($value)``, ``findOneByProperty($value)`` and ``countByProperty($value)``
---------------------------------------------------------------------------------------------------------------------------------------------------

Those three methods help by finding one or several objects and by counting all 
the objects that correspond to the given value. The substring *Property* must be 
replaced by the uppercase-written property name of the class that is managed by 
the Repository. The methods then only return the objects as well count the 
objects whose properties *Property* correspond to the given value. Whereas the 
method ``findByProperty()`` returns an Array of all the matching objects, the 
methode ``findOneByProperty()`` only returns the first object that was found. 
That is, assuming that no certain sorting order was given, the order in which 
the objects were created in the Backend. Last but not least, the method 
``countByProperty()`` returns the count of the objects that would be returned if 
``findByProperty()`` was given the same value and is, of course, an Integer 
number.



``createQuery()``
-------------------------------------------------

In opposite to the methods above, this function does not manage objects in the 
Repository. Instead, it returns a Query object which can be helpful to assemble 
own queries to the Storage-Backend. The details for this procedure will be given 
in the following chapter.

Before accessing the defined objects on the Repository you need to tell Extbase 
on which pages on TYPO3's page tree (see below for TYPO3's concept of the page 
tree) it should seek and file the objects. Without any further definitions 
Extbase will use the page tree's root (the globe).



Generally there are three cases which need to be distinguished: Persisting a 
newly created object, reaccessing an existing object and updating the properties 
of an existing object. When creating a new object Extbase determines the 
destination pages in the following rule hierarchy:

<procedure>


<!-- TODO: Check if the work for "Ausgangspunkt" is used as in Ch. 4 -->
* If, as already described in Chapter 4, the option *source* is checked then the objects will be searched in the corresponding pages
* If the TypoScript-Setup of the page contains the definition of ``plugin.tx_*extensionname*.persistence.storagePid`` with a comma-separated list of PIDs then those pages will be consulted.
* If the TypoScript-Setup of the page contains the definition of ``config.tx_extbase.persistence.storagePid`` with a comma-separated list of PIDs then those pages will be consulted.
* If none of the cases from above applies, then the root page will be consulted for the objects.

</procedure>

When insertion of new Domain objects happens, then the procedure will be as follows:

<procedure>

* If there's a TypoScript setup at ``plugin.tx_extensionname.persistence.classes.*FullClassName*.newRecordStoragePid`` with a single page value, then this is gonne be used.
* If there's a TypoScript setup at ``config. tx_extbase.persistence.classes.*FullClassName*.newRecordStoragePid`` with a single page value, the this is gonna be used.
* If none of the cases above apply, then the object will be inserted at the first item in the list of search pages. So to say, in the end the root page (the one with the globe) is gonna be used for insertion.

</procedure>



When updating the Domain objects their PID is not changed. However, you can 
implement the property ``pid`` in your domain object with its corresponding set- 
and get-methods. Then a domain object may be moved from one page to another by 
setting a new ``pid``.

.. note::

	Most occuring mistake for seemingly empty Repositories is a mis-configured 
	*Storage-PID*. Thus, you should firstly evaluate the Template Module whether 
	it is set correctly.


Besides of the options for setting the Page UID there exist two other 
possibilities for configuring the Persistence Layer: 
*enableAutomaticCacheClearing* and *updateReferenceIndex*. The option 
``config.tx_extbase.persistence.enableAutomaticCacheClearing = 1`` within the 
TypoScript setup leads to a deletion of the Cache whenever the data is 
rewritten. This option is normally activated.


.. sidebar:: TYPO3 v4's Page Tree

	In TYPO3 each Content Element and Dataset which should be rendered in the 
	Backend corresponds to a certain Page. Technically, a page is nothing more 
	than a a Node Element or a leaf in the virtual Page Tree. Every page is 
	associated with a unique Page ID (PID). Some of the pages are reachable via 
	a URL and TYPO3 renders and delivers them (usually in HTML). For example, 
	the URL *http://www.example.com/index.php?id=123* requests the Page with the 
	PID 123. In this case, the term Page has the meaning of being a Webpage. But 
	there are other cases, e.g. a directory (*SysFolder*) or a separator which 
	are used to save data in a clear and structured way. A special already 
	existing PID is 0 which is used to refer to the root page (the one with the 
	shiny globe). TYPO3 v5 will use the concept of the Page Tree, too. But it 
	will do many things much better such as the clear separation of Contents and 
	Structure. While v4 interlaces the structure of a Page Tree into every 
	aspect of data persistence, v5 treats alternative structurization principles 
	such as trees of categories or timelines equally well.

.. note::

	Usually, datasets will be saved into Folders in the Page Tree though the 
	pages using those datasets will be somewhere else. If their cache should be 
	cleared as well then you should set up their PIDs in the field *TSConfig* of 
	the page's preferences of the directory. For example, out Offers will be 
	shown on the pages with the PIDs 23 and 26 (let's say for a Single and a 
	List View). Then we will configure the variable ``TCEMAIN.clearCacheCmd = 
	23,26`` in the page preferences of the SysFolder. Then the Cache of these 
	pages will be cleared as well and changes of an Offer will show up 
	immediately. Alternatively, you can use the extension 
	*nc_beclearcachehelper* for managing your cache preferences.


Internally, TYPO3 manages an index of all relationships between two datasets the 
so-called *RefIndex*. Due to this index it's possible to show the number of 
associated datasets in the list module's column *[Ref.]*. By clicking on the 
number you get further informations about the incoming and outgoing references 
of the dataset. This index is automatically updated when any datasets get 
edited. The configuration ``config.tx_extbase.persistence.updateReferenceIndex = 
1`` effects an update when datasets get edited in the Frontend though it is 
normally deactivated due to its huge effects on performance. Before calling a 
Repository's methods they need to be instantiated at first with the TYPO3-API 
method ``makeInstance()``::

	$offerRepository = t3lib_div::makeInstance('Tx_SjrOffers_Domain_Repository_ OfferRepository');

.. warning::

	Repositories are *Singletons* therefore there may only exist one instance of 
	each class at one time of script-execution. If a new instance is requested, 
	the system will prove whether an instance of the requested object exists and 
	will instead of creating a new object return the existing one. This is 
	ensured by using the ``makeInstance()``. Thus, never ever use the PHP syntax 
	keyword ``new`` for creating a Repository object because the objects that 
	are placed there will not be automatically persisted.

Now you know all the basic tools for durable persistation and recovering of your 
objects. Extbase offers a lot more sophisticated functionalities for special 
needs because it happens quite frequently that the standard methods of saving 
and seeking data in a Repository are not sufficient for the individual case. 
Thus Extbase let's you define individual requests without losing the existing 
abstractions of the existing Persistence Backend. Additionally, Extbase let's 
you use "foreign" Data Sources which are most often data tables of the same 
database. With Extbase version 1.2 you may even persist whole class hierarchies 
in a database table so that you don't have to define a special table for each 
Domain object. The following Sections will describe the possibilities of sophisticated data persistation.

