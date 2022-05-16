.. include:: /Includes.rst.txt

.. _developing-a-custom-viewhelper:

Developing a custom ViewHelper
==============================

Developing a custom ViewHelper is often necessary in extension development.
This chapter will demonstrate how to write a custom ViewHelper for the blog
example extension.

The official documentation of Fluid for writing custom ViewHelpers can be found
within Fluid documentation at
https://github.com/TYPO3/Fluid/blob/master/doc/FLUID_CREATING_VIEWHELPERS.md.

.. _the-gravatar-viewhelper:
.. _the-example-viewhelper:

The Example ViewHelper
----------------------

"Avatar" images are pictures or icons that for example are dedicated to the author
of an article in blogs or on forums. The photos of blog authors and forum
moderators are mostly stored on the appropriate server. With users that only
want to ask a question or to comment a blog post, this is not the case. To allow
them to supply their article with an icon, a service called *gravatar.com* is
available. This online service makes sure that an email address is assigned to a
certain avatar picture.

A web application that wants to check if an avatar picture exists for a given
email address has to send a checksum (with the hash function :php:`md5()`) of the
email address to the service and receives the picture for display.

This section explains how to write a ViewHelper that uses an email address as
parameter and shows the picture from gravatar.com if it exists.

The custom ViewHelper is not part of the default distribution, therefore an own
namespace import is necessary to use this ViewHelper. In the following example
the namespace :php:`\MyVendor\BlogExample\ViewHelpers` is imported with the
prefix `blog`. Now, all tags starting with `blog:` are interpreted as
ViewHelper from within this namespace::

   {namespace blog=MyVendor\BlogExample\ViewHelpers}

For further information about namespace import, see :ref:`importing-namespaces`.

The ViewHelper should be given the name "gravatar" and only take an email
address as parameter. The ViewHelper is called in the template as follows:

.. code-block:: html

   <blog:gravatar emailAddress="username@example.org" />

See :ref:`global-namespace-import` for information how to import
namespaces globally.

.. _now-implementing:

The implementation
------------------

Every ViewHelper is a PHP class. For the Gravatar ViewHelper the name of the
class is :php:`\MyVendor\BlogExample\ViewHelpers\GravatarViewHelper`.

Following the naming conventions for Extbase extensions the ViewHelper skeleton
is created in the PHP file :file:`EXT:blog_example/Classes/ViewHelpers/GravatarViewHelper.php`::

   <?php
   namespace MyVendor\BlogExample\ViewHelpers;

   use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
   use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

   class GravatarViewHelper extends AbstractViewHelper
   {
      public static function renderStatic(
          array $arguments,
          \Closure $renderChildrenClosure,
          RenderingContextInterface $renderingContext
      ) {
          // Implementation ...
      }
   }

Every Viewhelper must inherit from the class
:php:`\TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper`.

A ViewHelper can also inherit from subclasses of :php:`AbstractViewHelper`, e.g.
from :php:`\TYPO3Fluid\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper`.
Several subclasses are offering additional functionality. The
:php:`TagBasedViewHelper` will be explained :ref:`later on in this chapter
<creating-xml-tags-using-tagbasedviewhelper>` in detail.

In addition every ViewHelper needs a method :php:`renderStatic()`, which is called
once the ViewHelper will be displayed in the template. The return value of the
method is copied directly into the complete output. If the above example is
extended like the following::

   <?php
   namespace MyVendor\BlogExample\ViewHelpers;

   use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
   use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;
   use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

   class GravatarViewHelper extends AbstractViewHelper
   {
      use CompileWithRenderStatic;

      public static function renderStatic(
          array $arguments,
          \Closure $renderChildrenClosure,
          RenderingContextInterface $renderingContext
      ) {
          return 'World';
      }
   }

And called like this in the template:

.. code-block:: html

   {namespace blog=MyVendor\BlogExample\ViewHelpers}

   Hello <blog:gravatar />

The displayed result will be `Hello World`.

.. _register-arguments-of-viewhelpers:

Register arguments of ViewHelpers
---------------------------------

The :php:`Gravatar` ViewHelper must hand over the email address on which identifies
the Gravatar.
This is the last remaining piece before the implementation can be completed.

All arguments of a ViewHelper must be registered. Every ViewHelper has to
declare explicitly which parameters are accepted. The registration happens
inside :php:`initializeArguments()`::

   public function initializeArguments()
   {
       $this->registerArgument('emailAddress', 'string', 'The email address to resolve the gravatar for', true);
   }

