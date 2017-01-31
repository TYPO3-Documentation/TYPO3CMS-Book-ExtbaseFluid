.. include:: ../Includes.txt

.. _individual_database_queries:

Individual Database Queries
================================================

The previous descriptions about generic methods of queries to a Repository are
sufficient for simple use-cases. However, there are many cases where they are
not adequate and require more flexible solutions. On the requirements list of
our application is the functionality to print a list of all the offers. In
natural language this would sound as follows:

* "Find all the offers for a certain region."
* "Find all the offers corresponding to a certain category."
* "Find all the offers containing a certain word."
* "Find offers that are associated to a selected set of organizations."

There are principally two ways of implementing such methods. On the one hand, you
could request all the offers from the Backend and filter them manually. This is
flexible and easy to implement. On the other hand, you could write a request
matching your criteria exactly and execute it. Contrary to the first case,
this method would only build the objects that are really needed, which
positively affects the performance of your application.


.. note::

    You may start developing your application using the first method and then,
    seeing your application growing, veer to the second method. Luckily, all
    the changes are encapsulated in the Repository, so you don't have
    to change any code out of the Persistence Backend.


You can use Extbase's *Query*-object for implementing individual queries by
giving it all the essential information needed for a qualified request to the
database backend. Those information contain:

* The request's class (*Type*) to which the request applies.
* An (optional) *Constraint* which restricts the result set.
* (Optional) Parameters which configure a section of the result set by a *limit* or an *offset*.
* (Optional) Parameters concerning the *Orderings* of the result set.

Within a Repository you can create a Query object by using the command
``$this->createQuery()``. The Query object is already customized to the class
which is managed by the Repository. Thus, the result set only consists of
objects of that class, i.e. it consists of Offer objects within the
``OfferRepository``. After giving all needed information to the Query object
(detailed information will be given later on) you execute the request by using
``execute()`` which returns a sorted Array with the properly instantiated
objects (or a via limit and offset customized section of it). For example, the
generic method ``findAll()`` looks as follows::

    public function findAll() {
        return $this->createQuery()->execute();
    }

In this simple first use-case we don't apply any constraining parameter to the Query
object. However, we have to define such a parameter to implement the first
specified request, "Find all the offers for a certain region". Thus, the
corresponding method looks as follows::

    public function findInRegion(\MyVendor\SjrOffers\Domain\Model\Region $region) {
        $query = $this->createQuery();
        $query->matching($query->contains('regions', $region));
        return $query->execute();
    }

Using the method ``matching()`` we give the Query the following condition: The
property *regions* of the object *Offer* (which is managed by the Repository)
should contain the region that is referenced by the variable ``$region``. The
method ``contains()`` returns a *Constraint* object. The Query object has some
other methods each of which returns a *Constraint* object. Those methods may be
roughly split into two groups: Comparing operations and Boolean operations.
The first group leads to a comparison between the value of a given property
and another operand. The latter mentioned operations connect two conditions to
one condition by the rules of Boolean Algebra and may
respectively negate a result. The following Comparing operations are acceptable::

    equals($propertyName, $operand, $caseSensitive = TRUE)
    in($propertyName, $operand)
    contains($propertyName, $operand)
    like($propertyName, $operand)
    lessThan($propertyName, $operand)
    lessThanOrEqual($propertyName, $operand)
    greaterThan($propertyName, $operand)
    greaterThanOrEqual($propertyName, $operand)

The method ``equals()`` executes a simple comparison between the property's
value and the operand which may be a simple PHP data type or a Domain object.

Contrarily, the methods ``in()`` and ``contains()`` accept multi-value data types
as arguments (e.g. Array, ObjectStorage). As ``in()`` checks if a single-valued
property exists in a multi-value operand, the latter method ``contains()``
checks if a multi-valued property contains a single-valued operand. The opposite
of the introduced method ``findInRegion()`` is ``findOfferedBy()`` which accepts
a multi-valued operand (``$organizations``).

::

    public function findOfferedBy(array $organizations) {
        $query = $this->createQuery();
        $query->matching($query->in('organization', $organizations));
        return $query->execute();
    }

.. note::

    The methods ``in()`` and ``contains()`` were introduced in Extbase version
    1.1. If you pass an empty multi-valued property value or an empty
    multi-valued operand (e.g. an empty Array) to them you always get a *false*
    as return value for the test. Thus you have to prove if the operand
    ``$organizations`` of the method call ``$query->in('organization',
    $organizations)`` contains sane values or if it is just an empty Array. This
    is dependent on your domain logic. In the last example the method
    ``findOfferedBy()`` would return an empty set of values.


It's possible to use comparison operators that are reaching deep into the object tree
hierarchy. Let's assume you want to filter the organizations by whether
they have offers for youngsters older than 16. You may define the request in the
``OrganizationRepository`` as follows::

    $query->lessThanOrEqual('offers.ageRange.minimalValue', 16)

