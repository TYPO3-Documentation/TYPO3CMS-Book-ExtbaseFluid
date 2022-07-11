.. include:: /Includes.rst.txt
.. index:: Validators
.. _validating-domain-objects:

=========================
Validating domain objects
=========================

After the first introduction to Extbase and Fluid in some detail
there has been very little time for discussing the domain and
how to go about ensuring its consistency.
People often assume that domain objects are consistent and adhere to some rules at all times.
Unfortunately, this is not achieved automatically. So it is important to define these
rules explicitly. In the blog example the following
rules can be created:

*  The fields ``username`` and ``password`` of the
   user object must have at least five characters. Furthermore, the ``username``
   must not contain special characters.
*  The field ``email`` of the user object must contain a valid email address.

These rules must apply at all times for the user object. A user object is only valid if
it complies with these validation rules.
These rules are called *invariants*, because they must be
valid during the entire lifetime of the object.

At the beginning of your project, it is important to consider which invariants your domain
objects will consist of. Extbase provides *validator* PHP classes for
checking of the invariants.

The following example shows this. The framework gives the user the ability to
correct an error, when it occurs.


Validators for checking of invariants
=====================================

A validator is a PHP class that has to check a certain invariant. All
validators that are used in Extbase extensions have to implement the interface
:php:`ValidatorInterface`. In most use cases it is recommended to extend the
:php:`TYPO3\CMS\Extbase\Validation\Validator\AbstractValidator`, overriding
the abstract method :php:`isValid()`.

The method :php:`isValid()` does not return a value but adds an error to the
:php:`TYPO3\CMS\Extbase\Error\Result` in case the validation fails.

There are 2 types of validation checks:

#.  A loose check is making only a relaxed check over a very large range of possible values.
#.  A tight check requires the exact fitting of the value.

If you want to implement a loose form value validation,
then validator options might come in handy. Extbase ships with a :php:`StringLength`
validator, which offers the options `minimum` and `maximum`, that
let you define the string length the validator should use to check against the incoming
value.

For example, a validator that checks whether the passed string is
a valid email address, looks like this:

.. code-block:: php
   :caption: EXT:my_extension/Classes/Domain/Validator/MyValidator.php

   use TYPO3\CMS\Extbase\Validation\Validator\AbstractValidator;

   final class MyValidator extends AbstractValidator
   {

       public function isValid(mixed $value): void
       {
           if (!is_string($value) || !$this->validEmail($value)) {
               $this->addError(
                   $this->translateErrorMessage(
                       'validator.emailaddress.notvalid',
                       'extbase'
                   ), 1221559976);
           }
       }

       private function validEmail($emailAddress)
       {
           return \TYPO3\CMS\Core\Utility\GeneralUtility::validEmail($emailAddress);
       }
   }

If ``$value`` is neither a string nor a valid email address, the validator
adds an error by calling `$this->addError()`.

.. tip::

    The method ``addError()`` expects an error message and an
    error code. The latter should be unique; therefore, we recommend using
    the UNIX timestamp of the source code's creation time. With the
    help of the error code, the error can be definitely identified, for
    example, in bug reports.

By default, Extbase will not call a validator if the value to validate is
empty. This is configured through the property ``$acceptsEmptyValues``, which is
set to ``true`` by default.

In the package
:php:`\TYPO3\CMS\Extbase\Validation\Validator\*` Extbase offers
many validators for default requirements like the validation of emails,
numbers and strings.


.. index:: Validators; When validated

When does validation take place?
================================

Domain objects in Extbase are validated only at one point in time:
When they get inserted into a controller action. Figure
9-1 shows what happens before the action is called.

.. figure::  /Images/Graphics/9-CrosscuttingConcerns/figure-9-1.png
    :align: center

    Figure 9-1: Data flow of a request before the action is called

