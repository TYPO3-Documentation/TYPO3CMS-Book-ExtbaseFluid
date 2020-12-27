.. include:: /Includes.rst.txt

=============================
Implementing the domain model
=============================

With the implementation of the domain, there are two different approaches to:
From top to bottom or from the bottom to the top. In the first case, you start
with those concepts, which include other or control them in the broadest sense.
In our example, the organization comes into account, the contact name, address,
quotes, etc. "contains". In the second case, one starts with the basic concepts,
such as the age range, address or region. The decision affects one of the two
variants are on the way, how tests are written for the individual sections of
the code. Ultimately, this is a matter of taste. We opted for the approach from
top to bottom.

So we begin with the concept of organization. The file containing the class
definition we put into the folder :file:`EXT:sjr_offers/Classes/Domain/Model/` and
rename it according to the last part of the class name: :file:`Organization.php`.

.. note::
   Using the abbreviation EXT: we cut off the part of the path that leads to the
   extension folder. For more information on possible locations of the extension
   folder, see Chapter 4

.. note::

   At this point in the development process, we find ourselves facing a fundamental
   decision: Should we develop our code secure by testing (using the method of
   test-driven development), or should we test only the final result? We know that
   the entry is in the method of test-driven development is a barrier. However, it
   is worthwhile to take the step because you will notice that you can increase
   your efficiency with TDD and save yourself a lot of frustrating experiences (eg
   in the painful search for an error). More information about the test-driven
   development, see chapter Chapter 2 in the section "test-driven development". If
   you still decide to test only at the end, you can create the cycles of test
   development and skip the class in a train. We have cautioned, however.

First, we create the corresponding test class in the appropriate folder
\MyVendor\SjrOffers\Domain\Model\OrganizationTest EXT: sjr_offers/Tests /Domain
/Model/. After that we write our test.

.. code-block:: php

   class OrganizationTest extends \TYPO3\CMS\Core\Tests\BaseTestCase
   {

      /**
       * @test
       */
      public function anInstanceOfTheOrganizationCanBeConstructed()
      {
         $organization = new \MyVendor\SjrOffers\Domain\Model\Organization('Name');
         $this->assertEquals('Name', $organization->getName());
      }
   }

.. note::

   In the folder Tests, you can select the folder structure freely. We, however, we
   recommend you to build the same structure as in classes. With an increasing
   number of unit tests you will be able to remain focused.

Note that our test class :php:`\MyVendor\SjrOffers\Domain\Model\OrganizationTest`
extends the class :php:`\TYPO3\CMS\Core\Tests\BaseTestCase` of Extbase.
Among other things, this class initializes the autoloader, which makes the
inclusion of the class files `require_once()` obsolete.

Remarkable is the remarkably long method name. Method names of this kind are
typical for Unit-Tests because these names could be transformed into readable
sentences. So please formulate the method name so that it describes which
result demonstrates a successful test. It gives you one (always current)
documentation of the functionality of your extension. The test cannot
run because the appropriate class and its method `getName()` note yet exist. So
we create first a minimum trunk of the class and its methods.

.. code-block:: php

   <?php
   namespace MyVendor\SjrOffers\Domain\Model;

   class Organization
   {
      public function getName()
      {

      }
   }

The test can now run but failed as expected (see Figure 5-5).

.. figure:: /Images/5-Domain/figure-5-5.jpg

   Figure 5-5: the message of the failed first test run

Only now we add just enough code that the test is successful:

.. code-block:: php

   <?php

   namespace MyVendor\SjrOffers\Domain\Model;

   use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;

   class Organization extends AbstractEntity
   {

      /**
       * @var string The name of the organization
       */
      protected $name;

      /**
       * Constructor
       */
      public function __construct($name)
      {
         $this->name = $name;
      }

      /**
       * Get the name of the organization
       */
      public function getName()
      {
         return $this->name;
      }
   }

