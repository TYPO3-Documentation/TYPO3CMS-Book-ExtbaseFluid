.. include:: /Includes.rst.txt
.. index::
   Fluid; Rendering
   Fluid; TemplateView
   Files; EXT:blog_example/Resources/Private/Templates

===============================
Rendering the output with Fluid
===============================

The TemplateView of Fluid now tries to load the corresponding HTML template.
Since there is none explicitly specified by ``this->view->setTemplatePathAndFilename($template-PathAndFilename)``
Fluid searches at a place defined by conventions.

All frontend templates can be found in :file:`EXT:blog_example/Resources/Private/Templates`
by default. For example, there are the two subfolders *Blog* and *Post*.
Since the call was made by the ``indexAction()`` of the ``BlogController``, Fluid
searches in the folder *Blog* for a file named *Index* and - if not set up
differently - the suffix *.html*. So every action method has its own template.
In table 3.1 you can find some examples for this convention.


*Table 3-1: Examples for the convention of template paths*

+-----------+------------+------------+--------------------------------------------+
|Controller |Action      |Format      |Path and filename                           |
+-----------+------------+------------+--------------------------------------------+
|Blog       |index       |unspecified |Resources/Private/Templates/Blog/Index.html |
+-----------+------------+------------+--------------------------------------------+
|Blog       |index       |txt         |Resources/Private/Templates/Blog/Index.txt  |
+-----------+------------+------------+--------------------------------------------+
|Blog       |new         |unspecified |Resources/Private/Templates/Blog/New.html   |
+-----------+------------+------------+--------------------------------------------+
|Post       |unspecified |unspecified |Resources/Private/Templates/Post/Index.html |
+-----------+------------+------------+--------------------------------------------+

In this case, the file *Index.html* will be loaded. Here you see an extract of the template file:

.. code-block:: html
   :caption: Index.html
   :name: index-html

    <h1>
        <f:translate key="blog.header">[Blog header]</f:translate>
    </h1>
    <p>
        <f:translate key="blog.introduction">[introduction]</f:translate>
    </p>

    <f:if condition="{blogs}">
        <f:then>
            <h2>
                <f:translate key="blog.list" arguments="{numberOfBlogs: '{blogs -> f:count()}'}">[list of blogs]</f:translate>
                :
            </h2>
            <f:render partial="Pagination" arguments="{pagination: pagination, pages: pages, paginator: paginator}" />
            <ol class="tx-blogexample-blog-list">
                <f:for each="{paginator.paginatedItems}" as="blog">
                     <li>
                        <h3>
                            <f:link.action action="index" controller="Post" arguments="{blog : blog}">{blog.title} ({f:translate(key: 'blog.numberOfPosts', arguments: '{numberOfPosts: \'{blog.posts -> f:count()}\'}')})</f:link.action>
                        </h3>
                        <f:security.ifHasRole role="{settings.editorUsergroupUid}">
                            <div class="tx-blogexample-options">
                                <f:link.action action="edit" class="icon edit" arguments="{blog : blog}" title="{f:translate(key: 'blog.edit')}">
                                    <f:translate key="blog.edit" />
                                </f:link.action>
                                <f:link.action action="delete" class="icon delete" arguments="{blog : blog}" title="{f:translate(key: 'blog.delete')}">
                                    <f:translate key="blog.delete" />
                                </f:link.action>
                            </div>
                        </f:security.ifHasRole>
                        <p class="tx-blogexample-description">
                            <f:format.nl2br>{blog.description}</f:format.nl2br>
                        </p>
                    </li>
                </f:for>
            </ol>


All the XML tags with namespace »f« stand out, like `<f:for>` or `<f:link.action>`.
These tags are provided by Fluid and represent different functionalities.

*  `<f:format.nl2br>[…]</f:format.nl2br>` :
   modifies linebreaks (new lines) to `<br />` tags.
*  `<f:link.action action="edit">` :
   creates a link tag that links to the :php:`editAction()` of the current controller.
*  `<f:for each="{paginator.paginatedItems}" as="blog">[…]</f:for>` :
   iterates over the paginated Blog objects found in Blogs.
*  `<f:link.action action="index" controller="Post" arguments="{blog : blog}">[…]</f:link.action>` :
   creates a link to the :php:`indexAction` method of the :php:`PostController` which is :php:`public function indexAction(Blog $blog, $tag = null)`. 
   The blog stored in the variable `{blog}` is passed as `blog` parameter to the action.
*  `{f:translate(key: 'blog.numberOfPosts', arguments: '{numberOfPosts: \'{blog.posts -> f:count()}\'}')}`
   The translation key `blog.numberOfPosts` refers to the translation 
   file:`Resources/Private/Language/locallang.xlf`. The number of `{blog.posts}` is counted using the 
   `f:count()` viewhelper and passed as argument to the `f:translate()` viewhelper. This viewhelper 
   inserts the argument into the translation text `%d posts`.  `{blog.posts}` is the list of posts
   which belong to the current blog. The class `Blog` contains a getter method `getPosts()` which is 
   automatically used to access the list of posts (:php:`\TYPO3\CMS\Extbase\Persistence\ObjectStorage`).
 
In the variable `{blogs}` of the latter example all
blogs are "included" and then split into "blogs per page" (paginatedItems) by
the paginator. The details have to be set up in the
controller, see the :ref:`documentation on pagination <t3coreapi:pagination>` for a
guide on how to achieve that.

The curly brackets tell Fluid that it is a variable that
has been "assigned" to the template. In our case this is done in the
:php:`indexAction()` of the `BlogController`. With the attribute `each`, the
`for` ViewHelper gets the `blog` objects over whom to iterate. The
attribute ``as`` holds the name of the variable with which the `blog` object is
available inside of `<f:for>[...]</f:for>`. Here it can be called with `{blog}`.

.. note::

    The string `"blog"` is *not* surrounded by brackets when assigned to the `as`
    attribute since the string is passed as a *name* for the variable and should not be
    parsed by Fluid. An `as="{blog}"` would be parsed as if you would have liked
    to make the name of the variable configurable. Rule of thumb: Curly brackets in
    `each`, none in `as`.

Objects cannot be rendered by Fluid directly if they do not have a
:php:`__toString()` method. The single properties of an object can be accessed
with point-notation.
If a string like `{blog.title}` appears, Fluid tries to parse it. Fluid
expects the variable `blog` to be an object. Inside of this object it searches
for a method named :php:`getTitle()`. The method's name is
created by extracting the part after the point, capitalizing the first letter,
and prefixing it with "get". With this convention, the call looks something like this:
:php:`$blog->getTitle()`. The return value will replace `{blog.title}` in the
template. In the same way, `{blog.description}` will be replaced with the
description.
Parsing this point goes recursively. That means Fluid can parse a string
`{blog.administrator.name}` by calling a method that equals
:php:`$blog->getAdministrator()->getName()`.

.. note::

    The return value is "tidied up" by :php:`htmlspecialchars()`. That protects from
    cross-site scripting (XSS) attacks.

As soon as Fluid is done with the whole template, the result is added to the
`Response` object. This is done in the
:php:`\TYPO3\CMS\Extbase\Mvc\Controller\ActionController` by the call
:php:`$body->write($this->view->render())`.

.. todo: Again, let's mention that the user has to do that.

This journey slowly comes to an end. The *request* has been fully answered by a
corresponding action. The `Response` object carries the completely generated
HTML content.
