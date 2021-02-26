.. include:: /Includes.rst.txt
.. _basic-concepts:

==============
Basic Concepts
==============

Fluid is a template engine that lets you display content on a website
very easily. A specific file (the template) will be processed, and the
containing placeholders will be replaced with the current content. This is
the basic concept of template engines - as well as Fluid's.

Fluid is based on three conceptual pillars which build the backbone of
the template engine and provide for scalability and flexibility:

* *Object Accessors* output the content of variables assigned to the View to be displayed.
* *ViewHelpers* are special tags in the template which provide more complex functionality such as loops or generating links.
* *Arrays* make it possible to assign hierarchical values to ViewHelpers.

.. index::
   Fluid; Object accessors
   Fluid; {myObject}

Outputting data with object accessors
=====================================

A template engine uses a placeholder to fill content in specified
areas in a template, and the result is then returned to the user. In Fluid,
these placeholders are called *Object
Accessors*.

.. tip::

    The markers used in the classic marker-based templates of TYPO3 v4
    are also placeholders which are replaced later on by the desired data.
    You will notice, though, that the placeholders used in Fluid are clearly
    more flexible and versatile.

Object Accessors are written in curly brackets. For example,
`{blogTitle}` will output the content of the variable
`blogTitle`. The variables have to be assigned in the
controller with :php:`$this->view->assign(variableName, object)`.
Let us look at this in an example of a list of blog posts.
In the controller, we assign some data to the template with the following
code::

    namespace ExtbaseTeam\BlogExample\Controller;

    class PostController extends \TYPO3\CMS\Extbase\Mvc\Controller\ActionController
    {
        // ...
        public function indexAction(\ExtbaseTeam\BlogExample\Domain\Model\Blog $blog)
        {
            $this->view->assign('blogTitle', 'Webdesign-Blog');
            $this->view->assign('blogPosts', $blog->getPosts());
        }
    }

Now we can insert the string »Webdesign-Blog« into the
template with the Object Accessor ``{blogTitle}``. Let us take a
look at the associated template::

    <h1>{blogTitle}</h1>

    <f:for each="{blogPosts}" as="post">
        <b>{post.title}</b><br />
    </f:for>

Upon generation of the output, the Object
Accessor ``{blogTitle}`` will be replaced by the title of the
blog »Webdesign-Blog«. To output the individual blog posts, the tag
``<f:for>`` is used, which you can also see in the template
above. Depending on the title of each blog post, the complete output looks
like this::

    <h1>Webdesign-Blog</h1>

    <b>Fluid as template-engine</b><br />
    <b>TypoScript to configure TYPO3</b><br />

.. tip::

    If you want to output an object instead of a String, the object
    needs to have a ``__toString()``-method which returns the
    textual representation of the object.

In the example above, you will also find the Object Accessor
``{post.title}`` which is used to output the title of a blog
post. This hierarchical notation is a syntax that makes it possible to
walk through associations in the object graph - you can literally move
from object to object. Often, a complex object is assigned to the View,
but only parts will be displayed. In the example above, we used
``{post.title}`` to display the property ``title`` of
the object. Generally, Fluid tries to handle such hierarchical properties
in the following order:

* If ``post`` is an array or an object which implements the interface ArrayAccess,
  the corresponding property will be returned as long as it exists.
* If it is an object, and a method `getTitle()` exists,
  the method will be called. This is the most common use case of an Object Accessor
  since, by convention, all public properties have a corresponding ``get``-method.
* The property will be returned if it exists in the object, and it
  is public. We discourage the ability to utilize this, though, since it
  violates the Uniform Access Principle (see box)

.. sidebar:: The Uniform Access Principle

    The Uniform Access Principle says all services offered by a
    module should be available through a uniform notation that does not
    betray whether they are implemented through storage or
    computation. <remark>Explanation on Wiki</remark>

    Stored objects are being accessed directly using public class
    variables in PHP - and it is visible on the outside that the object
    isn't being computed. For this reason, we often use `get` and
    `set`-methods in our models. Therefore, all class options are
    accessible through method calls and are uniformly addressed - it is
    not visible on the outside whether the class computed or stored the
    value directly.

You can navigate through more complex objects because Object
Accessors can be nested multiple times. For example, to output the email
address of an author of a blog post, you can use
``{post.author.emailAddress}``. That's almost equivalent to the
expression ``$post->getAuthor()->getEmailAddress()`` in
PHP, but focused on the essential.

Only the get-method, and not just any object method, can be
called with Object Accessors. This ensures that there is no PHP code in
the template. It is better to place PHP code in your own ViewHelper if
needed. The following describes how to do this.


.. index:: Fluid; ViewHelpers

Implementing more complex functionalities with ViewHelpers
==========================================================

