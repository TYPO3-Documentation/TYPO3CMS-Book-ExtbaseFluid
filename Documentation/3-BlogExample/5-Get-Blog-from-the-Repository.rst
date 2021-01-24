.. include:: /Includes.rst.txt
.. index::
   Blog example; BlogRepository
   \TYPO3\CMS\Extbase; Persistence\Repository

================================
Get the blog from the repository
================================

Let's take a look into the ``BlogRepository`` and travel into the inner core of
our little action island.

.. code-block:: php

    <?php
    namespace FriendsOfTYPO3\BlogExample\Domain\Repository;

    class BlogRepository extends \TYPO3\CMS\Extbase\Persistence\Repository
    {

    }

The ``BlogRepository`` does not need any own code since all methods which are
most commonly used are already implemented in the parent class
:php:`\TYPO3\CMS\Extbase\Persistence\Repository`.
In the controller, you saw the call to ``findAll()``, to retrieve all
blog objects, which is one of the methods available by default.

.. note::

   Although you don't need to implement your own logic, Extbase expects an existing
   class.


..index:: Extbase; Repositories

How repositories work
=====================

The way a repository works is much like a library of a university, which works
in the following way:

You tell an employee of the library to find a book matching certain criteria.
After a few minutes till days, you get the corresponding book. In this case, it
doesn't matter to you if the book is right below the counter, on a shelf, in
the cellar, or is not even printed yet (except the time issue - but
students have time). It is only important that you get the book at any time.
Remarks made with a pencil by you will be added permanently (hopefully without
changes) when you return the book.

That is translated to a repository: Via a repository, you tell a method to find
an object matching certain criteria. After a few milliseconds till seconds, you
receive the corresponding object. In this case, you don't care where the object
is stored. Practically it even doesn't matter if the object is stored in the
memory, must be fetched from the hard drive, is retrieved via web service from
another server, or is instantiated for the first time (except the speed -
but users have time). The only important thing is that the object is
instantiated and delivered to you. Object attributes changed by you will be
stored when you leave the extension.
