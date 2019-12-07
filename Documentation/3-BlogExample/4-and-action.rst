.. include:: ../Includes.txt

And... action!
==============

Our journey through the blog example is not only an educational journey, but
also an active one. We now turn to the activities. We are already in
the :php:`BlogController`. You can find the class file at
:file:`EXT:blog_example/Classes/BlogController.php`.

In software development, there are different variants of controllers.
In Extbase the controllers mostly exist as
:php:`ActionController`. This variant is characterized by
short methods, which are responsible for the control of a single action, the
so called `Actions`. Let's have a deeper look at a
shortened version of the :php:`BlogController`:

.. code-block:: php
   :caption: Classes/BlogController.php
   :name: blogcontroller-php

    <?php

    namespace FriendsOfTYPO3\BlogExample\Controller;
    use FriendsOfTYPO3\BlogExample\Domain\Model\Blog;

    class BlogController
          extends \TYPO3\CMS\Extbase\Mvc\Controller\ActionController {

        public function indexAction(): void
        {
            $this->view->assign('blogs', $this->blogRepository->findAll());
        }

        public function newAction(Blog $newBlog = null): void
        {
            $this->view->assign('newBlog', $newBlog);
            $this->view->assign('administrators', $this->administratorRepository->findAll());
        }

        public function createAction(Blog $newBlog): void
        {
            $this->blogRepository->add($newBlog);
            $this->redirect('index');
        }

        public function editAction(Blog $blog): void
        {
            $this->view->assign('blog', $blog);
            $this->view->assign('administrators', $this->administratorRepository->findAll());
        }

        public function updateAction(Blog $blog): void
        {
            $this->blogRepository->update($blog);
            // this does currently not work, use $this->blogRepository->add($blog); instead
            // see issue: https://forge.typo3.org/issues/76876
            $this->redirect('index');
        }

        public function deleteAction(Blog $blog): void
        {
            $this->blogRepository->remove($blog);
            $this->redirect('index');
        }

    }

The method `indexAction()` within the
:php:`BlogController` is responsible for showing a list of
blogs. We also could have called it
`showMeTheListAction()`. The only important point is,
that it ends with `Action` in order to help Extbase
to recognize it as an action. `newAction()` shows a
form to create a new blog. The `createAction()` then
creates a new blog with the data of the form. The pair
`editAction()` and
`updateAction()` have a similar functionality for the
change of an existing blog. The job of the
`deleteAction()` should be self explaining.

.. tip::

    Those who already worked with the model view controller pattern will
    notice, that the controller has only a little amount of code. Extbase
    aims for the `slim controller` approach . The controller is
    exclusively responsible for the control of the process flow. Additional
    logic (especially business or domain logic) needs to be separated into
    classes in the subfolder :file:`Domain`.

The request determines which controller action combination will be called.
The dispatching and matching of actions happens in the `Dispatcher` and in
:php:`\TYPO3\CMS\Extbase\Mvc\Controller\ActionController`. The BlogController
inherits all methods from it, by deriving it from this class.

::

   <?php
   declare(strict_types = 1);

   namespace FriendsOfTYPO3\BlogExample\Controller;

   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

   class BlogController extends ActionController
   {
       // ...
   }

If no specific action information is given, the default action will
be called; in our case the `indexAction()`. The `indexAction()` contains 
only one line in our example (as shown above), 
which looks like this:

::

   <?php
   declare(strict_types = 1);

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

       public function indexAction()
       {
           $allAvailableBlogs = $this->blogRepository->findAll();
           $this->view->assign('blogs', $allAvailableBlogs);
       }
   }

In the first line of the :php:`indexAction` the repository is asked to fetch
all available blogs. In the second line those blogs are assigned to the view
to be displayed. So the repository is responsible for fetching the data,
the view is responsible for displaying it and the controller connects and
"controls" these parts.
