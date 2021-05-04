.. include:: /Includes.rst.txt
.. index::
   PersistenceManager; persistAll()
   pair: Dispatcher; Response
   pair: Bootstrap; Response

=============================
Returning the result to TYPO3
=============================

At the end of the request, all changes to objects that have previously
been made only in memory are made permanent (persisted). The persistence manager
is called via ``$persistenceManager->persistAll()``. The persistence
manager walks through all used repositories and collects the new, the modified and
and the deleted objects. In this case, the persistence manager asks the blog
repository about such objects. Since we only displayed blog messages, but made no
changes, the persistence manager will not change anything at this time.

.. todo: Again, it's not clear who tells the persistence manager to persist changes.
         We need to explain that users can and should do it manually in actions that
         explicitly change objects, but that Extbase calls persistAll as well.

This is the end of this trip. The dispatcher returns
the response to the Bootstrap, which will return the rendered HTML content to
the TYPO3 framework. Then TYPO3 will add this to the output of the current page content.

.. code-block:: php

   $body = $response->getBody();
   $body->rewind();
   $content = $body->getContents();
   // ...
   return $content;

.. todo: Let's add context to this code snippet. It's taken from the Bootstrap
         and users should be able to follow and look it up quickly if wanted.

This section explains how the extension displays a list of blogs.
The following chapter is about how to create a new post.
It is about chaining several actions into a coherent sequence. 
It shows the possibilities of validation and deeper internals of Fluid.
