.. include:: ../Includes.txt

Alternative route: creating a new posting
=========================================

After out first journey through the blog example, in this chapter we will follow a
more complex example. As an example we have chosen the creation of a new post. The
user should be offered a form in the front end, in which he could put in the title
and the content of a new post entry and select an existing author for this post.
After clicking the *submit* button, the list of the last posts of the current blog
should be displayed - now with the just created post at the first place. There are
multiple steps, each based on the previous step, to be implemented that are
mirrored in the actions ``new`` and ``create``. The method
``newAction()`` displays the form, while the method ``createAction()``
really creates the post, puts it in the repository and routes the process to the
method ``indexAction()``.

Calling the method ``newAction()`` is done in our case with a link in the
front end, that looks - a bit purged - like this:

::

   <a href="index.php?id=99&tx_blogexample_pi1[blog]=6&tx_blogexample_pi1[action]=new&tx_blogexample_pi1[controller]=post">Create a new Post</a>

This was created with the following Fluid code in the template
*EXT:blog_example/Resources/Private/Templates/Post/Index.html*:

::

   <f:link.action action="new" controller="Post" argument="{blog : blog}">Create a new Post</f:link.action>

The tag ``<f:link.action>`` creates a link to a special controller action
combination: ``tx_blogexample_pi1[controller]=post`` and
``tx_blogexample_pi1[action]=new``. Also the current blog is given as an argument
with ``tx_blogexample_pi1[blog]=6``. Because the blog cannot be sent as an object,
it must be translated into an unique identifier - the *UID*. In our case this is
the UID 6. Extbase creates out of these three information the request and routes
it to the according ``PostController``. The translation of the UID back to the
corresponding ``blog`` object is done automatically by Extbase.

Lets take a look at the called method ``newAction()``:

