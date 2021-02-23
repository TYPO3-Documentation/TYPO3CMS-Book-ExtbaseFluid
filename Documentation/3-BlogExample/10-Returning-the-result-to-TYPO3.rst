.. include:: /Includes.rst.txt
.. index::
   PersistenceManager; persistAll()
   pair: Dispatcher; Response
   pair: Bootstrap; Response

=============================
Returning the result to TYPO3
=============================

At the end of the request, all changes to objects that were previously
only made in memory are made permanent (persisted). The persistence manager
will be called via ``$persistenceManager->persistAll()``. The persistence
manager will walk through all used repositories and collect the new
and the deleted objects. In our case, the persistence manager asks the blog
repository about such objects. Since we only displayed blog messages but made no
changes, the persistence manager will not change anything at this time.

.. todo: Again, it's not clear who tells the persistence manager to persist changes.
         We need to explain that users can and should do it manaully in actions that
         explicitly change objects but that Extbase calls persistAll as well.

We have now finally reached the end of our trip. The dispatcher returns
the response to the Bootstrap, which will return the rendered content to
the TYPO3 framework so TYPO3 can render it in
the main page context.

.. todo: TYPO3 includes the content, does not render it again.

.. code-block:: php

   $body = $response->getBody();
   $body->rewind();
   $content = $body->getContents();
   // ...
   return $content;

.. todo: Let's add context to this code snippet. It's taken from the Bootstrap
         and users should be able to follow and look it up quickly if wanted.

In this section, you have learned how the extension displays a list of blogs.
In the following chapters, we will look at creating a new post.
You will learn about chaining several actions into a coherent sequence,
explore the possibilities of validation and dive deeper into Fluid.
