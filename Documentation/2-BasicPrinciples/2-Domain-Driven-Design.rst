.. include:: ../Includes.txt

Domain-Driven Design
===============================================

Software development is a creative process. You do not stand on an assembly
line, but are increasingly exposed to new challenges. Each software differs
from each other, and every time you start with a new program you start from
scratch. You have to find out, what your client wants to achieve and after that
you want to implement this. Through this creativity you have many freedoms but
also the amount of misunderstandings between the customer and you as a developer
can grow. Who has never seen a project in which the requirements were documented
and the specifications were written and still the client was not satisfied at
the end or at worst the software hasn't solved his problems at all.


If you develop software for a customer, you must first understand his problems,
so you can offer your customer a tailored solution. This problem area is called
the application domain within the terms of domain-driven design. By knowing the
application domain of the customer, understand his problem and have clearly in
mind, you are in a position to adequately implement these domain in software.
Extbase supports you in supplying you with the required technical
infrastructure.


Domain-Driven Design is a development paradigm, which includes not only
technical concepts. Instead, with using different techniques, Extbase tries to
to direct the creativity in the development of software to structured directions
and so channel it and make it more effective.

With domain-driven design the understanding for you of the relevant problems and
of their environment is in the foreground, a problem which the customer wishes
to see resolved by your program. In close cooperation with the customer the
problem is collaborative explored. During this process, which proceeds
iteratively (ie. stepwise), you will develop a model together with the customer,
that represents the problem adequately. This model is then the basis of the
generated program. By focusing on the model you are not distracted with the
actual problem of the customer during prototyping - you can focus on the problem
domain.

.. note::

   The involvement of customers in the working phase is absolutely essential
   because only he knows the problem well enough.

Domain-Driven Design is a very pragmatic approach. Even at the beginning of a
software project is trying to write code while getting to know the problem to be
solved. Often you will need a few prototypes and iterations, until you reach the
final model. Take this time!



.. sidebar:: The history of the Domain-Driven Design

   The ideas behind Domain-driven design are not new: many good software developers
   have discovered long ago that the problem needs to be keenly modeled from the
   real world in software. Often, this process was guided intuitive - it lacked a
   conceptual skeleton which would have simplified the mapping from the problem to
   software. Eric Evans has described an approach in his book "Domain-Driven Design
   - Tackling Complexity in the Heart of Software (Addison-Wesley)", how to create
   a meaningful model of the reality in software, so this is helpful for solving a
   particular problem. For this he has founded the term "Domain-driven design". He
   wrote down the combined knowledge of many good software developers, which now
   makes it possible to address the systematic creation of models and make them
   learnable.

Extbase offers you a variety support of Domain-Driven Design. You do not have to
care for e.g. storing data in the database. If the domain contains complex
invariants (e.g. rules that must not be violated) so you can implement this
elegantly over so-called validators. In addition, you have fluid as a powerful
templating engine for efficient output of data available. So you can focus on
the problem domain, rather than have to invest much time in the output of the
data and the user interaction.

We now hope that your appetite is aroused! Below we show you some of the core
concepts of the Domain-driven design. These include certain approaches such as
the elaboration of a language used by all (the so-called Ubiquitous Language) or
dealing with associations. Besides these we also show you the technical elements
such as entities, value objects and repositories.


Develop a common language
--------------------------

In software projects, people are involved in different roles: the customer is an
expert in his business area and he has a problem he wants to solve through a
program. As he very well acquainted with the application domain of this program,
we refer to him as a so-called domain expert.

You are usually in the role of the developer: You are familiar with many
technical possibilities but you do usually not know in the business of the
customer. Therefore, misunderstandings are inevitable, because the developer
uses a language very different from the domain expert.

In Domain-driven design, important core terms should be found which are needed
for the characterization and solution of the problem. These will be compiled in
the form a glossary to ensure always, that the domain expert and the developer
understand each other correct.

This so-called ubiquitous language does not apply only during communication: it
should be found in the source code (e.g. class or method names) as well. This
makes it possible to consult experts with problems within the domain and make
decisions with the domain expert on the basis of the source code, whether the
business logic has been implemented correctly.

To model the domain
-------------------

During your meeting with the domain expert you will start to create a model and
after that you will refine it. Usually during the dialog a UML-Diagram will
arise that reflects the features, functions and relationships of the relevant
components of the problem area. These objects are called domain objects because
of its focus on the problem domain of the user.

Domain-driven design provides some building blocks that will help you in
creating a good domain model: Entities, Value Objects and Services. First, let's
concentrate on the first two building blocks: Does the domain object has its own
identity, which is received over time, even if the object goes through different
states? Then the object is an entity. Or is it an attribute that describes other
things in detail? Then the object is of type value object. Hereafter we will go
into more detail on the distinction between these two types.

