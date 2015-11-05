.. include:: ../Includes.txt

.. _using-boolean-conditions:

Using boolean conditions
========================

*Boolean conditions* are queries that compare two
values with each other (e.g. with ``==`` or ``>=``) and
then returns the value ``true`` or ``false``. Which values
are interpreted as ``true`` or ``false`` by Fluid depends
on the data type. A number for example is evaluated as ``true`` if
it is greater than 0.

.. tip::

    You find a complete list of all evaluating possibilities in appendix
    C in the section "Boolean expressions".

With the help of conditions you can hide or show certain parts of a
template. A typical scenario is the display of search results: If search
results are found, they were displayed; if none results are found an
appropriate message should be displayed. In Fluid the
``IfViewHelper`` enables such case-by-case analysis.

Simple ``if`` queries (without an else term) looks like
this::

    <f:if condition="{blog.posts}">
    This is only shown if blog posts are available.
    </f:if>

.. tip::

    If none comparison operator like ``==`` is given, per
    default empty lists are interpreted as ``false`` and list with at
    least one element as ``true``.

Using the inline notation it looks like this::

    <div class="{f:if(condition: blog.posts, then: 'blogPostsAvailable')}">
    This div has the CSS class 'BlogPostAvailable', if blog posts are available.
    </div>

Also ``if-then-else`` structures are possible. In that case
the ``then`` tag is required::

    <f:if condition="{blog.posts}">
    <f:then>
    This is only shown if blog posts are available.
    </f:then>
    <f:else>
    No blog posts available.
    </f:else>
    </f:if>

This is also possible in the inline notation::

    <div class="{f:if(condition: blog.posts, then: 'blogPostsAvailable', else: 'noPosts')}">
    This div has the CSS class 'BlogPostAvailable', if blog posts are available.
    If no posts are available this div container gets the CSS class 'noPosts' assigned.
    </div>

.. _realize-complex-comparisons:

Realize complex comparisons
---------------------------

Until now we have employed with simplest boolean evaluations. With
the syntax you have learned until now, no comparisons or modulo operations
are possible. Fluid supports these conditions as well. Here is a short
example::

    <f:if condition="{posts.viewCount} % 2">
    viewCount is an even number.
    </f:if>

Note the enhanced syntax inside the condition.
The compare operators ``>``, ``>=``,
``<``, ``<=``, ``==``, ``!=``
and ``%`` are available. The parameter left and right of the
operators could be numbers, object accessors, arrays and ViewHelpers in
inline notation, but not strings.

.. tip::

  Comparisons with strings, like ``<f:if condition="{gender}
  == 'male'">....</f:if>``, are not possible with Fluid yet
  because of the complex implementation. If you need such a condition, you
  have to write a ViewHelper that returns the needed string. Then you can
  compare the object accessor with the output of the ViewHelper:

  ``<f:if condition="{gender}" ==
  {my:male()}">...</f:if>``

The just shown detailed notation for comparisons and modulo
operations is not only available for the ``if`` ViewHelper but
for all ViewHelpers which have a parameter of the type
``boolean``.

.. tip::

  Once you develop an own ViewHelper - like described in the section
  "<xref linkend="Fluid_custom_viewHelper" />" later on in this chapter -
  you can use boolean expressions as arguments. Therefore the ViewHelper
  has to mark all arguments where those expressions are to be used as
  ``boolean``. The just explained functionality is not only
  available in the ``if`` ViewHelper, but rather available in
  self developed ViewHelper.<remark> ??? Sentence is not very
  clear</remark>

Upon engaged with many functionalities for the author of templates
in this section, we would show you now how to develop your own
ViewHelper.<remark>??? Does anyone understand the first part of the
sentence?</remark>