.. sidebar:: Test-driven development at a glance

   This approach is typical of test-driven development (see chapter 2, section »test-driven development«).
   So once again summarized the essential steps:

   #. Create a unit test and possibly a test class.
   #. Implement classes and methods just as much that the script runs through
      without syntax or run-time error ("Fatal Error").
   #. Let the unit test fails ( at this time, we have not implemented any code for
      the solution of this step).
   #. Implement a minimal solution.
   #. Rerun the test and, if necessary, make the implementation better.
   #. After a successful test-run, go to the next code to be implemented.

Currently, the name can only be set during the class's instantiation
because only at this moment the Constructor :php:`__construct()` is called. Because it
should be possible later to change the name, we introduce a public
method :php:`setName($name)` with the according test. Note also that we have slightly
modified the code in the constructor. We now use instead of the direct
:php:`$this->name = $name` the respective Setter. In the comment about the definition
of property :php:`$name`, the type of property is specified. In our case, the name of the
String. Thereby our class looks like as follows:

.. code-block:: php

   <?php
   namespace MyVendor\SjrOffers\Domain\Model;

   use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;

   class Organization extends AbstractEntity
   {

      /**
       * @var string The name of the organization
       */
      protected $name;

      /**
       * Constructor
       */
      public function __construct($name)
      {
         $this->setName($name);
      }

      /**
       * Set the name of the organization
       */
      public function setName($name)
      {
         $this->name = $name;
      }

      /**
       * Get the name of the organization
       */
      public function getName()
      {
         return $this->name;
      }
   }

Now we implement step by step the class :php:`\MyVendor\SjrOffers\Domain\Model\Organization` –
always protected by our tests. Here we meet the requirement that there can be
multiple contact persons. We want to keep ready in the capacity of contacts. So
we set there a :php:`\TYPO3\CMS\Extbase\Persistence\ObjectStorage`, which later takes the
instances of :php:`\MyVendor\SjrOffers\Domain\Model\Person` (or more precisely, the
references to instances).

But the test at first:

.. code-block:: php

   /**
    * @test
    */
   public function theContactsAreInitializedAsEmptyObjectStorage()
   {
      $organization = new \MyVendor\SjrOffers\Domain\Model\Organization('Youth Organization');
      $this->assertEquals('\TYPO3\CMS\Extbase\Persistence\ObjectStorage',
      get_class($organization->getContacts()));
      $this->assertEquals(0, count($organization->getContacts()));
   }

The contact person should be an instance of the class
:php:`\MyVendor\SjrOffers\Domain\Model\Person`. Since this class does not exist, one could
make the next working to implement them. Thus we would probably get bogged down
and jump from one class to the other. When writing unit tests can be upheld in
so-called Mocks back. A mock is an object that can behave as if it were another.
To "mock" an object means to create a replacement object in targeted areas
that will behave like the target object. Let's take a look at the test as an
example:


.. code-block:: php

   /**
    * @test
    */
   public function aContactCanBeAdded()
   {
      $organization = new \MyVendor\SjrOffers\Domain\Model\Organization('Youth Organization');
      $mockContact = $this->getMock('\MyVendor\SjrOffers\Domain\Model\Person');
      $organization->addContact($mockContact);
      $this->assertTrue($organization->getContacts()->contains($mockContact));
   }

The variable ``$mockContact`` contains the object, which behaves like an instance of
the class :php:`\MyVendor\SjrOffers\Domain\Model\Person`. Because of this we can now use the
two methods `addContact()` and implement `getContacts()`:

