Preparing the database
================================================

The preparation of the database primarily covers the creation of the
database tables. The commands for the creation are done in
*SQL*. The code is put into the file
:file:`ext_tables.sql` which itself is located on the top level
of the extension directory.

.. note::

	One of the main purposes of Extbase and FLOW3 is to abstract the
	access of the underlying persistence solution. Thus, you normally won't
	get in touch with native SQL-Queries in day-to-day development, especially
	when you let the kickstarter auto-generate your database tables (have a
	look at Chapter 10). However, you should fully understand all the
	peculiarities of your database.

Preparing the tables of the Domain Objects
--------------------------------------------------------------------------------------------------

Let's have a look at the definition of the database table which will
aggregate the objects of the class
:class:`Tx_SjrOffers_Domain_Model_Organization`:

	CREATE TABLE tx_sjroffers_domain_model_organization (
	uid int(11) unsigned DEFAULT '0' NOT NULL auto_increment,
	pid int(11) DEFAULT '0' NOT NULL,

	name varchar(255) NOT NULL,
	address text NOT NULL,
	telephone_number varchar(80) NOT NULL,
	telefax_number varchar(80) NOT NULL,
	url varchar(80) NOT NULL,
	email_address varchar(80) NOT NULL,
	description text NOT NULL,
	image varchar(255) NOT NULL,
	contacts int(11) NOT NULL,
	offers int(11) NOT NULL,
	administrator int(11) NOT NULL,

	tstamp int(11) unsigned DEFAULT '0' NOT NULL,
	crdate int(11) unsigned DEFAULT '0' NOT NULL,
	deleted tinyint(4) unsigned DEFAULT '0' NOT NULL,
	hidden tinyint(4) unsigned DEFAULT '0' NOT NULL,
	sys_language_uid int(11) DEFAULT '0' NOT NULL,
	l18n_parent int(11) DEFAULT '0' NOT NULL,
	l18n_diffsource mediumblob NOT NULL,
	access_group int(11) DEFAULT '0' NOT NULL,

	PRIMARY KEY (uid),
	KEY parent (pid),
	);

``CREATE TABLE`` instructs the database to create a new
table named ``tx_sjroffers_domain_model_organization``. The
table's name is derived from the Extbase convention which describes that
class names are written in lowercase retaining the underlines.

.. note::

	The file ``ext_tables.sql`` is executed whenever the
	extension is installed. Nevertheless, TYPO3 is smart enough not to
	overwrite an existing database table. On the contrary it deduces the
	differences between the new and the existing table and just adds those
	additional informations.

The definition of the database table fields ``name``,
``address`` etc. follow in round brackets. Some of them should
sould familiar since they meet the properties' names of the class
``Organization``. However, the Extbase convention is still
present: Field names are written in ``
<replaceable>lowercase_underscore</replaceable> `` and are derived
from the property's name by prefixing every uppercase letter with an
underscore and subsequently writing the whole construct in lowercase. The
value of the property ``address`` is saved in the field
``address``. The property ``telephoneNumber`` transforms
into the fieldname ``telephone_number`` etc.

However, the table definition contains additional fields that have
no correlating property in the class :class:`Organisation`.
They are needed by TYPO3 for providing functionalities like Localization,
Workspaces and Versioning. The according TYPO3-specific fields are:

``uid`` Describes the unique identifier associated with
every record within a database table *(unique record
identifier)*.

``pid`` Every page within a TYPO3 installation has a unique
page identifier (Page ID or PID). This may be System Folder
*(SysFolder)* or even used to refer to the Frontend
page of a Content Element.

``crdate`` The UNIX timestamp of the date the record was
created *(creation date)*. This date may differ from
the creation date of the Domain Object.

``tstamp`` The UNIX timestamp of the date the record was
changed the last time. Most often this relates to the timestamp the Domain
Model was changed the last time.

``deleted`` When this fields' value differs from 0, TYPO3
handles its corresponding record as physically deleted. Thus it won't show
off neither in the Backend nor in the Frontend. It can be restored by
either setting the field to 0 or much more easily be dug out by using the
system extension *Recycler*. Extbase will set this
field whenever a record is deleted if the field is existing. Additionally,
it holds all the references to other records so that whole
*Aggregates* may be restored.

``hidden`` The record set won't show up in the Frontend if
this field's value differs from 0.

``starttime`` UNIX timestamp when the record first showed
up in the Frontend. Extbase respects that when it reads the values from
the database thus it creates the Domain Objects not before that
time.

``endtime`` UNIX timestamp when the record got "invisible"
in the Frontend (i.e. when its hidden value got non-zero). As well as with
the *starttime* field, Extbase respects this value when
it reads from the database.

