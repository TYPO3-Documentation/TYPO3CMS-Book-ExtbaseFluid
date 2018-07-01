.. include:: ../Includes.txt

.. _developing-a-custom-viewhelper:

Developing a custom ViewHelper
==============================

Developing a custom ViewHelper is often necessary in extension development.
This chapter will demonstrate how to write a custom ViewHelper for the blog
example extension.

.. _the-gravatar-viewhelper:

The Gravatar ViewHelper
-----------------------

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

.. _preliminary-considerations:

Preliminary considerations
--------------------------

The first step should be thinking about how to use the ViewHelper later on in
the template, in order to get a clear vision about the arguments of the
ViewHelper.

The ViewHelper is not part of the default distribution, therefore an own
namespace import is necessary to use the ViewHelper. In the following example
the namespace :php:`MyVendor\BlogExample\ViewHelpers` is imported with the
prefix `blog`. Now, all tags starting with `blog:` are interpreted as
ViewHelper from within the namespace::

   {namespace blog=MyVendor\BlogExample\ViewHelpers}

The ViewHelper should be given the name "gravatar" and only take an email
address as parameter. The ViewHelper is called in the template as follows:

.. code-block:: html

   <blog:gravatar emailAddress="username@example.com" />

.. _now-implementing:

Now implementing!
-----------------

Every ViewHelper is a PHP class. For the Gravatar ViewHelper the name of the
class is :php:`MyVendor\BlogExample\ViewHelpers\GravatarViewHelper`.

Following the naming conventions for Extbase extensions the ViewHelper skeleton
is created in the PHP file :file:`EXT:blog_example/Classes/ViewHelpers/GravatarViewHelper.php`::

   <?php
   namespace MyVendor\BlogExample\ViewHelpers;

   use TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper;

   class GravatarViewHelper extends AbstractViewHelper
   {
      public function render()
      {
         // Implementation ...
      }
   }

Every ViewHelper must inherit from the class
:php:`TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper`.

A ViewHelper can also inherit from subclasses of :php:`AbstractViewHelper`, e.g.
from :php:`\TYPO3Fluid\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper`.
Several subclasses are offering additional functionality. The
:php:`TagBasedViewHelper` will be explained :ref:`later on in this chapter
<creating-xml-tags-using-tagbasedviewhelper>` in detail.

In addition every ViewHelper needs a method :php:`render()`, which is called
once the ViewHelper is to be displayed in the template. The return value of the
method is copied directly into the complete output. If the above example is
extended like the following::

   <?php
   namespace MyVendor\BlogExample\ViewHelpers;

   use TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper;

   class GravatarViewHelper extends AbstractViewHelper
   {
      public function render()
      {
         return 'World';
      }
   }

This is how the ViewHelper is called used in the template:

.. code-block:: html

   {namespace blog=MyVendor\BlogExample\ViewHelpers}

   Hello <blog:gravatar />

As result `Hello World` is displayed.

.. _register-arguments-of-viewhelpers:

Register arguments of ViewHelpers
---------------------------------

The `Gravatar` ViewHelper must hand over the email address on which identifies
the Gravatar.
This is the last remaining piece before the implementation can be completed.

All arguments of a ViewHelper must be registered. Every ViewHelper has to
declare explicitly which parameters are accepted. The registration happens
inside `initializeArguments()`::

   public function initializeArguments()
   {
      $this->registerArgument(
         'emailAddress',
         'string',
         'The e-mail address the gravatar is generated for.',
         true
      );
   }

This way the ViewHelper receives the argument `emailAddress` of type `string`.
The type is given by the second argument of the `registerTagAttribute()`.  The
arguments are registered via :php:`$this->registerArgument($name, $type,
$description, $required, $defaultValue)`. These arguments can be accessed
through the array :php:`$this->arguments`.

.. tip::

   Sometimes arguments can take various types. In this case the type `mixed`
   should be used.

Finally the output of the :html:`img` tag needs to be implemented::

   <?php
   namespace MyVendor\BlogExample\ViewHelpers;

   use TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper;

   class GravatarViewHelper extends AbstractViewHelper
   {
      public function initializeArguments()
      {
         $this->registerArgument(
            'emailAddress',
            'string',
            'The email address to resolve the gravatar for',
            true
         );
      }

      /**
       * @return string the HTML <img> tag of the gravatar
       */
      public function render()
      {
         return '<img src="http://www.gravatar.com/avatar/' .
            md5($this->arguments['emailAddress']) .
            '" />';
      }
   }