There are also concepts that couldn't assigned directly to be entities or value
objects - this happens every time you speak of activities during the modeling
phase. For this purpose the concept of services is introduced.


**Entities**

Entities are objects that possess a unique identity. For example, a user has an
username as an identity, a product has a product number, and a student has a
student number. Therefore, all examples mentioned are entities. The identity of
the object remains the same over time, even if the properties of the object
changes.

The identity of an object is defined by an immutable property or a combination
of several immutable properties of the object. At least one property must be
identity-determining. Normally Extbase takes care about automatically and
therefore assigns a unique value to a (hidden) identity property. You can also
select this by yourself and select which combination of properties should be
identity-determining.

.. note::

   Extbase uses as an automatically generated identity property as
   identifier, which is generated by the underlying database (the so-called
   Unique identifier, UID). The word unique clearly means in this context
   really "unique within a database table". This will, however, possibly change
   in a future   version of Extbase to ensure a global uniqueness.

Depending on the application, it may be useful to establish their own
identity-determining properties that are important within your domain. How can I
identify a human clearly? The passport number and country - taken together-
perhaps are such a clear identification, but is often less practical: Who wants
to give his passport number if he logs into a Web site? For an internet forum,
it's practical, for example, to determine the identity of the forum member with
his mail address. But if you write an e-government application, the identity
card number would considered instead.

It is important that the identity-determining properties of an object are set
when it is created and after that never changes: If you make these properties
changeable, different identities could be converted together - but this is
undesirable in most cases. Because you have to promote the new identity to all
objects, which know the object under his old identity. Otherwise you will loose
all connections from other objects to this object. In general, the change of
identity-determining properties should be prohibited by exclusive read access to
these properties.

If you have written databased applications, you may have noticed that you have
often used entities subconsciously, by having provided the database tables with
indexes and primary keys (in TYPO3, for example, the UID will always added as an
identifier). Therefore, you may wonder why we now need a different type of
object at all. In the next section we answer this question.

**Value Objects**

PHP offers several build-in value-types, such as integer, float or string. Often
you will notice that you need domain specific values-types​​, such as colors or
tags. These are represented by so-called Value Objects.

Value Objects are objects that are determined by the values ​​of their
properties. Take a graphic program as an example: Somewhere it must be defined,
what is meant by a "color". A color is determined only by its value, such as the
three color components for red, green and blue in RGB mode. If two objects have
the same RGB color values, so they are effectively the same and must not
continue be distinguished.

Within value objects all properties are identity-determining. If all of the
properties of two value objects have the same value, then these two objects are
the same. Nevertheless, value objects are often longer more than just simple
data structures for primitive data types. They can contain potentially much
complex domain logic. Our color-object could - for example - use methods for
converting color to other color spaces like CMYK or HSV and could include color
profiles for this.

Since all properties are identity-determining and as it is not allowed to change
these properties after the creation of the object, value objects are immutable.
They are generated completely initialized and after that they can't change their
value. You can only create a new value object and eliminate the old.

.. note::

   Although you could provide methods for changing the internal state of a
   value object, it is not allowed to change the state at any time. Take the
   example of the color object, which could contain a new method "makeBrighter()".
   This method must change the color value and give back a new color object with
   these changed values. It must not change the existing object.

By this simple semantics value objects can easily generated, cloned, transmitted
to other computers or transfered to other objects. This makes the
implementation easier and clearly communicates that these objects
are just simple values​​.

.. sidebar:: Entity or Value Object?

   It is not always possible to determine instantly whether an object is an entity
   or a value object. Let's look at an example: In many applications, you have to
   deal with addresses. Just imagine an online store where the customer can specify
   one or more delivery addresses. The address is a typical value object in this
   case, because it is only used as a container for name, street address, city and
   ZIP code.

In an application that optimizes the delivery of letters for the post office,
addresses can be associated with other characteristics such as the name of the
postman who delivered the mail. This name, however, belongs not to the identity
of the object and can change over time (e.g. if a postman retired) - a clear
reference to the usage of an entity.

So you see: you can not always say clearly whether objects are entities or value
objects - it depends entirely on the application and the application domain.

.. note::

   The distinction between entities and value objects will be perhaps
   difficult for you at the beginning and appear as an unnecessary expense. Extbase
   treats the two object types very different in the background. The administration
   of value-objects is more efficient than those of entities. The
   additional expenses for the administration and monitoring of the uniqueness
   omitted here, for example, completely.<remark>TODO: This sentence might be incomplete. At least I don't get it.</remark>


**Associations**

