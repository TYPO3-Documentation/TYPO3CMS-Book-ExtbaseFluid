.. include:: /Includes.rst.txt
.. index::
   Templates
   Files; Resources/Private/Templates

=================
Adding a template
=================

In Extbase, frontend templates are stored by default in the subdirectory
:file:`Resources/Private/Templates/` provided by  an extension. This
local path is written as :file:`EXT:store_inventory/Resources/Private/Templates`
in the setup.

The name of the subdirectory below the :file:`Templates/` folder is derived
from the corresponding controller name (without the `Controller` suffix).
The class name :php:`\T3docs\StoreInventory\Controller\StoreInventoryController`
will result in the directory name :file:`StoreInventory/`.

The directory :file:`StoreInventory/` contains the template file for our list view.
As the list action renders our list view, the template must be named :file:`List.html`.
This is the action name, without the "action" suffix.


.. index:: Templates; Fluid

The Fluid template
==================

:file:`EXT:store_inventory/Resources/Private/Templates/StoreInventory/List.html`
looks like this:

.. code-block:: html
   :caption: EXT:store_inventory/Resources/Private/Templates/StoreInventory/List.html

   <html xmlns:f="http://typo3.org/ns/TYPO3/CMS/Fluid/ViewHelpers">
   <table border="1" cellspacing="1" cellpadding="5">
       <tr>
           <td>Product name</td>
           <td>Product description</td>
           <td>Quantity</td>
       </tr>
       <f:for each="{products}" as="product">
           <tr>
               <td align="top">{product.name}</td>
               <td align="top">
                   <f:format.crop maxCharacters="100">{product.description}</f:format.crop>
               </td>
               <td align="top">{product.quantity}</td>
           </tr>
       </f:for>
   </table>
   </html>

The inventory is rendered as a table.
The template gets access to the array of products which have been assigned to the view
(:php:`$this->view->assign('products', $products)`) with :html:`{products}`.
Tags starting with :html:`<f:` are Fluid ViewHelper tags.
The code inside the :html:`for` tag is repeated for each product in :html:`products`.
The ViewHelper :html:`f:crop` shortens the containing text to a maximum length of 100 characters.
Within the brackets, the products and their properties are accessed.
If there is a dot after the object name, the getters are automatically called.
So :html:`{product.description}` uses the getter method :php:`getDescription()` from the
domain model in file :file:`EXT:store_inventory/Classes/Domain/Model/Product.php`.

Just creating the template is not yet enough to get the list in the frontend.
A content element must be added, that is inserted on a page in the TYPO3 backend
to tell TYPO3 where exactly our product list must be rendered.
This element is a so-called "Frontend-Plugin".