``cruser_id`` The UID of the Backend user who created the
record. Currently, Extbase neither sets nor reads this value. Whenever a
Domain Object is created in the Frontend, this field is set to 0.

``fe_group`` A list of Frontend-Usergroups which can access
the record set. The logged-in Frontend-User must at least belong to this
group.

``sys_language_uid`` The language's UID which belongs to
this record set. Languages may be created using the globe at the root of
the page tree.

``l18n_parent`` The UID of the translation source, i.e. the
record set of the original language *(default)*.

``l18n_diffsource`` A serialized form of the translation
source. This is useful for showing the differences between the original
language and its translation in the Backend.

``t3ver_oid``, ``t3ver_id``,
``t3ver_wsid``, ``t3ver_label``,
``t3ver_state``, ``t3ver_stage``,
``t3ver_count``, ``t3ver_tstamp``,
``t3ver_move_id``, ``t3ver_origuid`` Those fields are
used by TYPO3 for the management of the Versioning and the Workspaces. If
they are not needed, they may be omitted.

All fields but ``uid`` and ``pid`` are optional.
However, we highly recommend creating the fields ``deleted``,
``hidden``, ``fe_group``, ``starttime`` and
``endtime`` additionally to ensure the access control. If the
Domain Objects are multi-lingual the fields ``sys_language_uid``,
``l18n_parent``, ``l18n_diffsource`` are
essential.


.. note::

	More information about Localization and Multilingualism can be
	found in Chapter 9.

.. note::

	The order of the field definitions is arbitrary. Nevertheless, it
	is recommended to set the fields which are frequently inspected in a
	SQL-tool like phpMyAdmin at the beginning since they are consequential
	arranged at the left in the table view and show up without any annoying
	scrolling.

Every line in a table definition holds various statements. The
*field type* follows the field's name. In the following
case the field ``tstamp`` takes an unsigned Integer number
(``unsigned``). The default value that is used if no value is
given when the record is created is the number 0 (``DEFAULT 0``).
The field value mustn't be NULL (``NOT NULL``) and the field
definitions are separated by a comma.``tstamp int(11) unsigned DEFAULT
'0' NOT NULL,``

.. note::

	Note that in case of the field ``tstamp`` the field
	definition is chosen somewhat awkwardly by TYPO3 since the value 0
	corresponds to the UNIX timestamp of the date 1.1.1970 00:00. It would
	be better to use the value NULL for the meaning of 'undefined' instead
	of 0. However, this inconsistency draws through the whole TYPO3 core
	thus it is very difficult to correct this weakness.

SQL databases provide various field types. Which one of them is
chosen for persisting a Domain Property depends on the kind and length of
the value that is to be saved: Text strings are saved as
``char``, ``varchar`` or ``text``. Using
``char`` and ``varchar``, their length may be set in
round brackets. Whereas ``char`` may hold up to 255 characters
with a fixed size, ``varchar`` fields can hold up to 65.535 Bytes
as well as fields containing the type ``text``. But record sets
cannot be grouped or sorted by fields with type ``text`` and they
cannot have a standard value. The type should, nonetheless, still be
chosen if grouping, sorting and setting a standard value can be resigned.
TYPO3 is usually used with the database engine MySQL which additionally
provides the developer with the field types ``mediumtext`` and
``longtext``.

.. warning::
	Always spare memory but, on the other side, don't be too penurious
	with Strings since their values are simply cut-off when exceeding the
	datatype range. This concludes with bugs and errors that are hard to
	find.

Integers are meant to have the field types ``smallint``,
``int`` and ``bigint``. If working with a MySQL database
there are additionally the fields ``tinyint`` and
``mediumint`` available. All those integer field types differ
only in the number range for which they can be used (see table
6-1).

Floating-point types can be stored in fields with the type
``decimal`` or ``float``, where ``decimal``
describes a fixed-size field type. E.g. a field defined with
``decimal(6,2)`` takes a number with 6 digits before and 2 digits
after the comma, the standard value is (10,0). The keyword
``numeric`` is a synonym for ``decimal``. The type
``float`` takes numbers from ``-1.79E+308`` to
``1.79E+308``, again, the range may be limited by a number (from
1 to 53) in round brackets.

Besides of the already defined field types there are some other
types that are, however, rather uncommon in the environment of TYPO3.
Examples for those uncommon types are ``date`` and
``datetime`` for date values following the pattern
``YYYY-MM-DD`` resp. ``YYYY-MM-DD HH:MM:SS`` or
``boolean`` datatypes for the values true and false.

