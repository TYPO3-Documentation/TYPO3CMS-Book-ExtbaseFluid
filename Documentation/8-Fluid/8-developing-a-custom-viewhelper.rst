Developing a custom ViewHelper
================================================

The development of an own ViewHelper is much asked for in practice and
is part of the base repertoire of the extension development. We will guide
you step by step through a simple example from the blog example and describe
enhanced techniques afterwards.


The Gravatar-ViewHelper
-------------------------------------------------

Avatar-Images are pictures or icons that for example are dedicated
to the author of an article in blogs or on forums. The photos of blog
authors and forum moderators are mostly stored on the appropriate server.
With users that only want to ask a question or to comment a blog post,
this is not the case. To allow them to supply their article with an icon,
a service called *gravatar.com* is available. This
online service makes sure that an email address is assigned to a certain
avatar picture.

A web application that wants to check if an avatar picture exists
for a given email address has to send a checksum (with the hash function
*md5*) of the email address to the service and receives
the picture to display. Therefore the use of
*gravatar.com* introduces no security risk because the
user of the blog only see the checksums of the email address and not the
email address itself. This is possible as no efficient possibility is
known to get the original data reconstructed from the checksum.

In this section we show you how to write your own ViewHelper that
uses an email address as parameter and shows the picture from gravatar.com
if it exists.



Preliminary considerations
-------------------------------------------------

The first step should be thinking about how to use the ViewHelper
later on in the template, in order to get a clear view about the arguments
of the ViewHelper. We take the point of view of a template author who
wants to use our ViewHelper later on, without knowledge of the internal
operations.

First of all, think about how the ViewHelper should be called inside
the template: The ViewHelper is not part of the default distribution,
therefore we need an own namespace import to use the ViewHelper. We import
the namespace ``Tx_BlogExample_ViewHelpers`` with the token
``blog``. Now, all tags starting with ``blog:`` are
interpreted as ViewHelper::

	``{namespace blog=Tx_BlogExample_ViewHelpers}``

Our ViewHelper should get the name gravatar and only get an email
address as parameter. We will call the ViewHelper in the template as
follows::

	&lt;blog:gravatar emailAddress="sebastian@typo3.org" /&gt;

After this preliminary considerations we will start with the
implementation.



Now implementing!
-------------------------------------------------

Every ViewHelper is a PHP class whose name is derived from the
namespace import and the name of the XML element. The classname consists
of the following three parts:

* full namespace (in our example
  ``Tx_BlogExample_ViewHelpers``)
* the name of the ViewHelper in UpperCamelCase writing (in our
  example ``Gravatar``)
* the ending ``ViewHelper``

For the Gravatar ViewHelper the name of the class is
``Tx_BlogExample_ViewHelpers_GravatarViewHelper``.

Following the naming conventions for Extbase extensions we create
the ViewHelper skeleton in the PHP file
*EXT:blog_example/Classes/ViewHelpers/GravatarViewHelper.php*::

	class Tx_BlogExample_ViewHelpers_GravatarViewHelper extends Tx_Fluid_Core_ViewHelper_AbstractViewHelper {
	public function render() {
	}
	}

Every ViewHelper must inherit from the class
``Tx_Fluid_Core_ViewHelper_AbstractViewHelper``.

.. tip::
	A ViewHelper can also inherit from subclasses of
	``AbstractViewHelper``, e.g. from
	``Tx_Fluid_Core_ViewHelper_TagBasedViewHelper``. Several
	subclasses are offering additional functionality. We will talk about the
	just addressed TagBasedViewHelper later on in this chapter in detail in
	"Creating XML tags using TagBasedViewHelper".

In addition every ViewHelper needs a method render(), which is
called once the ViewHelper is to be displayed in the template. The return
value of the method is copied directly into the complete output. If we
enhanced our ViewHelper from above as follows:

	class Tx_BlogExample_ViewHelpers_GravatarViewHelper extends Tx_Fluid_Core_ViewHelper_AbstractViewHelper {
	public function render() {
	return 'World';
	}
	}

and we insert it in the template like this:

	``{namespace blog=Tx_BlogExample_ViewHelpers}
	Hello &lt;blog:gravatar /&gt;``

``Hello World`` should be displayed.



Register arguments of ViewHelpers
-------------------------------------------------

Our ``Gravatar`` ViewHelper must hand over the email
address it should work on. This is the last needed building block, before
we can implement our needed functionality.

All arguments of a ViewHelper must be registerd. Every ViewHelper
has to declare explicit which parameters are accepted.

The easiest alternative to register these arguments is to enhance
the ``render()`` method. All method arguments of the
``render()`` method are automatically arguments of the
ViewHelpers. In our example it looks like this::

	/**
	* @param string $emailAddress
	*/
	public function render($emailAddress) {
	}

