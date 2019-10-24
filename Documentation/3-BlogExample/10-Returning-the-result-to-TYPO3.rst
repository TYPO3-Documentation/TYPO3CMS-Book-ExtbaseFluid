.. include:: ../Includes.txt

Returning the result to TYPO3
=============================

At the end of the request, all changes to objects that were previously
only made in memory are made permanent (persisted). The persistence manager
will be called via ``$persistenceManager->persistAll()``. The persistence
manager will walk through all used repositories and collects at first the new
and the deleted objects. In our case the persistence manager asks the blog
repository about such objects. Since we only displayed blogs but made no
changes, the persistence manager will not change anything at this time.

We have now finally reached the end of our trip. The Dispatcher has still to
return the rendered Content to the TYPO3 framework so TYPO3 can render it in
the main page context.

.. code-block:: php

   return $response->getContent();

In this section you have learned how the extension displays a list of blogs.
In the following chapters we will look at creating a new post.
You will learn about chaining of several actions into a coherent sequence,
explore the possibilities of validation and dive deeper into fluid.
