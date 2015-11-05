.. include:: ../Includes.txt

.. _adding-a-template:

Adding a template
=================

In Extbase frontend templates are created in a subdirectory of
:file:`EXT:inventory/Resources/Private/Templates` - if not configured otherwise.
The name of the subdirectory results in the last part of the controller
class name without the ``Controller`` suffix.
So the class name :class:`Tx_Inventory_Controller_InventoryController` results in the
directory name *inventory*.

Below the directory *Inventory* we create the file with the HTML template. The name
of the file results of the name of the action that is called with an added
suffix *.html*. So the filename in our case is *list.html*.

.. note::

    You have to be aware that the filename is *list.html* and not *listAction.html*.
    *list* is the name of the action. ``listAction()`` is the name of the corresponding
    method in the controller. Without additional configuration Extbase expects the suffix
    *.html*. It is also possible to use templates for other formats, such as JSON or XML.
    How these are called is described in chapter 8, section "Using different output formats".

The HTML template in the file
:file:`EXT:inventory/Resources/Private/Templates/Inventory/list.html` looks like the
following::

    <table border="1" cellspacing="1" cellpadding="5">
        <tr>
            <td>Productname</td>
            <td>Productdescription</td>
            <td>Quantity</td>
        </tr>
        <f:for each="{products}" as="product">
            <tr>
                <td align="top">{product.name}</td>
                <td align="top"><f:format.crop maxCharacters="100">{product.description}</f:format.crop></td>
                <td align="top">{product.quantity}</td>
            </tr>
        </f:for>
    </table>

The inventory is rendered as a table. We can access the
the array with the product objects that we assigned to the view in the
controller via ``$this->view->assign('products', $products)`` with ``{products}``.
Tags starting with ``<f:`` are Fluid tags. The code inside the ``for`` tag is repeated for
each product object in ``products``. The ``crop`` tag shortens the containing text to
the desired length.
A more detailed introduction about how to use Fluid tags can be found in chapter
8, *Styling the output with Fluid* and also in the reference in appendix c.

We still do not have a result in the frontend until we created a frontend
plugin.
