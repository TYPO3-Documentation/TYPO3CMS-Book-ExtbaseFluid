.. include:: ../Includes.txt

Using PHP based views
================================================

So far we have used Fluid as template engine. Most textual output
formats are well representable with Fluid. For some use cases it is
reasonable to use pure PHP for the output. An example of such an use case is
the creation of JSON files.

For this reason, Extbase also supports PHP based views. Assume we want
create a JSON based output for the ``list`` action in the
``post`` controller of the BlogExample. To be able to do so we need
a PHP based view.

When no Fluid template is found for a controller/action/format
combination, a PHP based view will be used. This PHP class is resolved
against a naming convention which is defined in the
``ActionController`` in the class variable
``$viewObjectNamePattern``. The default naming convention is
following::

   \MyVendor\@extension\View\@controller\@action@format

All parts beginning with ``@`` will be replaced accordingly.
When no class with this name can be found, the ``@format`` will be
removed from the naming convention and a matching class again searched
for.

Our PHP based view for the list view of the post controller should
have the class name ``\MyVendor\BlogExample\View\Post\ListJSON``, because
it applies only for the format JSON. So that the class according to the
naming convention must be implemented in the file
*EXT:blog_example/Classes/View/Post/ListJSON.php*.

Each view must implement the interface
``\TYPO3\CMS\Extbase\Mvc\ViewViewInterface``. This consists off some
initializing methods and the ``render()`` method, which is called
by the controller for displaying the view.

It is often helpful to inherit directly from
``\TYPO3\CMS\Extbase\Mvc\View\AbstractView`` which provides default
initializing methods and you only have to implement the
``render()`` method. A minimal view would like this::

   <?php
   namespace MyVendor\BlogExample\View\Post;

   class ListJSON extends \TYPO3\CMS\Extbase\Mvc\View\AbstractView {
      public function render() {
         return 'Hello World';
      }
   }

Now we have the full expression power of PHP available and we can
implement our own output logic. For example our JSON view could look like
this::

   <?php
   namespace MyVendor\BlogExample\View\Post;

   class ListJSON extends \TYPO3\CMS\Extbase\Mvc\View\AbstractView {
      public function render() {
         $postList = $this->viewData['posts'];
         return json_encode($postList);
      }
   }

Here we can see that the data that is passed to the
view is available in the array ``$this->viewData``. These are
converted to JSON data using the function ``json_encode`` and then
returned.

.. tip::

   PHP based views are also helpful for specially complex kind of
   output like the rendering of PDF files.

View configuration options in the controller
-------------------------------------------------

You have some methods in the controller that you can overwrite to
control the resolution of the view. In the most cases the customization of
``$viewObjectNamePattern`` should be flexible enough, but
sometimes you have to put more logic into it.

For example you might have to initialize your view in a special
manner before it can be used. For this there is the template method
``initializeView($view)`` inside the
``ActionContoller``, which gets the view as parameter. In this
method you should write your own initializing routine for your
view.

If you want to control the resolving and initializing of the view
completely, you have to rewrite the method ``resolveView()``.
This method has to return a view that implements
``\TYPO3\CMS\Extbase\Mvc\ViewViewInterface``. Sometimes it is enough to just
overwrite the resolution of the view object name. Therefore you must
overwrite the method ``resolveViewObjectName()``. This method
returns the name of the PHP class which should be used as view.

.. tip::

  If you have a look at the source code of Extbase at these points,
  in the comment blocks of the above mentioned methods you see an
  ``@api`` annotation. These methods are part of the
  *official API* of Extbase and could be overwritten
  for personal use.

  Methods without an API annotation should never be overwritten
  (although it is technically possible), because they could be directly
  changed in feature versions of Extbase.

Now you have learned about the most helpful functions of Fluid. In
the following section we would show the interaction of these functions
during the creation of a real template, to give you a better feeling for
the work with Fluid.


