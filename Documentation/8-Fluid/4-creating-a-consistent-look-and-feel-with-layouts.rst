.. include:: ../Includes.txt

.. _creating-a-consistent-look-and-feel-with-layouts:

Creating a consistent look and feel with layouts
================================================

While partials are suitable for small recurring elements, layouts
build the frame of the templates (see Figure 8-1). They should create a
consistent look and feel of a web application and decorate an existing
template. In a layout, areas are marked as variable and replaced with the
current template. Note that the template has the focus and controls the
output. You also have to determine which layout is being used in the
template.

.. figure:: /Images/8-Fluid/figure-8-1.png
    :align: center

    Figure 8-1: Layouts build the outer frame for a template, whereas recurring
    elements can be implemented in a template with partials.

Now we look at how to create and use a layout. A layout is a Fluid
file in the folder :file:`Resources/Private/Layouts/`. It
contains placeholders which should be replaced by content of the
corresponding template within the layout. In the following example you see a
use case of the ViewHelper ``<f:render section="..." />`` as
placeholder.

::

    <html>
    ...
    <body>
    <h1>Blogging with Extbase:</h1>
    <f:render section="main" />
    <h6>This is the footer section</h6>
    </body>
    </html>

.. tip::

  Layouts in Extbase usually don't contain the basic structure of a
  HTML document (``<html>``, ``<head>``
  etc.), since this is usually generated with TYPO3. For the purpose of
  illustration though, we show a complete HTML page.

A template looks like this::

    <f:layout name="default" />

    <f:section name="main">
    <h2>Blog List</h2>
    ...
    </f:section>

The first line in the template defines
which layout should be wrapped around the template. With specifying
name="default", Fluid will use the file
:file:`Resources/Private/Layouts/default.html` as
layout.

The template must also contain ``<f:section
name="...">...</f:section>`` for every placeholder in the
layout. So by defining the placeholder
``<f:render section="main">``, like in the example layout above, a
template, which uses this layout, must define the section
``<f:section name="main">...</f:section>``, whose
content then is being inserted in the layout. Layouts can reference any number of
sections. Different sections are often used for multi-column layouts.
Besides, you can use all features of Fluid in layouts, which you'll get to
know in the course of this chapter, for building templates. So layouts offer
various possibilities for efficiently templating a web application.

.. tip::

  You'll find a practical example for building layouts in the
  section ":ref:`template-creation-by-example`" later on in this
  chapter.

Now that you got to know how you can structure templates with
layouts and partials, we want to explore some options ViewHelpers offer. In
the following segment we'll introduce a powerful tool for template building.
A ViewHelper which combines the possibilities of Fluid and the classic
TYPO3-templating.
