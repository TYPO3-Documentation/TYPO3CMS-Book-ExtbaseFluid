.. include:: ../Includes.txt

Controlling The Flow
================================================

The inventory created in the backend should be shown as a list in the frontend now.
The creation of the HTML code out of the product objects to be shown is done by the *view*.
Extbase uses the class :php:`\TYPO3\CMS\Fluid\View\TemplateView` of the extension
Fluid as default for the view.

The connection between the *model* and the *view* is the *controller*. It controls the
sequences inside the extension and is responsible for the ``list`` action in our case.
This includes locating the products which are to be shown, as well as transmission of the
selected products to the responsible view.

The class name of the controller must end with ``Controller``. Because our controller controls
the display of the inventory we call it ``\MyVendor\Inventory\Controller\InventoryController``.

.. tip::

    When naming a controller you are free inside the described frame. We advise to name a
    controller by what he "controls". In big projects these are specially the aggregate root
    objects (see section "aggregates" in chapter 2). For this we had also named our controller
    ``MyVendor\Inventory\Controller\ProductController``.

In our simple example the controller looks like this:

::

    <?php
    namespace MyVendor\Inventory\Controller;
    use \TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
    use \TYPO3\CMS\Core\Utility\GeneralUtility;
    use \MyVendor\Inventory\Domain\Model\Repository\ProductRepository;

    class InventoryController extends ActionController {

        public function listAction() {
            $productRepository = GeneralUtility::makeInstance(ProductRepository::class);
            $products = $productRepository->findAll();
            $this->view->assign('products', $products);
        }
    }
    ?>

Our ``\MyVendor\Inventory\Controller\InventoryController`` must be derived from the
``\MyVendor\Extbase\MVC\Controller\ActionController``. It contains only the method ``listAction()``.
Extbase identifies all methods that ends with ``Action`` as actions - so as little plan of procedures.

In the first line of the ``listAction()`` the ``ProductRepository`` is instanced. The products to be
shown we get by the method ``findAll()`` of the repository. This method is implemented in the class
:php:`\TYPO3\CMS\Extbase\Persistence\Repository`. Which methods are also still for disposition you can
read in chapter 6.

.. tip::

    Take care about using the framework method ``GeneralUtility::makeInstance()`` of TYPO3 instead of the
    keyword *new* to create new instances of the repository. Background for familiar folks: The repository
    is a so called *Singleton* and is marked accordingly for that. The method ``makeInstance()``
    recognize the singleton by means of the identification mark and returns - after the first creation -
    always the same object, independent of the place in your code where it is requested.
    In contrast the creation with "new" always returns a new and therefor empty repository object.

As result we get a ``\TYPO3\CMS\Extbase\Persistence\Generic\QueryResult`` object with the product objects. We pass these objects to the view with
``$this->view->assign(...)``. Without our further assistance, at the end of the action the view is
invited to return the passed content rendered based on a HTML template back to TYPO3.

::

    return $this->view->render();

This line is declined by Extbase for us, if we not initiate the rendering process ourselves.
So we can omit the line in our case.
