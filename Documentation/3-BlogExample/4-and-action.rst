.. include:: /Includes.rst.txt
.. index::
   Extbase; Action
   Extbase; ActionController
   \TYPO3\CMS\Extbase; Mvc\Controller\ActionController
   \FriendsOfTYPO3\BlogExample; Controller\BlogController

==============
And... action!
==============

The journey through the blog example is not only an educational journey but
also an active one. This topic is about activities. The class file
of the :php:`BlogController` is at
:file:`EXT:blog_example/Classes/BlogController.php`.

In software development, there are different variants of controllers.
In Extbase, the controllers mostly exist as
:php:`ActionController`. This variant is characterized by
short methods, which are responsible for the control of a single action, the
so called `Actions`. Let's have a deeper look at a
shortened version of the :php:`BlogController`. Please note that for brevity
the doc comments and some methods have been removed. Find the full example at
:file:`EXT:blog_example/Classes/BlogController.php`:

.. todo: mostly -> only (referring to 'the controllers mostly exist as'),
   will change in the future when ActionController will be optional or replaced by traits. Also Middlewares will have controllers.

.. code-block:: php
   :caption: Classes/BlogController.php
   :name: blogcontroller-php

   <?php
   declare(strict_types=1);

   namespace FriendsOfTYPO3\BlogExample\Controller;

   use FriendsOfTYPO3\BlogExample\Domain\Model\Blog;
   use Psr\Http\Message\ResponseInterface;
   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

   class BlogController extends ActionController {
      protected $blogRepository;

      public function __construct(BlogRepository $blogRepository)
      {
         $this->blogRepository = $blogRepository;
      }

      public function indexAction(): ResponseInterface
      {
         $this->view->assign('blogs', $this->blogRepository->findAll());

         return $this->responseFactory->createHtmlResponse($this->view->render());
      }

      public function newAction(Blog $newBlog = null): ResponseInterface
      {
         $this->view->assignMultiple([
            'newBlog' => $newBlog,
            'administrators' => $this->administratorRepository->findAll(),
         });

         return $this->responseFactory->createHtmlResponse($this->view->render());
      }

      public function createAction(Blog $newBlog): ResponseInterface
      {
         $this->blogRepository->add($newBlog);
         return $this->redirect('index');
      }

      public function editAction(Blog $blog): ResponseInterface
      {
         $this->view->assignMultiple([
            'blog' => $blog,
            'administrators' => $this->administratorRepository->findAll()
         ]);

         return $this->responseFactory->createHtmlResponse($this->view->render());
      }

      public function updateAction(Blog $blog): ResponseInterface
      {
         $this->blogRepository->update($blog);
         return $this->redirect('index');
      }

      public function deleteAction(Blog $blog): ResponseInterface
      {
         $this->blogRepository->remove($blog);
         return $this->redirect('index');
      }
   }

.. index::
   BlogController; indexAction
   BlogController; newAction
   BlogController; createAction
   BlogController; editAction
   BlogController; updateAction
   BlogController; deleteAction
   BlogController; showTheListAction

The method `indexAction()` within the
:php:`BlogController` is responsible for showing a list of
blogs. The `indexAction` has to return an implementation
of the :php:`\Psr\Http\Message\ResponseInterface`.

`newAction()` shows a form to create a new blog. The
`createAction()` then creates a new blog with the data of the form.

The `editAction()` and `updateAction()` have similar functionality for the
change of an existing blog.

The job of the `deleteAction()` should be self explaining.

The function names can be chosen freely but have to end on "Action".
This helps Extbase to recognize them as an action. For example  `indexAction()`
could also be called  `showTheListAction()`.

.. index:: Extbase; Slim controller

.. tip::

   Those who already worked with the model view controller pattern will
   notice, that the controller has only a little amount of code. Extbase
   aims for the `slim controller` approach . The controller is
   exclusively responsible for the control of the process flow. Additional
   logic (especially business or domain logic) needs to be separated into
   classes in the subfolder :file:`Domain`.
   
   .. todo: We should also mention Services and Middlewares here. The domain only holds the
            business logic, not all the application logic.

The request determines which controller action combination will be called.
The dispatching and matching of actions happen in the `RequestBuilder`, in the `Dispatcher` and in
:php:`\TYPO3\CMS\Extbase\Mvc\Controller\ActionController`. The BlogController
inherits all methods from it by deriving it from this class ::

   <?php
   declare(strict_types=1);

   namespace FriendsOfTYPO3\BlogExample\Controller;

   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

   class BlogController extends ActionController
   {
       // ...
   }

.. index:: Action; Default

If no specific action information is given, the default action will
be called; in our case the `indexAction()`. The `indexAction()` contains
only one line in our example (as shown above),
which looks like this:

.. todo: To a first time reader it's not clear what information is meant here.
         We should explicitly mention url params and the plugin configuration
         which defines the default method. First time readers could get the
         impression that the default action always is `indexAction()`.

::

   <?php
   declare(strict_types=1);

   namespace FriendsOfTYPO3\BlogExample\Controller;

   use FriendsOfTYPO3\BlogExample\Domain\Repository\BlogRepository;
   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

   class BlogController extends ActionController
   {
      protected $blogRepository;

      public function __construct(BlogRepository $blogRepository)
      {
         $this->blogRepository = $blogRepository;
      }

      public function indexAction(): ResponseInterface
      {
         $allAvailableBlogs = $this->blogRepository->findAll();
         $this->view->assign('blogs', $allAvailableBlogs);

         return $this->responseFactory->createHtmlResponse($this->view->render());
      }
   }

In the first line of the :php:`indexAction` the repository is asked to fetch
all available blogs. In the second line those blogs are assigned to the view
to be displayed. The last line returns a :php:`Response` object with the
HTML code from the view. So the repository is responsible for fetching the data,
the view is responsible for displaying it and the controller connects and
"controls" these parts.
