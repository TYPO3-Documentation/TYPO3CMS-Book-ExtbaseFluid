.. include:: ../Includes.txt

.. _developing-a-custom-viewhelper:

Developing a custom ViewHelper
==============================

The development of an own ViewHelper is much asked for in practice and is part
of the base repertoire of the extension development. This chapter will provide
step by step guidance for a small example from the blog example and describe
enhanced techniques afterwards.

.. _the-gravatar-viewhelper:

The Gravatar-ViewHelper
-----------------------

Avatar-Images are pictures or icons that for example are dedicated to the author
of an article in blogs or on forums. The photos of blog authors and forum
moderators are mostly stored on the appropriate server. With users that only
want to ask a question or to comment a blog post, this is not the case. To allow
them to supply their article with an icon, a service called *gravatar.com* is
available. This online service makes sure that an email address is assigned to a
certain avatar picture.

A web application that wants to check if an avatar picture exists for a given
email address has to send a checksum (with the hash function :php:`md5`) of the
email address to the service and receives the picture to display.

This section explains how to write a ViewHelper that uses an email address as
parameter and shows the picture from gravatar.com if it exists.

.. _preliminary-considerations:

Preliminary considerations
--------------------------

The first step should be thinking about how to use the ViewHelper later on in
the template, in order to get a clear view about the arguments of the
ViewHelper.

The ViewHelper is not part of the default distribution, therefore an own
namespace import is necessary to use the ViewHelper. In the following example
the namespace :php:`MyVendor\BlogExample\ViewHelpers` is imported with the
prefix ``blog``. Now, all tags starting with ``blog:`` are interpreted as
ViewHelper from within the namespace::

   {namespace blog=MyVendor\BlogExample\ViewHelpers}

The ViewHelper should get the name gravatar and only get an email address as
parameter. The ViewHelper is called in the template as follows:

.. code-block:: html

   <blog:gravatar emailAddress="username@example.com" />

.. _now-implementing:

Now implementing!
-----------------

Every ViewHelper is a PHP class whose name is derived from the namespace import
and the name of the XML element. The classname consists of the following three
parts:

* full namespace (in our example :php:`MyVendor\BlogExample\ViewHelpers`)
* the name of the ViewHelper in UpperCamelCase writing (in our example ``Gravatar``)
* the ending ``ViewHelper``

For the Gravatar ViewHelper the name of the class is
:php:`MyVendor\BlogExample\ViewHelpers\GravatarViewHelper`.

Following the naming conventions for Extbase extensions the ViewHelper
skeleton is created in the PHP file
:file:`EXT:blog_example/Classes/ViewHelpers/GravatarViewHelper.php`::

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

.. tip::

   A ViewHelper can also inherit from subclasses of :php:`AbstractViewHelper`,
   e.g.  from :php:`TYPO3\CMS\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper`.
   Several subclasses are offering additional functionality. The
   :php:`TagBasedViewHelper` will be explained later on in this chapter in
   detail in ":ref:`creating-xml-tags-using-tagbasedviewhelper`".

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

And the ViewHelper is called in template like:

.. code-block:: html

   {namespace blog=MyVendor\BlogExample\ViewHelpers}

   Hello <blog:gravatar />

Then ``Hello World`` is displayed.

.. _register-arguments-of-viewhelpers:

Register arguments of ViewHelpers
---------------------------------

The ``Gravatar`` ViewHelper must hand over the email address it should work on.
This is the last needed building block, before the implementation of
functionality can happen.

All arguments of a ViewHelper must be registered. Every ViewHelper has to declare
explicit which parameters are accepted.

The one way to register these arguments is to enhance the :php:`render()`
method. All method arguments of the :php:`render()` method are automatically
arguments of the ViewHelper. In the example it looks like this::

   /**
    * @param string $emailAddress
    */
   public function render($emailAddress)
   {
   }

This way the ViewHelper receives the argument ``emailAddress``, which is of the
type ``string``. The type is fetched from the annotation of the method in the
PHPDoc block.

.. warning::

   If the type of a parameter is not defined, an error message will be
   displayed. The PHPDoc block has to be complete and syntactical correct.
   For example, if ``@`` is missing in front of the ``param``, the type of the
   parameter is not identified.

.. tip::

   Sometimes arguments should get different types. In this case the type mixed
   should be used in the PHPDoc. With the line :php:`@param mixed
   $emailAddress` any type of object can be given as parameter ``emailAddress``,
   e.g. arrays, strings or integer values.

