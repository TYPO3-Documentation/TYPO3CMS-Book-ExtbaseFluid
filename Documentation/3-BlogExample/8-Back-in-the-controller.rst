.. include:: /Includes.rst.txt
.. index:: Extbase; Controller

======================
Back in the controller
======================

The ready ``Blog`` objects are delivered in an array. "Ready" means in this
context that every ``Blog`` object already has all its related ``Post`` objects and their
``Comment`` and ``Tag`` objects.

These blogs are delivered to the object responsible for the output for
further processing: the so-called *View*, available under the class
variable ``$this->view``.


The method ``assign()`` "binds" the array of the blogs to the variable
named "blogs" of the TemplateView. It can be addressed in the
template with this name. The method ``render()`` of the TemplateView starts the generation of the
HTML code.

.. todo: Let's have a code example here to let people see assign and render in action

Before leaving the small, contemplative action island and digging into the deep of
the Fluid template, take a look at the abbreviations and simplifications
Extbase offers at this point.

.. todo: deep -> depths?

.. index:: Controller; initializeAction()

* First of all, there is the method `initializeAction()`, which is called before
  every action, if defined in your controller.

* Secondly, you can define methods for the initialization of single actions. These
  methods follow a specific naming convention: `initialize` + `actionMethodName`

The following example explains this mechanism:


.. code-block:: php
   :caption: EXT:my_extension/Classes/Controller/CompanyController.php

   <?php
   declare(strict_types=1);

   namespace MyVendor\MyExtension\Controller;

   use Psr\Http\Message\ResponseInterface;
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

      public function fooAction(): ResponseInterface
      {
         // foo
      }

      public function barAction(): ResponseInterface
      {
         // bar
      }
   }

Action methods return a response object of type `\Psr\Http\Message\ResponseInterface`.

Another tour is coming: dive into Fluid - the new template engine of TYPO3
- and get to know the magnificent underwater world full of colorful Fluid tags
and view helpers.