While this works for most use cases, there are some when arguments with a given
prefix should be allowed, e.g. `data-` arguments. Therefore it's possible to
handle additional arguments. For further information see
:ref:`handle-additional-arguments`.

This way the ViewHelper receives the argument `emailAddress` of type `string`.
The type is given by the second argument of the :php:`registerTagAttribute()`.
The arguments are registered via :php:`$this->registerArgument($name, $type,
$description, $required, $defaultValue)`. These arguments can be accessed
through the array :php:`$arguments`, which is passed into the method.

.. tip::

   Sometimes arguments can take various types. In this case the type `mixed`
   should be used.

Finally the output of the :html:`img` tag needs to be implemented::

   <?php
   namespace MyVendor\BlogExample\ViewHelpers;

   use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
   use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;
   use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

   class GravatarViewHelper extends AbstractViewHelper
   {
      use CompileWithRenderStatic;

      public function initializeArguments()
      {
          $this->registerArgument('emailAddress', 'string', 'The email address to resolve the gravatar for', true);
      }

      public static function renderStatic(
          array $arguments,
          \Closure $renderChildrenClosure,
          RenderingContextInterface $renderingContext
      ) {
         return '<img src="http://www.gravatar.com/avatar/' .
            md5($arguments['emailAddress']) .
            '" />';
      }
   }

.. _escaping-of-output:

Escaping of Output
------------------

The above implementation still does not provide the expected result. The output
for the following usage:

.. code-block:: html

   <blog:gravatar emailAddress="username@example.org" />

Does not result in:

.. code-block:: html

   <img src="http://www.gravatar.com/avatar/5f0efb20de5ecfedbe0bf5e7c12353fe" />

Instead the result is:

.. code-block:: html

   &lt;img src=&quot;http://www.gravatar.com/avatar/5f0efb20de5ecfedbe0bf5e7c12353fe&quot; /&gt;

By default all output is escaped by :php:`htmlspecialchars` to prevent cross site scripting.

To allow unescaped HTML output, escaping has to be explicitly disabled. This is done
by setting the class property :php:`$escapeOutput` to `false`::

   protected $escapeOutput = false;

To make the above implementation work, the property is set to false. The output
is no longer escaped and the :html:`<img>`-Tag is now rendered as expected.

If escaping of children is disabled, no nodes that are passed with inline
syntax or values used as tag content will be escaped. Note that
:php:`$escapeOutput` takes priority: if it is disabled, escaping of child nodes
is also disabled unless explicitly enabled.

.. code-block:: php

   protected $escapeChildren = false;

Passing in children is explained in :ref:`prepare-viewhelper-for-inline-syntax`.

.. _creating-xml-tags-using-tagbasedviewhelper:
.. _creating-html-tags-using-tagbasedviewhelper:

Creating HTML/XML tags using TagBasedViewHelper
-----------------------------------------------

For ViewHelpers which create HTML/XML tags, Fluid provides an enhanced base
class: :php:`\TYPO3Fluid\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper`.  This
base class provides an instance of
:php:`\TYPO3Fluid\Fluid\Core\ViewHelper\TagBuilder` that can be used to create
HTML-tags. It takes care of the syntactically correct creation and for example
escapes single and double quotes in attribute values.

.. attention::

   Correctly escaping the attributes is mandatory as it affects security and
   prevents cross site scripting attacks.

The :php:`GravatarViewHelper` will now make use of the
:php:`TagBasedViewHelper`. Because the Gravatar ViewHelper creates an
:html:`img` tag the use of the
:php:`\TYPO3Fluid\Fluid\Core\ViewHelper\TagBuilder` is advised::

   <?php
   namespace MyVendor\BlogExample\ViewHelpers;

   use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper;

   class GravatarViewHelper extends AbstractTagBasedViewHelper
   {
       protected $tagName = 'img';

       public function initializeArguments()
       {
           parent::initializeArguments();
           $this->registerUniversalTagAttributes();
           $this->registerTagAttribute('alt', 'string', 'Alternative Text for the image');
           $this->registerArgument('emailAddress', 'string', 'The email address to resolve the gravatar for', true);
       }

       public function render()
       {
           $this->tag->addAttribute(
               'src',
               'http://www.gravatar.com/avatar/' . md5($this->arguments['emailAddress'])
           );
           return $this->tag->render();
       }
   }

