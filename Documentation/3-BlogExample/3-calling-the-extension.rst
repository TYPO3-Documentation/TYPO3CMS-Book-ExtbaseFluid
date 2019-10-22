Calling the extension
=====================

When a user opens the web page containing our blog in their browser,
this request (`Request`) will be forwarded to the remote TYPO3 Server. Then
TYPO3 starts the processing of this request straight away.

A request generally contains the identifier of the page
(the so called page slug) that should be generated (e. g. ``/blog``). Using
this page identifier, TYPO3 searches all relevant content elements on the
specific page and converts these to HTML code one after another. While
processing this page request, TYPO3 discovers the content element for our
example extension, the so called *plugin*. This plugin should display a list
of all blogs. Each with an individual title, a short description and the
amount of all enclosed posts. In figure 3-4 you can see the output of the
plugin in the frontend. This output is embedded within the greater overview
of the page.

.. figure:: /Images/3-BlogExample/figure-3-4.png
   :align: center

   Figure 3-4: Output of the plugin of our example extension

The process of eradication is first forwarded to the *dispatcher*
of Extbase by TYPO3.
Before the execution is handed to our own controller code, the 
dispatcher and the parent `ActionController` complete several 
preliminary tasks before they hand the further processing on 
to the according position within the code of our blog example:

* It interprets the incoming request and bundles all relevant
  information into a ``Request`` object.
* It prepares the ``Response`` object as a
  container for the result of the request.
* It loads the configuration of our extension from the different
  sources and makes it available.
* It determines whether or not the request was manipulated in an
  illegal manner and when this is the case deflects it (e.g. in of case
  maliciously added form input field).
* It sets up the persistence layer which performs the persisting of
  new or changed objects.
* It prepares the cache in which the content is stored for faster reuse.
* It instantiates and configures the controller of our extension
  which controls further processing within the extension.

When these preparations are fulfilled, we
are able to travel to the first stop of our destination: the controller. In
our example all further processing is assigned to the
:php:`BlogController`. A reference to the `request` and the
`response` is handed over.

The class :php:`BlogController` can be found in the
file
:file:`EXT:blog_example/Classes/Controller/BlogController.php`.
The complete name of the controller is
:php:`\MyVendor\BlogExample\Controller\BlogController`. At first
this might seem long-winded but the syntax follows a very strict convention.