Extbase solves the path ``offers.ageRange.minimalValue`` by seeking every
organization having offers whose age values have a minimum less than or
equal to 16. Assuming that a Relational Database System is used in the Persistence
Backend, this is internally solved by a so-called *INNER JOIN*. All relational
types (1:1, 1:n, m:n) and all comparison operators are covered by this feature.

.. note::

    The path notation was introduced in Extbase 1.1 and is derived from the
    *Object-Accessor* notation of Fluid (see Ch. 8). In Fluid you may access
    object properties with the notation ``{organization.administrator.name}``.
    However, Fluid does not support the notation
    ``{organization.offers.categories.title}``, so that in
    ``$query->equals('offers.categories.title', 'foo')`` it is possible to die,
    due to Fluid's limitation that property access is not possible in a
    "concatenated way".

Besides comparison operators, the ``Query`` object supports Boolean
Operators such as::

    logicalAnd($constraint1, $constraint2)
    logicalOr($constraint1, $constraint2)
    logicalNot($constraint)

The methods above return a ``Constraint`` object. The resulting ``Constraint``
object of ``logicalAnd()`` is true if both given parameters ``$constraint1`` and
``$constraint2`` are true. It's sufficient when using ``logicalOr()`` to
be true if only one of the given parameters is true. Since Extbase 1.1, both methods
accept an Array of constraints. Last, but not least, the function
``logicalNot()`` inverts the given ``$constraint`` to its opposite, i.e. *true*
yields *false* and *false* yields *true*. Given this information, you can create
complex queries such as::

    public function findMatchingOrganizationAndRegion(\MyVendor\SjrOffers\Domain\Model\Organization $organization, \MyVendor\SjrOffers\Domain\Model\Region $region) {
        $query = $this->createQuery();
        $query->matching(
            $query->logicalAnd(
                $query->equals('organization', $organization),
                $query->contains('regions', $region)
            )
        );
        return $query->execute();
    }

The method ``findMatchingOrganizationAndRegion()`` returns those offers that
match both the given organization and the given region.

For our example extension we have the complex specification to find all offers
that comply with the requirements of the user. The requirements are given
via information about the age, the organization, the city district, and the category,
as well as a freely defined search term in the front end. We encapsulate the requirements
in their own ``Demand`` object that basically consists of the properties ``age``, ``organisation``,
``region``, ``category`` and ``searchWord``, plus their getters and setters.
In addition to the restrictions for the needs of the user, there comes the request
to show the current offers. This example request denotes a date constraint at most one week ago.
In the method ``findDemanded()`` of the ``offerRepository``, the request is implemented::

    public function findDemanded(\MyVendor\SjrOffers\Domain\Model\Demand $demand) {
        $query = $this->createQuery();
        $constraints = array();
        if ($demand->getRegion() !== NULL) {
            $constraints[] = $query->contains('regions', $demand->getRegion());
        }
        if ($demand->getCategory() !== NULL) {
            $constraints[] = $query->contains('categories', $demand->getCategory());
        }
        if ($demand->getOrganization() !== NULL) {
            $constraints[] = $query->contains('organization', $demand->getOrganization());
        }
        if (is_string($demand->getSearchWord()) && strlen($demand->getSearchWord()) > 0) {
            $constraints[] = $query->like($propertyName, '%' . $demand->getSearchWord . '%');
        }
        if ($demand->getAge() !== NULL) {
            $constraints[] = $query->logicalAnd(
                $query->logicalOr(
                    $query->equals('ageRange.minimumValue', NULL),
                    $query->lessThanOrEqual('ageRange.minimumValue', $demand->getAge())
                ),
                $query->logicalOr(
                    $query->equals('ageRange.maximumValue', NULL),
                    $query->greaterThanOrEqual('ageRange.maximumValue', $demand->getAge())
                ),
            );
        }
        $constraints[] = $query->logicalOr(
            $query->equals('dateRange.minimumValue', NULL),
            $query->equals('dateRange.minimumValue', 0),
            $query->greaterThan('dateRange.maximumValue', (time() - 60*60*24*7))
        );
        $query->matching($query->logicalAnd($constraints));
        return $query->execute();
    }

The ``Demand`` object is passed as an argument. In the first line, the ``Query`` object is created.
All single constraint terms are then collected in the array ``$constraints``. The
``$query->logicalAnd($constraints)`` instruction brings together these constraint terms, and
they are assigned to the ``Query`` object via ``matching()``. With ``return $query->execute();``, the
query is executed and the located ``Offer`` objects are returned to the caller.

The example's offer age range requirement is interesting.

