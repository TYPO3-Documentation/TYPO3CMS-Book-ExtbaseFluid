.. include:: /Includes.rst.txt

==============================
Using different output formats
==============================

The model view controller paradigm (MVC), as described in chapter 2,
has many decisive advantages: It separates the model from the user
interaction and allows different output formats for the same data. We
want to discuss them later.

Often different output formats are useful when generating content for
CSV files, RSS feeds, or print views. On the blog example, we will show
you how you can extend your Extension with a print view.

Let's assume you have programed an HTML view for a list of blog posts.
This view's Fluid template is
:file:`Resources/Private/Templates/Post/list.html`. Now you
want to add a print view, which is formatted differently. Create a new
template :file:`Resources/Private/Templates/Post/list.print`
and write the appropriate Fluid markup to generate the print view. You can
use the ``format`` attribute of the link Viewhelper to generate a
link to the print view:

``<f:link.action action="list" format="print">Print
View</f:link.action>``

The same ``list`` action is being called that was used for
the HTML view. However, Fluid doesn't choose the file
*list.html* but *list.print*, because
the ``format`` attribute of the ``link.action`` Viewhelper
changed the format to ``print``, our print view. You notice: The
format is being reflected in the file ending of the template.

.. tip::

   In the example above, we have given the print view the name
   ``print``. All format names are treated equally. There are no
   technical limitations for format names. Therefore you should choose a
   semantically meaningful name.


.. index:: Fluid; Output formats

Output other formats with Fluid
===============================

If you want to output JSON, RSS, or similar data with Fluid, you
have to write the appropriate TypoScript, which passes the page rendering
to Extbase and Fluid, respectively. Otherwise, TYPO3 will always generate
the ``<head>``- and
``<body>``-section.

You can use the following TypoScript::

   rss = PAGE
   rss {
      typeNum = 100
      10 =< tt_content.list.20.*[ExtensionKey]*_*[PluginName]*

      config {
         disableAllHeaderCode = 1
         additionalHeaders.10.header = Content-type:application/xml
         xhtml_cleaning = 0
         admPanel = 0
      }
   }

You still have to exchange *[ExtensionKey]* and *[PluginName]* with the Extension and Plugin name.
We recommend searching for the path of your Plugin in the
TypoScript Object Browser to avoid misspelling. Further on you have to
explicitly set :typoscript:`plugin.tx_*[ExtensionKey]*.persistence.storagePid`
to the number of the page containing the data to tell Extbase from which page
the data should be read.


.. index:: JsonView
.. _using-built-in-jsonview:

Using built in :php:`JsonView`
==============================

Extbase provides the :php:`\TYPO3\CMS\Extbase\Mvc\View\JsonView` as an
alternative to :php:`\TYPO3\CMS\Fluid\View\TemplateView` which is used by
default.

The intention is to provide the same public API, e.g., assign variables to the
view, but replace the rendering. The View itself needs further configuration
about how to convert assigned variables to JSON format.


.. _switching-php-class-of-view:

Switching php class of view
---------------------------

To use this view, these are multiple possible ways within the controller:

.. rst-class:: bignums

#. Replace default view by changing property :php:`$defaultViewObjectName`::

       protected $defaultViewObjectName = \TYPO3\CMS\Extbase\Mvc\View\JsonView::class;

#. Switch property values within an :php:`initialize*Action()` method::

      public function initializeSpecialAction()
      {
          $this->defaultViewObjectName = \TYPO3\CMS\Extbase\Mvc\View\JsonView::class;
      }


.. _configuring-jsonview:

Configuring :php:`JsonView`
---------------------------

Once the view is in use, it needs to be configured::

     $this->view->setConfiguration([
         'customVariable' => [
             '_only' => [
                 'key1',
                 'key3',
             ],
         ],
     ]);

     $this->view->setVariablesToRender(['customVariable']);

     $this->view->assignMultiple([
         'anotherVariable' => 'value',
         'customVariable' => [
             'key1' => 'value1',
             'key2' => 'value2',
             'key3' => [
                 'key3.1' => 'value3.1',
                 'key3.2' => 'value3.2',
             ],
         ],
     ]);

The above example will result in the following output:

.. code-block:: json

   {
       "key1": "value1",
       "key3": {
           "key3.1": "value3.1",
           "key3.2": "value3.2"
       }
   }

The following is happening during rendering:

.. rst-class:: bignums

