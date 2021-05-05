.. include:: /Includes.rst.txt
.. index::
   BlogController; newAction()
   BlogController; createAction()

============================================
Alternative redirection: creating a new post
============================================

After the first journey through the blog example, 
here follows a more complex example. It is about the
creation of a new post. The user js offered a form in the front
end, where he can insert the title and the content of a new post
and select an existing author for this post.
After clicking the *submit* button, the list of the last posts of the
current blog are displayed - now with the just created post in
the first place. The steps of this example are mirrored in the actions ``new`` and
``create``. The method ``newAction()`` displays the form, while the
method ``createAction()`` creates the post after the submission of the form. It puts the
submitted data into the repository, and redirects to the method ``indexAction()``.

Calling the method ``newAction()`` is done with a link in the
front end, that looks - a bit challenging - like this:

::

   <a href="/index.php?id=29&tx_blogexample_pi1[action]=new&tx_blogexample_pi1[blog]=12&tx_blogexample_pi1[controller]=Post">Create a new Post</a>

This is created with the following Fluid code in the template
*EXT:blog_example/Resources/Private/Templates/Post/Index.html*:

.. index:: Fluid; f:link.action

::

   <f:link.action action="new" class="icon new" arguments="{blog: blog}" title="{f:translate(key: 'post.createAnother')}">
         <f:translate key="post.createAnother">[create another post]</f:translate>
   </f:link.action>

.. todo: Either remove the class attribute here or add it above. There are people (like me) that
         are confused by code examples where things are not 100% correct. Same for the title attribute.
         franzholz: I do not understand this comment. I consider the class as useful for some cases. Can we remove the comment?

The tag ``<f:link.action>`` creates a link to a special controller action
combination: ``tx_blogexample_pi1[controller]=Post`` and
``tx_blogexample_pi1[action]=new``. The current blog is given as an argument
with ``tx_blogexample_pi1[blog]=12``. Because the blog cannot be sent as an object,
it must be converted into a unique identifier - the *UID*. In our case, this is
the UID 12. Extbase creates the request out of these three parameters and redirections
to the according ``PostController``. The conversion of the UID back to the
corresponding ``blog`` object is done automatically by Extbase.

Lets take a look at the called method ``newAction()``:

::

   <?php
   declare(strict_types = 1);

   namespace FriendsOfTYPO3\BlogExample\Controller;

   use FriendsOfTYPO3\BlogExample\Domain\Model\Blog;
   use FriendsOfTYPO3\BlogExample\Domain\Model\Comment;
   use FriendsOfTYPO3\BlogExample\Domain\Model\Post;
   use FriendsOfTYPO3\BlogExample\Domain\Repository\PersonRepository;
   use FriendsOfTYPO3\BlogExample\Domain\Repository\PostRepository;
   use TYPO3\CMS\Core\Messaging\FlashMessage;
   use TYPO3\CMS\Extbase\Annotation\IgnoreValidation;

   class PostController extends \FriendsOfTYPO3\BlogExample\Controller\AbstractController
   {
      /**
      * Displays a form for creating a new post
      *
      * @param Blog $blog The blog the post belogs to
      * @param Post $newPost A fresh post object taken as a basis for the rendering
      * @return void
      * @TYPO3\CMS\Extbase\Annotation\IgnoreValidation $newPost
      */
      public function newAction(Blog $blog, Post $newPost = null)
      {
         $this->view->assign('authors', $this->personRepository->findAll());
         $this->view->assign('blog', $blog);
         $this->view->assign('newPost', $newPost);
         $this->view->assign('remainingPosts', $this->postRepository->findByBlog($blog));
      }
   }

The method ``newAction()`` expects a ``blog`` object and an optional ``post``
object as parameter. This can sound weird at first, because in the beginning there is no blog and no
post object. They have to be created after submission of the form. Actually the parameter
``$newPost`` is empty (``null``) at the first call.

.. index::
   Blog Example; PostController
   Extbase; PropertyMapper

