.. include:: /Includes.rst.txt
.. index:: ViewHelpers; Inline notation
.. _inline-notation:

===============================
Inline notation for ViewHelpers
===============================

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


.. _inline-notation-converting:

Converting from tag-based notation to inline notation
=====================================================

| For every view helper you have the choice of using the *tag based*
  syntax or the so called *inline notation*.

Here a list of view helper examples and the corresponding inline
notation:

.. t3-field-list-table::
   :header-rows: 1

   -  :Header1:   Syntax example
      :Header2:   Tag notation
      :Header3:   Inline notation

   -  :Header1:   Variable as parameter
      :Header2:   :xml:`<f:foo argument="{someVariable}" />`
      :Header3:   :xml:`{f:foo(argument: someVariable)}`

   -  :Header1:   Variable as tag content
      :Header2:   :xml:`<f:foo>{someVariable}</f:foo>`
      :Header3:   :xml:`{someVariable -> f:foo()}`

   -  :Header1:   String
      :Header2:   :xml:`<f:foo argument="someString" />`
      :Header3:   :xml:`{f:foo(argument: 'someString')}`


.. note::

   Tags with String content cannot represented by the inline notation.
   :html:`<f:foo>someString</f:foo>` has no inline notation representaton.


ViewHelper as array value
-------------------------

.. code-block:: xml

   <f:translate
      key="{msg_id}"
      arguments="{1: '{f:format.date(date: record.validend, format: \'d.m.Y H:i:s\')}'}"
   />

Nested inline notation ViewHelpers
----------------------------------

Additional nesting levels require more escaped quotation marks!

.. code-block:: xml

   <f:example
      arguments="{1: '{f:format.date(
         date: record.validend,
         format: \'{f:test(value:\\'nested level 2\\')}\'
      )}'}"
   />


.. _inline-notation-vs-tag-based-notation:

Inline notation vs. tag-based notation
======================================

A comparison between inline notation and tag-based syntax:


Tags have an advantage, if:
---------------------------

*  Control structures are being displayed::

      <f:for each="{posts}" as="post">...</f:for>

*  The ViewHelper returns a tag::

      <f:form.textfield />

*  The hierarchical structure of ViewHelpers is important::

     <f:form>
         <f:form.textfield />
     </f:form>

*  The ViewHelper contains a lot of content::

      <f:section name="main">
         <!-- ... -->
      </f:section>


Inline notation should be used, if:
-----------------------------------

*  The focus is on the data flow::

      {post.date -> f:format.date(format: 'Y-m-d') -> f:format.padding(padLength: 40)}

*  The ViewHelper is being used inside of XML tags::

      <link rel="stylesheet" href="{f:uri.resource(path: 'styles.css')}" />

*  The nature of the ViewHelper is rather a helper function::

      {f:translate(key: '...')}