::

    $constraints[] = $query->logicalAnd(
        $query->logicalOr(
            $query->equals('ageRange.minimumValue', NULL),
            $query->lessThanOrEqual('ageRange.minimumValue', $demand->getAge())
        ),
        $query->logicalOr(
            $query->equals('ageRange.maximumValue', NULL),
            $query->greaterThanOrEqual('ageRange.maximumValue', $demand->getAge())
        ),
    );

This requirement is fulfilled using multiple levels of nested query constraints. Each ``logicalOr()``
condition allows either an unset age (value ``equals() NULL``) or a boundary
age value. (Here, the minimum age is more recent in the past than the maximum age, on a timeline.)
The ``logicalAnd()`` constraint then joins the two ``logicalOr()`` constraints, making a single
constraint, overall.

You can sort the result of a query by assigning one or more rules ``$query->setOrderings($orderings);``
to the ``Query`` object. These rules are collected in an associative array. Each array element has the
property name on which the sort is based as its key, and the search order constant as its value.
There are two constants for the search order: ``\TYPO3\CMS\Extbase\Persistence\QueryInterface::ORDER_ASCENDING``
for an ascending order, and ``\TYPO3\CMS\Extbase\Persistence\QueryInterface::ORDER_DESCENDING`` for a descending
order. A complete sample for specifying a sort order looks like this::

    $query->setOrderings(
        array(
            'organization.name' => \TYPO3\CMS\Extbase\Persistence\QueryInterface::ORDER_ASCENDING,
            'title' => \TYPO3\CMS\Extbase\Persistence\QueryInterface::ORDER_ASCENDING
        )
    );

Multiple orderings are processed in the specified order. In our sample the offers are ordered first
by the name of the organization, then inside the organization by the title of the offers, both in ascending
order (thus from A to Z). Since Extbase 1.1, you can use TypoScript-style point notation for
specifying the property names.

If you need only an extract of the result set, you can do this with the two parameters, ``Limit``
and ``Offset``. Assuming you want to get the tenth up to thirtieth offers from the overall query result
from the repository, you can use the following lines::

    $query->setOffset(10);
    $query->setLimit(20);

Both methods expect an integer value. With the method ``setOffset()``, you set the pointer to the
object you will start with. With the method ``setLimit()``, you set the maximum count of objects you will
get.

At first, the usage of a ``Query`` object with ``Constraint`` objects instead of directly written
SQL statements looks very inefficient. But doing so here in Extbase makes possible a complete abstraction
of the storage backend. FLOW3 does the same with its ``Query`` object and an identical API, so you can now
easily port your query code to FLOW3.

.. note::

    The ``Query`` object leans against the *Java Specification Request* (JSR) 283. JSR 283
    describes a standardised content repository for Java, The FLOW3 team ported this idea to PHP. You can
    find more information about this at
    :file:`http://jcp.org/en/jsr/detail?id=283`.

Even so, using the method ``statement()`` of the ``Query`` object, you can send a native SQL statement to
the database.