When a user sends a request, Extbase first determines which action
within the controller is responsible for this request. As Extbase knows
the names and types of the action's arguments, it can create objects
from the incoming data. This operation will be described in detail in the
section "Argument mapping" later on. Now the main step is as
follows: The created objects are to be validated. That is, the invariants
must be checked. If all arguments are successfully validated, the
extension's requested action is called, and it can continue processing
the given objects.

.. tip::

    Certainly, it would be helpful if the validation was also done
    during the persisting of the objects to the database. At the moment, it
    is not done, since the data is stored in the database after sending the
    answer back to the browser. Therefore the user could not be informed in
    case of validating errors. In the meantime, a second validating when
    persisting the objects is built into FLOW. So this is expected in
    Extbase in the medium term.

When an error occurs during the validation, then the method
`errorAction()` of the current controller is
called. The default ``errorAction()``, when possible, redirects the user
to the last used form, in order to give them a chance to
correct the entries.

.. tip::

    How the `errorAction()` knows
    which form was the last displayed one? This information is created by
    the ``form`` ViewHelper. It automatically adds the property
    ``__referrer`` to every generated form, which contains
    information about the current extension, controller, model and action
    combination. This data can be used by the
    `errorAction()` to display the erroneous form
    again.


.. index:: Validators; Registration

Registering validators
======================

The last chapter shows how validators are working and when they are called.
However the domain model must be connected with its validators. It must be defined
which part of the model has to be checked by which validator. Therefore
there are three possibilities:

* validating in the domain model with annotations
* validating in the domain model with user defined validator class
* validating of controller arguments


.. index:: Validators; Annotations

Validating in the domain model with annotations
===============================================
In most cases, it is sufficient to validate the properties of a
domain object separately. When all properties are validated with success,
the complete domain object is also successfully validated. When a property
can not be validated, the overall validation of the domain object
fails.

To define how a property of a domain object should be validated,
there is a mark *annotations* inside the source code.
Annotations are machine-readable "annotations" marks in the source code that
are placed in comment blocks and start with the character
``@``.

For the validation, the ``@TYPO3\CMS\Extbase\Annotation\Validate`` annotation is
available. With this it can be specified, which validator has to be used for
checking the annotated property. Take a look at this part
of the domain model ``Post`` inside of the blog example:


.. code-block:: php
   :caption: blog_example/Class/Domain/Model/Post.php

    <?php
    namespace MyVendor\BlogExample\Domain\Model;

    class Post extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
    {
        /**
         * @var string
         * @TYPO3\CMS\Extbase\Annotation\Validate("StringLength", options={"minimum": 3, "maximum": 50})
         */
        protected $title;

        /**
         * @var string
         */
        protected $content;
    }

With the line ``@TYPO3\CMS\Extbase\Annotation\Validate("StringLength", options={"minimum": 3, "maximum": 50})``
the validator for the property ``$title`` is
specified. In parenthesis, the parameters for the validator are also specified.
It is made sure that a title of a blog post is never shorter
than three characters, and that it will never be longer than 50 characters.

Which validator class has to be used? Extbase looks for a validator
class using
``\TYPO3\CMS\Extbase\Validation\Validator\*ValidatorName*Validator``.
Using the above given annotation ``@TYPO3\CMS\Extbase\Annotation\Validate("StringLength")`` the
validator
:php:`\TYPO3\CMS\Extbase\Validation\Validator\StringLengthValidator`
is used.

When you have created your own validator to check the invariants
you can use it in the ``@TYPO3\CMS\Extbase\Annotation\Validate`` annotation using the full
class name.

Example:

.. code-block:: php
   :caption: blog_example/Class/Domain/Model/Post.php

    <?php
    namespace MyVendor\BlogExample\Domain\Model;

    class Post extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
    {
        /**
         * @var string
         * @TYPO3\CMS\Extbase\Annotation\Validate("MyVendor\BlogExample\Domain\Validator\TitleValidator")
         */
        protected $title;

        /**
         * @var string
         */
        protected $content;
    }