In the following sections some enhancements and tricks for implementing
ViewHelpers are shown.

.. _creating-xml-tags-using-tagbasedviewhelper:
.. _creating-html-tags-using-tagbasedviewhelper:

Creating HTML/XML tags using TagBasedViewHelper
-----------------------------------------------

For ViewHelpers which create HTML/XML tags, Fluid provides an enhanced base
class: the :php:`TYPO3Fluid\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper`.
This ViewHelper provides :php:`TYPO3Fluid\Fluid\Core\ViewHelper\TagBuilder` that
can be used to create tags. It takes care of the syntactically correct creation
of tags and for example escapes single and double quotes in attribute values.

.. attention::

   Correctly escaping the attributes is mandatory as it affects security and
   prevents cross site scripting attacks.

In the next step the example :php:`GravatarViewHelper` is modified a bit to use
the :php:`TagBasedViewHelper`. Because the Gravatar ViewHelper creates an
:html:`img` tag the use of the
:php:`TYPO3Fluid\Fluid\Core\ViewHelper\TagBuilder` is advised.

.. code-block:: php

   namespace MyVendor\BlogExample\ViewHelpers;

   use TYPO3Fluid\Fluid\Core\ViewHelper\TagBasedViewHelper;

   class GravatarViewHelper extends TagBasedViewHelper
   {
     protected $tagName = 'img';

     /**
      * @param string $emailAddress The email address to resolve the gravatar for
      * @return string the HTML <img>-Tag of the gravatar
      */
     public function render($emailAddress)
     {
       $gravatarUri = 'http://www.gravatar.com/avatar/' . md5($emailAddress);
       $this->tag->addAttribute('src', $gravatarUri);
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

.. tip::

   Why is this code better even though it is much longer? It communicates the
   meaning in a much better way, therefore it is preferable to the first
   example, where the gravatar URL and the creation of the :html:`img` tag
   were mixed together.

The base class :php:`TagBasedViewHelper` allows implementing ViewHelpers which
make creating HTML/XML tags easier.

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
      $this->registerArgument(
         'emailAddress',
         'string',
         'The email address to resolve the gravatar for',
         true
      );
      $this->registerArgument(
         'size',
         'integer',
         'The size of the gravatar, ranging from 1 to 512',
         false,
         80
      );
   }

   /**
    * @return string the HTML <img> tag of the gravatar
    */
   public function render()
   {
      $address = $this->arguments['emailAddress'];
      $size = $this->arguments['size'];

      $gravatarUri = 'http://www.gravatar.com/avatar/' .
         md5($address) .
         '?s=' . urlencode($size);
      $this->tag->addAttribute('src', $gravatarUri);

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

To fetch the content of the ViewHelper the method :php:`renderChildren()` is
available in the :php:`AbstractViewHelper`. This returns the evaluated object
between the opening and closing tag.

Lets have a look at the new code of the :php:`render()` method::

   /**
    * @return string the HTML <img> tag of the gravatar
    */
   public function render()
   {
      if ($this->arguments['emailAddress'] === null) {
         $this->arguments['emailAddress'] = $this->renderChildren();
      }

      $gravatarUri = 'http://www.gravatar.com/avatar/' .
         md5($this->arguments['emailAddress']) .
         '?s=' . urlencode($this->arguments['size']);
      $this->tag->addAttribute('src', $gravatarUri);
      return $this->tag->render();
   }

If no email address argument is provided, Fluid tries to read the value from tag
contents or inline passing of child node value. The rest of the code is
unchanged.

.. tip::

   This trick was in particular used with formatting ViewHelpers. These
   ViewHelpers all support both tag mode and inline syntax.

.. _escaping-of-output:

Escaping of Output
------------------

By default all output is escaped to prevent cross site scripting. In the example
above no :html:`<img>` tag will be displayed, instead escaped HTML will be
displayed.

To allow unescaped output, escaping has to be explicitly disabled. This is done
by setting the class property :php:`$escapeOutput` to `false`::

   protected $escapeOutput = false;

If escaping of children is disabled, no nodes that are passed with inline
syntax or values used as tag content will be escaped. Note that
:php:`$escapeOutput` takes priority: if it is disabled, escaping of child nodes
is also disabled unless explicitly enabled.

.. code-block:: php

   protected $escapeChildren = false;
