.. include:: ../Includes.txt

Creating the Repositories
=========================


We have already introduced the Repositories in Chapter 3. They serve with
capabilities to save and reaccess our objects. We set up such a Repository
object for every Aggregate-Root object which is, then again, used for accessing
all the Aggregate-Root's corresponding objects. In our concrete example
:php:`\MyVendor\SjrOffers\Domain\Model\Organization` is such an Aggregate-Root object. The
Repository's class name is derived from the class name of the Aggregate-Root
object concatenated with the suffix *Repository*. The Repository needs to extend
the class :php:`\TYPO3\CMS\Extbase\Persistence\Repository`. The class file :php:`\MyVendor\
SjrOffers\Domain\Repository\OrganizationRepository` will be saved in the
directory :file:`EXT:sjr_ offers/Classes/Domain/Repository/`. Thus the directory
*Repository* is on the same hierarchy-level as the directory *Model*. In our
case, the class body remains empty because all the important functionalities are
already generically implemented in the super-class
:php:`\TYPO3\CMS\Extbase\Persistence\Repository`.

.. code-block:: php

   <?php

   namespace MyVendor\SjrOffers\Domain\Repository;

   use TYPO3\CMS\Extbase\Persistence\Repository;

   class OrganizationRepository extends Repository
   {

   }

We create a :php:`\MyVendor\SjrOffers\Domain\Repository\OfferRepository` exactly the same
way but we will later extend it with own methods for accessing offers. It's very
likely that we have to access the other objects for categories, regions and
update data of contact information of certain persons independent of the offers
or their organizations. Thus we define some additional Repositories for those
objects for easier access from the Frontend.

.. note::

   You have to resist the urge to define Repositories for each object and limit
   yourself to a minimal number of Repositories. Instead, you should define the
   access methods within the Aggregate-Root objects as `find` methods.

:php:`\TYPO3\CMS\Extbase\Persistence\Repository` serves with the following methods which
are of course accessible and overridable in the extending child derivations:


:php:`add($object)`
-------------------

Adds an object to the Repository which is then persistent in the sense of
Domain-Driven Design. But be careful, it will not be written (and assigned a
`UID`) to the database before finishing the loop through the Extension, to be
precise, after the call of the method :php:`persistAll()` of the
`PersistenceManager`.


:php:`remove($object)` and :php:`removeAll()`
---------------------------------------------

The opponent of :php:`add()`. An object will be removed from the Repository and is
gonna be deleted from the database after finishing the Extension's loop. The
method :php:`removeAll()` empties the whole Repository.

:php:`update($modifiedObject)`
------------------------------

An existing object in the Repository will be updated with the properties of the
given object. Extbase finds the to-be-updated object by the uid of the given
object and throws an exception if it does not exist.


:php:`findAll()` and :php:`countAll()`
--------------------------------------

Returns all the Repository's objects that are currently persisted in the
database. However, this slightly confusing behaviour is intended. Whereas
:php:`findAll()` returns an Array of objects the method :php:`countAll()` only counts
the currently persisted objects (if the database backend is of type SQL it just
executes the query `SELECT COUNT`) and returns an Integer number.


:php:`findByProperty($value)`, :php:`findOneByProperty($value)` and :php:`countByProperty($value)`
--------------------------------------------------------------------------------------------------

Those three methods help to find one or several objects and to count all
the objects that correspond to the given value. The substring *Property* must be
replaced by the uppercase-written property name of the class that is managed by
the Repository. The methods then only return the objects or count the
objects whose properties *Property* correspond to the given value. Whereas the
method :php:`findByProperty()` returns an Array of all the matching objects, the
method :php:`findOneByProperty()` only returns the first object that was found.
That is, assuming that no certain sorting order was given, the order in which
the objects were created in the Backend. Last but not least, the method
:php:`countByProperty()` returns the count of the objects that would be returned if
:php:`findByProperty()` was given the same value and is, of course, an Integer
number.


:php:`createQuery()`
--------------------

In opposite to the methods above, this function does not manage objects in the
Repository. Instead, it returns a Query object which can be helpful to assemble
own queries to the Storage-Backend. The details for this procedure will be given
in the following chapter.

Before accessing the defined objects from the Repository you need to tell Extbase
on which pages on TYPO3's page tree (see below for TYPO3's concept of the page
tree) it should seek and file the objects. Without any further definitions
Extbase will use the page tree's root (the globe).



Generally there are three cases which need to be distinguished: Persisting a
newly created object, reaccessing an existing object and updating the properties
of an existing object. When creating a new object Extbase determines the
destination pages in the following rule hierarchy:

.. _procedure_to_fetch_objects:

.. todo Check if the work for "Ausgangspunkt" is used as in Ch. 4