.. code-block:: php

   <?php
   declare(strict_types = 1);

   namespace MyVendor\SjrOffers\Domain\Model;

   use MyVendor\SjrOffers\Domain\Model\Person;
   use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;
   use TYPO3\CMS\Extbase\Persistence\ObjectStorage;

   class Organization extends AbstractEntity
   {
       /**
        * The contacts of the organization
        *
        * @var ObjectStorage<Person>
        */
       protected $contacts;

       /**
        * Adds a contact to the organization
        *
        * @param Person The contact to be added
        * @return void
        */
       public function addContact(Person $contact)
       {
          $this->contacts->attach($contact);
       }

       /**
        * Returns the contacts of the organization
        *
        * @return ObjectStorage The contacts of the organization
        */
       public function getContacts()
       {
          return clone $this->contacts;
       }
   }

The comment about the definition of property is ``$contacts`` of crucial importance.
Extbase "reads" the comment and concludes of it that an ObjectStorage should be
created and from which class the objects should be, which are in it included (also
see chapter 3). The omission of this information would lead to a PHP exception:
»Could not determine the type of the contained objects«.

Another special feature is the keyword clone. With clone, the method
`getContacts()` clones the ObjectStorage before returning to the caller. Cloning
causes the objects to be copied within the ObjectStorage, and the reference to
the original contacts is deleted. This is necessary because the caller does not
know that it gets delivered an ObjectStorage instead of a PHP array. Would the
caller manipulate the containing objects without using the keyword clone, he
would change the original data by accident.

In this section, you could use the procedure for test-driven development to meet.
If you use this procedure in your development practice, you will be rewarded
with a good feeling to write code that is always functional - or at least
compliant as expected. In English, one can use the expression »green bar
feeling« (see figure 5-6). In the course, we will not explicitly deal with
the testing. But we use it always in the background.

.. figure:: /Images/5-Domain/figure-5-6.jpg

   Figure 5-6: By the test-driven development, there is a residual »Green-Bar-Feeling«.


Implementing relationships between domain objects
=================================================

Extbase supports three different types of hierarchical relationships between domain objects.

1:1-relationship
An offer has, in our case, exactly one period in which it is valid. The object
"Offer" gets, therefore, a property `dateRange`, that is exactly referenced one time
to the object `DateRange`.

1:n-relationship
An organization can have multiple contacts. The object Organization, therefore,
gets the property contacts that refers to any number of Contact objects.

m:n-relationship
An offer, on the one hand, could be assigned to different categories. On the other
hand, offers could be assigned to one category. Therefore receives the Offer
object categories as a property.

.. note::

   In addition to these relations, an n: 1 relationship is often used: A company has
   a representative, a representative can work for several companies. In Extbase
   such a relationship is always mapped by an m: n relationship in which the number
   of child objects (agents) from the perspective of a parent object (enterprise)
   is limited to just one.

In a 1:1 relationship, set and get methods are implemented. At the polyhydric 1:n
and m:n relationships, the add and remove methods are added.

.. code-block:: php

   setContacts(\TYPO3\CMS\Extbase\Persistence\ObjectStorage $contacts)
   getContacts()
   addContact(\MyVendor\SjrOffers\Domain\Model\Contact $contact)
   removeContact(\MyVendor\SjrOffers\Domain\Model\Contact $contact)

Be careful about the subtle differences here. The methods `setContacts()` and
`getContacts()` refer simultaneously to all contacts. They expect and hence provide
an ObjectStorage. The methods `addContact()` and `removeContact()` refer to a single
Contact-Object that is added to the list or removed from. To extract a single
contact from the list, let us first bring all contacts with `getContacts()` and
then draw on the methods of the ObjectStorage to individual contacts.

The property offers, we proceed to the equivalent property contacts. The
definition of the property offers includes in the comment two special
annotations:
:php:`@TYPO3\CMS\Extbase\Annotation\ORM\Lazy` and :php:`@TYPO3\CMS\Extbase\Annotation\ORM\Cascade` remove.

