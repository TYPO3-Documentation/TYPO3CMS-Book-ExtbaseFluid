Creating A Consistent Look And Feel With Layouts
================================================================================================

While partials are suitable for small recurring elements, layouts
build the frame of the templates (see Figure 8-1). They should create a
consistent look and feel of a web application and decorate an existing
template. In a layout, areas are marked as variable and replaced with the
current template. Note that the template has the focus and controls the
output. You also have to determine which layout is being used in the
template.

<remark>TODO: insert Figure 8-1 "Layouts build the outer frame for a
template, whereas recurring elements can be implemented in a template with
partials."</remark>

Now we look at how to create and use a layout. A layout is a Fluid
file in the folder <filename>Resources/Private/Layouts/</filename>. It
contains placeholders which should be replaced by content of the
corresponding template within the layout. In the following example you see a
use case of the ViewHelper ``&lt;f:render section="..." /&gt;`` as
placeholder.

::

	&lt;html&gt;
	...
	&lt;body&gt;
	&lt;h1&gt;Blogging with Extbase:&lt;/h1&gt;
	&lt;f.render section="main" /&gt;
	&lt;h6&gt;This is the footer section&lt;/h6&gt;
	&lt;/body&gt;
	&lt;/html&gt;

.. tip::
  Layouts in Extbase usually don't contain the basic structure of a
  HTML document (``&lt;html&gt;``, ``&lt;head&gt;``
  etc.), since this is usually generated with TYPO3. For the purpose of
  illustration though, we show a complete HTML page.

A template looks like this::

	&lt;f:layout name="default" /&gt;

	&lt;f:section name="main"&gt;
	&lt;h2&gt;Blog List&lt;/h2&gt;
	...
	&lt;/f:section&gt;

The first line in the template defines
which layout should be wrapped around the template. With specifying
name="default", Fluid will use the file
<filename>Resources/Private/Layouts/default.html</filename> as
layout.

The template must also contain ``&lt;f:section
name="..."&gt;...&lt;/f:section&gt;`` for every placeholder in the
layout whose content will be inserted. So by defining the placeholder
``&lt;f:section name="main"&gt;``, like in the example above, a
template, which uses this layout, must define the section
``&lt;f:section name="main"&gt;...&lt;/f:section&gt;``, whose
content then is being inserted in the layout. (<remark>TODO: does anybody
understand this sentence?</remark>) Layouts can reference any number of
sections. Different sections are often used for multi-column layouts.
Besides, you can use all features of Fluid in layouts, which you'll get to
know in the course of this chapter, for building templates. So layouts offer
various possibilities for efficiently templating a web application.

.. tip::
  You'll find a practical example for building layouts in the
  section "<xref linkend="Fluid_template_by_example" />" later on in this
  chapter.

Now that you got to know how you can structure templates with
layouts and partials, we want to explore some options ViewHelpers offer. In
the following segment we'll introduce a powerful tool for template building.
A ViewHelper which combines the possibilities of Fluid and the classic
TYPO3-templating.

