.. include:: /Includes.rst.txt
.. highlight:: html
.. index::
   Fluid; Partials
   Partials
.. _moving-repeating-snippets-to-partials:

=====================================
Moving repeating snippets to partials
=====================================

Some parts within different templates might be the same. To not repeat this part
in multiple templates, Fluid offers so-called partials.
Partials are small pieces of Fluid template within a separate file that can be
included in multiple templates.

For example, an extension might display tags inside an
:file:`Resources/Private/Templates/RecordType/Index.html` template and also in
:file:`Resources/Private/Templates/RecordType/Show.html`. The snippet to display
these tags might look like:

.. code-block:: html
   :caption: EXT:blog_example/Resources/Private/Templates/RecordType/Index.html

   <b>Tags</b>: <f:for each="{tags}" as="tag">{tag}</f:for>

If this is to be changed, e.g., an :html:`ul` is preferred someday, the
modifications would have to be made in both templates.

That's where partials are used. Partials are stored, by default, within
:file:`Resources/Private/Partials/`. One might create a new partial
:file:`Resources/Private/Partials/Tags.html` with the snippet:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Partials/Tags.html

   <b>Tags</b>: <f:for each="{tags}" as="tag">{tag}</f:for>

.. index:: Partials; Rendering

Inside the existing template the snippet can now be replaced with a ViewHelper
to render the partial:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/SomeTemplate.html

   {f:render(partial: 'Tags', arguments: {
       tags: post.tags
   })}

Fluid will replace the ViewHelper call with the result of the rendered partial.
The argument "partial" receives the full path within the configured partial
folder to the file, excluding the file extension.

It's also possible to create further folders, e.g.:
:file:`Resources/Private/Partials/Blogpost/Tags.html` and to call the partial:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Partials/Blogpost/Tags.html

   {f:render(partial: 'Blogpost/Tags', arguments: {
       tags: post.tags
   })}


.. index:: Fluid; Namespace import

ViewHelper namespace import
===========================

Like within Fluid templates, custom ViewHelpers can be used within partials.
Because these ViewHelpers are not in the default namespace,
their namespace needs to be imported. For information about how to import a
namespace, see :ref:`t3coreapi:fluid-syntax-viewhelpers-import-namespaces`.

.. note::

   Up to CMS v8, this namespace import has to be within each partial where such a
   ViewHelper was used. Since CMS v8, there is no need anymore. The namespace has
   to be imported within the partial or the templates. It still can be imported
   in both, but the template is enough.


How to treat partials
=====================

Partials should best be treated as a reusable block of Fluid, with no
dependencies. Therefore the namespace imports should happen within the partial.
Also, the partial should be self-contained.

This way, the partial can be reused within different templates. As each template
has do call the partial, each template can map existing variables to match the
used variables within the partial.

Let's assume the following partial:
:file:`Resources/Private/Partials/Tags.html` again:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Partials/Tags.html

   <b>Tags</b>: <f:for each="{tags}" as="tag">{tag}</f:for>

This partial only requires the variable :html:`{tags}`.

Let's assume the following template:
:file:`Resources/Private/Templates/BlogPosts/Index.html`:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/BlogPosts/Index.html

   <f:for each="{blogPosts}" as="blogPost">
       <h2>{blogPost.title}</h2>
       {blogPost.content -> f:format.html()}

       {f:render(partial: 'Tags', arguments: {
          tags: blogPost.tags
       })}
   </f:for>

Within the template, no variable :html:`{tags}` exists. Instead, the variable
:html:`{blogPost.tags}` is mapped to :html:`{tags}` for the partial.

This way, it can also be reused for the following template:

:file:`Resources/Private/Templates/Blogs/Index.html`:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/Blogs/Index.html

   <f:for each="{blogs}" as="blog">
       <h2>{blog.title}</h2>
       {blog.description -> f:format.html()}

       {f:render(partial: 'Tags', arguments: {
          tags: blog.tags
       })}
   </f:for>

Again, there is no variable :html:`{tags}`. This time, an index of Blogs is
displayed instead of blog posts of a single Blog. Both have relations to
tags, which should be displayed the same way. With a single partial and the
`arguments`-Argument this is possible.