::

    $result = $query->statement('SELECT * FROM tx_sjroffers_domain_model_offer
        WHERE title LIKE ? AND organization IN ?', array('%climbing%', array(33,47)));

is translated by Extbase to the following query::

    SELECT * FROM tx_sjroffers_domain_model_offer WHERE title LIKE '%climbing%' AND
        organization IN ('33','47')

.. warning::

    You should always avoid making queries to the persistence layer outside of the domain model.
    Encapsulate these queries always in a repository.

    Inside of the repositories, you can access the database using the TYPO3 4.x API
    (for example with ``$GLOBALS['TYPO3_DB']->exec_SELECTgetRows([...])``). You have to
    handle the creation and maintenance of the objects by yourself.

    The method ``statement()`` is not part of the FLOW3 API. If you want to port your extension later
    to FLOW3 you have to assign these calls manually. The same also applies when using the TYPO3 4.x API.

The method ``execute()`` per default returns a ready built object and the related objects
- the complete *Aggregate*. In some cases, though, it is convenient to preserve the "raw data" of the objects,
e.g. if you want to manipulate them before you build objects out of them. For this, you have to change
the settings of the ``Query`` object.

::

    $query->getQuerySettings()->setReturnRawQueryResult(TRUE);

Since Extbase 1.2, the method ``execute()`` returns a multidimensional array with the object data.
Inside an object, one finds single value properties, multi value properties and NULL values. Let's have a
look at an object with a single value property.

 ::

    array(
        'identifier' => '<identifier>',
        'classname' => '<classname>',
        'properties' => array(
            '<name>' => array(
                'type' => '<type>',
                'multivalue' => FALSE,
                'value' => <value>
            ), ...
        )
    )

In Extbase, the value for ``<identifier>`` is always the UID of the data record. The class name
``<classname>`` and the identifier together make the element unique across the whole database. The
properties are stored in an own associative array. The name of the property is the key and the
corresponding information of the properties are the value. The property is signed with the property
type ``<type>`` and the property value ``<value>`` itself. The property type could be ``string``, ``integer``,
``DateTime``, or a class name like ``\MyVendor\SjrOffers\Domain\Model\Organization``, for example. The property
is declared as single value per default (``'multivalue' => FALSE``).

The array of an object with a multivalue property is basically composed the same way. The actual value of the
property is not a simple data type (like a string or a single object), but an array of data types.
This array could also be empty, and instead of the array, a NULL value is possible. The property type
for multivalue properties is always ``\TYPO3\CMS\Extbase\Persistence\ObjectStorage``. In the future, other containers
like ``array`` or ``splObjectStorage`` may be supported. The property is per definition declared as
multivalue (``'multivalue' => TRUE``).

::

    array(
        'identifier' => '<identifier>',
        'classname' => '<classname>',
        'properties' => array(
            '<name>' => array(
                'type' => '<type>',  // always '\TYPO3\CMS\Extbase\Persistence\ObjectStorage'
                'multivalue' => TRUE,
                'value' => array(
                    array(
                        'type' => '<type>',
                        'index' => <index>,
                        'value' => <value>
                    ), ...
                )
            )
        )
    )

If a property has a NULL value, it is stored in the object array like this::

    array(
        'identifier' => '<identifier>',
        'classname' => '<classname>',
        'properties' => array(
            '<name>' => array(
                'type' => '<type>',
                'multivalue' => <boolean>,
                'value' => NULL
            ), ...
        )
    )

The debug output of the return value looks like figure 6-13.

.. figure:: /Images/6-Persistence/figure-6-13.png
    :align: center

    Figure 6-13: Debug output of "raw" object data

Maybe in figure 6-13 you have noticed the empty array (``EMPTY!``) of the properties of the organization.
In the domain model the property ``organization`` of the offer is annotated with ``@lazy``.
This annotation instructs Extbase to load the properties of the object only when they are really
needed (so called *lazy loading*).

Beside ``setReturnRawQueryResult()``, there are three additional settings for the execution of a query.
All settings are occupied with default values that are set when the ``Query`` object was created by
``$this->createQuery()``. The settings are enclosed in an own ``QuerySettings`` object that you can get
from the ``Query`` object with ``getQuerySettings()``. In table 6-3 you find all settings in summary.

*Table 6-3: Settings for the execution of a query* (``QuerySetting``)

+-------------------------------+-------------------------------------------------------------+---------+
| Setting                       | If this attribute is set (=true), ...                       | Default |
+===============================+=============================================================+=========+
| ``setReturnRawQueryResult()`` | ... instead of the ready built object graphs, the database  | false   |
|                               | tuples are returned as an array                             |         |
+-------------------------------+-------------------------------------------------------------+---------+
| ``setRespectStoragePage()``   | ... the result set is limited to these tuples/objects that  | true    |
|                               | are assigned to a given page or directory in the backend    |         |
|                               | (e.g. ``pid IN (42,99)``)                                   |         |
+-------------------------------+-------------------------------------------------------------+---------+
| ``setRespectSysLanguage()``   | ... the result set for localized data is limited to these   | true    |
|                               | tuples/objects valid for either the default language        |         |
|                               | or for all languages (e.g. ``sys_language_uid IN (-1,0)``)  |         |
|                               | This setting is mostly used for internal purposes.          |         |
+-------------------------------+-------------------------------------------------------------+---------+
| ``setRespectEnableFields()``  | ... the result set is limited to these tuples/objects that  | true    |
|                               | at the present moment can be viewed by the current user     |         |
|                               | (e.g. ``deleted=0 AND hidden=0``)                           |         |
+-------------------------------+-------------------------------------------------------------+---------+

While the setting ``setReturnRawQueryResult()`` is active by ``matching()`` and ``statement()``,
the remaining three settings are only effective by ``matching()``.

.. warning::

    The ``QuerySettings`` object encapsulates specific settings of TYPO3 4.x.
    In FLOW3 as well as TYPO3 5.x the concepts of localization, the access rights and the
    page tree structure are completely different. At the moment of publishing Extbase 1.1,
    this books deals with it, the concepts are not finally defined. For this, the conducted settings
    are not compatible with that of TYPO3 5.x.

Beside the method ``execute()``, the ``Query`` object provides the method ``count()`` for disposal.
It returns only the number of elements of the result set, as an integer value, and can only be used in
conjunction with the method ``matching()``. In a backend SQL database, a statement of the form
``SELECT COUNT(*) FROM ...`` would be sent, which has significantly more performance than ``SELECT * FROM ...``.

In any backend storage case, the call

::

    $offersInRegion = $query->matching($query->contains('regions', $region))->count();

thus returns the count of offers of a given region.