With this the ViewHelper gets the argument
``emailAddress``, which is of the type ``string``. You
see that the annotation of the method in the PHPDoc block is important,
because the type of the parameter is based on this by Fluid.

.. warning::
	If you forget to specify the type of a parameter, an error message
	will be displayed. Check at all times that the PHPDoc block is complete
	and syntactical correct. For example, if you forget the ``@``
	in front of the ``param``, the type of the parameter is not
	identified.

.. tip::
	Sometimes arguments should get *different*
	types. In this case you should use the type mixed in the PHPDoc. With
	the line ``@param mixed $emailAddress`` any type of object can
	be given as parameter ``emailAddress``, e.g. arrays, strings or
	integer values.

At the end we implement the output as img tag::

	class Tx_BlogExample_ViewHelpers_GravatarViewHelper extends Tx_Fluid_Core_ViewHelper_AbstractViewHelper {
	/**
	* @param string $emailAddress The email address to resolve the gravatar for
	* @return string the HTML &lt;img&gt;-Tag of the gravatar
	*/
	public function render() {
	return '&lt;img src="http://www.gravatar.com/avatar/' . md5($emailAddress) . '" /&gt;';
	}
	}

Congratulation on creating your first ViewHelper! In the
following sections we will show you some enhancements and tricks for
implementing ViewHelpers.



Register Arguments with initializeArguments()
--------------------------------------------------------------------------------------------------

Initializing the ViewHelper arguments directly at the
``render()`` method is extreme handy, when you don't have to much
arguments. But sometimes you'll build a complex inheritance hierarchy with
the ViewHelper, where different level of the inheritance structure should
register additional arguments. Fluid itself does this for example with the
``form`` ViewHelpers.

Because method parameter and annotations are not inheritable, there
must be an additional way to register the arguments of a ViewHelper. Fluid
provides the method ``initializeArguments`` for this. In this
method you can register additional arguments by calling
``$this-&gt;registerArgument($name, $type, $description, $required,
$defaultValue)``. You can access these arguments through the array
``$this-&gt;arguments``.

The above example could be changed in the following way and would
function identical::

	class Tx_BlogExample_ViewHelpers_GravatarViewHelper extends Tx_Fluid_Core_ViewHelper_AbstractViewHelper {
	/**
	* Arguments Initialization
	*/
	protected function initializeArguments() {
	$this-&gt;registerArgument('emailAddress', 'string',
	'The email address to resolve the gravatar for', TRUE);
	}

	/**
	* @return string the HTML &lt;img&gt;-Tag of the gravatar
	*/
	public function render() {
	return '&lt;img src="http://www.gravatar.com/avatar/' .
	md5($this-&gt;arguments['emailAddress']) . '" /&gt;';
	}
	}

In this example the usage of
``initializeArguments`` is not particular meaningful, because the
method only requires one parameter. When working with complex ViewHelpers
which have a multilevel inheritance hierarchy, it is sometimes more
readable to register the arguments with
``initializeArguments()``.



Creating XML tags using TagBasedViewHelper
--------------------------------------------------------------------------------------------------

For ViewHelper that create XML tags Fluid provides an enhanced
baseclass: the ``Tx_Fluid_Core_TagBasedViewHelper``. This
ViewHelper provides a *Tag-Builder* that can be used to
create tags in a simple way. It takes care about the syntactical correct
creation of the tag and escapes for example single and double quote in
attributes.

.. tip::
	With the correct escaping of the attributes the system security is
	enhanced, because it prevents *cross site scripting*
	attacks that would break out of the attributes of XML tags.

In the next step we modify the just created
``GravatarViewHelper`` a bit and use the
``TagBasedViewHelper``. Because the
``Gravatar-ViewHelper`` creates an ``img`` tag the use
of the Tag-Builder is advised.

Lets have a look how we change the ViewHelper:

<remark>TODO:code</remark>

What has changed? First of all, the ViewHelper inherits not directly
from ``AbstractViewHelper`` but from
``TagBasedViewHelper``, which provides and initializes the
Tag-Builder. Beyond that there is a class variable ``$tagName``
which stores the name of the tag to be created. Furthermore the
Tag-Builder is available at ``$this-&gt;tag``. It offers the
method ``addAttribute`` *(Attribute, Value)*
to add new tag attributes. In our example we add the attribute
``src`` to the tag, with the value assigned one line above it.
Finally the Tag-Builder offers a method ``render()`` which
generates and returns the tag which than is given back, because we want to
insert it in the template.

.. tip::
	You may ask why this code is better even though it is much longer.
	It communicates the meaning much better and therefore it is preferred to
	the first example, where the gravatar URL and the creating of the
	``img`` tag was mixed.

