.. include:: ../Includes.txt

Back in the controller
==============================

You get the ready ``Blog`` objects delivered in an array. "Ready" means in this
context, that every ``Blog`` object already has all it's ``Post`` objects and their
``Comment`` and ``Tag`` objects.

These blogs are delivered to the object, which is responsible for the output for
further processing: the so called *View*. If we make no own choice, like in our
example, the TemplateView of Fluid is automatically available under the class
variable ``$this->view``.

With the method ``assign()`` we "bind" the array with our blogs to the variable
name "blogs" of the TemplateView. It can be addressed with this name in the
template. The method ``render()`` of the TemplateView starts the generation of the
HTML code.

Before we leave our small, contemplative action island and dig into the deep of
the Fluid template, let's take a look at the abbreviations and simplifications
Extbase offers at this point.

Since we need the ``BlogRepository`` in all actions, we move the code for it's
initialization to the method ``initializeAction()``. This method is called by
Extbase prior to *each* call of an action. There the necessary repositories are
instantiated:

::

   public function initializeAction() {
      $this->blogRepository = GeneralUtility::makeInstance(\MyVendor\BlogExample\Domain\Repository\BlogRepository::class);
      $this->administratorRepository = GeneralUtility::makeInstance(\MyVendor\BlogExample\Domain\Repository\AdministratorRepository::class);
   }

This approach offers no performance gain (rather a negligible disadvantage), but
we avoid duplicate code. In addition to the method ``initializeAction()``, that is
worked off before the call of _each_ action, Extbase calls, if available, the
method ``initializeIndexAction()``. The string *IndexAction* needs to be replaced
by the name of those action, in before that method should be called. In short:
You can create an own method for initialization of each action.

The second step is the combination of the rows to query the repository and to
bind the variable name to a row. Finally you waive to explicit call the method
``render()``. If the action does not return a result with ``return $content`` by
itself (either because the call is missing or returns NULL), Extbase
automatically calls the method ``render()``.

.. note::

   This automatism can be confusing, because you have to specify return '';
   explicitly vice versa, to suppress the rendering process. Sometimes this might
   be handy to discover errors.

Come with us on another tour: dive into Fluid - the new template engine of TYPO3
- and get to know the magnificent underwater world full of colorful Fluid tags
and ViewHelper.