Here the property ``$title`` is validated with the
:php:`\MyVendor\BlogExample\Domain\Validator\TitleValidator`.
This validator class can now check any invariants. For example, the
validator shown in the following listing checks whether the title of a
blog post is always built using the convention *Maintopic: Title*:

.. code-block:: php
   :caption: blog_example/Class/Domain/Validator/TitleValidator.php

   <?php

   namespace MyVendor\BlogExample\Domain\Validator;

   use TYPO3\CMS\Extbase\Validation\Validator\AbstractValidator;

   class TitleValidator extends AbstractValidator
   {
      protected function isValid($value)
      {
         // $value is the title string
         if (count(explode(':', $value)) >= 2) {
            return;
         }
         $this->addError('The title was not of the type [Topic]:[Title].', 1221563773);
      }
   }

By this method particular properties of
the domain model are validated. The next section is about complex domain
objects.


.. index:: Validators; Custom validator classes

Domain model with user defined validator class
==============================================

The ability to register validators in the
model is handy when the model's individual properties
need to be validated. However, sometimes it is necessary to validate the
relationship between two or more properties of a model class. For
example, for a user registration, it is reasonable that in the user object,
the properties ``$password`` and ``$passwordConfirmed``
exist and must be identical. Therefore the individual validators
for ``$password`` respectively
``$passwordConfirmation`` can not help because they have no
access to each other. You need an option to validate a domain object
*as a whole*.

For this, you can create your own validator class for every object
in the domain model, which validates the object as a whole and with it
has access to all object properties where possible.

Equipped with this knowledge, a
``UserValidator`` can be implemented, which compares ``$password`` with
``$passwordConfirmation``. At first it must be checked, if the given
object is of the type ``user`` - after all, the validator can be
called with any object and has to add an error in such
case.

.. code-block:: php
   :caption: extbase_example/Class/Domain/Validator/UserValidator.php

    <?php
    namespace MyVendor\ExtbaseExample\Domain\Validator;

    class UserValidator extends \TYPO3\CMS\Extbase\Validation\Validator\AbstractValidator
    {
        protected function isValid($user)
        {
            if (! $user instanceof \MyVendor\ExtbaseExample\Domain\Model\User) {
                $this->addError('The given object is not a User.', 1262341470);
            }
        }
    }

If ``$user`` is not an instance of the user object, an
error message is directly created with ``addError()``. The
validator does not validate the object any further.

.. tip::

    The method ``addError()`` gets two parameters - the
    first is an error message string, while the second is an error number.
    The Extbase developers always use the current UNIX timestamp of the source code's creation time
    when calling ``addError()``. By this, it is secured that any
    validation errors can be uniquely identified.

Now the foundation of the validator is created.
Here comes the proper implementation of it - the check for equality between the
passwords. This is made quickly.

.. code-block:: php
   :caption: extbase_example/Class/Domain/Validator/UserValidator.php

    <?php
    namespace MyVendor\ExtbaseExample\Domain\Validator;

    class UserValidator extends \TYPO3\CMS\Extbase\Validation\Validator\AbstractValidator
    {
        protected function isValid($user)
        {
            if (! $user instanceof \MyVendor\ExtbaseExample\Domain\Model\User) {
                $this->addError('The given object is not a User.', 1262341470);
                return;
            }
            if ($user->getPassword() !== $user->getPasswordConfirmation()) {
                $this->addError('The passwords do not match.', 1262341707);
            }
        }
    }

Because the complete object is accessed, the checking
for equality of ``$password`` and
``$passwordConfirmation`` is very straightforward.

Use the newly created validator by annotating the corresponding controller,
for example:

