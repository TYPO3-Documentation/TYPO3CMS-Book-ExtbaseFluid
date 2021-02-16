.. include:: /Includes.rst.txt
.. index:: ViewHelpers; Inline notation
.. _inline-notation-vs-tag-based-notation:

=============================
Inline syntax for ViewHelpers
=============================



Inline notation for ViewHelpers
-------------------------------

.. sidebar:: Inline notation vs. tag-based notation

    Once again, a comparison between inline notation and tag-based syntax:

    Tags have an advantage, if:

    * Control structures are being displayed::

        <f:for each="{posts}" as="post">...</f:for>

    * The ViewHelper returns a tag::

        <f:form.textfield />

    * The hierarchical structure of ViewHelpers is
      important::

        <f:form>
            <f:form.textfield />
        </f:form>

    * The ViewHelper contains a lot of content::

        <f:section name="main">
            <!-- ... -->
        </f:section>

    Inline notation should be used, if:

    * The focus is on the data flow::

        {post.date -> f:format.date(format: 'Y-m-d') -> f:format.padding(padLength: 40)}

    * The ViewHelper is being used inside of XML tags::

        <link rel="stylesheet" href="{f:uri.resource(path: 'styles.css')}" />

    * The nature of the ViewHelper is rather a helper function::

        {f:translate(key: '...')}


It is intuitive and natural for most of the ViewHelpers to be called
with the tag-based syntax. Especially with control structures or form
elements, this syntax is easily understood. But there are also ViewHelpers,
which can lead to difficult to understand and invalid template code when
used as a tag. An example of this is the ``f:uri.resource``
ViewHelper, which returns the path to a resource in the
*Public/* folder of an Extension. It is being used
inside of ``<link rel="stylesheet" href="..." />`` for
example. Using the normal, tag-based syntax, it looks like this::

    <link rel="stylesheet" href="<f:uri.resource path='myCss.css' />" />

That isn't easy to read and doesn't adequately communicate
the meaning of the ViewHelper. Also, the above code is not valid XHTML, and
therefore most text editors can't display the code with correct syntax
highlighting anymore.

For that reason, it is also possible to call the ViewHelper
differently, with the help of the *inline notation*.
The inline notation is function-oriented, which is more suitable for this
ViewHelper: Instead of ``<f:uri.resource />`` you can also
write ``{f:uri.resource()}``.

So the example above can be changed to::

    <link rel="stylesheet" href="{f:uri.resource(path: 'myCss.css')}" />

The purpose of the ViewHelper is easily understandable and visible -
it is a helper function that returns a resource. It is well-formed XHTML
code as well, and the syntax highlighting of your editor will work
correctly again.

We'll illustrate some details of Fluid's syntax, based on formatting
a date.

Let's assume we have a blog post object with the name
*post* in the template. It has, among others, a
property *date* which contains the date of the creation
of the post in a *DateTime* object.

*DateTime* objects that can be used in PHP to
represent dates, have no `__toString()`-method and
can, therefore not be outputted with Object Accessors in the template.
You'll trigger a PHP error message if you simple write
``{post.date}`` in your template.

.. index:: Fluid; f:format.date

In Fluid there is a ViewHelper ``f:format.date`` to output
*DateTime* objects, which (as you can see on the prefix
``f:``) is already part of Fluid:

``<f:format.date format="Y-m-d">{post.date}</f:format.date>``

This ViewHelper formats the date as defined in the
*format* property. In this case, there must be
no whitespaces or newlines before or after
``{post.date}``. If there is, Fluid tries to chain the whitespace
and the string representation of ``{post.date}`` together as
string. Because the DateTime object has no method
`__toString()`, a PHP error message will be thrown
again.

.. tip::

    To avoid this problem, all ``f:format``-ViewHelpers
    have a property to specify the object to be formatted.

Instead of writing
``<f:format.date>{post.date}</f:format.date>``
you can write: ``<f:format.date date="{post.date}" />``
to bypass the problem. But again, there can't be any characters before
or after ``{post.date}``.
</tip>You can pretty much see, that in this case the tag based syntax is
prone to errors: We have to know, that ``{post.date}`` is an
object so we don't add whitespaces inside of
``<f:format.date>...</f:format.date>``.

An alternative would be to use the following syntax::

    {post.date -> f:format.date(format: 'Y-m-d')}

Inside the object accessor, we can use a ViewHelper to process the
value. The above example is easily readable, intuitive, and less
error-prone than the tag-based variation.

.. tip::

    This might look familiar if you happen to know the UNIX shell:
    There is a pipe operator (|) which has the same functionality as our
    chaining operator. The arrow shows the direction of the data flow
    better though.

You can also chain multiple ViewHelpers together. Lets assume we
want to pad the processed string to the length of 40 characters (e.g.
because we output code). This can be simply written as::

    {post.date -> f:format.date(format: 'Y-m-d') -> f:format.padding(padLength: 40)}

Which is functionally equal to::

    <f:format.padding padLength="40"><f:format.date format="Y-m-d">{post.date}</f:format.date></f:format.padding>

The data flow is also easier to read with an inline syntax like
this, and it is easier to see on which values the ViewHelper is working
on. We can thus confirm that you can process the value of every Object
Accessor by inserting it into the ViewHelper with the help of the chaining
operator (->). This can also be done multiple times.


Converting from Fluid tag syntax to inline syntax
-------------------------------------------------


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