What is different in this code?

First of all, the ViewHelper does not inherit directly from
:php:`AbstractViewHelper` but from :php:`TagBasedViewHelper`, which provides
and initializes the tag builder. Beyond that there is a class property
:php:`$tagName` which stores the name of the tag to be created. Furthermore the
tag builder is available at :php:`$this->tag`. It offers the method
:php:`addAttribute()` to add new tag attributes. In our example the attribute
`src` is added to the tag, with the value assigned one line above it. Finally,
the GravatarViewHelper creates an img tag builder, which has a method named
:php:`render()`. After configuring the tag builder instance, the rendered tag
markup is returned.

.. note::

   As :php:`$this->tag` is an instance variable, :php:`render()` is used to
   generate the output. :php:`renderStatic()` would have no access. For further
   information take a look at :ref:`the-different-render-methods`.

Notice that the attribute :php:`$escapeOutput` is no longer necessary.

Furthermore the :php:`TagBasedViewHelper` offers assistance for ViewHelper
arguments that should recur directly and unchanged as tag attributes. These
should be output directly must be registered in :php:`initializeArguments()`
with the method :php:`$this->registerTagAttribute($name, $type, $description, $required = false)`.
If support for the :html:`<img>` attribute :html:`alt`
should be provided in the ViewHelper, this can be done by initializing this in
:php:`initializeArguments()` in the following way::

   public function initializeArguments()
   {
       $this->registerTagAttribute('alt', 'string', 'Alternative Text for the image');
   }

For registering the universal attributes id, class, dir, style, lang, title,
accesskey and tabindex there is a helper method
:php:`registerUniversalTagAttributes()` available.

If support for universal attributes should be provided and in addition to the
`alt` attribute in the Gravatar ViewHelper the following
:php:`initializeArguments()` method will be necessary::

   public function initializeArguments()
   {
       parent::initializeArguments();
       $this->registerUniversalTagAttributes();
       $this->registerTagAttribute('alt', 'string', 'Alternative Text for the image');
   }

.. _insert-optional-arguments:

Insert optional arguments
-------------------------

An optional size for the image can be provided to the Gravatar ViewHelper. This
size parameter will be used to determine the height and width in pixels of the
image and can range from 1 to 512. When no size is given, an image of 80px is
generated.

The :php:`render()` method can be improved like this::

   public function initializeArguments()
   {
       $this->registerArgument('emailAddress', 'string', 'The email address to resolve the gravatar for', true);
       $this->registerArgument('size', 'integer', 'The size of the gravatar, ranging from 1 to 512', false, 80);
   }

   public function render()
   {
       $this->tag->addAttribute(
          'src',
          'http://www.gravatar.com/avatar/' .
              md5($this->arguments['emailAddress']) .
              '?s=' . urlencode($this->arguments['size'])
       );
       return $this->tag->render();
   }

With this setting of a default value and setting the fourth argument to `false`,
the `size` attribute becomes optional.

.. _prepare-viewhelper-for-inline-syntax:

Prepare ViewHelper for inline syntax
------------------------------------

So far the Gravatar ViewHelper has focused on the tag structure of the
ViewHelper. The call to render the ViewHelper was written with tag syntax which
seemed obvious because it itself returns a tag:

.. code-block:: html

   <blog:gravatar emailAddress="{post.author.emailAddress}" />

Alternatively this expression can be written using inline notation:

.. code-block:: html

   {blog:gravatar(emailAddress: post.author.emailAddress)}

One should see the Gravatar ViewHelper as a kind of post processor for an email
address and would allow the following syntax:

.. code-block:: html

   {post.author.emailAddress -> blog:gravatar()}

This syntax places focus on the variable that is passed to the ViewHelper as it
comes first.

The syntax `{post.author.emailAddress -> blog:gravatar()}` is an alternative
syntax for `<blog:gravatar>{post.author.emailAddress}</blog:gravatar>`. To
support this the email address comes either from the argument `emailAddress`
or, if it is empty, the content of the tag should be interpreted as email
address.

This was in particular used with formatting ViewHelpers. These ViewHelpers all
support both tag mode and inline syntax.

Depending on the implemented method for rendering, the implementation is
different:

.. _with-renderstatic:

With :php:`renderStatic()`
^^^^^^^^^^^^^^^^^^^^^^^^^^