.. code-block:: php
   :caption: extbase_example/Class/Controller/UserController.php

   <?php
   declare(strict_types=1);

   namespace MyVendor\ExtbaseExample\Controller;

   use MyVendor\ExtbaseExample\Domain\Model\User;
   use Psr\Http\Message\ResponseInterface;
   use TYPO3\CMS\Extbase\Annotation as Extbase;
   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

   class UserController extends ActionController
   {
      /**
       * @Extbase\Validate(param="user", validator="MyVendor\ExtbaseExample\Domain\Validator\UserValidator")
       */
      public function showAction(User $user): ResponseInterface
      {
         // ...
      }
   }

Now there are two possibilities how validators can be
registered for domain objects:

*  directly in the model via ``@TYPO3\CMS\Extbase\Annotation\Validate`` annotation for single properties
*  with an own validator class for complete domain objects.

.. important::

   Up until version 10, Extbase "magically" applied validators based on a naming
   convention. Starting with TYPO3 v10, all validators need to be explicitly registered.


The illustrated validators until now are always executed when a
domain model is given as a parameter to a controller action - that is, for
all actions. Sometimes it is desired to initiate the validation only
when calling special actions. How this can be done, is shown in the
next section.


.. index:: Validators; Controller arguments

Validation of controller arguments
==================================

If you want to validate a domain object only when calling a
special action, you have to define validators for individual arguments.
Therefore a slightly modified form of the ``@TYPO3\CMS\Extbase\Annotation\Validate``
annotation can be used, which is set in the comment block of the
controller action. It has the format ``@TYPO3\CMS\Extbase\Annotation\Validate
*[variablename] [validators]*``, in the example
below it is ``$pageName``:

.. code-block:: php
   :caption: EXT:my_extension/Classes/Domain/Validator/PagenameValidator.php

    /**
     * Creates a new page with a given name.
     *
     * @param string $pageName The name of the page which should be created.
     * @TYPO3\CMS\Extbase\Annotation\Validate("MyVendor\MyExtension\Domain\Validator\PageNameValidator", param="pageName")
     */
    public function createPageAction(string $pageName): ResponseInterface
    {
        // ...
    }

Here the parameter ``$pageName`` is checked with its own
validator.


.. index:: Validators; Interaction

Interaction of validators
-------------------------

For an argument of an action, the following validators are
called:

* All ``@TYPO3\CMS\Extbase\Annotation\Validate`` annotations of the domain model are evaluated.
* Validators defined in the action doc block with ``@TYPO3\CMS\Extbase\Annotation\Validate`` are called.

Let's have a look at the interaction once more with an
example:

.. code-block:: php
   :caption: EXT:my_extension/Classes/Controller/SomeController.php

   // use TYPO3\CMS\Extbase\Annotation\Validate;
   // use MyVendor\ExtbaseExample\Domain\Model\User;
   /**
   * Creates a website user for the given page name.
   *
   * @param string $pageName The name of the page where the user should be created.
   * @param User $user The user which should be created.
   * @Validate(param="pageName", validator="TYPO3\CMS\Extbase\Validation\Validator\StringValidator")
   * @Validate("MyVendor\BlogExample\Domain\Validator\CustomUserValidator", param="user")
   */
   public function createUserAction(string $pageName, User $user): ResponseInterface
   {
     // ...
   }

For ``$user`` all ``@TYPO3\CMS\Extbase\Annotation\Validate`` annotations of the model are validated. Beyond that, the validator
``\MyVendor\BlogExample\Domain\Validator\CustomUserValidator`` is used
to validate ``$user``.

In some use cases, it is reasonable that *incomplete
domain objects* are given as arguments. That can be the case
for multi-page forms because after filling the first page, the domain
object is not complete. In this case you can use the annotation
:php:`@TYPO3\CMS\Extbase\Annotation\IgnoreValidation("parameter")`. This
prevents the processing of the ``@TYPO3\CMS\Extbase\Annotation\Validate`` annotations in the
domain model and calling the validator class of the domain
object.


.. _case_study-edit_an_existing_object:

Case study: Edit an existing object
===================================

As of now, the edit form should be displayed again in case of a
validation error. Two actions are involved in editing the blog: The
``editAction`` shows the form with the blog to be edited and the
``updateAction`` saves the changes.

