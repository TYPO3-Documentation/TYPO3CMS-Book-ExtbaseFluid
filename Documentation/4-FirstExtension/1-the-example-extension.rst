.. review information:
   - language: ok (corrected May/14 2019)

.. include:: /Includes.rst.txt

=====================
The example extension
=====================

The first extension will show an inventory list of products,
which is maintained in the backend *List* module.
Each product consists of a title,
a short description, and the number of pieces in stock.
The following steps are necessary for implementation:

#. Create directory tree and the minimal configuration files
#. Translate the problem domain to an abstract domain model
#. Configuration of the persistence layer


   * Define the database tables
   * Configure the display of the backend forms
   * Create the repository for the product object

#. Define the application flow inside the extension (create *controller* and *action* methods)
#. Implement design with HTML-templates
#. Configure the plugin for list display
#. Activate and test the extension