#. Only allowed variables are rendered.
   In above example only `customVariable` is allowed due to
   :php:`setVariablesToRender(['customVariable'])` call.
   Therefore variable `anotherVariable` is ignored during rendering.

#. Only allowed properties of variables are rendered.
   In above example only `key1` and `key3` are allowed, due to :php:`setConfiguration()` call.
   Therefore `key2` is ignored.


.. _jsonview_recursive:

Recursive transformation of properties
--------------------------------------

.. versionadded:: 11.4
   Since TYPO3 11.4 recursive tranformations of properties are available in
   the build-in JsonView.

The Extbase :php:`JsonView` is able to resolve recursive properties of
objects, for example directories containing directories or comments
containing comments as replies.

Examples:

1. This is for 1:1 relations, where a comment has at most 1 comment.

   .. code-block:: php

      $configuration = [
          'comment' => [
              '_recursive' => ['comment']
           ]
      ];


2. This is for the more common 1:n relation in which you have lists of
   sub objects.

   .. code-block:: php

      $configuration = [
          'directories' => [
              '_descendAll' => [
                  '_recursive' => ['directories']
              ],
          ]
      ];

You can put all the other configuration like `_only` or `_exclude` at the same
level as `_recursive` and the view will apply this for all levels.

.. _further-examples:

Further examples
----------------

Example 1 for :php:`setConfiguration()` call::

   $this->view->setConfiguration([
      'variable1' => [
         '_only' => [
            'property1',
            'property2',
            // ...
         ],
      ],
      'variable2' => [
         '_exclude' => [
            'property3',
            'property4',
            //...
         ],
      ],
      'variable3' => [
         '_exclude' => ['secretTitle'],
         '_descend' => [
            'customer' => [
               '_only' => ['firstName', 'lastName'],
            ],
         ],
      ],
      'somearrayvalue' => [
         '_descendAll' => [
            '_only' => ['property1'],
         ],
      ],
   ]);

Of variable1, only property1 and property2 will be included.
Of variable2 all properties except property3 and property4
are used.
Of variable3, all properties except `secretTitle` are included.

If a property value is an array or object, it is not included
by default. If, however, such a property is listed in a "_descend"
section, the renderer will descend into this substructure and
include all its properties (of the next level).

Each property's configuration in "_descend" has the same syntax
as at the top level. Therefore - theoretically - infinitely nested
structures can be configured.

The ``_descendAll`` section can be used to include all array keys
for the output to export indexed arrays. The configuration inside a
``_descendAll`` will be applied to each array element.


Example 2 for :php:`setConfiguration()` call: exposing object identifier::

   $this->view->setConfiguration([
      'variableFoo' => [
         '_exclude' => ['secretTitle'],
         '_descend' => [
            'customer' => [    // consider 'customer' being a persisted entity
               '_only' => ['firstName'],
               '_exposeObjectIdentifier' => TRUE,
               '_exposedObjectIdentifierKey' => 'guid',
            ],
         ],
      ],
   ]);

Note for entity objects, you can expose the object's identifier
also, add an "_exposeObjectIdentifier" directive set to TRUE and
an additional property ``__identity`` will appear, keeping the persistence
identifier. Renaming that property name instead of '__identity' is also
possible with the directive ``_exposedObjectIdentifierKey``.
Example 2 above would output (summarized):
``{"customer":{"firstName":"John","guid":"892693e4-b570-46fe-af71-1ad32918fb64"}}``


Example 3 for :php:`setConfiguration()` call: exposing object's class name::

   $this->view->setConfiguration([
      'variableFoo' => [
         '_exclude' => ['secretTitle'],
         '_descend' => [
            'customer' => [    // consider 'customer' being an object
               '_only' => ['firstName'],
               '_exposeClassName' => TYPO3\CMS\Extbase\Mvc\View\JsonView::EXPOSE_CLASSNAME_FULLY_QUALIFIED,
            ],
         ],
      ],
   ]);

The ``_exposeClassName`` is similar to the `objectIdentifier` one, but the class name is added to the
JSON object output, for example (summarized):
``{"customer":{"firstName":"John","__class":"Acme\Foo\Domain\Model\Customer"}}``

The other option is ``EXPOSE_CLASSNAME_UNQUALIFIED`` which only will give the last part of the class
without the namespace, for example (summarized):
``{"customer":{"firstName":"John","__class":"Customer"}}``
This might be of interest to not provide information about the package or domain structure behind it.
