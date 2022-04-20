.. include:: /Includes.rst.txt

====================
Controlling the flow
====================

The frontend page shall show a list of products in the inventory.
The component responsible for rendering that list is the *view*.
The default view and templating engine used in Extbase is Fluid.

The connection between the *model* and the *view* is the *controller*.
The controller is responsible for fetching the model's data and handing it
to the view to be rendered. The controller uses `*Action` methods as entry points.
In our case, we want to display a list of products, so we should implement a `listAction`.

.. index:: Controller

The Controller
==============

The class name of the controller must end with ``Controller``. Because our controller controls
the display of the inventory we call it :php:`\T3docs\StoreInventory\Controller\StoreInventoryController`.

The controller looks like this:

.. code-block:: php
   :caption: EXT:store_inventory/Classes/Controller/StoreInventoryController.php

   <?php
   declare(strict_types=1);

   namespace MyVendor\StoreInventory\Controller;

   use MyVendor\StoreInventory\Domain\Repository\ProductRepository;
   use Psr\Http\Message\ResponseInterface;
   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

   class StoreInventoryController extends ActionController
   {
      private $productRepository;

      /**
      * Injects the product repository
      *
      * @param ProductRepository $productRepository
      */
      public function injectProductRepository(ProductRepository $productRepository)
      {
         $this->productRepository = $productRepository;
      }

      public function listAction(): ResponseInterface
      {
         $products = $this->productRepository->findAll();
         $this->view->assign('products', $products);

         return $this->responseFactory->createHtmlResponse($this->view->render());
      }
   }

.. versionchanged:: 11.0
   From version 11 on Extbase expects actions to return an instance
   of Psr\Http\Message\ResponseInterface.

.. index:: \TYPO3\CMS\Extbase; Mvc\Controller\ActionController

Our :php:`\T3docs\StoreInventory\Controller\StoreInventoryController` is derived from
:php:`\TYPO3\CMS\Extbase\Mvc\Controller\ActionController`.
It only contains the method :php:`listAction()`.
Extbase identifies all methods ending with ``Action`` as actions
- entry points to our application.


.. index:: Repository; Injection

Injecting the repository
========================

The method :php:`injectProductRepository()` shows how dependency injection looks like in Extbase
- Extbase automatically injects the product repository via this method.
Afterwards the repository can be accessed with :php:`$this->productRepository` in all actions.
Use dependency injection for getting all of your class dependencies if possible.


.. index::
   Repository; findAll()
   Repository; Fetching Models

Fetching the products from the repository
=========================================

As a list of all products should be displayed in our inventory,
the method :php:`findAll()` of the repository is used to fetch them.
:php:`findAll()` is  implemented in class :php:`\TYPO3\CMS\Extbase\Persistence\Repository`,
the parent class of our repository.


.. index::
   \TYPO3\CMS\Extbase; Persistence\Generic\QueryResult
   View; Assign
   View; Rendering

Assigning the view
==================

The repository returns a :php:`\TYPO3\CMS\Extbase\Persistence\Generic\QueryResult`
object with all product objects (that are not hidden or deleted).

These objects are passed to the view with :php:`$this->view->assign(…)` and
finally return a :php:`Response` object (created with the :php:`ResponseFactory`)
with the rendered content of the view.
