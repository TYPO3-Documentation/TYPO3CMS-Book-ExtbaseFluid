.. include:: /Includes.rst.txt

The Example Extension
=====================

Our first Extension will show an inventory list of products, which we
created before in a backend list-module. Each product is marked by a title,
a short description and a quantity as the number of pieces in stock. The
following steps are necessary for implementation:

#. Create directory tree and the minimal configuration files
#. Translate the problem domain in an abstract domain model
#. Configuration of persistence layer

   * Definition of database tables
   * Configure the display of backend forms
   * Create repositories for product objects

#. Define the application flow inside the extension (create *controller* and *action* methods)
#. Realize design with HTML-templates
#. Configure the plugin for list display
#. Install and test the extension

.. tip::

   We choose the step order inside the example extension, so the
   connection will stay visible and a »natural« growth of extension and
   knowledge is given. After gathering the first experience in programming
   with Extbase, you probably will work in another and quicker order.
   Furthermore, in the future you will have the Extension Builder, a convenient
   tool to create the base of an extension which is outlined in chapter
   10.

