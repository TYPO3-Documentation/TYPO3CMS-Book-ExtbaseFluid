.. include:: ../Includes.txt

.. highlight:: html

.. _moving-repeating-snippets-to-partials:

Moving Repeating Snippets To Partials
=====================================

Some parts within different Templates might be the same. In order to not repeat this part
in multiple templates, Fluid offers so called Partials.
Partials are small pieces of Fluid template within a separate file that can be
included in multiple Templates.

For example, an extension might display tags inside an
:file:`Resources/Private/Templates/RecordType/Index.html` template and also in
:file:`Resources/Private/Templates/RecordType/Show.html`. The snippet to display
these tags might look like::

   <b>Tags</b>: <f:for each="{tags}" as="tag">{tag}</f:for>

If this is to be changed, e.g. an :html:`ul` is preferred some day, the
modifications would have to be made in both templates.

That's where Partials are used. Partials are stored, by default, within
:file:`Resources/Private/Partials/`. One might create a new Partial
:file:`Resources/Private/Partials/Tags.html` with the snippet::

   <b>Tags</b>: <f:for each="{tags}" as="tag">{tag}</f:for>

Inside the existing Template the snippet can now be replaced with a ViewHelper
to render the Partial::

   {f:render(partial: 'Tags', arguments: {
       tags: post.tags
   })}

Fluid will replace the ViewHelper call with the result of the rendered Partial.
The argument "partial" receives the full path within the configured Partial
folder to the file, excluding the file extension.

It's also possible to create further folders, e.g.:
:file:`Resources/Private/Partials/Blogpost/Tags.html` and to call the Partial::

   {f:render(partial: 'Blogpost/Tags', arguments: {
       tags: post.tags
   })}

ViewHelper Namespace import
---------------------------

Like within Fluid Templates, custom ViewHelpers can be used within Partials.
Because these ViewHelpers are not in the default namespace,
their namespace needs to be imported. For information about how to import a
namespace, see :ref:`importing-namespaces`.

It's possible to use a :ref:`global-namespace-import`, or :ref:`imports the namespace
<importing-namespaces>` within the Partial, or within the Template.

.. note::

   Up to CMS v8 this namespace import has to be within each Partial where such a
   ViewHelper was used. Since CMS v8 there is no need anymore. The namespace has
   to be imported within the Partial or the Templates. It still can be imported
   in both, but the template is enough.

How to treat Partials
---------------------

Partials should best be treated as reusable block of Fluid, with no
dependencies. Therefore the namespace imports should happen within the Partial.
Also the Partial should be self contained.

This way the Partial can be reused within different Templates. As each Template
has do call the Partial, each Template can map existing variables to match the
used variables within the Partial.

Let's assume the following Partial:
:file:`Resources/Private/Partials/Tags.html` again::

   <b>Tags</b>: <f:for each="{tags}" as="tag">{tag}</f:for>

This Partial only requires the variable :html:`{tags}`.

Let's assume the following Template:
:file:`Resources/Private/Templates/BlogPosts/Index.html`::

   <f:for each="{blogPosts}" as="blogPost">
       <h2>{blogPost.title}</h2>
       {blogPost.content -> f:format.html()}

       {f:render(partial: 'Tags', arguments: {
          tags: blogPost.tags
       })}
   </f:for>

Within the Template, no variable :html:`{tags}` exists. Instead, the variable
:html:`{blogPost.tags}` is mapped to :html:`{tags}` for the Partial.

This way, it can also be reused for the following Template:

:file:`Resources/Private/Templates/Blogs/Index.html`::

   <f:for each="{blogs}" as="blog">
       <h2>{blog.title}</h2>
       {blog.description -> f:format.html()}

       {f:render(partial: 'Tags', arguments: {
          tags: blog.tags
       })}
   </f:for>

Again, there is no variable :html:`{tags}`. This time, an index of Blogs is
displayed instead of Blogposts of a single Blog. Both have relations to
tags which should be displayed the same way. With a single Partial and the
`arguments`-Argument this is possible.