At the end the output of :html:`img`-Tag is implemented::

   <?php
   namespace MyVendor\BlogExample\ViewHelpers;

   use TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper;

   class GravatarViewHelper extends AbstractViewHelper
   {
      /**
       * @param string $emailAddress The email address to resolve the gravatar for
       * @return string the HTML <img>-Tag of the gravatar
       */
      public function render($emailAddress)
      {
         return '<img src="http://www.gravatar.com/avatar/' . md5($emailAddress) . '" />';
      }
   }

In the following sections some enhancements and tricks for implementing
ViewHelpers are shown.

.. _register-arguments-with-initializearguments():

Register Arguments with initializeArguments()
---------------------------------------------

Initializing the ViewHelper arguments directly at the :php:`render()` method is
extreme handy, when there aren't much arguments. But sometimes a complex
inheritance hierarchy is implemented with the ViewHelper, where different level
of the inheritance structure should register additional arguments. Fluid itself
does this for example with the ``form`` ViewHelpers.

Because method parameter and annotations are not inheritable, there must be an
additional way to register the arguments of a ViewHelper. Fluid provides the
method :php:`initializeArguments()` for this. In this method additional
arguments can be registered by calling :php:`$this->registerArgument($name,
$type, $description, $required, $defaultValue)`. These arguments can be
accessed through the array :php:`$this->arguments`.

The above example could be changed in the following way and would function
identical::

   <?php
   namespace MyVendor\BlogExample\ViewHelpers;

   use TYPO3\CMS\Fluid\Core\ViewHelper\AbstractViewHelper;

   class GravatarViewHelper extends AbstractViewHelper
   {
      public function initializeArguments()
      {
         $this->registerArgument('emailAddress', 'string', 'The email address to resolve the gravatar for', true);
      }

      /**
       * @return string the HTML <img>-Tag of the gravatar
       */
      public function render()
      {
         return '<img src="http://www.gravatar.com/avatar/' . md5($this->arguments['emailAddress']) . '" />';
      }
   }

In this example the usage of :php:`initializeArguments()` is not particular
meaningful, because the method only requires one parameter. When working with
complex ViewHelpers which have a multilevel inheritance hierarchy, it is
sometimes more readable to register the arguments with
:php:`initializeArguments()`.

.. _creating-xml-tags-using-tagbasedviewhelper:

Creating XML tags using TagBasedViewHelper
------------------------------------------

For ViewHelper that create XML tags Fluid provides an enhanced baseclass: the
:php:`TYPO3\CMS\Fluid\Core\ViewHelper\AbstractTagBasedViewHelper`. This
ViewHelper provides a *Tag-Builder* that can be used to create tags. It takes
care about the syntactical correct creation of the tag and escapes for example
single and double quote in attributes.

.. tip::

   With the correct escaping of the attributes the system security is enhanced,
   because it prevents cross site scripting attacks that would break out of the
   attributes of XML tags.

In the next step the example :php:`GravatarViewHelper` is modified a bit to use
the :php:`TagBasedViewHelper`. Because the Gravatar-ViewHelper creates an
:html:`img`-Tag the use of the Tag-Builder is advised.

.. todo:: Add code

What has changed? First of all, the ViewHelper inherits not directly from
:php:`AbstractViewHelper` but from :php:`TagBasedViewHelper`, which provides and
initializes the Tag-Builder. Beyond that there is a class property
:php:`$tagName` which stores the name of the tag to be created. Furthermore the
Tag-Builder is available at :php:`$this->tag`. It offers the method
:php:`addAttribute()` to add new tag attributes. In our example the attribute
`src` is added to the tag, with the value assigned one line above it. Finally
the Tag-Builder offers a method :php:`render()` which generates and returns the tag
which than is given back.

.. tip::

   It might be unclear why this code is better even though it is much longer. It
   communicates the meaning much better and therefore it is preferred to the
   first example, where the gravatar URL and the creating of the :html:`img`-Tag
   was mixed.

The base class :php:`TagBasedViewHelper` allows implementing ViewHelpers which
returns a XML tag easier and cleaner and help to concentrate at the essential.

Furthermore the :php:`TagBasedViewHelper` offers assistance for ViewHelper
arguments that should recur direct and unchanged as tag attributes. These could
be registered in :php:`initializeArguments()` with the method
:php:`$this->registerTagAttribute($name, $type, $description, $required =
false)`.  If support for the :html:`<img>` attribute ``alt`` should be provided
in the ViewHelper, this can be done by initializing this in
:php:`initializeArguments()` in the following way::

   public function initializeArguments()
   {
      $this->registerTagAttribute('alt', 'string', 'Alternative Text for the image');
   }

