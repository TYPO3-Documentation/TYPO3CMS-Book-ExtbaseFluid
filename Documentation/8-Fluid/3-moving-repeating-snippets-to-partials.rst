.. _moving-repeating-snippets-to-partials

Moving Repeating Snippets To Partials
================================================================================================

During developing of templates, you often reach a point, where you
need a template snippet that you wrote already before somewhere else. To
avoid duplicating code and to guarantee a consistent look with such
recurring elements, Fluid supports so called *Partials.*
You can think of partials as of a small code snippets that you can include
anywhere within a template. In our blog example there is a list of tags,
which are used in different views. In the list view of all posts and in the
detail view of a single blog post. In this case it makes sense to move the
view of the tag list to a partial.

All Partials are Fluid templates and are located in
:file:`Resources/Private/Partials/`. For example we could save
our tag-view-partial in
:file:`Resources/Private/Partials/tags.html` and it could
contain the following code to display the list of the tags::

	<b>Tags</b>: <f:for each="{tags}" as="tag">{tag}</f:for>

We use the ViewHelper ``f:render partial="..."`` to call a Partial in a template:

::

	<f:for each="{blogPosts}" as="post">
	<li><b>{post.title}</b><br />
	  <f:render partial="tags" arguments="{tags: post.tags}" />
	</li>
	</f:for>
	</ul>

With ``partial="tags"``, the ViewHelper
is being told to render the Partial called ``tags``. Further on,
the list of the tags is being passed to the ViewHelper as parameter. All
variables needed in the Partial, have to be passed to it explicitely with
``arguments="..."``.

.. tip::

  We referenced the Partial with the ending .html. In doing so, the
  current format is being used. Therefore a different format of the output
  is applied automatically when changing the format. If you specify the
  ending of the Partial explicitely, then this Partial is always used, no
  matter in which format the data is being outputted. More information
  about formats can be found in »Using Different Output Formats« in the
  previous chapter.