.. code-block:: php

   <?php
   declare(strict_types = 1);

   namespace MyVendor\SjrOffers\Domain\Model;

   use MyVendor\SjrOffers\Domain\Model\Offer;
   use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;
   use TYPO3\CMS\Extbase\Persistence\ObjectStorage;

   class Organization extends AbstractEntity
   {
       /**
        * @var ObjectStorage<Offer> The offers the organization has to offer
        * @TYPO3\CMS\Extbase\Annotation\ORM\Lazy
        * @TYPO3\CMS\Extbase\Annotation\ORM\Cascade("remove")
        */
       protected $offers;
   }

By default, Extbase invites all child objects with the parent object (so for
example, all offers of an organization). This behavior is called Eager-Loading.
The annotation :php:`@TYPO3\CMS\Extbase\Annotation\ORM\Lazy` causes Extbase to load the objects and build only when they
are actually needed (lazy loading). This can be an appropriate data structure,
e.g., many organizations, each with very many offers, that lead to a significant
increase in speed.

.. note::

   Beware, however, against all the properties provided by child objects with
   :php:`@TYPO3\CMS\Extbase\Annotation\ORM\Lazy`, because this can lead to frequent loading of child objects. The ensuing,
   small-scaled database accesses reduces the performance and cause then the exact
   opposite of what you wanted to achieve with the lazy-loading.

The annotation :php:`@TYPO3\CMS\Extbase\Annotation\ORM\Cascade("remove")` causes if the organization is deleted, the offers
will also be deleted immediately. Extbase leaves usually persist unchanged all
child objects.

Besides these two, there are a few more annotations available, which will be used
in other contexts (e.g., in the controller). For the complete list of all Extbase
supported annotations, see the index.

So far, the impression may arise that domain models consist only of setters and
getters. The domain objects, however, contain the main part of the business
logic. In the following section, we add to our class
:php:`\MyVendor\SjrOffers\Domain\Model\Organization` a small part of this business logic.


Adding business logic to the domain objects
===========================================

Part in deciding which part of the business logic belongs to a particular domain
model, you can be guided by what questions we can ask the domain object in the
"real" world. We can ask the organization for the list of all contacts, for
example. So we implement a method `getAllContacts()`. In contrast to the
previously implemented method `getContacts()` this should deliver in addition to
these direct contacts of the organization and provide the contact for all
services. For this, the organization has to pass through all their offerings and
add one if there is an existing contact to the result. This is especially useful
for administrators of an organization. The implementation is as follows:

.. code-block:: php

   public function getAllContacts()
   {
      $contacts = $this->getContacts();
      foreach ($this->getOffers() as $offer) {
         $contact = $offer->getContact();
         if (is_object($contact)) {
            $contacts->attach($contact);
         }
      }
      return $contacts;
   }

The organization gets first by using `getContacts()` as their direct contact.
Therefore all the offers are iterated with `foreach`. The query `is_object()` is
necessary because the offer returns `NULL` if a contact is missing. The contact
person of the offer will be added to the ObjectStorage as the variable
``$contacts``. It becomes clear how important the keyword clone of
the method `getContacts()` is. If the ObjectStorage had not been cloned, we
would add all the contacts of the organization's offers as primary
contacts. Besides, we benefit here by a special property of the
ObjectStorage: It takes one and the same object only once. If it had not this
quality, a person assigned to multiple offers would appear more than
once in the list.

.. note::

   Alternatively to the method `getAllOffers()` in the domain object Organization,
   you could have also implemented a method in an OfferRepository
   ``findAllContacts($organization)``. It would have been possible to get the
   offers by a bit more complex query directly from the database. But we
   follow the important basic rule of the domain-driven design at this place, which
   says that an element of an aggregate (the totality of all the terms contained in
   the organization) should be accessed by the root object (Aggregate-Root). The
   alternative we choose only if iterating through all the offers causes
   a performance problem actually.

We finish that implementation of the class from
:php:`\MyVendor\SjrOffers\Domain\Model\Organization` and turn to the class
:php:`\MyVendor\SjrOffers\Domain\Model\Offer`. The basic approach here is not fundamentally
different from the last. Let's take a look at the (shortened) class, which
emphasizes some peculiarities.