The base class ``TagBasedViewHelper`` allows you to
implement ViewHelpers which returns a XML tag easier and cleaner and help
to concentrate at the essential.

Furthermore the TagBasedViewHelper offers assistance for ViewHelper
arguments that should recur direct and unchanged as tag attributes. These
could be registerd in ``initializeArguments()`` with the method
``$this-&gt;registerTagAttribute($name, $type, $description, $required
= FALSE)``. If we want to support the ``&lt;img&gt;``
attribure ``alt`` in our ViewHelper, we can initialize this in
``initializeArguments()`` in the following way::

	public function initializeArguments() {
	$this-&gt;registerTagAttribute('alt', 'string', 'Alternative Text for the image');
	}

For registering the universal attributes ``id, class,
dir, style, lang, title, accesskey`` and ``tabindex`` there
is a helper method ``registerUniversalTagAttributes()``
available.

If we want to support the universal attributes and the
``alt`` attribute in our ``Gravatar`` ViewHelper we need
the following ``initializeArguments()`` method::

	public function initializeArguments() {
	parent::initializeArguments();
	$this-&gt;registerUniversalTagAttributes();
	$this-&gt;registerTagAttribute('alt', 'string', 'Alternative Text for the image');
	}


Insert optional arguments
-------------------------------------------------

All ViewHelper arguments we have registered so far were required. By
setting a default value for an argument in the method signature, the
argument is automatically *optional*. When registering
the arguments through ``initializeArguments()`` the according
parameter has to be set to ``FALSE``.

Back to our example: We can add a size parameter for the picture in
the Gravatar ViewHelper. This size parameter will be used to determine the
height and width of the image in pixels and can range from 1 to 512. When
no size is given, an image of 80px is generated.

We can enhance the ``render()`` method like this::

	/**
	* @param string $emailAddress The email address to resolve the gravatar for
	* @param string $size The size of the gravatar, ranging from 1 to 512
	* @return string the HTML &lt;img&gt;-Tag of the gravatar
	*/
	public function render($emailAddress, $size = '80') {
	$gravatarUri = 'http://www.gravatar.com/avatar/' . md5($emailAddress) . '?s=' . urlencode($size);
	$this-&gt;tag-&gt;addAttribute('src', $gravatarUri);
	return $this-&gt;tag-&gt;render();
	}
	}

With this setting of a default value we have made the
``size`` attribute optional.



Prepare ViewHelper for inline syntax
--------------------------------------------------------------------------------------------------

So far with our gravatar ViewHelper we have focussed on the tag
structure of the ViewHelper. We have used the ViewHelper only with the tag
syntax (because it returns a tag as well):

``&lt;blog:gravatar emailAddress="{post.author.emailAddress}"
/&gt;``

Alternatively we can rewrite this sample in the inline
notation:

``{blog:gravatar(emailAddress:
post.author.emailAddress)}``

With this, the tag concept of the ViewHelper is mostly gone. One
should see the gravatar ViewHelper as a kind of post processor for an
email address and would allow the following syntax:

``{post.author.emailAddress -&gt; blog:gravatar()}``

Here the email address has the focus and we see the gravatar
ViewHelper as a converting step based on the email address.

We want to show you now what a ViewHelper has to do, to support this
syntax. The syntax ``{post.author.emailAddress -&gt;
blog:gravatar()}`` is an alternative writing for
``&lt;blog:gravatar&gt;{post.author.emailAddress}&lt;/blog:gravatar&gt;``.
To support this we have to use the email address either from the argument
``emailAddress`` or, if it is empty, we should interpret the
content of the tag as email address.

How did we get the content of a ViewHelper tag? For this a helper
method ``renderChildren()`` is available in the
``AbstractViewHelper``. This returns the evaluated object between
the opening and closing tag.

Lets have a look at the new code of the ``render()``
method::

	/**
	* @param string $emailAddress The email address to resolve the gravatar for
	* @param string $size The size of the gravatar, ranging from 1 to 512
	* @return string the HTML &lt;img&gt;-Tag of the gravatar
	*/
	public function render($emailAddress = NULL, $size = '80') {
	if ($emailAddress === NULL) {
	$emailAddress = $this-&gt;renderChildren();
	}

	$gravatarUri = 'http://www.gravatar.com/avatar/' . md5($emailAddress) . '?s=' . urlencode($size);
	$this-&gt;tag-&gt;addAttribute('src', $gravatarUri);
	return $this-&gt;tag-&gt;render();
	}
	}

This code section has the following effect: First we have
made the ViewHelper attribute ``emailAddress`` optional. If no
``emailAddress`` attribuite is given, we interpret the content of
the tag as email address. The rest of the code in unchanged.

.. tip::
	This trick was specially used at the format ViewHelpers. Every
	ViewHelper supports both writings there.