To fetch the content of the ViewHelper the argument
:php:`$renderChildrenClosure` is available.  This returns the evaluated object
between the opening and closing tag.

Lets have a look at the new code of the :php:`renderStatic()` method::

   <?php
   namespace MyVendor\BlogExample\ViewHelpers;

   use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
   use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;
   use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

   class GravatarViewHelper extends AbstractViewHelper
   {
       use CompileWithContentArgumentAndRenderStatic;

       protected $escapeOutput = false;

       public function initializeArguments()
       {
           $this->registerArgument('emailAddress', 'string', 'The email address to resolve the gravatar for');
       }

       public static function renderStatic(
           array $arguments,
           \Closure $renderChildrenClosure,
           RenderingContextInterface $renderingContext
       ) {
           $emailAddress = $renderChildrenClosure();

           return '<img src="http://www.gravatar.com/avatar/' .
               md5($emailAddress) .
               '" />';
       }
   }

.. _with-render:

With :php:`render()`
^^^^^^^^^^^^^^^^^^^^

To fetch the content of the ViewHelper the method :php:`renderChildren()` is
available in the :php:`AbstractViewHelper`. This returns the evaluated object
between the opening and closing tag.

Lets have a look at the new code of the :php:`render()` method::

    <?php
    namespace MyVendor\BlogExample\ViewHelpers;

    use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper;

    class GravatarViewHelper extends AbstractTagBasedViewHelper
    {
        protected $tagName = 'img';

        public function initializeArguments()
        {
            $this->registerArgument('emailAddress', 'string', 'The email address to resolve the gravatar for', false, null);
        }

        public function render()
        {
            $emailAddress = $this->arguments['emailAddress'] ?? $this->renderChildren();

            $this->tag->addAttribute(
                'src',
                'http://www.gravatar.com/avatar/' . md5($emailAddress)
            );

            return $this->tag->render();
        }
    }

.. _importing-namespaces:

Importing namespaces
--------------------

Three different ways exist to import a ViewHelper namespace into Fluid. These
three ways are explained in the following section.

.. _local-namespace-import-via-<>-syntax:

Local namespace import via <>-Syntax
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To import a ViewHelper namespace into Fluid, the following Syntax can be used:

.. code-block:: html

   <html xmlns:f="http://typo3.org/ns/TYPO3/CMS/Fluid/ViewHelpers"
         xmlns:blog="http://typo3.org/ns/MyVendor/BlogExample/ViewHelpers"
         data-namespace-typo3-fluid="true"
   >
       <!-- Content of Fluid Template -->
   </html>

In above example `blog` is the namespace available within the Fluid template and
`MyVendor\BlogExample\ViewHelpers` is the PHP namespace to import into Fluid.

All ViewHelper which start with `blog:` will be looked up within the PHP
namespace.

The :html:`<html>`-Tags will not be part of the output, due to
:html:`data-namespace-typo3-fluid="true"` attribute.

One benefit of this approach is auto completion within modern IDEs and the
possibility to lint the Fluid files.

.. _local-namespace-import-via-{}-syntax:

Local namespace import via {}-Syntax
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

To import a ViewHelper namespace into Fluid, the following Syntax can be used:

.. code-block:: html

   {namespace blog=MyVendor\BlogExample\ViewHelpers}

In above example `blog` is the namespace available within the Fluid template and
`MyVendor\BlogExample\ViewHelpers` is the PHP namespace to import into Fluid.

All ViewHelper which start with `blog:` will be looked up within the PHP
namespace.

Each of the rows will result in an blank line. Multiple import statements can go
into a single, or multiple lines.

.. _global-namespace-import:

Global namespace import
^^^^^^^^^^^^^^^^^^^^^^^

Fluid allows for registering namespaces. This is already done for
`typo3/cms-fluid` and `typo3fluid/fluid` ViewHelpers. Therefore they are always
available via the `f` namespace.

Custom ViewHelpers, e.g. for a site package, can be registered the same way.
Namespaces are registered within
:php:`$GLOBALS['TYPO3_CONF_VARS']['SYS']['fluid']['namespaces']` in the form
of::

    $GLOBALS['TYPO3_CONF_VARS']['SYS']['fluid']['namespaces']['blog'] = [
        'MyVendor\BlogExample\ViewHelpers',
    ];

In above example `blog` is the namespace within Fluid templates, which is
resolved to the PHP namespace :php:`\MyVendor\BlogExample\ViewHelpers`.

