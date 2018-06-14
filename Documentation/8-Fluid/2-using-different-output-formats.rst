.. include:: ../Includes.txt

==============================
Using Different Output Formats
==============================

The Model-View-Controller-Paradigm (MVC), as described in chapter 2,
has many decisive advantages: It separates the model from the user
interaction and it allows different output formats for the same data. We
want to discuss the later.

Often different output formats are useful when generating content for
CSV files, RSS feeds or print views. On the example of the blog we will show
you, how you can extend your Extension with a print view.

Lets assume you have programed a HTML view for a list of blog posts.
The Fluid template of this view is
:file:`Resources/Private/Templates/Post/list.html`. Now you
want to add a print view, which is formatted differently. Create a new
template :file:`Resources/Private/Templates/Post/list.print`
and write the appropriate Fluid markup to generate the print view. You can
use the ``format`` attribute of the link ViewHelper to generate a
link to the print view:

``<f:link.action action="list" format="print">Print
View</f:link.action>``

The same ``list`` action is being called that was used for
the HTML view. However, Fluid doesn't choose the file
*list.html* but *list.print*, because
the ``format`` attribute of the ``link.action`` ViewHelper
changed the format to ``print``, our print view. You notice: The
format is being reflected in the file ending of the template.

.. tip::

	In the example above we have given the print view the name
	``print``. All format names are treated equally. There are no
	technical limitations for format names. Therefore you should choose a
	semantically, meaningful name.

Output other formats with Fluid
===============================

If you want to output JSON, RSS or similar data with Fluid, you
have to write the appropriate TypoScript which passes the page rendering
to Extbase and Fluid respectivly. Otherwise, TYPO3 will always generate
the ``<head>``- and
``<body>``-section.

You can use the following TypoScript::

	rss = PAGE
	rss {
		typeNum = 100
		10 =< tt_content.list.20.*[ExtensionKey]*_*[PluginName]*

		config {
		disableAllHeaderCode = 1
		additionalHeaders = Content-type:application/xml
		xhtml_cleaning = 0
		admPanel = 0
		}
	}

You still have to exchange *[ExtensionKey]* and *[PluginName]* with the name of the Extension and Plugin.
We recommend to search for the path of your Plugin in the
TypoScript Object Browser to avoid misspelling. Futher on you have to
implicitley set ``plugin.``*[ExtensionKey]*.``persistence.storagePid``
to the ID of the page containg the data, to tell Extbase from which page
the data should be read.
