.. include:: ../Includes.txt

Automatic persistence of the domain logic
=========================================

Remarkable at this point is, that up to this time no method to save
the blogs or posts was called. Only the fact that the post is added to the
blog and thereby was changed is enough to initiate extbase to save the
changes permanently (to persist). Like on our first route the persistence
manager is assigned with it by
``$persistenceManager->persistAll()``. This time it collects all
reconstructed objects (e.g. such, that are restored from the database) that
are managed by a repository. These "managed" objects represent the root
objects of an object graph (aggregate). These are so called
*aggregate root* objects.

The collection of new and deleted objects as well as the root objects
(in our case the ``Blog`` objects) are handed over from the
persistence manager to the persistence backend. The backend has the task to
manage the complete process in a controlled manner. The course is done in
the following order:

* All new added aggregate root objects are inserted (first without
  to create the child and grandchild objects).
* All properties of the aggregate root objects are persisted.
* All kind objects are processed recursive in a corresponding manner.
* All removed objects were deleted.

.. warning::
   Do not confound the persistence backend with the storage backend
   that we discussed before in the section "An excursion to the database" in
   this chapter. The persistence backend is a layer "above" the storage
   backend. It is responsible for the cycle of the persistence (what should
   be stored, deleted or changed in which order?), while the storage backend
   has the job to translate the abstract requests into the native language of
   the "physical" storage option (most the SQL dialect of a database).

In our case the persistence backend (in the following called backend)
checks for every ``Blog`` object whose properties (``title,
description, posts`` and so on) have to be
stored. This is the case if the corresponding objects is new or the property
value was changed in the runtime. If the property refers to an object, the
backend checks these objects for changes of property values in the next step.

.. sidebar:: Dirty objects

   How does extbase know that a property value has changed? Every
   object of the domain of your extension (domain object) must enhance a
   defined class of extbase. For the blog class this is
   ``\TYPO3\CMS\Extbase\DomainObject\AbstractEntity``. Inside this parent
   class a property ``$_cleanProperties`` is defined. This property
   is directly, after the reconstruction of the object (restored from the
   database), initialized with the unchanged property values with a call of
   ``_memorizeCleanState()``; in our case with the title, the
   description, the administrator and all ``post`` objects. With
   this it is possible later on to check every property for changes with
   calling of ``_isDirty($propertyName)``.

.. note::

   All methods that start with an underline (_) are internal methods.
   These methods can be called from "outside" *(public)* in a technical view,
   but they should not be called inside an extension - even though it is
   attractive to do that. No methods or classes marked as `@internal` should 
   be used in your extension.

In our example the backend finds the new post while it iterates through
the post objects. The storage backend is directed to store these post in the
database - and with it also all of its relations to other objects. Because
the post has a 1:n relation to the blog (a blog has many posts, every post
is part of just one blog) the UID of the blog is stored inside the property
``blog`` of the post. With this the post refers to its blog and can
be assigned when the method ``indexAction()`` is called.