For registering the universal attributes id, class, dir, style, lang, title,
accesskey and tabindex there is a helper method
:php:`registerUniversalTagAttributes()` available.

If support for the universal attributes should be provided and the ``alt``
attribute in the Gravatar ViewHelper the following :php:`initializeArguments()`
method will be necessary::

   public function initializeArguments()
   {
      parent::initializeArguments();
      $this->registerUniversalTagAttributes();
      $this->registerTagAttribute('alt', 'string', 'Alternative Text for the image');
   }

.. _insert-optional-arguments:

Insert optional arguments
-------------------------

All ViewHelper arguments so fare registered were required. By setting a default
value for an argument in the method signature, the argument is automatically
optional. When registering the arguments through :php:`initializeArguments()`
the according parameter has to be set to :php:`false`.

Back to the example: An optional size parameter for the picture in the Gravatar
ViewHelper can be provided. This size parameter will be used to determine the
height and width of the image in pixels and can range from 1 to 512. When no
size is given, an image of 80px is generated.

The :php:`render()` method can be improved like this::

   /**
    * @param string $emailAddress The email address to resolve the gravatar for
    * @param int $size The size of the gravatar, ranging from 1 to 512
    * @return string the HTML <img>-Tag of the gravatar
    */
   public function render($emailAddress, $size = 80)
   {
      $gravatarUri = 'http://www.gravatar.com/avatar/' . md5($emailAddress) . '?s=' . urlencode($size);
      $this->tag->addAttribute('src', $gravatarUri);
      return $this->tag->render();
   }

With this setting of a default value, the ``size`` attribute becomes optional.

.. _prepare-viewhelper-for-inline-syntax:

Prepare ViewHelper for inline syntax
------------------------------------

So far the Gravatar ViewHelper has focussed on the tag structure of the
ViewHelper. The ViewHelper was only with the tag syntax (because it returns a
tag as well):

.. code-block:: html

   <blog:gravatar emailAddress="{post.author.emailAddress}" />

Alternatively this sample can be written in the inline notation:

.. code-block:: html

   {blog:gravatar(emailAddress: post.author.emailAddress)}

With this, the tag concept of the ViewHelper is mostly gone. One should see the
Gravatar ViewHelper as a kind of post processor for an email address and would
allow the following syntax:

.. code-block:: html

   {post.author.emailAddress -> blog:gravatar()}

Here the email address has the focus and the Gravatar ViewHelper is a converting
step based on the email address.

The syntax ``{post.author.emailAddress -> blog:gravatar()}`` is an alternative
writing for ``<blog:gravatar>{post.author.emailAddress}</blog:gravatar>``. To
support this the email address comes either from the argument ``emailAddress``
or, if it is empty, the content of the tag should be interpreted as email
address.

To fetch the content of the ViewHelper the method :php:`renderChildren()` is
available in the :php:`AbstractViewHelper`. This returns the evaluated object
between the opening and closing tag.

Lets have a look at the new code of the :php:`render()` method::

   /**
    * @param string $emailAddress The email address to resolve the gravatar for
    * @param int $size The size of the gravatar, ranging from 1 to 512
    * @return string the HTML <img>-Tag of the gravatar
    */
   public function render($emailAddress = null, $size = 80)
   {
      if ($emailAddress === null) {
         $emailAddress = $this->renderChildren();
      }

      $gravatarUri = 'http://www.gravatar.com/avatar/' . md5($emailAddress) . '?s=' . urlencode($size);
      $this->tag->addAttribute('src', $gravatarUri);
      return $this->tag->render();
   }

This code section has the following effect: First the ViewHelper attribute
``emailAddress`` becomes optional. If no ``emailAddress`` attribute is given,
content of the tag is interpreted as email address. The rest of the code in
unchanged.

.. tip::

   This trick was specially used at the format ViewHelpers. Every ViewHelper
   supports both writings there.

.. _escaping-of-output:

Escaping of Output
------------------

By default all output is escaped to prevent cross site scripting. In above
example no :html:`<img>`-Tag will be displayed, instead escaped HTML will be
displayed.

To allow the raw output, the escaping has to be disabled. This is done by
setting the class property :php:`$escapeOutput` to `false`::

   protected $escapeOutput = false;

In addition to the output of the ViewHelper itself, there is another property
defining the escaping of child ViewHelpers if any::

   protected $escapeChildren = false;