You should never leave the implementation out of sight during the modeling. So
let us talk briefly about a very complex field of implementation: associations
between objects.

Domain objects are related to each other. Such relationships are called in the
language of the domain with the following phrases: A "consists of" B, C 'has' D,
E "processed" F, or G 'belongs to' I. These relationships are referred in
abstract domain model as associations.

At a university professors and students are in relation of each other: the
professor lectures and students are enrolled for classes. To reflect this
relationship in our domain model, we add an association as an abstraction of the
real world. Practically, this means that an professor object contains a list of
pointers to the student objects, who sit with him in the lecture.

Particularly complicated to implement are many-to-many associations here, as
shown in the above example, (a professor taught many students and a student is
taught by various professors) - and moreover, if these associations are
bidirectional. This means that the association can point from a professor to his
students, but also in the other direction.

If you use many-to-many associations during the design, consider to simplify and
restructure them. It is nature that you use a great number of bidirectional
many-to-many associations especially at the beginning of the modeling. In the
refinement of associations you can find help with the following questions:

#. Is the many-to-many association important in the application domain?
#. Can the association be made ​​unilaterally, as there is a main direction in
   which the objects are queried?
#. Could the association be specified in greater detail, e.g. by qualifying the
   individual elements more closely?
#. Is the association for the core functionality needed at all?

So remember to use very simple associations, as it is easier to implement them
and they are better understandable.

**Aggregates**

If you build a complex domain model, you have to deal with many classes offered
at the same hierarchical level. Often it is given that certain objects are part
of a larger object. If you want to model an application for a garage, so maybe
you have to model not only the car but the engine and the wheels too, because
these are of particular importance for the garage. Intuitively, we look at the
wheels and the engine of a car as part of the car, so this understanding should
be visible in the model as well. We call such a relationship between closely
related parts and the whole "aggregates". You see this domain model in Figure
2-1.

.. figure:: /Images/2-BasicPrinciples/figure-2-1.png
   :align: center

   Figure 2-1: The domain model of an auto repair shop. Objects outside an
   aggregate may only reference on the aggregate root.

An aggregate possesses a root object, the so-called "aggregate root". This is
responsible for the integrity of their sub-objects. Objects outside of the
aggregate must only refer to the aggregate root, but never to parts of it,
because otherwise the units couldn't ensure the integrity of the root objects.
To the outside, the units have only an external identity: the aggregate root. As
aggregate roots need an identity, which is used for referencing, their type has
to be an entity.

Transferred to the car analogy it is like this: The service station may not
maintain a permanent reference to the engine, but needs to remember a permanent
reference to the car (e.g. by the vehicle number as the external identity). If you
require a reference to engine for your work - you can reach it via the car.

Through this rules of referencing the domain will be structured further, which
reduces the complexity of the application and makes it manageable.

So far we have shown how real world objects can be mapped into entities and
value objects objects. However, there are concepts in the world that do not fit
into this scheme. To reflect this, we introduce services.


**Services**

In practice there are actions while modeling an application, which could not
directly assigned to certain domain objects. In object-oriented programming, you
are trying to force entities or value objects to these actions, although it does
not really belongs in there. To circumvent this problem, there exist so-called
services. These are containers for actions that may belong to the domain of
application but can't be assigned to any particular object.

A service should be stateless, ie should not use or manipulate internal states.
A service should be used, without knowing its internal state to be known be
taken into account. A service often receives entities or value objects as input
and performs complex operations on them.

Lifecycle of objects

In the real world objects have a certain life cycle. A car is built, then it
changes during its lifetime (the mileage increases, brakes are replaced, wear,
...), and at some point the car is scrapped.

Since we model a domain with domain-driven design, which has a counterpart in
the real world, the life cycle of objects in our program are very similar to the
objects in the real world. Objects are created at a time, then they are active
and can be changed, and eventually they will be deleted. This is shown in Figure
2-2.


.. figure:: /Images/2-BasicPrinciples/figure-2-2.png
   :height: 300px
   :align: center

   Figure 2-2: The life cycle of an object in the real world

We can not always keep all existing objects instantiated in memory of our
program of course - our program would be unusable slow and memory-hungry (not to
mention the case where the power fails and then the objects are gone).

Chapter 2.2 / page 34

So we need a way to maintain only needed objects in the memory. The active
state actually consists of several sub-states, which are shown in Figure 2-3.

.. figure:: /Images/2-BasicPrinciples/figure-2-3.png
   :height: 450px
   :align: center

   Figure 2-3: The life cycle of an object in extbase is more complex, because the
   object can be stored in the data storage (like a database).

