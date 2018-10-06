.. include:: ../Includes.txt

.. highlight:: html

.. _moving-repeating-snippets-to-partials:

Moving Repeating Snippets To Partials
=====================================

Some parts within different Templates might be the same. To not repeat this part
in multiple templates, Fluid offers so called Partials.
Partials are small pieces of Fluid template within a separate file, that can be
included in multiple Templates.

For example an extension might display tags inside an
:file:`Resources/Private/Templates/RecordType/Index.html` template and also in
:file:`Resources/Private/Templates/RecordType/Show.html`. The snippet to display
these tags might look like::

   <b>Tags</b>: <f:for each="{tags}" as="tag">{tag}</f:for>

Once these might change, e.g. an :html:`ul` might be preferred some day, this
has to be changed within both templates.

That's where Partials are used. Partials are stored, by default, within
:file:`Resources/Private/Partials/`. One might create a new Partial
:file:`Resources/Private/Partials/Tags.html` with the snippet::

   <b>Tags</b>: <f:for each="{tags}" as="tag">{tag}</f:for>

Inside the existing template the snippet can now be replaced with a ViewHelper
to render the Partial::

   {f:render(partial: 'Tags', arguments: {
       tags: post.tags
   })}

Fluid will replace the ViewHelper call with the result of the rendered Partial.
The argument "partial" receives the full path within the configured Partial
folder to the file, excluding the file extension.

It's also possible to create further folders, e.g.:
:file:`Resources/Private/Partials/Blogpost/Tags.html` and to call the partial::

   {f:render(partial: 'Blogpost/Tags', arguments: {
       tags: post.tags
   })}

ViewHelper Namespace import
---------------------------

Like within Fluid Templates, custom ViewHelpers might be used within Partials.
As these ViewHelpers are within a different namespace then default ViewHelpers,
this namespace need to be imported. For information about how to import a
namespace, see :ref:`importing-namespaces`.

Either one uses a :ref:`global-namespace-import`, or :ref:`imports the namespace
<importing-namespaces>` within the partial, or within the template. The last two
options can be used consecutive.

.. note::

   Up to CMS v8 this namespace import has to be within each partial where such a
   ViewHelper was used. Since CMS v8 there is no need anymore. The namespace has
   to be imported within the Partial or the Templates. It still can be imported
   in both, but the template is enough.

How to treat Partials
---------------------

Partials should best be treated as reusable block of Fluid, with no
dependencies. Therefore the namespace imports should happen within the Partial.
Also the partial should be self contained.

This way the Partial can be reused within different Templates. As each Template
has do call the partial, each Template can map existing variables to match the
used variables within the Partial.

Let's assume the following Partial:
:file:`Resources/Private/Partials/Tags.html` again::

   <b>Tags</b>: <f:for each="{tags}" as="tag">{tag}</f:for>

These partial only requires the variable :html:`{tags}` to exist.

Let's assume the following Template:
:file:`Resources/Private/Templates/BlogPosts/Index.html`::

   <f:for each="{blogPosts}" as="blogPost">
       <h2>{blogPost.title}</h2>
       {blogPost.content -> f:format.html()}

       {f:render(partial: 'Tags', arguments: {
          tags: blogPost.tags
       })}
   </f:for>

Then within the Template no variable :html:`{tags}` exist. Instead the variable
:html:`{blogPost.tags}` is mapped to :html:`{tags}` for the Partial.

This way it can also be reused for the following Template:

Let's assume the following Template:
:file:`Resources/Private/Templates/Blogs/Index.html`::

   <f:for each="{blogs}" as="blog">
       <h2>{blog.title}</h2>
       {blog.description -> f:format.html()}

       {f:render(partial: 'Tags', arguments: {
          tags: blog.tags
       })}
   </f:for>

Again there is no variable :html:`{tags}`. This time an index of Blogs is
displayed instead of Blogposts of a single Blog. Still both have relations to
tags which should be displayed the same way. With a single Partials and the
`arguments`-Argument this is possible.
