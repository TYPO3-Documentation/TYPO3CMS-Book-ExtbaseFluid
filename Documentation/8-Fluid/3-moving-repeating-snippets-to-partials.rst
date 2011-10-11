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
<filename>Resources/Private/Partials/</filename>. For example we could save
our tag-view-partial in
<filename>Resources/Private/Partials/tags.html</filename> and it could
contain the following code to display the list of the tags:

``&lt;b&gt;Tags&lt;/b&gt;: &lt;f:for each="{tags}"
as="tag"&gt;{tag}&lt;/f:for&gt;``

We use the ViewHelper ``f:render partial="..." to call a Partial
in a template:``

::

	&lt;f:for each="{blogPosts}" as="post"&gt;
	&lt;li&gt;&lt;b&gt;{post.title}&lt;/b&gt;&lt;br /&gt;
	  &lt;f:render partial="tags" arguments="{tags: post.tags}" /&gt;
	&lt;/li&gt;
	&lt;/f:for&gt;
	&lt;/ul&gt;

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