.. code-block:: php

   <?php
   declare(strict_types = 1);

   namespace MyVendor\SjrOffers\Domain\Model;

   use MyVendor\SjrOffers\Domain\Model\AgeRange;
   use MyVendor\SjrOffers\Domain\Model\AttendanceFee;
   use MyVendor\SjrOffers\Domain\Model\AttendanceRange;
   use MyVendor\SjrOffers\Domain\Model\Category;
   use MyVendor\SjrOffers\Domain\Model\DateRange;
   use MyVendor\SjrOffers\Domain\Model\Organization;
   use MyVendor\SjrOffers\Domain\Model\Person;
   use MyVendor\SjrOffers\Domain\Model\Region;
   use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;
   use TYPO3\CMS\Extbase\Persistence\ObjectStorage;

   class Offer extends AbstractEntity
   {

       /**
        * The organization of the offer
        *
        * @var Organization
        */
       protected $organization;

       protected $title;
       protected $image;
       protected $teaser;
       protected $description;
       protected $services;
       protected $dates;
       protected $venue;

       /**
        * @var AgeRange The age range of the offer.
        */
       protected $ageRange;

       /**
        * @var DateRange The date range of the offer.
        */
       protected $dateRange;

       /**
        * @var AttendanceRange The attendance range.
        */
       protected $attendanceRange;

       /**
        * @var ObjectStorage<AttendanceFee>
        */
       protected $attendanceFees;

       /**
        * The contact of the offer
        *
        * @var Person
        */
       protected $contact;

       /**
        * The categories the offer is assigned to
        *
        * @var ObjectStorage<Category>
        */
       protected $categories;

       /**
        * The regions the offer is available
        *
        * @var ObjectStorage<Region>
        */
       protected $regions;

       /**
        * The title of the offer
        *
        * @param string $title
        */
       public function __construct($title)
       {
           $this->setTitle($title);
           $this->setAttendanceFees(new \TYPO3\CMS\Extbase\Persistence\ObjectStorage);
           $this->setCategories(new \TYPO3\CMS\Extbase\Persistence\ObjectStorage);
           $this->setRegions(new \TYPO3\CMS\Extbase\Persistence\ObjectStorage);
       }
       // Getter and Setter
   }

The property organization of the object Offer includes a backreference of the
offering organization. We have introduced them to have later quick access to
the collection of all the offers on the organization. Thus, we deviate slightly
from the pure "doctrine" from the domain-driven design. This means, among other
things, that you access the child object Offer only on the root object
Organization (Aggregate Root) should.

.. note::

   The backreference in the form of property organization is similar in some
   aspects to the foreign key organization in the database table
   tx_sjroffers_domain_model_offer. This foreign key contains the uid and links the
   offer-tuple associated with the corresponding tuple from the table
   tx_sjroffers_domain_model_organization. We use here sent from the fact that the
   integer value of the uid is converted by Extbase because of the annotation @var
   \MyVendor\SjrOffers\Domain\Model\Organization into the corresponding object
   Organization.

The properties ageRange, dateRange, and attendanceRange contains the objects of
the type RangeConstraint. These classes we have to create at first and had
created mocks for the in our tests.

Then we add the class to the necessary getters and setters. Even class
internally it is advisable to access using setter and getter. So there (maybe
later) the actual code is used before the setting of the property value is done.
The title which is passed to the constructor is not set by ``$this->title =
$title``, but by ``$this->setTitle($title)``.

The objects that are kept at the properties attendanceFees, categories, and
regions, we set off in an object storage. At the three properties so we
initialize an empty ObjectStorage each in the constructor.


Use inheritance in class hierarchies
====================================