When an object is newly created, it is transient, i.e. at the end of the current
request PHP will remove the object from the memory: It will be deleted. To
change object to be permanent, i.e. over multiple requests, it must be converted
from a transient object to a persistent object. Repositories are responsible for
this. These allow the permanent storage and retrieval of objects based on
certain criteria. But how to use repositories now in practice? While you add an
object to a repository, it will be persisted. Now the repository is responsible
for the object. It automatically cares about the storing of an object at the end
of a request.

You can also get back an object reference from the repository when you need it -
the repository will reconstitute the object in this case automatically from the
database.

It is important that the logical object still exists when it is stored in the
database. Just for performance reasons it is not held in the memory. It is very
important to distinguish between the creation of an object and the
reconstitution of the object from the database. Imagine therefore that the
objects continue to exist in the database, only in a different form of
representation.

.. note::

   The constructor of an object is only called when creating the object. If
   the object is reconstituted from the database, the constructor is not called
   because the object still exists logical.

You can retransform a persistent object in a transient object by explicitly
removing it from the repository. This means that the repository for this object
has no responsibility anymore. At the end of a request the object is then
deleted.

Extbase does the work for you in terms of persistence of objects in the database
as much as possible. You are not in touch with database layer directly, as
Extbase cares about the whole life cycle of the objects.

Now - as you have learned many things about the life cycle of objects - we want
to substantiate two pieces of the life cycle: the creation of objects and the
reconstitution of objects.

Create objects with the help of factories

Now that you know the life cycle of objects more accurately, we will deal
initially with the creation of objects. You are allowed to produce only
self-consistent aggregates. In the car example from earlier, this means that, in
preparing the car, the wheels and the engine must be created and immediately
too, because the car object is in an inconsistent state otherwise.

In simple initializations, it is recommended that you use the constructor of the
aggregate root for these purposes. If a complex object networks are built with
many cross connections, then you should move that functionality into its own
factory. This is a class that assembles complex objects and gives them back
finished.

The following is an example of the initialization of the cars in the constructor
of the aggregate root:

.. code-block:: php

   <?php
   class Car
   {
      protected $engine;
      protected $wheels;

      public function __construct()
      {
         $this->engine = new Engine();
         $this->wheels[0] = new Wheel();
         $this->wheels[1] = new Wheel();
         $this->wheels[2] = new Wheel();
         $this->wheels[3] = new Wheel();
      }
   }

For simplicity we have omitted the base classes and the full class names to show
you the essence: As the constructor is executed at creating an object, it is
always built a consistent object.

.. note::

   In TYPO3 you can not generate classes with the new operator, but with
   GeneralUtility::makeInstance (className). In the example above, we wanted to
   concentrate on the essentials, so we have used new there.

Reconstitute objects with repositories
--------------------------------------

You can imagine a repository like a library: go to the circulation desk and ask
for a specific book (based on certain criteria such as the title or author). If
the book is available, the librarian will get it and gives it to you. You do not
have to know on which shelf the book is or whether it perhaps has to be
delivered from another library for you. Now you can read the book and find
perhaps a typo and correct it with a pencil. After expiry of the loan period,
you have to give the book back again, and then the next person will borrow it -
of course with your corrections are still exists in the book.

But how will new books get into the library? You can, for example, donate books
that you have read, to the library. Here, a librarian will write the title of
the book, the author and some keywords in the central library database , so the
book can be found and borrowed by other users. Conversely, a book will be sorted
out if it is old and broken. Of course, the entry in the library database have
to be deleted, so the book can no longer be found.

With a repository, it behaves like a library.With a repository you can find
objects of a certain type. If you send a query like findByTitle('Domain-Driven
Design') to the BookRepository for example, you get all objects back where the
title is "Domain-driven Design". If you now change a book-object (for example,
by correcting a typo in the table of contents), these changes are saved
automatically, and the next search operation, will return the revised object.

So how can you make a repository responsible for an object? For this the
repository has the method add($object). If you want to commit a new object to
the BookRepository for example, you can create it using $book = new
Book('Extbase and Fluid'). A new book titled "Extbase and Fluid" can added to
the BookRepository with add($book). Similarly, you can remove an object from a
repository, by calling the method remove($object). Now the object is not
findable in the repository anymore and therefore it is deleted from the
database.

For each aggregate root exactly one repository has to exists, which is
responsible for that object type and his sub objects. By using this repository,
you can then locate the desired aggregate root object by different criteria.
Conversely, this means: In extbase you define an object type as aggregate root
object by creating a repository for this type.

We have now explained how the domain of the application can be efficiently
packed into a software model. Therefore, we have explained "Domain-Driven
Design" as a "toolbox" of techniques, which are supported by extbase. But an
growing application consists not only of the model: presentation logic is
important too. With an effective separation of model and presentation logic we
will continue in the following section.
