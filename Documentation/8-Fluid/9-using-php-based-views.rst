.. include:: /Includes.rst.txt
.. index:: Views; PHP based

=====================
Using PHP based views
=====================

So far, we have used Fluid as a template engine. Most textual output
formats are well representable with Fluid. For some use cases, it is
reasonable to use pure PHP for the output. An example of such a use case is
the creation of JSON files.

For this reason, Extbase also supports PHP based views. Assume we want to
create a JSON based output for the ``list`` action in the
``post`` controller of the BlogExample. To be able to do so, we need
a PHP based view.

A PHP-based view will be used when no Fluid template is found
for a controller/action/format combination. This PHP class is resolved
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
it applies only to the format JSON. So that the class according to the
naming convention must be implemented in the file
*EXT:blog_example/Classes/View/Post/ListJSON.php*.

Each view must extend class :php:`TYPO3\CMS\Fluid\View\StandaloneView`
or at least implement the interface
:php:`\TYPO3Fluid\Fluid\View\ViewInterface`. This consists of some
initializing methods and the ``render()`` method called
by the controller for displaying the view.

.. versionchanged:: 12.0
   Extending :php:`\TYPO3\CMS\Extbase\Mvc\View\AbstractView` has been
   deprecated with v11 and removed with v12.

.. versionchanged:: 12.0
   :php:`TYPO3\CMS\Extbase\Mvc\Controller\ControllerContext has been
   deprecated with v11 and removed with v12.

.. todo: The following code example will not work in TYPO3 12 anymore. Example needs
   to be updated.

.. warning::
   The following code example will not work in TYPO3 12 anymore. Example needs
   to be updated.

A minimal view would like this::

   <?php
   namespace MyVendor\BlogExample\View\Post;

   use TYPO3\CMS\Extbase\Mvc\Controller\ControllerContext;

   class ListJSON implements \TYPO3\CMS\Extbase\Mvc\View\ViewInterface
   {
       protected ControllerContext $controllerContext;
       protected $variables = [];

       public function setControllerContext(ControllerContext $controllerContext)
       {
           $this->controllerContext = $controllerContext;
       }

       /**
        * Add a variable to $this->viewData.
        * Can be chained, so $this->view->assign(..., ...)->assign(..., ...); is possible
        *
        * @param string $key Key of variable
        * @param mixed $value Value of object
        * @return self an instance of $this, to enable chaining
        */
       public function assign($key, $value)
       {
           $this->variables[$key] = $value;
           return $this;
       }

       /**
        * Add multiple variables to $this->viewData.
        *
        * @param array $values array in the format array(key1 => value1, key2 => value2).
        * @return self an instance of $this, to enable chaining
        */
       public function assignMultiple(array $values)
       {
           foreach ($values as $key => $value) {
               $this->assign($key, $value);
           }
           return $this;
       }

       /**
        * Initializes this view.
        *
        * Override this method for initializing your concrete view implementation.
        */
       public function initializeView()
       {
       }

       public function render()
       {
           return 'Hello World';
       }
   }


Now we have the full expressive power of PHP available, and we can
implement our own output logic. For example, our JSON view could look like
this::

   class ListJSON implements \TYPO3\CMS\Extbase\Mvc\View\ViewInterface
   {
      // [...]
      public function render()
      {
         $postList = $this->viewData['posts'];
         return json_encode($postList);
      }
   }

Here we can see that the data passed to the
view is available in the array ``$this->viewData``. These are
converted to JSON data using the function ``json_encode`` and then
returned.

.. tip::

   PHP based views are also helpful for especially complex kind of
   output, like the rendering of PDF files.


View configuration options in the controller
============================================

You have some methods in the controller that you can overwrite to
control the resolution of the view. In most cases, the customization of
``$viewObjectNamePattern`` should be flexible enough, but
sometimes you have to put more logic into it.

For example, you might have to initialize your view specially
before it can be used. For this, there is the template method
``initializeView($view)`` inside the
``ActionContoller``, which gets the view as a parameter. In this
method, you should write your own initializing routine for your
view.

If you want to control the resolving and initializing of the view
completely, you have to rewrite the method ``resolveView()``.
This method has to return a view that implements
:php:`\TYPO3Fluid\Fluid\View\ViewInterface`. Sometimes it is enough to
overwrite the resolution of the view object name. Therefore you must
overwrite the method ``resolveViewObjectName()``. This method
returns the name of the PHP class, which should be used as a view.

.. tip::

  If you have a look at the source code of Extbase at these points,
  in the comment blocks of the above-mentioned methods, you see an
  ``@api`` annotation. These methods are part of the
  *official API* of Extbase and could be overwritten
  for personal use.

  Methods without an API annotation should never be overwritten
  (although it is technically possible), because they could be directly
  changed in feature versions of Extbase.

Now you have learned about the most helpful functions of Fluid. In
the following section, we would show the interaction of these functions
during the creation of a real template, to give you a better feeling for
the work with Fluid.