::

   <?php
   declare(strict_types = 1);

   namespace MyVendor\BlogExample\Controller;

   use TYPO3\CMS\Extbase\Annotation as Extbase;
   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

   class BlogController extends ActionController
   {
       /**
        * Displays a form for creating a new post
        *
        * @param \MyVendor\BlogExample\Domain\Model\Blog $blog The blog the post belongs to
        * @param \MyVendor\BlogExample\Domain\Model\Post $newPost An invalid new post object passed by a rejected createAction()
        * @return string An HTML form for creating a new post
        * @Extbase\IgnoreValidation("newPost")
        */
       public function newAction(\MyVendor\BlogExample\Domain\Model\Blog $blog, \MyVendor\BlogExample\Domain\Model\Post $newPost = NULL)
       {
          $this->view->assign('authors', $this->authorRepository->findAll();
          $this->view->assign('blog', $blog);
          $this->view->assign('newPost', $newPost);
       }
   }

The method ``newAction()`` expected a ``blog`` object and an optional ``post``
object as parameter. It should be weird at first, because we have no blog and no
post object, that has to be created with the form. Actually the parameter
``$newPost`` is empty (``NULL``) at the first call.

Our ``PostController``, that is derived from ``ActionController``, prepares all
parameters before an action is called. The controller delegates this  to an
instance of the class :php:`PropertyManager`, that has mainly two functions: it
converts the parameter from the call (from our link) into the target object and
checks if it is valid. The target for the parameter ``$blog`` is an instance of the
class :php:`\MyVendor\BlogExample\Domain\Model\Blog`, for the parameter ``$newPost`` it
is an instance of the class :php:`\MyVendor\BlogExample\Domain\Model\Post`.

How does Extbase know what the target of the conversion is? It takes this
information from the information above the argument. If there is nothing declared
it takes the destination type from the PHP documentation above the method, from
the line:

::

   * @param \MyVendor\BlogExample\Domain\Model\Blog $blog The blog the post belongs to

The link is created with the name of the argument ``$blog``.
In this way the link between the request parameter and the ``newAction()`` is resolved.
The link parameter::

   tx_blogexample_pi1[blog]=6

is assigned to the parameter::

   \MyVendor\BlogExample\Domain\Model\Blog $blog

of the ``newAction()`` with the name "blog". With the help of the UID 6 the
corresponding blog object can be identified, reconstructed and given to the
``newAction()``.

In the first line of the ``newAction()`` the view gets an array of persons in
the parameter ``authors`` which is taken from the ``AuthorRepository`` with the
``findAll()`` method. In the second and third line the view gets the parameter
``blog`` and ``newPost``. The following actions are called automatically by the
controller after calling ``newAction()``.

::

   $form = $this->view()->render();
   return $form;

Here you will see the shortened template *new.html*:

::

   <f:form method="post" controller="Post" action="create" name="newPost" object="{newPost}" arguments="{blog: blog}">
      <label for="author">Author (required)</label><br />
      <f:form.select property="author" options="{authors}" optionLabelField="fullName">
         <select><option>dummy</option></select>
      </f:form.select><br />
      <label for="title">Title (required)</label><br />
      <f:form.textbox property="title" /><br />
      <label for="content">Content (required)</label><br />
      <f.form.textarea property="content" rows="8" cols="46" /><br />
      <f:form.submit class="submit" value="Submit" />
   </f:form>

Fluid offers some comfortable tags for creating forms which names are all starting
with ``form``. The whole form is enclosed in ``<f:form></f:form>``. Like the creating
of a link the controller action combination which should be called when clicking the
submit button is given here.

.. note::

   Don't be confused by the parameter ``method="post"``. This is the transfer method
   of the form and has nothing to do with our domain (instead of ``method="post"``
   it also could be ``method="get"``).

The form is bind with ``object="{newPost}"`` to the object that we have assigned to
the variable ``newPost`` in the controller. The specific form fields have a property
``property="..."```. With this a form field can be filled with the content of the
property of the given object. Because ``{newPost}`` is empty (= ``NULL``) here, the
form fields are empty at first.

The ``select`` tag is created by the Fluid tag ``<f:form.select>``. Thereby it is
keep in mind that the HTML code ``<select><option>dummy</option></select>`` will be
completely replaced with the code generated by Fluid. This allows the preview of the
template with blind text. The available options are taken by Fluid from the content
of the given property ``options="{authors}"``. In our case it is an array with all
persons of the ``AuthorRepository``. The visible text of the options are created by
Fluid from the parameter ``optionLabelField="fullName"``. The created HTML code of
the form looks like this:

::

   <form method="post" name="newPost" action="index.php?id=99&tx_blogexample_pi1[blog]=2&tx_blogexample_pi1[action]=create&tx_blogexample_pi1[controller]=Post">
      <label for="author">Author (required)</label><br />
      <select name="tx_blogexample_pi1[newPost][author]">
         <option value="1">Stephen Smith</option>
         <option value="2">John Doe</option>
      </select><br />
      <label for="title">Title (required)</label><br />
      <input type="text" name="tx_blogexample_pi1[newPost][title]" value="" /><br />
      <label for="content">Content (required)</label><br />
      <textarea rows="8" cols="46" name="tx_blogexample_pi1[newPost][content]"></textarea><br />
      <input class="submit" type="submit" value="Submit" />
   </form>

TYPO3 takes the rendered form and includes it at the appropriate place in the HTML page
(see figure 3-5).

.. figure:: /Images/3-BlogExample/figure-3-5.png
   :align: center

   Figure 3-5: The rendered form

Clicking the *submit* button calls the ``createAction`` of the ``PostController``.
Here you will see the stripped-down method:

::

   /**
    * Creates a new post
    *
    * @param \MyVendor\BlogExample\Domain\Model\Blog $blog The blog the post belongs to
    * @param \MyVendor\BlogExample\Domain\Model\Post $newPost A fresh Post object which has not yet been persisted
    * @return void
    */
   public function createAction(\MyVendor\BlogExample\Domain\Model\Blog $blog,
        \MyVendor\BlogExample\Domain\Model\Post $newPost) {
      $blog->addPost($newPost);
      $this->redirect('index', NULL, NULL, ['blog' => $blog]);
   }

The arguments ``$blog`` and ``$post`` are filled and validated equivalent to the
method ``newAction()``.

.. note::

   During the conversion of the arguments into the property values of the target
   object, the above-mentioned ``PropertyManager`` checks if any errors encountered
   during the validation. The validation effected on the base of the property
   definitions of the target object. More about the subject validating you will find
   in the section "Validating domain objects" in chapter 9.

The post is added to the blog with ``$blog->addPost($newPost)``. After that the
following processing is forwarded by ``$this->redirect([...])`` to the method
``indexAction()``. Thereby the blog - now with the new post - is passed as
argument. In order that the new post is available in the blog when next called, it
must be persisted. This is done automatically after the flow through the extension
in the dispatcher of Extbase.

.. note::

   Beneath the method ``redirect()`` Extbase knows the method ``forward()``.
   This also forwards the further processing. But the difference is that
   ``redirect()`` starts a complete new page call (new request response cycle),
   while ``forward()`` resides in the processing of the current page call. The
   outcome of this is an important consequence: At ``redirect()`` the changes are
   persisted before the call of the target action, whereas at ``forward()`` these
   must be done by hand with the call of
   :php:`$this->objectManager->get(TYPO3\CMS\Extbase\Persistence\Generic\PersistenceManager::class)->persistAll();`.