The domain objects and their relationships can generally be mapped well in a
tree hierarchy. Such a hierarchy can be found in figure 5-2. Organizations
include Offers. In turn, offers "contained" small fees. In our domain model is
however, a second kind of hierarchy: the class hierarchy. In this hierarchy, we
have set that the objects ageRange, dateRange, and attendanceRange are a
concretization. They inherit properties and methods. In modeling, we consider
the opposite approach: You have to search properties which are in common in that
objects. This may be abstracted and then stores them in a new, higher-level
class out. In Figure 5-7 and Figure 5-8, we have shown the procedure again
separately.

.. figure:: /Images/5-Domain/figure-5-7.png

   Figure 5-7: Creating the Range Constraints

.. figure:: /Images/5-Domain/figure-5-8.png

   Figure 5-8: Abstraction of the properties and the shift in RangeConstraint


In the class Range Constraint, all common properties and methods are gathered.
The properties minimumValue and maximumValue are of the type integer by default.
But the inherited class DateRange expected as property values, not Numbers, but objects of type DateTime.
So we »override« the type definition in the class DateRange and set the type DateTime.
The class RangeConstraint looks as follows (Comments were partly removed):

.. code-block:: php

   <?php

   namespace MyVendor\SjrOffers\Domain\Model;

   use TYPO3\CMS\Extbase\DomainObject\AbstractValueObject;

   abstract class RangeConstraint extends AbstractValueObject
   {

      /**
       * @var int The minimum value
       */
      protected $minimumValue;

      /**
       * @var int The maximum value
       */
      protected $maximumValue;

      /**
       * @param int $minimumValue
       * @param int $maximumValue
       */
      public function __construct($minimumValue = null, $maximumValue = null)
      {
         $this->setMinimumValue($minimumValue);
         $this->setMaximumValue($maximumValue);
      }

      /**
       * @param mixed The minimum value
       * @return void
       */
      public function setMinimumValue($minimumValue = null)
      {
         $this->minimumValue = $this->normalizeValue($minimumValue);
      }

      public function getMinimumValue()
      {
         return $this->minimumValue;
      }

      /**
       * @param mixed The maximum value
       * @return void
       */
      public function setMaximumValue($maximumValue = null)
      {
         $this->maximumValue = $this->normalizeValue($maximumValue);
      }

      public function getMaximumValue()
      {
         return $this->maximumValue;
      }

      public function normalizeValue($value = null)
      {
         if ($value !== null && $value !== '') {
            $value = abs(int()$value);
         } else {
            $value = null;
         }
         return $value;
      }
   }

All of this range objects have beyond their properties and methods further things in common.
They have no identity other than the whole of their property values. It is not important for the offer,
which age range »from 12 till 15 years« the range object is assigned to receive. Of importance is only the two values 12 and 15.
Are two offers designed for the same age range, so Extbase must therefore ignore the fact
that it assigns a particular age range with the values 12 and 15 to the offer. Value Objects can, e.g., occur multiple
times in memory, and therefore any be copied while it was driving in the major entities of the ambiguity problem.
The internal handling is much easier because of this.
We thus have to Extbase to treat the object as a Value Object Constraint Range by inheriting from the appropriate
Extbase class: extends \TYPO3\CMS\Extbase\DomainObject\AbstractValueObject.

The class rank by the keyword abstract constraint was marked as abstract. Thus we prevent the Range object itself is instantiated.

We have furthermore implement a method :php:`normalizeValue()`.
These »adjusted« the value coming from the outside before they are assigned to a property. This is overwritten in the class
DateRange together with the above-mentioned type definitions:

