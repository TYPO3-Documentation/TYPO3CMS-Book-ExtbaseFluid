.. include:: /Includes.rst.txt

=================
Adding a template
=================

In Extbase frontend templates are stored in a subdirectory:
:file:`EXT:store_inventory/Resources/Private/Templates`
- if not configured otherwise.
The name of the subdirectory in the :file:`Templates/` folder is derived
from the corresponding controller name (without the `Controller` suffix).
The class name :php:`\MyVendor\StoreInventory\Controller\StoreInventoryController`
will result in the directory name :file:`StoreInventory/`.

In the directory :file:`StoreInventory/` we can now create the template file for our list view.
As the list action renders our list view, the template should be :file:`List.html`.
The action name, without the action suffix.

:file:`EXT:store_inventory/Resources/Private/Templates/StoreInventory/List.html` looks like this:

.. code-block:: html

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
We can access the array of products we assigned to the view
(:php:`$this->view->assign('products', $products)`) with :html:`{products}`.
Tags starting with :html:`<f:` are Fluid ViewHelper tags.
The code inside the :html:`for` tag is repeated for each product in :html:`products`.
The ViewHelper :html:`f:crop` shortens the containing text to at max 100 characters length.
Within the brackets, we can access the products and their properties.
If there is a dot after the object name, the getters are automatically called.
So :html:`{product.description}` uses the getter method :php:`getDescription()` from the
domain model in file :file:`EXT:store_inventory/Classes/Domain/Model/Product.php`.

Just creating the template is not yet enough to get the list in the frontend.
We need to add an element that can be inserted on a page in the TYPO3 backend
to tell TYPO3 where exactly we want to render our product list.
This element is a so-called "Frontend-Plugin".
