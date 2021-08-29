.. include:: /Includes.rst.txt

=====================
Calling the extension
=====================

When a user opens the web page containing our blog in their browser,
this request (`Request`) will be forwarded to the remote TYPO3 server. Then
TYPO3 starts the processing of this request straight away.

A request generally contains the page's identifier
(the so-called page slug) that should be generated (e. g. ``/blog``). Using
this page identifier, TYPO3 searches all relevant content elements on the
specific page and collects their generated HTML code one after another. While
processing this page request, TYPO3 discovers the content element for this
example extension, the so-called *plugin*. This plugin should display a list
of all blogs. Each with an individual title, a short description, and the
amount of all enclosed posts. In figure 3-4, you can see the output of the
plugin in the frontend. This output is embedded within the greater overview
of the page.

.. figure::  /Images/ManualScreenshots/Frontend/3-BlogExample/figure-3-4.png
   :align: center

   Figure 3-4: Output of the plugin of the example extension

.. index:: Extbase; Dispatcher

The process of eradication is first forwarded to the *dispatcher*
of Extbase by TYPO3.
The dispatcher and the parent `Boostrap` complete several
preliminary tasks before they hand the further processing on
to the according position within the code of the blog example,
which is part of the `ActionController`:

* The `RequestBuilder` interprets the incoming request and bundles all relevant
  information into a ``Request`` object.

* The Extbase `Bootstrap` loads the configuration of the extension from the different
  sources and makes it available.

* The `ActionController` determines whether or not the request was manipulated in an
  illegal manner and when this is the case, it deflects it (e.g. in case of
  a maliciously added form input field).

* The extension contains a set up of the persistence layer, which performs the persisting of
  new or changed objects. This is done in a mechanism of the `Bootstrap`,
  that automatically saves pending domain objects.

* The extension contains definitions for the TYPO3 cache, by which the content is stored for faster reuse.
  TYPO3 will take care of this.

* The dispatcher instantiates the controller of the extension depending on its configuration.
  The `ActionController` controls the further processing within the extension.


.. index::
   Extbase; Controller
   Blog Example; BlogController
   Files; EXT:blog_example/Classes/Controller/BlogController.php

When these preparations are fulfilled, you
can travel to the destination's first stop: the `ActionController` which will be present under different names.
In this example, all further processing is assigned to the
:php:`BlogController`. A reference to the `request` is handed over.

The class :php:`BlogController` can be found in the file
:file:`EXT:blog_example/Classes/Controller/BlogController.php`.
The complete name of the controller namespace class is
:php:`\MyVendor\BlogExample\Controller\BlogController`. At first
this might seem long-winded, but the syntax follows a very strict convention.
