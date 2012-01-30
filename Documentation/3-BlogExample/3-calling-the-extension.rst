Calling the extension
========================================

When a user opens the web page containing our blog in their browser,
this request (Request) will be forwarded to the remote TYPO3 Server. Then
TYPO3 starts the processing of this request straight away.

A request generally contains the identification number of the page
(the so called Page-ID or *PID*) that should be generated (e. g. ``id=99``). Using
this PID TYPO3 searches all relevant content elements on the specific page
and converts these to the outputted HTML code one after another. While
processing this page request TYPO3 comes by the content element for our
example extension, the so called *plugin*. This plugin should display a list
of all blogs. Each with the individual title, a short description and the
amount of all inclosed posts. In figure 3-4 you can see the output of the
plugin in the frontend. This output is embedded within the greater overview
of the page.

.. figure:: /Images/3-BlogExample/figure-3-4.png
	:align: center
Figure 3-4: Output of the plugin of our example extension

The process of eradication is first forwarded to the *dispatcher* of Extbase by TYPO3.
The dispatcher completes several preliminary tasks before it hands the further processing on
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
  new or changed object.
* It prepares the cache in which content is stored for faster reuse.
* It instantiates and configures the controller of our extension
  which controls the further processing within the extension.

When these preparations are full-filled by the Extbase dispatcher, we
are able to travel to the first stop of our destination: the controller. In
our example the further processing is assigned to the
:class:`BlogController`. A reference to the ``request`` and the
``response`` is handed over.

The class :class:`BlogController` can be found in the
file
:file:`EXT:blog_example/Classes/Controller/BlogController.php`.
The complete name of the controller is
:class:`Tx_BlogExample_Controller_BlogController`. At first
this might seem long-winded but the syntax follows a very strict convention
(please see box "Be careful, conventions!").

.. tip::

	Be careful, conventions!

	The name of a class is separated into individual parts, which
	themselves are divided by an underscore. All parts of a class name are
	spelled with capital camel case, where each initial letter is capitalized.
	This style for notation is commonly known as
	*UpperCamelCase* because each capital letter suggests
	the hump of a camel. For extensions the first part always is
	":class:`Tx`". The second part is the name of the extension
	- in the underlying case ":class:`BlogExample`". The last
	art is the name of the domain object. The center between those parts
	builds the path to the class file below the folder
	:file:`Classes`. In our case the file is stored directly
	within the folder :file:`Controller`. The name of the class
	file is taken from the last part of the class name appended with the
	suffix :file:`.php`.

