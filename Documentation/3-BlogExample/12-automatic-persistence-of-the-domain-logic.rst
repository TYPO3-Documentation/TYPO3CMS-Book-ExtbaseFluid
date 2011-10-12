automatic persistence of the domain logic
=========================================================

Remarkable at this point is, that up to this time no method to save
the blogs or posts was called. Only the fact that the post is added to the
blog and thereby was changed is enough to initiate extbase to save the
changes permanently (to persist). Like on our first route the persistance
manager is assigned with it by
``$persistenceManager->persistAll()``. This time it collects all
reconstructed objects (e.g. such, that are restored from the database) that
are managed by a repository. These "managed" objects represent the root
objects of an object graph (aggregate). These are so called
*aggregate root* objects.

.. note::

	More about the object life cycle you will find out in "Domain Driven
	Design" in chapter 2. The states *transient* and
	*persistent* are also elucidated in detail there. For
	the topic aggregate root you will find in the section "aggregates" in
	chapter 2 a detailed introduction.

The collection of new and deleted objectsas well as the root objects
(in our case the ``Blog`` objects) are hand over from the
persistence manager to the persistence backend. The backend has the task to
manage the complete process in a controlled manner. The course is done in
the following order:

* All new added aggregate root objects are inserted (first without
  to create the child and grandchild objects).
* All properties of the aggregate root objects are persisted.
* All kind objects are processed recusive in a corresponding manner.
* All removed objects were deleted.

.. warning::
	Do not confound the persistence backend with the storage backend
	that we discussed before in the section "An excursion to the database" in
	this chapter. The persistence backend is a layer "above" the storage
	backend. It is responsible for the cycle of the persistence (what should
	be stored, deleted or changed in which order?), while the storage backend
	has the job to translate the abstact requests into the native language of
	the "physical" storage option (most the SQL dialect of a database).

In our case the persistence backend (in the following called backend)
checks for every ``Blog`` object whose properties (``title,
description, posts`` and so on) if the property values have to be
stored. This is the case ifthe corresponding objects is new or the property
value was changed in the runtime. If the property refer to an object, the
backend checks in the next step also these objects for changes of the
property values.

.. sidebar:: Dirty objects

	How does extbase know that a property value has changed? Every
	object of the domain of your extension (domain object) must enhance a
	defined class of extbase. For the blog class this is
	``Tx_Extbase_DomainObject_AbstractEntity``. Inside this parent
	class a property ``$_cleanProperties`` is defined. This property
	is directly, after the recontruction of the object (restored from the
	database), initialized with the unchanged property values with a call of
	``_memorizeCleanState()``; in our case with the title, the
	description, the administrator and all ``post`` objects. With
	this it is possible later on to check every property for changes with
	calling of ``_isDirty($propertyName)``.

.. note::

	All methods that starts with an underline (_) are internal methods.
	These methods can be called from "outside" (public) in a technical view,
	but they should not called inside an extension - even though it is
	attractive to do that. In FLOW3 the "observation" of the objects is solced
	in an other way and it is not applicable to enhance a parent class of the
	framework. The declaration ``extends
	Tx_Extbase_DomainObject_AbstractEntity`` can simply be removed when
	you port your extension to TYPO3 v5.

In our example the backend find the new post while it iterates through
the post objects. The storage backend is directed to store these post in the
database - and with it also all of its relations to other objects. Because
the post has a 1:n relation to the blog (a blog has many posts, every post
is part of just one blog) the UID of the blog is stored inside the property
``blog`` of the post. With this the post refers to its blog and can
be assigned when the method ``indexAction()`` is called.

We are glad that you followed us also on this second, much more
exhausting route. With the holiday destination you are so far familiar that
you can move around safety in the blog example in the future without us -
your travel guides. Of course there is a lot more to explore!

