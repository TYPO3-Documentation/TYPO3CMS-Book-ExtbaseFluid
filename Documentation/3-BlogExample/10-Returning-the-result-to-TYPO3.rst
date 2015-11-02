.. include:: ../Includes.txt

Returning the result to TYPO3
=============================

In conclusion, all changes to objects that were previously only in the main
memory are made permanently preserved (persists). Thus the persistence manager
will now be appointed by ``$persistenceManager->persistAll()``. The persistence
manager will walk through the used repositories and collects at first the new
and the deleted objects. In our case the persistence manager asks the blog
repository about such objects. Since we set at run time either newly created
objects in the repository nor objects which have been included from there again,
the persistence manager remained at this time inactive.

We have now finally reached the end of our trip. The Dispatcher has still to
return the rendered Content to the TYPO3 framework.

::

	return $response->getContent();

In this section you had learned how the extension is a list of blogs is issued.
Below we take an alternative route by creating a new post. You will learn about
the chaining of several actions into a coherent sequence, exploit the
possibilities of validation and deeper into fluid.
