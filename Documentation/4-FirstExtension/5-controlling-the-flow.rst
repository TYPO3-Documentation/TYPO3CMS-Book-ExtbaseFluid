.. include:: /Includes.rst.txt

====================
Controlling the flow
====================

We now want to show a list of products in our inventory in the frontend.
The component responsible for rendering that list is the *view*.
The default view and templating engine used in Extbase is Fluid.

The connection between the *model* and the *view* is the *controller*.
The controller is responsible for fetching the model's data and handing it
to the view to be rendered. The controller uses `*Action` methods as entry points.
In our case, we want to display a list of products, so we should implement a `listAction`.

The class name of the controller must end with ``Controller``. Because our controller controls
the display of the inventory we call it :php:`\MyVendor\StoreInventory\Controller\StoreInventoryController`.

In our simple example, the controller looks like this:

.. code-block:: php

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
      * Inject the product repository
      *
      * @param \MyVendor\StoreInventory\Domain\Repository\ProductRepository $productRepository
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


Our :php:`\MyVendor\StoreInventory\Controller\StoreInventoryController` is derived from
:php:`\TYPO3\CMS\Extbase\Mvc\Controller\ActionController`.
It only contains the method :php:`listAction()`.
Extbase identifies all methods ending with ``Action`` as actions
- entry points to our application.

The method :php:`injectProductRepository()` shows how dependency injection looks like in Extbase
- Extbase automatically injects the product repository via this method.
Afterward, we can access the repository with :php:`$this->productRepository` in all actions.
Use dependency injection for getting all your class dependencies if possible.

As we want to display a list of all products in our inventory,
we can use the method :php:`findAll()` of the repository to fetch them.
:php:`findAll()` is  implemented in class :php:`\TYPO3\CMS\Extbase\Persistence\Repository`, the parent class of our repository.

The repository returns a :php:`\TYPO3\CMS\Extbase\Persistence\Generic\QueryResult`
object with all product objects (that are not hidden or deleted).
We pass these objects to the view with :php:`$this->view->assign(…)` and
finally return a :php:`Response` object (created with the :php:`ResponseFactory`)
with the rendered content of the view.