.. code-block:: php
   :caption: DateRange.php
   :name: daterange

   <?php
   namespace MyVendor\SjrOffers\Domain\Model;

   class DateRange extends \MyVendor\SjrOffers\Domain\Model\RangeConstraint
      implements \MyVendor\SjrOffers\Domain\Model\DateRangeInterface {

   /**
    * The minimum value
    *
    * @var \MyVendor\SjrOffers\Domain\Model\DateTime
    */
   protected $minimumValue;

   /**
    * The maximum value
    *
    * @var \MyVendor\SjrOffers\Domain\Model\DateTime
    */
   protected $maximumValue;

   public function normalizeValue($value = NULL)
   {
      if (!($value instanceof \DateTime)) {
         $value = null;
      }
      return $value;
   }


The class :php:`DateRange` implements furthermore the interface :php:`DateRangeInterface`.
The interface on its own is empty and is only used for identification.
This makes especially sense for the other two Range Objects. These both implement the :php:`NumericRangeInterface`.
The classes :php:`AgeRange` and :php:`AttendanceRange` Classes are otherwise empty hulls
because they inherit all the properties and methods from the object RangeConstraint.

.. code-block:: php

    <?php

    namespace MyVendor\SjrOffers\Domain\Model;

    class AgeRange extends \MyVendor\SjrOffers\Domain\Model\RangeConstraint
       implements \MyVendor\SjrOffers\Domain\Model\NumericRangeInterface
    {
    }

   class AttendanceRange extends \MyVendor\SjrOffers\Domain\Model\RangeConstraint
       implements \MyVendor\SjrOffers\Domain\Model\NumericRangeInterface
    {
    }

    interface \MyVendor\SjrOffers\Domain\Model\NumericRangeInterface
    {
    }

    interface \MyVendor\SjrOffers\Domain\Model\DateRangeInterface
    {
    }


We have implemented the terms age range, number of participants and offer an adequate period in domain models.
Let us now turn to the object administrator. Also, here we use another, less obvious class hierarchy.
Extbase provides two domain models available: FrontendUser and FrontendUserGroup.
They are the equivalents of the website user or user group's website, created in the backend of TYPO3
can be assigned and managed. The two Extbase classes are filled with this data
stored in two database tables or fe_users fe_groups.
The database fields in these tables each have a corresponding property in the domain model.
The properties' names were indeed subjected to the convention that the field names lower_underscore spelling
in the name of the property is converted into lowerCamelCase notation.
But they are otherwise taken 1:1 and therefore - in contrast to our previous practice - not so meaningful.
Behind the property `isOnline` we would suspect a value of the type Boolean.
But it contains the date on which the website has started the last page user demand.
The class hierarchy is shown in Figure 5-9.

.. figure:: /Images/5-Domain/figure-5-9.png

   Figure 5-9: The Administrator class inherits all the properties and methods of the class Extbase FrontendUser.


Validate the domain objects
===========================

The business logic often looks for rules as to the properties of the data domain objects
needs to be. Here are some examples of such so-called invariants in our
Extension:

* The length of the title of an offer must not be under 3 characters and not over 50 characters.
* The start date of an offer may not be later than the end date.
* If one partner identifies an e-mail address, it must be valid.

You can implement the check of the details of these invariants directly in the domain model.
In the setter of the title of an offer would stand the following code:

.. code-block:: php

 public function setTitle($title)
 {
   if (strlen($title) > 3 && strlen($title) < 50) {
      $this->title = $title;
   }
 }

This has several disadvantages:

* This examination had to be done at any point, which manipulates the title (risk of failure to examination
  and duplicated code by cut-and-paste).
* The definition of the rule is more or less far away from the definition of the property (poor readability of the code).
* A change in an option of a rule ("80 rather than 50 characters") requires an intervention possibly at difficult to-find places.

Therefore Extbase offers an alternative about Annotations.
Let us have a look at the definitions of the properties of the class Offer definition - this time with all the comments:

.. code-block:: php

   <?php
   declare(strict_types=1);

   namespace MyVendor\SjrOffers\Domain\Model;

   use MyVendor\SjrOffers\Domain\Model\AgeRange;
   use MyVendor\SjrOffers\Domain\Model\AttendanceFee;
   use MyVendor\SjrOffers\Domain\Model\AttendanceRange;
   use MyVendor\SjrOffers\Domain\Model\Category;
   use MyVendor\SjrOffers\Domain\Model\DateRange;
   use MyVendor\SjrOffers\Domain\Model\Organization;
   use MyVendor\SjrOffers\Domain\Model\Person;
   use MyVendor\SjrOffers\Domain\Model\Region;
   use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;
   use TYPO3\CMS\Extbase\Persistence\ObjectStorage;

   class Offer extends AbstractEntity
   {
       /**
        * The title of the offer
        *
        * @var string
        * @TYPO3\CMS\Extbase\Annotation\Validate("StringLength", options={"minimum": 3, "maximum": 50})
        */
       protected $title;

       /**
        * A single image of the offer
        *
        * @var string
        */
       protected $image;

       /**
        * The teaser of the offer. A line of text.
        *
        * @var string
        * @TYPO3\CMS\Extbase\Annotation\Validate("StringLength", options={"maximum": 150})
        */
       protected $teaser;

       /**
        * The description of the offer. A longer text.
        *
        * @var string
        * @TYPO3\CMS\Extbase\Annotation\Validate("StringLength", options={"maximum": 2000})
        */
       protected $description;

       /**
        * The services of the offer.
        *
        * @var string
        * @TYPO3\CMS\Extbase\Annotation\Validate("StringLength", options={"maximum": 1000})
        */
       protected $services;

       /**
        * The textual description of the dates. E.g. "Monday to Friday, 8-12"
        *
        * @var string
        * @TYPO3\CMS\Extbase\Annotation\Validate("StringLength", options={"maximum": 1000})
        */
       protected $dates;

       /**
        * The venue of the offer.
        *
        * @var string
        * @TYPO3\CMS\Extbase\Annotation\Validate("StringLength", options={"maximum": 1000})
        */
       protected $venue;

       /**
        * The age range of the offer.
        *
        * @var AgeRange
        * @TYPO3\CMS\Extbase\Annotation\Validate("MyVendor\SjrOffers\Domain\Validator\RangeConstraintValidator")
        */
       protected $ageRange;

       /**
        * The date range of the offer is valid.
        *
        * @var DateRange
        * @TYPO3\CMS\Extbase\Annotation\Validate("MyVendor\SjrOffers\Domain\Validator\RangeConstraintValidator")
        */
       protected $dateRange;

       /**
        * The attendance range of the offer.
        *
        * @var AttendanceRange
        * @TYPO3\CMS\Extbase\Annotation\Validate("MyVendor\SjrOffers\Domain\Validator\RangeConstraintValidator")
        */
       protected $attendanceRange;

       /**
        * The attendance fees of the offer
        *
        * @var ObjectStorage<AttendanceFee>
        */
       protected $attendanceFees;

       /**
        * The contact of the offer
        *
        * @var Person
        */
       protected $contact;

       /**
        * The categories the offer is assigned to
        *
        * @var ObjectStorage<Category>
        */
       protected $categories;

       /**
        * The regions the offer is available
        *
        * @var ObjectStorage<Region>
        */
       protected $regions;
   }

The values of some properties must be checked to control the offer being classified as valid.
Which rule will narrow, about the annotation :php:`@TYPO3\CMS\Extbase\Annotation\Validate("…")` is set.
The annotation :php:`@TYPO3\CMS\Extbase\Annotation\Validate("StringLength", options={"minimum": 3, "maximum": 50})` on the property title affected,
for example, that the title length is not smaller than 3 characters and no longer than 50 characters.
Extbase provides the validator `StringLength` for this.
The name of the associated class is :php:`\\TYPO3\\CMS\\Extbase\\Validation\\Validator\\StringLengthValidator`.
The options minimum and maximum are passed to the Validator and are evaluated there.

With the validation, we conclude the modeling and implementation of the domain at first.
With that achieved, it is possible to store domain objects generated during a page view in memory.
All data will be lost at the end of the page view. For the domain objects to be permanently on the grouting,
the persistence layer is to be set up accordingly.