* If, as already described in Chapter 4, the option *source* is checked then the objects will be searched in the corresponding pages
* If the TypoScript-Setup of the page contains the definition of :typoscript:`plugin.tx_*extensionname*.persistence.storagePid` with a comma-separated list of PIDs then those pages will be consulted.
* If the TypoScript-Setup of the page contains the definition of :typoscript:`config.tx_extbase.persistence.storagePid` with a comma-separated list of PIDs then those pages will be consulted.
* If none of the cases from above applies, then the root page will be consulted for the objects.

When new Domain objects are inserted, then the procedure will be as follows:

* If there's a TypoScript setup at :typoscript:`plugin.tx_extensionname.persistence.classes.*FullClassName*.newRecordStoragePid` with a single page value, then this is gonna be used.
* If there's a TypoScript setup at :typoscript:`config. tx_extbase.persistence.classes.*FullClassName*.newRecordStoragePid` with a single page value, the this is gonna be used.
* If none of the cases above apply, then the object will be inserted at the first item in the list of search pages. So to say, in the end the root page (the one with the globe) is gonna be used for insertion.



When updating the Domain objects their PID is not changed. However, you can
implement the property `pid` in your domain object with its corresponding set-
and get-methods. Then a domain object may be moved from one page to another by
setting a new `pid`.

.. note::

   Most occurring mistake for seemingly empty Repositories is a mis-configured
   *Storage-PID*. Thus, you should first evaluate the Template Module whether
   it is set correctly.


Besides the option for setting the Page UID, two other possibilities for configuring the Persistence Layer exist:
*enableAutomaticCacheClearing* and *updateReferenceIndex*. The option
:typoscript:`config.tx_extbase.persistence.enableAutomaticCacheClearing = 1` within the
TypoScript setup leads to a deletion of the cache whenever the data is
rewritten. This option is normally activated.


.. sidebar:: TYPO3's Page Tree

   In TYPO3 each Content Element and Dataset which should be rendered in the
   Backend corresponds to a certain Page. Technically, a page is nothing more
   than a Node Element or a leaf in the virtual Page Tree. Every page is
   associated with a unique Page ID (PID). Some of the pages are reachable via
   a URL and TYPO3 renders and delivers them (usually in HTML). For example,
   the URL *http://www.example.com/index.php?id=123* requests the Page with the
   PID 123. In this case, the term Page has the meaning of being a Webpage. But
   there are other cases, e.g. a directory (*SysFolder*) or a separator which
   are used to save data in a clear and structured way. A special already
   existing PID is 0 which is used to refer to the root page (the one with the
   shiny globe).

.. note::

   Usually, data sets will be saved into Folders in the Page Tree though the
   pages using those data sets will be somewhere else. If their cache should be
   cleared as well then you should set up their PIDs in the field *TSConfig* of
   the page's preferences of the directory. For example, our Offers will be
   shown on the pages with the PIDs 23 and 26 (let's say for a Single and a
   List View). Then we will configure the variable 
   `TCEMAIN.clearCacheCmd=23,26` 
   in the page preferences of the SysFolder. Then the cache of these
   pages will be cleared as well and changes of an offer will show up
   immediately.

Internally, TYPO3 manages an index of all relationships between two data sets, the
so-called *RefIndex*. Due to this index it's possible to show the number of
associated data sets in the list module's column *[Ref.]*. By clicking on the
number you get further information about the incoming and outgoing references
of the dataset. This index is automatically updated when any data sets are
edited. The configuration `config.tx_extbase.persistence.updateReferenceIndex = 1` 
causes an immediate update when data sets are edited in the Frontend though it is
normally deactivated due to its huge effects on performance.

Before calling a Repository's methods, they need to be instantiated 
by the ObjectManager or via dependency injection first.

.. code-block:: php
   :caption: Dependency injection example from chapter 2
   :name:

    /**
     * @var ProductRepository
     */
    private $productRepository;

    /**
     * Inject the product repository
     *
     * @param \MyVendor\StoreInventory\Domain\Repository\ProductRepository $productRepository
     */
    public function injectProductRepository(ProductRepository $productRepository)
    {
        $this->productRepository = $productRepository;
    }


.. warning::

   Repositories are *Singletons* therefore there may only exist one instance of
   each class at one point in time during script-execution. If a new instance is requested,
   the system will check whether an instance of the requested object exists already. In that case, 
   the system will return the existing object instead of creating a new one. This is
   ensured by using the dependency injection. Thus, never ever use the PHP syntax
   keyword :php:`new` for creating a repository object because the new objects
   will not automatically be persisted.

Now you know all the basic tools for persisting and recovering your
objects. Extbase offers a lot more sophisticated functionalities for special
needs because it happens quite frequently that the standard methods of saving
and seeking data in a repository are not sufficient for the individual case.
Thus Extbase let's you define individual requests without losing the existing
abstractions of the existing persistence backend. Additionally, Extbase let's
you use "foreign" data sources which are most often data tables of the same
database.
