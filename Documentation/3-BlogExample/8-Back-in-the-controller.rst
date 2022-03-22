.. include:: /Includes.rst.txt

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

* First of all there is the method `initializeAction()`, which is called before
  every action if defined in your controller.

* Secondly you can define methods for the initialization of single actions. These
  methods follow a specific naming convention: `initialize` + `actionMethodName`

The following example explains this mechanism:

::

   <?php
   declare(strict_types = 1);

   namespace MyVendor\MyExtension\Controller;

   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

   class CompanyController extends ActionController
   {
       public function initializeAction()
       {
           // this method is called before method fooAction and barAction
       }

       public function initializeFooAction()
       {
           // this method is only called before method fooAction
           // mind the uppercase F in the method name.
       }

       public function fooAction()
       {
           // foo
       }

       public function barAction()
       {
           // bar
       }
   }

Action methods can either return a response (`string`) themselves or not return at all.
If an action method does not return anything, Extbase calls `$this->view->render()` and
returns the rendered view automatically.

Come with us on another tour: dive into Fluid - the new template engine of TYPO3
- and get to know the magnificent underwater world full of colorful Fluid tags
and ViewHelper.