Functionalities that exceed the simple output of values have to be
implemented with ViewHelpers. Every ViewHelper has its own PHP class. Now,
we're going to see how we can use ViewHelpers. Later, you'll also learn
how to write your own ViewHelper.

To use an existing ViewHelper, you have to import the
*namespace* and assign a shortcut to it. You can do
this with the declaration ``{namespace ...=...}``.

All namespaces used in your template must always be registered. This
might seem redundant, but because all important information is embedded in
the template, readability increases immensely for other template editors
who work on the same templates.

The standard ViewHelper of Fluid will be imported and assigned to
the shortcut ``f`` with the following declaration::

    {namespace f=TYPO3\CMS\Fluid\ViewHelpers}


This namespace will be imported automatically by Fluid. All
ViewHelpers that come with Fluid are prefixed with ``f``. Your
own namespaces have to be imported into the template like previously
mentioned.


.. index:: Fluid; f:for

All tags, which begin with a registered prefix, will be evaluated.
Here's a small example:

.. code-block:: xml

    <ul>
        <f:for each="{blogPosts}" as="post">
            <li>{post.title}</li>
        </f:for>
    </ul>

Tags without a registered prefix (in this example
<ul> and <li>) will be treated as text. The tag
``<f:for>`` will be interpreted as a ViewHelper since it
starts with the prefix ``f:``. This is implemented in the class
:php:`\TYPO3Fluid\Fluid\ViewHelpers\ForViewHelper`.

The first part of the class name is the complete namespace like it
was defined earlier with ``{namespace f=TYPO3\CMS\Fluid\ViewHelpers}``.
Followed by the name of the ViewHelper and the ending
*ViewHelper*.

Fluid will interpret every argument of a ViewHelper. The
ViewHelper ``<f:for>`` from the previous example therefore
receives the array of all blog posts with the argument
*each*.

.. tip::

    If the name of the ViewHelper contains a single or multiple
    periods, it will be resolved as a subpackage. For example, the
    ViewHelper ``f:form.textfield`` is implemented in the class
    :php:`\TYPO3\CMS\Fluid\ViewHelpers\Form\TextfieldViewHelper`.
    Therefore ViewHelpers can be divided further and structured even
    more.

ViewHelpers are the main tools of template editors. They make it
possible to have a clear separation of the template and embedded
functionality.

.. tip::

    All control structures like ``if/else`` or
    ``for`` are individual ViewHelpers in Fluid and not a core
    language feature. This is one of the main reasons for the flexibility
    of Fluid. You'll find a detailed reference in the `ViewHelpers Reference
    <https://docs.typo3.org/other/typo3/view-helper-reference/master/en-us/typo3/fluid/latest/Index.html>`__.

.. index:: Fluid; arrays

Flexible array data structures
==============================

Arrays round off the concept of Fluid and build another core concept
of the template engine. Arrays in Fluid can be somewhat compared to
associative arrays in PHP. Every value in a Fluid array needs a
key.

Arrays are used to pass a variable number of arguments to View
Helpers. The best example is the ``link.action``-ViewHelper. With
this, you can create a link to other controllers and Actions in your
Extension. The following link refers to the ``index`` action of
the ``Post`` controller:

``<f:link.action controller="Post" action="index">Show
list of all posts</f:link.action>``

However, many links in your application need parameters, which can be
passed with the ``arguments`` attribute. We can already see that
we need arrays to do so: It's unpredictable how many parameters you want
to pass. By using an array, we can pass an indefinite amount of parameters.
The following example adds the parameter ``post`` to the
link:

``<f:link.action controller="Post" action="show"
arguments="{post: currentPost}">Show current
post</f:link.action>``

The array ``{post: currentPost}`` consists of a single
element with the name ``post``. The value of the element is the
object ``currentPost``. A comma separates multiple elements:
``{post: currentPost, blogTitle: 'Webdesign-Blog'}``.

Fluid only supports named arrays, which means that you always have
to specify the key of the array element. Let's look at what options you
have when creating an array::

    {
        key1: 'Hello',
        key2: "World",
        key3: 20,
        key4: blog,
        key5: blog.title,
        key6: '{firstname} {lastname}'
    }

The array can contain strings as values as in key1 and key2.
It can also have numbers as values as in key3. More interesting are key4
and key5: Object Accessors are being specified as array values. You can
also access sub-objects like you are used to with Object Accessors. All
strings in arrays are interpreted as Fluid markup as well. So that you can
combine strings from individual strings, for example. This way, it is also
possible to call ViewHelpers with the inline notation.

These are the basic concepts of Fluid. Now we move on to more
advanced concepts, which increase the effectiveness of template creation.
The following chapter will explain how to use different output formats to
achieve different views of data.