.. _handle-additional-arguments:

Handle additional arguments
---------------------------

If a ViewHelper allows further arguments then the configured one, see
:ref:`register-arguments-of-viewhelpers`, the :php:`handleAdditionalArguments()`
method can be implemented.

The :php:`\TYPO3Fluid\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper` makes use
of this, to allow setting any `data-` argument for tag based ViewHelpers.

The method will receive an array of all arguments, which are passed in addition
to the registered arguments. The array uses the argument name as key and the
argument value as the value. Within the method these arguments can be handled.

E.g. the :php:`AbstractTagBasedViewHelper` implements the following behaviour::

    public function handleAdditionalArguments(array $arguments)
    {
        $unassigned = [];
        foreach ($arguments as $argumentName => $argumentValue) {
            if (strpos($argumentName, 'data-') === 0) {
                $this->tag->addAttribute($argumentName, $argumentValue);
            } else {
                $unassigned[$argumentName] = $argumentValue;
            }
        }
        parent::handleAdditionalArguments($unassigned);
    }

To keep the default behaviour, all unwanted arguments should be passed to the
parent method call :php:`parent::handleAdditionalArguments($unassigned);`, to
throw accordingly exceptions.

.. _the-different-render-methods:

The different render methods
----------------------------

ViewHelper can have one or multiple of the following three methods for
implementing the rendering. The following section will describe the differences
between all three implementations.

.. _compile-method:

:php:`compile()`-Method
^^^^^^^^^^^^^^^^^^^^^^^

This method can be overwritten to define how the ViewHelper should be compiled.
That can make sense if the ViewHelper itself is a wrapper for another native PHP
function or TYPO3 function. In that case the method can return the call to this
function and remove the need to call the ViewHelper as a wrapper at all.

The :php:`compile()` has to return the compiled PHP code for the ViewHelper.
Also the argument :php:`$initializationPhpCode` can be used to add further PHP
code before the execution.

.. note::

   The :php:`renderStatic()` method has still to be implemented for the non
   compiled version of the ViewHelper. In the future, this should no longer be
   necessary.

Example implementation::

   <?php
   namespace MyVendor\BlogExample\ViewHelpers;

   use TYPO3Fluid\Fluid\Core\Compiler\TemplateCompiler;
   use TYPO3Fluid\Fluid\Core\Parser\SyntaxTree\ViewHelperNode;
   use TYPO3Fluid\Fluid\Core\Rendering\RenderingContextInterface;
   use TYPO3Fluid\Fluid\Core\ViewHelper\Traits\CompileWithRenderStatic;
   use TYPO3Fluid\Fluid\Core\ViewHelper\AbstractViewHelper;

   class StrtolowerViewHelper extends AbstractViewHelper
   {
       use CompileWithRenderStatic;

       public function initializeArguments()
       {
           $this->registerArgument('string', 'string', 'The string to lowercase.', true);
       }

       public static function renderStatic(
           array $arguments,
           \Closure $renderChildrenClosure,
           RenderingContextInterface $renderingContext
       ) {
           return strtolower($arguments['string']);
       }

       public function compile(
           $argumentsName,
           $closureName,
           &$initializationPhpCode,
           ViewHelperNode $node,
           TemplateCompiler $compiler
       ) {
           return 'strtolower(' . $argumentsName. '[\'string\'])';
       }
   }

.. _renderstatic-method:

:php:`renderStatic()`-Method
^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Most of the time this method is implemented. It's the one that is called by
default from within the compiled Fluid.

It is however not called on AbstractTagBasedViewHelper implementations - on such classes
you still need to use the render() method since that is the only way you can access $this->tag
which contains the tag builder that generates the actual XML tag.

As this method has to be static, there is no access to instance attributes, e.g.
:php:`$this->tag` within a subclass of :php:`AbstractTagBasedViewHelper`.

.. note::

   This method can not be used when access to child nodes is necessary. This is
   the case for ViewHelpers like `if` or `switch` which need to access their
   children like `then` or `else`. In that case, :php:`render()` has to be used.

.. _render-method:

:php:`render()`-Method
^^^^^^^^^^^^^^^^^^^^^^

This method is the slowest one. As the compiled version always calls
the :php:`renderStatic()` method, this will call further PHP code which, in the
end, will call the original :php:`render()` method.

By using this method, the surrounding logic does not get compiled.

.. note::

   This way is planned to be removed in the future.