The ``PostController``, which is derived from ``\FriendsOfTYPO3\BlogExample\Controller\AbstractController``
and its parents ``\TYPO3\CMS\Extbase\Mvc\Controller\ActionController`` and ``\TYPO3\CMS\Extbase\Mvc\Controller\AbstractController``, 
prepares all parameters, before an action method is called. The controller delegates this to an
instance of the class :php:`\TYPO3\CMS\Extbase\Property\PropertyMapper`, that has mainly two functions: it
converts the parameter from the call (initiated from our link) into the target object and
it checks, if the parameter is valid. The target for the parameter ``$blog`` is an instance of the
class :php:`\FriendsOfTYPO3\BlogExample\Domain\Model\Blog`, for the parameter
``$newPost`` it is an instance of the class
:php:`\FriendsOfTYPO3\BlogExample\Domain\Model\Post`. 
A source parameter with value 12 for the :php:`convert` method of the PropertyMapper will make a conversion into the blog object for record with :php:`$blog->uid == 12`.

How does Extbase know what the target type of the conversion has to be? It takes this
information from the type hint of the argument :php:`$targetType` passed to the :php:`convert` method. 
If there is nothing else declared, it takes this destination type from the PHP comment above the method :php:`createAction`                                          as the target type:

.. index:: Action; Parameters

::

   * @param Blog $blog The blog the post belongs to

.. todo: This needs to be checked. Might be that this fallback is dropped already.
         If not, it should be with 13, forcing people to use native type hints.

The link is created with the name of the argument ``$blog``.
In this way, the link between the request parameter and
the ``newAction()`` is resolved.
The link parameter::

   tx_blogexample_pi1[blog]=12

is assigned to the parameter::

   \FriendsOfTYPO3\BlogExample\Domain\Model\Blog $blog

of the ``newAction()`` with the name "blog". With the help of the UID 12 the
corresponding blog object can be identified, reconstructed, and given to the
``newAction()``.

In the first line of the ``newAction()`` the view gets an array of persons in
the parameter ``authors`` which is taken from the ``PersonRepository`` with the
``findAll()`` method. In the second and third line, the view gets the parameter
``blog`` and ``newPost``. The following actions are called automatically by the
controller after calling ``newAction()``.

::

   $form = $this->view()->render();
   return $form;

.. todo: return $this->htmlResponse($this->view->render());

Here you will see the shortened template *new.html*:

::

   <f:form action="{action}" controller="Post" arguments="{blog: blog}" objectName="{objectName}" object="{object}" method="post">
      <dl>
         <dt>
            <label for="tx-blogexample-author"><f:translate key="property.author">[author]</f:translate>:</label>
         </dt>
         <dd>
            <f:form.select property="author" id="tx-blogexample-author" options="{authors}" optionLabelField="fullName"></f:form.select>
         </dd>
         <dt>
            <label for="tx-blogexample-title"><f:translate key="property.title">[title]</f:translate>:</label>
         </dt>
         <dd>
            <f:form.textfield property="title" id="tx-blogexample-title"><input type="text" id="tx-blogexample-title" /></f:form.textfield>
         </dd>
         <dd>
            <f:form.submit class="button" value="{f:translate(key: 'submit', default: '[submit]')}"><input class="button" type="submit" name="" value="Submit" /></f:form.submit>
         </dd>
      </dl>
   </f:form>

.. todo: There is a regular button inside the <f:form.submit>, looks wrong.

.. index:: Fluid; f:form

Fluid offers some comfortable tags for creating forms which names are all starting
with ``form``. The whole form is enclosed in ``<f:form></f:form>``. Like creating
a link, the controller action combination, which should be called when clicking the
submit button, is given here.

.. note::

   Don't be confused by the parameter ``method="post"``. This is the transfer method
   of the form and has nothing to do with our domain (instead of ``method="post"``
   it also could be ``method="get"``).
   .. todo: I would either drop this explanation or simply refer to an official HTML
      documentation to make things really clear.