.. tip::

    If you want to implement edit forms for the domain objects of your
    extension you should implement it according to the schema displayed
    here.

The ``editAction`` for the blog looks like this:

.. code-block:: php
   :caption: EXT:blog_example/Classes/Controller/BlogController.php

    public function editAction(\MyVendor\BlogExample\Domain\Model\Blog $blog): ResponseInterface
    {
        $this->view->assign('blog', $blog);
    }

The blog object to edit is passed and given to the
view. The Fluid template than looks like this (slightly shortened and
reduced to the important):

.. code-block:: html
   :caption: EXT:blog_example/Resources/Private/Templates/SomeTemplate.html

   <f:form name="blog" object="{blog}" action="update">
       <f:form.textfield property="title" />
       <f:form.textarea property="description" />
       <f:form.submit />
   </f:form>

Note that the ``blog`` object to be edited is bound to the
form with ``object="{blog}"``. With this, you can reference a
property of the linked object with the help of the ``property``
attribute of the form elements.

The name of the form (name="blog") is also important because it is
used as a variable name for the object to be sent. When submitting the form,
the ``updateAction`` is called with the ``blog`` object
as a parameter.

.. code-block:: php
   :caption: EXT:blog_example/Classes/Controller/BlogController.php

   public function updateAction(\MyVendor\BlogExample\Domain\Model\Blog $blog): ResponseInterface
   {
       $this->blogRepository->update($blog);
   }


So the name of the argument is ``$blog`` because the form
has the name blog. When no validation errors occur, the blog object will
be persisted with its changes.

Now have a look at what happens when the user inserts erroneous data
into the form. In this case, an error occurs when validating the
``$blog`` arguments. Therefore instead of the
`updateAction`, the `errorAction` is called. This action routes the
request by returning a :php:`ForwardResponse` to the last used action because
the form should be displayed again in case of an error. Additionally, an error
message is generated and given to the controller. Ergo: In case of a
validation error, the `editAction` is displayed
again.

As the erroneous object should be displayed again, it is important
that the ``updateAction`` and ``editAction`` use the
same argument names. In our example, the argument is called
``$blog`` in both cases, so we are on the safe side.

There is another problem: The ``editAction``
validates all parameters, but the blog object is not valid - the programm is
trapped in an endless loop. Therefore the argument
validation must be suppressed for the ``editAction``. For this, the annotation
:php:`@TYPO3\CMS\Extbase\Annotation\IgnoreValidation` is needed. – The comment block
of the ``editAction`` must be changed like this:

.. code-block:: php
   :caption: EXT:blog_example/Classes/Controller/BlogController.php

   <?php
   declare(strict_types=1);

   namespace MyVendor\BlogExample\Controller;

   use Psr\Http\Message\ResponseInterface;
   use TYPO3\CMS\Extbase\Annotation as Extbase;
   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

   class BlogController extends ActionController
   {
      /**
       * @param \MyVendor\BlogExample\Domain\Model\Blog $blog The blog object
       * @Extbase\IgnoreValidation("blog")
       */
      public function editAction(\MyVendor\BlogExample\Domain\Model\Blog $blog): ResponseInterface
      {
         $this->view->assign('blog', $blog);

         return $this->responseFactory->createHtmlResponse($this->view->render());
      }
   }

Now the ``blog`` object is not validated in the
``editAction``. So also, a non-valid ``blog`` object is
displayed correctly.

.. tip::

    If Extbase throws the exception
    \TYPO3\CMS\Extbase\Mvc\Exception\InfiniteLoopException it signs that the
    :php:`@TYPO3\CMS\Extbase\Annotation\IgnoreValidation` annotation is missing.

Fluid automatically adds the CSS class ``f3-form-error``
to all erroneous fields - so you can frame them in red, for example, using
CSS. There is also a ``flashMessages`` ViewHelper, which outputs
the error messages of the validation.


