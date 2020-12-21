.. include:: ../Includes.txt

Using boolean conditions
================================================

*Boolean conditions* are queries that compare two
values with each other (e.g., with ``==`` or ``>=``) and
then returns the value ``true`` or ``false``. Which values
are interpreted as ``true`` or ``false`` by Fluid depends
on the data type. A number, for example, is evaluated as ``true`` if
it is greater than 0.

.. tip::

   You find a complete list of all evaluating possibilities in the appendix
   C in the section "Boolean expressions".

With the help of conditions, you can hide or show certain parts of a
template. A typical scenario is the display of search results: If search
results are found, they were displayed; if none results are found, an
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
   If no posts are available, this div container gets the CSS class 'noPosts' assigned.
   </div>


Realize complex comparisons
-------------------------------------------------

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
operators could be numbers, object accessors, arrays, and ViewHelpers in
inline notation, or quoted strings.


.. tip::

  Any ViewHelper argument declared as ``boolean`` supports boolean
  expression syntax, including in your own self-written ViewHelpers.