The form is bound with ``object="{newPost}"`` to the object assigned to
the variable ``newPost`` in the controller. The specific form fields have a property
``property="..."```. With this, a form field can be filled with the content of the
given object's property. Because ``{newPost}`` is empty (= ``null``) here, the
form fields are empty at first.

.. index:: Fluid; f:form.select

The ``select`` tag is created by the Fluid tag ``<f:form.select>``.
The available options are taken by Fluid from the content
of the given property ``options="{authors}"``. In our case it is an array with all
persons of the ``PersonRepository``. The visible text of the options are created by
Fluid from the parameter ``optionLabelField="fullName"``. The created HTML code of
the form looks like this:

::

   <form method="post" action="/?tx_blogexample_pi1%5Baction%5D=create&amp;tx_blogexample_pi1%5Bblog%5D=12&amp;tx_blogexample_pi1%5Bcontroller%5D=Post&amp;cHash=4218364112cecc7a3cc9de3428c36c46">
       <dl>
         <dt><label for="tx-blogexample-author">author:</label></dt>
         <dd>
               <select id="tx-blogexample-author" name="tx_blogexample_pi1[newPost][author]">
                     <option value="9">Stephen Smith</option>
                     <option value="10">Stephen Smith</option>
                     <option value="11">Stephen Smith</option>
                     <option value="12">Stephen Smith</option>
               </select>
         </dd>
         <dt><label for="tx-blogexample-title">title:</label></dt>
         <dd><input id="tx-blogexample-title" type="text" name="tx_blogexample_pi1[newPost][title]"></dd>
         <dt><label for="tx-blogexample-content">content:</label></dt>
         <dd><textarea rows="8" cols="46" id="tx-blogexample-content" name="tx_blogexample_pi1[newPost][content]"></textarea></dd>
         <dt><label for="tx-blogexample-relatedposts">related posts:</label></dt>

         <dd><input class="button" type="submit" value="submit"></dd>
      </dl>
   </form>

TYPO3 takes the rendered form and includes it at the appropriate place in the HTML page
(see figure 3-5).

.. figure:: /Images/3-BlogExample/figure-3-5.png
   :align: center

   Figure 3-5: The rendered form

Clicking the *submit* button calls the ``createAction`` of the ``PostController``.
Here you will see the stripped-down method:

.. todo: This sounds like magic again. We should use the same wording as in a regular
         HTML context. The submit button submits the form. It sends the form data to
         the given form action. Given the query params, the then called plugin on the
         same page dispatches the request to the desired controller and action. This
         is important because many people ask for Extbase magic when they only need to
         understand HTTP.

::

    /**
     * Creates a new post
     *
     * @param Blog $blog The blog the post belogns to
     * @param Post $newBlog A fresh Blog object which has not yet been added to the repository
     * @return void
     */
    public function createAction(Blog $blog, Post $newPost)
    {
        // TODO access protection
        $blog->addPost($newPost);
        $newPost->setBlog($blog);
        $this->addFlashMessage('created');
        $this->redirect('index', null, null, ['blog' => $blog]);
    }


The arguments ``$blog`` and ``$post`` are filled and validated equivalent to the
method ``newAction()``.

.. note::

   During the conversion of the arguments into the target
   object's property values, the above-mentioned ``PropertyManager`` checks if any errors are encountered
   during the validation. The validation effected on the base of the property
   definitions of the target object. More about the subject validating you will find
   in the section :ref:`validating-domain-objects`.

The post is added to the blog with ``$blog->addPost($newPost)``. After that, the
following processing is forwarded by ``$this->redirect([...])`` to the method
``indexAction()``. Thereby the blog - now with the new post - is passed as
argument. So that the new post is available in the blog when next called, it
must be persisted. This is done automatically after the flow through the extension
in the dispatcher of Extbase.

..index::
   Action; redirect
   Extbase; ForwardResponse

.. note::

   What's :php:`redirect()`? With Extbase, requests can be further dispatched either
   by returning a `ForwardResponse` or by using :php:`redirect()`.
   The difference is: ``redirect()`` starts a completely new page call
   (new request-response cycle), while a :php:`ForwardResponse` is handled as part of the
   current request cycle. This has an important consequence: When using ``redirect()`` the
   changes are persisted before the call of the target action, whereas when returning a
   :php:`ForwardResponse` changes need to be persisted manually by calling
   :php:`$persistenceManager->persistAll();`.
