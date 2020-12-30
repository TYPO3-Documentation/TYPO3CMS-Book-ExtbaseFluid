.. include:: /Includes.rst.txt

=============================
An excursion to the database
=============================

During our trip to the database, bear in mind that we are in the brush of the
Extbase Framework - an area you wouldn't enter without traveling experience or
a travel guide. Later on, you will use the Query Object to create your own requests.
If you are not interested in the background of the data storage, but trust
that Extbase will take care of this, you can skip this chapter.

The ``BlogRepository`` creates a ``Query`` object with the class
:php:`\TYPO3\CMS\Extbase\Persistence\Generic\Query`, which is specialised for ``Blog`` objects, and
executes the query (``$query->execute()``). The ``Query`` object is mostly abstracted
from the physical storage - normally a relational database. It does not contain
any information on how something is searched for. It only contains a specification of what is
searched for. The ``Query`` object still allows any kind of storage method like a
web service or storage in a text file.

The ``Query`` object is handed over to the storage backend. The storage backend
translates the request into a form that the given storage method can use
directly. In our case, this is an SQL-Statement. The call ``$query->execute()`` will
finally be translated to ``SELECT * FROM tx_blogexample_domain_model_blog``.

The storage backend returns the "raw" results as a collection (array) of
database tuples. Every database tuple corresponds to a table row and is in itself
an associative array with the field names as keys and the field contents as
value. It does not contain any objects yet, and it also does not contain any data on posts,
comments, or tags that belong to the database record. The task to build
a complete object tree starting from the ``Blog`` object down to the last tag of a
post will be handed over to another object - the ``DataMapper``.