.. note::

	As with fieldnames of ``char`` and ``varchar``
	the ``integer`` types may take ranges as numbers in round
	brackets upon their definition, e.g. ``int(11)``. But in
	contrast they do NOT describe the count of digits or Bytes that can be
	stored in that field. Instead, the number serves as a hint for SQL
	management tools for correctly filling up the field type's column with
	whitespaces. Thus, the fields defined with ``int(11)`` as well
	as with ``int(3)``can store the same value ranges from
	``-21.474.838.648`` to ``+21.474.838.647``. It's still
	useful to define ``integer`` data fields with their maximum
	count of digits because this befriends the database computing complex
	``JOIN``s. Thus the rule of thumb is: Always use the maximum
	possible value in round brackets when defining ``integer``
	fields (see table 6-1) plus one additional space for the sign value when
	using signed numbers.

Table 6-1 sums up all possible use-cases with their recommended data
types.

*Table 6-1: Comparison of different field types*



Configure Relationships between Objects
--------------------------------------------------------------------------------------------------

There are many relations between the objects in our Domain that have
to be persisted in the database for being able to resolve them at a later
time. It depends on the type of relationship how they can be persisted and
Extbase distinguishes between several types as already defined in Chapter
5 "Implement Relationships between Domain Objects". In memoriam to Chapter
5, following a short summary of the types:

*1:1-Relationship:* An offer has exactly one
range of time when it is valid.

*1:n-Relationship:* An organisation may have
several contact persons whereas each contact person is in charge for
exactly one organisation.

*n:1-Relationship:* An organisation has exactly
one administrator but this administrator may be in charge for several
organisations.

*m:n-Relationships:* An offer may be connected
with several categories and on the other hand one certain category may be
attached to several offers.

.. sidebar:: NULL or NOT NULL?

	All common Relational Database Management Systems (RDBMS) allow
	NULL as a special value for a field. This usually means that this value
	is kind of "not defined". However, be clear about the semantical
	differences of the values ``NULL``, ``0`` and
	``""`` (i.e. the NULL value, the number 0 and the empty
	string). The difference gets clear with the value of the participation
	fees of the ``SjrOffers`` example. If the field
	``attendance_fee`` contains the value ``NULL`` then
	the participation fee is not defined and NOT that the fee is 0 Euro.
	However, in this concrete example this may due in the same
	Frontend-output ("free of charge") but that has to be reasoned depending
	on the use-case. 

	* One cannot make calculations with ``NULL`` values.
	  The functions ``AVG``, ``SUM``, etc. ignore the
	  ``NULL`` value.
	* One cannot do comparing instructions on ``NULL``
	  values. For example, the comparison of ``NULL = NULL``
	  always leads to ``false`` due to the vagueness of
	  ``NULL``. Thus, it does not make sense to write a
	  statement like ``uid = NULL`` and there is an own
	  operator introduced for that ``IS`` which leads to
	  expressions like ``uid IS NULL``. However, Extbase
	  automagically figures out the right way for you.
	* ``NULL`` values in queries like
	  ``DISTINCT``, ``ORDER BY`` and ``GROUP
	  BY`` are seen the same way and are thus grouped
	  together.
	* Fields permitting ``NULL`` values take more memory,
	  because it is harder to improve the database engine for those SQL
	  queries.

	A general rule of thumb is to avoid ``NULL``
	values as far as your Domain Semantic allows that.

There are several techniques for persisting those relationships in a Relational Database:

*Comma-separated list (Comma-separated values,
CSV):* In a field of the parent object's table the UIDs of their
child objects are stored as comma-separated values.

*Foreign Keys:* The UID of the child object's
table is stored in a field of the parent table or vice versa.

*Intermediate Table:* For persisting the
informations of the relationships between two classes a special table is
created - the Intermediate Table. The UID of the parent table as well as
the UID of the child table is stored as an own data set of the
Intermediate Table. Additionally, there can be stored informations about
assorting, the visibility and the access control informations. They
concern the relationship of the related objects and not the objects
themself.

.. warning::
	Do not store data in the Intermediate Table that concern the
	Domain. Though TYPO3v4 supports this (especially in combination with
	*Inline Relational Record Editing (IRRE)* but this is
	always a sign that further improvements can be made to your Domain
	Model. Intermediate Tables are and should always be tools for storing
	relationships and nothing else.

	Let's say you want to store a CD with its containing music tracks:
	``CD -- m:n (Intermediate Table) -- Song``. The track number
	number may be stored in a field of the Intermediate Table. However, the
	track should be stored as a separate Domain Object and the connection be
	realized as ``CD -- 1:n -- Track -- n:1 -- Song``.

<!-- TODO: insert table and references -->Not all combinations of
relationship type and its technical persistence are sane. Table 6-2 lists
all combinations that are 1) possible and useful, 2) technically possible
but rarely sensible, 3) either technically impossible or not
supported.