Case study: Create an object
============================

Here it is shown how to create a new blog object with a form.
Also, for creating a blog object, two actions are involved. The
`newAction` shows a form for creating an object, and
the `createAction` finally stores the
object.

The only difference to the editing of an object is that the
`newAction` is not always given an argument: when
first displaying the form, it is logical that no object is available
to be displayed. Therefore the argument must be marked as optional.

Here you will see all that we need. At first the controller
code:

.. code-block:: php
   :caption: EXT:blog_example/Classes/Controller/BlogController.php

   <?php
   declare(strict_types=1);

   use Psr\Http\Message\ResponseInterface;
   use TYPO3\CMS\Extbase\Annotation as Extbase;
   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

   class BlogController extends ActionController
   {
      /**
       * This action shows the 'new' form for the blog.
       *
       * @param \MyVendor\BlogExample\Domain\Model\Blog $newBlog The optional default values
       * @Extbase\IgnoreValidation("newBlog")
       */
      public function newAction(\MyVendor\BlogExample\Domain\Model\Blog $newBlog = NULL): ResponseInterface
      {
         $this->view->assign('newBlog', $newBlog);

         return $this->responseFactory->createHtmlResponse($this->view->render());
      }

      /**
       * This action creates the blog and stores it.
       *
       * @param \MyVendor\BlogExample\Domain\Model\Blog $newBlog
       */
      public function createAction(\MyVendor\BlogExample\Domain\Model\Blog $newBlog): ResponseInterface
      {
         $this->blogRepository->add($newBlog);
         return $this->htmlResponse();
      }
   }

The Fluid template for the `NewAction` looks
like this (in short form):

.. code-block:: html
   :caption: EXT:blog_example/Resources/Private/Templates/NewAction.html

    <f:flashMessages />
    <f:form name="newBlog" object="{newBlog}" action="create">
        <f:form.textfield property="title" />
        <f:form.textarea property="description" />
        <f:form.submit />
    </f:form>

Again it is important that the `newAction` and the
`createAction` have the same argument name. This
also has to conform with the name of the Fluid template
(``newBlog`` in the example). Also, the parameter for the
`newAction` must be marked as optional, and the
validation of the parameter must be suppressed with
:php:`@TYPO3\CMS\Extbase\Annotation\IgnoreValidation`. Finally, you can
output validation errors in the template using the ``flashMessages``
ViewHelper when saving the data.

Figure 9-2 gives an overview of the behavior of Extbase when
displaying, editing respectively creating of domain objects in the
frontend.

.. figure::  /Images/Graphics/9-CrosscuttingConcerns/figure-9-2.png
    :align: center

    Figure 9-2: Data flow of the form display and saving. When a validating
    error occurs, it is displayed again.



.. index:: Validators; Argument mapping
.. _mapping-arguments:

Mapping arguments
=================

This section describes what happens during a
request before the respective action is called, especially when sending a form.
Because the HTTP protocol (and PHP) can only transfer arrays and strings, a large array with data is transferred when
sending a form. In the action, domain objects are often expected as input
parameters, so somehow, the array must become an object. That is done by
Extbase during the *Argument Mappings*. It
makes it possible that as a user of Extbase, you not only work with
arrays, but you can change objects in forms or give over a complete object
as *parameter* in links.

Here is a concrete example: Edit a blog object, like you got to know in
the last section ("Case study: Edit an existing object"). When you edit a
blog you see a form in which you can change the properties of the blog, in
our case ``title`` and ``description``.

The Fluid form looks like this (shortened to the essential):

.. code-block:: html
   :caption: EXT:blog_example/Resources/Private/Templates/NewAction.html

    <f:form method="post" action="update" name="blog" object="{blog}">
        <f:form.textfield property="title" />
        <f:form.textarea property="description" />
    </f:form>

If the form is submitted the data will be sent in the following
manner to the server:

