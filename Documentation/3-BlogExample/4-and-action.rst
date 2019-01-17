.. include:: ../Includes.txt

And... action!
==============

Our journey through the blog example is not only an educational, but
also an activity holiday. We now turn to the activities. We are already in
the :php:`BlogController`. You can find the class file under
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

    namespace MyVendor\BlogExample\Controller;

    class BlogController
          extends \TYPO3\CMS\Extbase\Mvc\Controller\ActionController {

        public function indexAction() {
            $this->view->assign('blogs', $this->blogRepository->findAll());
        }

        public function newAction(\MyVendor\BlogExample\Domain\Model\Blog $newBlog = null) {
            $this->view->assign('newBlog', $newBlog);
            $this->view->assign('administrators', $this->administratorRepository->findAll());
        }

        public function createAction(\MyVendor\BlogExample\Domain\Model\Blog $newBlog) {
            $this->blogRepository->add($newBlog);
            $this->redirect('index');
        }

        public function editAction(\MyVendor\BlogExample\Domain\Model\Blog $blog) {
            $this->view->assign('blog', $blog);
            $this->view->assign('administrators', $this->administratorRepository->findAll());
        }

        public function updateAction(\MyVendor\BlogExample\Domain\Model\Blog $blog) {
            $this->blogRepository->update($blog);
            // this does currently not work, use $this->blogRepository->add($blog); instead
            // see issue: https://forge.typo3.org/issues/76876
            $this->redirect('index');
        }

        public function deleteAction(\MyVendor\BlogExample\Domain\Model\Blog $blog) {
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

    Who already dealt with the model-view-controller-pattern will
    notice, that the controller has only a little amount of code. Extbase (and
    FLOW3) aim to the approach to have a slim controller. The controller is
    exclusively responsible for the control of the process flow. Additional
    logic (especially business or domain logic) needs to be separated into
    classes in the subfolder :file:`Domain`.

.. tip::

    The name of the action is strictly spoken only the part without the
    suffix `Action`, e.g.
    `list`, `show` or
    `edit`. With the suffix
    `Action` the name of the action-method is marked.
    But we use the action itself and its method mostly synonymous.

From the request the controller can extract which action has to be
called. The call is happening without the need to write another line of code
in the BlogController. This does
:php:`\TYPO3\CMS\Extbase\Mvc\Controller\ActionController`. The BlogController
"inherits" all methods from it, by deriving it form this class::

    namespace MyVendor\BlogExample\Controller;

    use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

    class BlogController extends ActionController
    {
        // ...
    }

At first call of the plugin without additional information the request
will get a standard action; in our case the
`indexAction()`. The
`indexAction()` contains only one line in our example
(as shown above), which looks more detailed like this::

    public function indexAction()
    {
        $blogRepository = GeneralUtility::makeInstance(\MyVendor\BlogExample\Domain\Repository\BlogRepository::class);
        $allAvailableBlogs = $blogRepository->findAll();
        $this->view->assign('blogs', $allAvailableBlogs);
        $content = $this->view->render();
        return $content;
    }

In the first line a repository is instantiated, which "contains" all
blogs. How they are saved and managed, is not of interest at this point of
our journey. All files, which are defined in the repository-classes, are
located in the folder
:file:`EXT:blog_example/Classes/Domain/Repository/`. This you
can also derive directly from the Name
:php:`\MyVendor\BlogExample\Domain\Repository\BlogRepository`. This
naming scheme is a big advantage by the way, if you search a particular
class file. The name :php:`BlogRepository` results from the
name of the class, whose instances are managed by the repository, namely by
adding :php:`Repository`. A repository can only manage one
single class at a time. The second line retrieves all available blogs by
`findAll()`.