<table>
<caption>Combination of reference type and technical storage</caption>

<thead>
<tr>
<td />

<td>1:1</td>

<td>1:n</td>

<td>n:1</td>

<td>m:n</td>
</tr>
</thead>

<tr>
<td>Comma-separated list</td>

<td>2)</td>

<td>2)</td>

<td>3)</td>

<td>2)</td>
</tr>

<tr>
<td>Foreign Keys</td>

<td>1)</td>

<td>1)</td>

<td>1)</td>

<td>3)</td>
</tr>

<tr>
<td>Intermediate Table</td>

<td>3)</td>

<td>3)</td>

<td>1)</td>

<td>1)</td>
</tr>
</table>

Thus, every type of relationship has its own recommended form of
persistence that will be explained subsequently. In case of a
1:1-relationship the UID of the child object will be saved in the Foreign
Key field of the parent object::

	CREATE TABLE tx_sjroffers_domain_model_offer(
	...
	contact int(11) NOT NULL,
	...
	);

``NULL`` values are explicitly allowed and stands for
*"The contact partner has not yet been assigned."*
Later on, Extbase computes the ``Contact``-object out of the
UUID.

In a ``1:n`` relationship there are two possibilities.
Either every ``uid`` value is stored as comma-separated list in a
field of the parent object. Or every child object contains the parental
uid in a foreign key field. The further is mostly used by TYPO3 in its
core but we disencourage that solution because of its drawbacks: For
example, comma-separated fields complicate the search and hinder the
indexation in the databse. Furthermore, the creation and deletion of child
objects is complex and time-consuming. Thus, using comma-separated lists
for modelling relationships should only be used with database tables that
cannot be altered in their structure (e.g. external sources, the
TYPO3-Core). We highly recommend the latter methode which stores a Foreign
Key in the table of the child object. In TYPO3, the parental object's
table holds a separate value for counting the sum of the corresponding
child objects. Consecutively, we list the definition of the relationship
between the organization and its offers of the class
``Tx_Sjr_Offers_Domain_Model_Organization``. This will later be
filled with instances of the class
``Tx_Sjr_Offers_Domain_Model_Offer``.

::

	CREATE TABLE tx_sjroffers_domain_model_organization (
	...
	offers int(11) NOT NULL,
	...
	);

The definition of the table
``tx_sjroffers_domain_model_offer`` holds the field
``organization`` as a Foreign Key.

::

	CREATE TABLE tx_sjroffers_domain_model_offer (
	...
	organization int(11) NOT NULL,
	...
	);

.. note::

	Extbase stores the relationship between ``organization``
	and the offer as a ``1:1-relationship``. This can be taken as
	advantage by adding the property ``organization`` to the class
	``Tx_Sjr_Offers_Domain_Model_Offer``. Consequently, it will be
	filled with an instance of the class
	``Tx_Sjr_Offers_Domain_Model_Organization`` and can therefore
	be used as a backreference from the offer to its corresponding
	organization.

The ``n:1`` and the ``1:n`` are pretty similar to
each other, it is just a matter of perspective. Concerning the persistence
of them, one is served with two possibilities. Either the relationship can
be stored as Foreign Key in the parent object or an Intermediate Table can
be used which is described consecutively. We prefer the Foreign Key method
because it is easier to manage.

The fourth kind of relationship which is known by Extbase is the
``m:n-relationship``. This uses an Intermediate Table for
persistence and stores the uid of the parent object as well as the uid of
the child object. The table definitions for a relationship between offer
and category are as follows::

	CREATE TABLE tx_sjroffers_domain_model_offer(
	...
	contact int(11) NOT NULL,
	...
	);

The table ``tx_sjroffers_domain_model_offer`` holds a field
``categories`` as a counter (and as a counter-part to the
``categories`` property). The Intermediate Table holds the field
``uid_local`` that takes the ``uid`` of an offer as well
as a field ``uid_foreign`` for the uid of the category. Using the
values in the fields ``sorting`` and ``sorting_foreign``
Extbase evaluates the order of the objects in the
``ObjectStorage``. While ``sorting`` orders the
categories from the perspective of an offer, ``sorting_foreign``
evaluates the order of the offers from the perspective of a
category.

.. note::

	The name of the Intermediate Table can be chosen freely. However,
	the following convention is recommended:
	``tx_myext_linkesobjekt_rechtesobjekt_mm``.

For now, we have proper SQL definitions of the Domain's tables for
each kind of relationship. In the next step we configure the
representation of the database tables and their interaction with the
Backend.