.. code-block:: none
   :caption: HTTP POST

   tx_blogexample_pi1[blog][__identity] = 5
   tx_blogexample_pi1[blog][title] = My title
   tx_blogexample_pi1[blog][description] = Description

First of all, the data is tagged with a prefix that contains the name
of the extension and the plugin (``tx_blogexample_pi1``). This
makes sure that no extensions have impact on each other. Furthermore,
all changed properties of the blog object are transferred in an array, in
this case ``title`` and ``description``. As
a blog object needs a change, also its identity is needed.
This is why Fluid automatically adds the ``__identity``
property for the ``blog`` object and fills it with the UID of the
blog.

Now on the server-side, a ``blog`` object must be created
out of this information. This is the job of the property mapper. Its
operation method is shown in figure 9-3.

For every argument, it must be decided first whether a new object has
to be created or if the work is based on an existing object. This will be
decided based on the identity property ``__identity``. If this is
not part of the input data, a new object is created. Otherwise, the framework
knows the object identity and can continue working with it.

.. tip::

    When you take a look at what is transferred to the server by the
    new action of the blog example, you will see that no identity
    properties are transferred - in this case, a new object is created as
    intended.

In the blog example from above, the `__identity` property is available,
therefore the object with the corresponding UID is fetched from the
repository and used for further modification.

When no properties should be changed, the object is given as an argument
to the action. So that it is always persistent, that its changes to this
object are saved automatically. <remark>!!!Sentence not
clear</remark>

.. figure::  /Images/Graphics/9-CrosscuttingConcerns/figure-9-3.png
    :align: center

    Figure 9-3: The internal control flow of the property mapper.

In this case, not only the ``__identity`` property is sent,
but also a new ``title`` and ``description`` for this
blog. For safety reasons, a *copy* of the persistent
object is applied. The properties of the copy are changed as given in the
request. In this case, ``title`` and ``description`` are
set new. The generated copy is yet a transient object (see section "live
cycle of objects" in chapter 2); that is, changes on the object are
*not* automatically persisted. The changed copy is
given to the action as an argument.

Now it is to tell the controller to explicitly
replace the existing persistent ``blog`` object with the modified
``blog`` object. For this, the repository provides the method
update():

.. code-block:: php
   :caption: EXT:blog_example/Classes/Controller/BlogController.php

   $this->blogRepository->update($blog);

With this, the changed object will be made into the persistent
object: The changes are now permanently stored.

.. sidebar:: Copies of objects

   Why is a copy of an object created when it is to be changed? Lets
   assume that the persistent object would be directly changed. In
   this case, an empty controller would be updating persistent
   objects:

   .. code-block:: php
      :caption: EXT:blog_example/Classes/Controller/BlogController.php

      public function updateAction(\MyVendor\BlogExample\Domain\Model\Blog $blog)
      {
         // object will be automatically persisted
      }

   This is not transparent and difficult to understand.
   Besides that, this procedure introduces a big safety issue: When the
   original object is changed, it would be impossible to cancel the
   persisting of the changes. For this reason, a copy of the object is
   returned for changed objects, so the developer of the extension has to
   decide explicitly whether or not the changes are to be made
   persistent.

We want to assume a refinement of the argument mapping: When a link
to an action is generated, and the link contains an object as a parameter, the
object's identity is transferred automatically. In the following
example, the UID is transferred instead of the ``blog``
object:

.. code-block:: html
   :caption: EXT:blog_example/Resources/Private/Templates/SomeTemplate.html

   <f:link.action action='show' arguments='{blog: blog}'>Show Blog</f:link.action>

The generated URL contains the identity of the blog object:
``tx_blogexample_pi1[blog]=47``. That is a short form of
``tx_blogexample_pi1[blog][__Identity]=47``. Therefore the
property mapper gets the blog object with identity 47 from the
repository and returns it directly without copying before.

After you have learned how you can make sure any invariants of
domain objects, the focus will be directed to the secure programming of
the complete extension.
