.. include:: ../Includes.txt
.. _extbase_reference:

=================
Extbase Reference
=================

In this appendix, you can look up how Extbase interacts with the TYPO3
installation. This includes the registration of plugins and the configuration of
Extbase extensions.

.. note::

    Under https://docs.typo3.org/m/typo3/docs-cheatsheets/master/en-us/CheatSheets.html#cheat-sheets you will find
    a useful Cheat Sheet for Extbase and Fluid.



.. _registration_of_frontend_plugins:

Registration of Frontend Plugins
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

.. Todo: Add section about backend modules.

In classical TYPO3 extensions the frontend functionality is divided into
several frontend plugins. Normally each has a separate code base.
In contrast, there is only one code base in Extbase (a series of controllers and
actions). Nevertheless, it is possible to group controllers and actions
to make it possible to have multiple frontend plugins.

.. sidebar:: Why two files?

    You may wonder why you need to edit both, file :file:`ext_localconf.php` and file
    :file:`Configuration/TCA/Overrides/tt_content.php`, to configure a plugin. The reason lays in the architecture of TYPO3:
    file :file:`ext_localconf.php` is evaluated in the frontend and file :file:`Configuration/TCA/Overrides/tt_content.php` in
    the backend. Therefore, in file :file:`Configuration/TCA/Overrides/tt_content.php` we add the entry to the plugin list (for
    the backend). In addition, the list of controller / action combinations is required at runtime
    in the frontend - and therefore this must be defined in the file file :file:`ext_localconf.php`.

    For further information, check out :ref:`Extension configuration files
    <t3coreapi:extension-configuration-files>`.

For the definition of a plugin, the files :file:`ext_localconf.php` and :file:`Configuration/TCA/Overrides/tt_content.php`
have to be adjusted.

In :file:`ext_localconf.php` resides the definition of permitted controller action
Combinations. Also here you have to define which actions should not be cached.
In :file:`Configuration/TCA/Overrides/tt_content.php` there is only the configuration of the plugin selector for the
backend. Let's have a look at the following two files:

:file:`ext_localconf.php`::

    $pluginName = 'ExamplePlugin';
    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
        'extension_key',
        $pluginName,
        $controllerActionCombinations,
        $uncachedActions
    );

In addition to the extension key and a unique name of the plugin (line 2 and 3),
the allowed combinations of the controller and actions are determined.
`$controllerActionCombinations` is an associative array. The Keys of this array
are the allowed controller classes, and the values are a comma-separated list of
allowed actions per controller. The first action of the first controller is the
default action.

Additionally you need to specify which actions should not be cached. To do this,
the fourth parameter also is a list of controller action Combinations in the
same format as above, containing all the non-cached-actions.

:file:`Configuration/TCA/Overrides/tt_content.php`:

.. code-block:: php

    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
        'extension_key',
        'ExamplePlugin',
        'Title used in Backend'
    );

The first two arguments must be completely identical to the definition in
:file:`ext_localconf.php`.

Below there is a complete configuration example for the registration of a
frontend plugin within the files :file:`ext_localconf.php` and :file:`Configuration/TCA/Overrides/tt_content.php`.

*Example B-1: Configuration of an extension in the file ext_localconf.php*

.. code-block:: php

    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
        'example_extension',
        'Blog',
        [
            \Vendor\ExampleExtension\Controller\BlogController::class => 'index,show,new,create,delete,deleteAll,edit,update,populate',
            \Vendor\ExampleExtension\Controller\PostController::class => 'index,show,new,create,delete,edit,update',
            \Vendor\ExampleExtension\Controller\CommentController::class => 'create',
        ],
        [
            \Vendor\ExampleExtension\Controller\BlogController::class => 'delete,deleteAll,edit,update,populate',
            \Vendor\ExampleExtension\Controller\PostController::class => 'show,delete,edit,update',
            \Vendor\ExampleExtension\Controller\CommentController::class => 'create',
        ]
    );

*Example B-2: Configuration of an extension in the file Configuration/TCA/Overrides/tt_content.php*

.. code-block:: php

    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
        'example_extension',
        'Blog',
        'A Blog Example',
        'EXT:blog/Resources/Public/Icons/Extension.svg'
    );

The plugin name is ``Blog``. It is important that the name is exactly the same
in :file:`ext_localconf.php` and
:file:`Configuration/TCA/Overrides/tt_content.php`. The default called method is
:php:`indexAction()` of controller class
:php:`Vendor\ExampleExtension\Controller\BlogController` since it's the first
element defined in the array and the first action in the list.

All actions which change data must not be cacheable. Above, this is for example
the :php:`deleteAction()` action in the
:php:`Vendor\ExampleExtension\Controller\BlogController` controller. In the
backend you can see "*A Blog Example*" in the list of plugins (see Figure B-1).

.. figure:: /Images/b-ExtbaseReference/figure-b-1.png
    :align: center

    Figure B-1: In the selection field for frontend plugins, the name which was defined in the
    file :file:`Configuration/TCA/Overrides/tt_content.php` will be displayed

.. _caching_of_actions_and_records:

Caching of actions and records
------------------------------

Furthermore, Extbase is clearing the TYPO3 cache automatically for update processes. This is called
*Automatic cache clearing*. This functionality is activated by default. If a domain object is
inserted, changed or deleted, then the cache of the corresponding page in which the object is
located is cleared.  Additionally the setting
of TSConfig :ref:`TCEMAIN.clearCacheCmd <t3tsconfig:pagetcemain-clearcachecmd>` is evaluated for this page.

Figure B-2 is an example that is explained below:

.. figure:: /Images/b-ExtbaseReference/figure-b-2.png
    :align: center

    Figure B-2: For the sysfolder in which the data was stored, the setting
    :ref:`TCEMAIN.clearCacheCmd <t3tsconfig:pagetcemain-clearcachecmd>` defines that the cache of
    the page *Blog* should be emptied.

The frontend plugin is on the page *Blog* with the *11*. As a storage folder for all the Blogs and
Posts the SysFolder *BLOGS* is configured. If an entry is changed, the cache of the SysFolder
*BLOGS* is emptied and also the TSConfig configuration
:ref:`TCEMAIN.clearCacheCmd <t3tsconfig:pagetcemain-clearcachecmd>` for the SysFolder is evaluated.
This contains a comma-separated list of Page IDs, for which the cache should be emptied. In this
case, when updating a record in the SysFolder *BLOGS* (e.g.  Blogs, Posts, Comments), the cache of
the page *Blog*, with ID 11, is cleared automatically, so the changes are immediately visible.

Even if the user enters incorrect data in a form (and this form will be
displayed again), the cache of the current page is deleted to force a new
representation of the form.

The automatic cache clearing is enabled by default, you can use the TypoScript configuration
:ref:`persistence.enableAutomaticCacheClearing <persistence-enableAutomaticCacheClearing>` to disable
it.

.. _typoscript_configuration:

TypoScript Configuration
^^^^^^^^^^^^^^^^^^^^^^^^

Each Extbase extension has some settings which can be modified using TypoScript. Many of these
settings affect aspects of the internal Configuration of Extbase and Fluid. There is also a block
``settings`` in which you can set Extension specific settings, which can be accessed in the
controllers and Templates of your extensions.

.. tip::

    These options are always available. Integrators can use them to configure the behaviour, even
    if not intended or provided by the author of the extension.

**plugin.tx_[lowercasedextensionname]**

The TypoScript configuration of the extension is always located below this
TypoScript path. The "lowercase extension name" is the extension key with no
underscore (_), as for example in ``blogexample``. The configuration is divided into
the following sections:

.. _typoscript_configuration-features:
.. _features-skipDefaultArguments:
.. _features-ignoreAllEnableFieldsInBe:
.. _features-requireCHashArgumentForActionArguments:
.. _features-consistentTranslationHandling:

features
--------

Activate features for Extbase or a specific plugin.

`features.skipDefaultArguments`
    Skip default arguments in URLs. If a link to the default controller or action is created, the
    parameters are omitted.
    Default is `false`.

`features.ignoreAllEnableFieldsInBe`
    Ignore the enable fields in backend.
    Default is `false`.

`features.requireCHashArgumentForActionArguments`
    Do not force a cHash for arguments used in actions. If this is turned on, all requests with
    arguments but no, or an invalid cHash, are handled as `pageNotFoundOnCHashError`.
    Default is `true`.

`features.consistentTranslationOverlayHandling`
    Use the same translation handling in extbase as in TypoScript. Used via `config.tx_extbase.features.consistentTranslationOverlayHandling`.
    The feature switch will be removed in TYPO3 v10 and the behaviour will become the only way translations are handled.

.. _typoscript_configuration-persistence:
.. _persistence-enableAutomaticCacheClearing:

persistence
-----------

Settings relevant to the persistence layer of Extbase.

`persistence.enableAutomaticCacheClearing`
    Enables the automatic cache clearing when changing data sets (see also the
    section ":ref:`caching_of_actions_and_records`" above in this chapter).
    Default is `true`.

`persistence.storagePid`
    List of Page-IDs, from which all records are read (see the section
    ":ref:`Procedure to fetch objects <procedure_to_fetch_objects>`" in Chapter 6).

.. _typoscript_configuration-settings:

settings
--------

Here reside are all the domain-specific extension settings. These settings are
available in the controllers as the array variable `$this->settings` and in any Fluid
template with `{settings}`.

.. tip::

    The settings allow you to pass arbitrary information to a template, even for 3rd party extensions.
    Just make sure you prefix them with a unique vendor to prevent collisions with further updates
    of the extensions.

.. _typoscript_configuration-view:

view
----

View and template settings.

`view.layoutRootPaths`
    This can be used to specify the root paths for all fluid layouts in this
    extension. If nothing is specified, the path
    :file:`extensionName/Resources/Private/Layouts` is used. All layouts that are necessary
    for this extension should reside in this folder.

`view.partialRootPaths`
    This can be used to specify the root paths for all fluid partials in this
    extension. If nothing is specified, the path
    :file:`extensionName/Resources/Private/Partials` is used. All partials that are
    necessary for this extension should reside in this folder.

`view.pluginNamespace`
    This can be used to specify an alternative namespace for the plugin.
    Use this to shorten the Extbase default plugin namespace or to access
    arguments from other extensions by setting this option to their namespace.
    .. todo: This is not understandable without an example.

`view.templateRootPaths`
    This can be used to specify the root paths for all fluid templates in this
    extension. If nothing is specified, the path
    :file:`extensionName/Resources/Private/Templates` is used. All layouts that are necessary
    for this extension should reside in this folder.

All root paths are defined as array which enables you to define multiple root paths that
will be used by Extbase to find the desired template files.

The feature is best described by an example.
Imagine you installed the extension `news`, which provides several plugins for
rendering news in the frontend.

The default template directory of that extension is the following:

.. code-block:: typoscript

   EXT:news/Resources/Private/Templates/

Let's assume you want to change the output of the plugins because you need to use
different css classes for example. You can simply create your own extension and
add the following TypoScript setup:

.. code-block:: typoscript

   plugin.tx_news {
       view {
           templateRootPaths.10 = EXT:example_extension/Resources/Private/Templates/
       }
   }

As all typoscript will be merged, the following configuration will be compiled:

.. code-block:: typoscript

   plugin.tx_news {
       view {
           templateRootPaths {
               0 = EXT:news/Resources/Private/Templates/
               10 = EXT:example_extension/Resources/Private/Templates/
           }
           ...
       }
   }

Imagine there is a news plugin that lists news entries. In that case, the `listAction` method
of the `NewsController` will be called. By convention, Extbase will look for an html file
called `List.html` in a folder `News` in all of the configured template root paths.

If there is just one root path configured, that's the one being chosen right away. Once there
are more paths defined, Extbase will check them in reverse order i.e. from highest key
to lowest. Following our example, Extbase will check the given path with key `10` first and if
no template file is found, it will proceed with `0`.

.. tip::

   If there is no root path defined at all, a fallback path will be created during runtime.
   The fallback path consists of the extension key and a fixed directory path.

More information on root paths can be found in the TypoScript reference:
:ref:`t3tsref:cobj-fluidtemplate-properties-templaterootpaths`

.. _typoscript_configuration-mvc:

mvc
---

These are useful mvc settings about error handling:

`mvc.callDefaultActionIfActionCantBeResolved`
    Will cause the controller to show its default action
    e.g. if the called action is not allowed by the controller.

`mvc.throwPageNotFoundExceptionIfActionCantBeResolved`
    Same as `mvc.callDefaultActionIfActionCantBeResolved`
    but this will raise a "page not found" error.


.. _typoscript_configuration-local_lang:

_LOCAL_LANG
-----------

Under this key you can modify localized strings for this extension.
If you specify for example `plugin.tx_blogexample._LOCAL_LANG.default.read_more =
More>>` then the standard translation for the key `read_more` is overwritten by the
string *More>>*.

.. _format:

format
------

Output of Extbase plugins can be provided in different formats, e.g. HTML, CSV,
JSON, …. The required format can be requested via request parameter. The default
format if nothing is requested, can be set via TypoScript. This can be combined
with conditions.

`format`
   Defines the default format for the plugin.

.. _class_hierarchy:

Class Hierarchy
^^^^^^^^^^^^^^^

The MVC Framework is the heart of Extbase. Below we will give you an overview of
the class hierarchy for the controllers and the API of the `ActionControllers`.

Normally you will let your controllers inherit from `ActionController`. If you
have special requirements that can not be realized with the `ActionController`,
you should have a look at the controllers below.

:php:`\TYPO3\CMS\Extbase\Mvc\Controller\ControllerInterface`
    The basic interface that must be implemented by all controllers.

:php:`TYPO3\CMS\Extbase\Mvc\Controller\ActionController`
    The most widely used controller in Extbase with the basic functionality of the ControllerInterface.
    An overview of its API is given in the following section.

:php:`TYPO3\CMS\Extbase\Mvc\Controller\CommandController`
    Extend this controller if you want to provide commands to the scheduler or command line
    interface.

.. _class_hierarchy-action_controller_api:

ActionController API
--------------------

The action controller is usually the base class for your own controller. Below
you see the most important properties of the action controller:

`$actionMethodName`
    Name of the executed action.

`$argumentMappingResults`
    Results of the argument mapping. Is used especially in the errorAction.

`$defaultViewObjectName`
    Name of the default view, if no fluid-view or an action-specific view was found.

`$errorMethodName`
    Name of the action that is performed when generating the arguments of actions
    fail. Default is errorAction. In general, it is not sensible to change this.

`$request`
    Request object of type :php:`\TYPO3\CMS\Extbase\Mvc\RequestInterface`.

`$response`
    Response object of type :php:`\TYPO3\CMS\Extbase\Mvc\ResponseInterface`.

`$settings`
    Domain-specific extension settings from TypoScript (as array), see :ref:`typoscript_configuration-settings`.

`$view`
    The view used of type :php:`\TYPO3\CMS\Extbase\Mvc\View\ViewInterface`.


.. _class_hierarchy-most_important_api_methods_of_action_controller:

Most important API methods of action controller
---------------------------------------------------

`Action()`
    Defines an action.

`errorAction()`
    Standard error action. Needs to be adjusted only in very rare cases. The name of
    this method is defined by the property $errorMethodName.

`forward($actionName, $controllerName = NULL, $extensionName = NULL, array $arguments = NULL)`
    Issues an immediate internal forwarding of the request to another controller.

`initializeAction()`
    Initialization method for all actions. Can be used to e.g. register arguments.

`initialize[actionName]Action()`
    Action-specific initialization, which is called only before the specific action.
    Can be used to e.g. register arguments.

`initializeView(\TYPO3\CMS\Extbase\Mvc\View\ViewInterface $ view)`
    Initialization method to configure and initialize the passed view.

`redirect($actionName, $controllerName = NULL, $extensionName = NULL, array $arguments = NULL, $pageUid = NULL, $delay = 0, $statusCode = 303)`
    External HTTP redirect to another controller (immediately)

`redirectToURI($uri, $delay = 0, $statusCode = 303)`
    Redirect to full URI (immediately)

`resolveView()`
    By overriding this method you can build and configure a completely individual
    view object. This method should return a complete view object. In general,
    however, it is sufficient to overwrite resolveViewObjectName().

`resolveViewObjectName()`
    Resolves the name of the view object, if no suitable fluid template could be
    found.

`throwStatus($statusCode, $statusMessage = NULL, $content = NULL)`
    The specified HTTP status code is sent immediately.

.. _class_hierarchy-actions:

Actions
-------

All public and protected methods that end in *action* (for example `indexAction` or `showAction`),
are automatically registered as actions of the controller.

Many of these actions have parameters. These appear as annotations in the Doc-Comment-Block
of the specified method, as shown in Example B-3:

*Example B-3: Actions with parameters*

::

   <?php
   declare(strict_types = 1);

   namespace Ex\BlogExample\Controller;

   use TYPO3\CMS\Extbase\Annotation as Extbase;
   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

   class BlogController extends ActionController
   {
       /**
        * Displays a form for creating a new blog, optionally pre-filled with partial information.
        *
        * @param \Ex\BlogExample\Domain\Model\Blog $newBlog A fresh blog object which should be taken
        *        as a basis for the form if it is set.
        *
        * @return void
        *
        * @Extbase\IgnoreValidation("newBlog")
        */
       public function newAction(\Ex\BlogExample\Domain\Model\Blog $newBlog = NULL)
       {
           $this->view->assign('newBlog', $newBlog);
       }
   }

It is important to specify the full type in the `@param` annotation as this is used for the validation
of the object. Note that not only simple data types such as String, Integer or Float can be validated,
but also complex object types (see also the section ":ref:`validating-domain-objects`" in Chapter 9).

In addition, on actions showing the forms used to create domain objects, the validation of domain
objects must be explicitly disabled - therefore the annotation
:php:`@TYPO3\CMS\Extbase\Annotation\IgnoreValidation` is necessary.

Default values can, as usual in PHP, just be indicated in the method signature. In the above case,
the default value of the parameter `$newBlog` is set to NULL. If an action returns `NULL` or nothing,
then automatically `$this->view->render()` is called, and thus the view is rendered.

.. _class_hierarchy-define_initialization_code:

Define initialization code
--------------------------

Sometimes it is necessary to execute code before calling an action. For example, if complex
arguments must be registered or required classes must be instantiated.

There is a generic initialization method called `initializeAction()`, which is called after
the registration of arguments, but before calling the appropriate action method itself. After the
generic `initializeAction()`, if it exists, a method named *initialize[ActionName]()* is called.
Here you can perform action specific initializations (e.g. `initializeShowAction()`).

.. _class_hierarchy-catching_validation_errors_with_error_action:

Catching validation errors with errorAction
-------------------------------------------

If an argument validation error has occurred, the method `errorAction()` is called. There,
in `$this->argumentsMappingResults` you have a list of occurred warnings and errors of the argument
mappings available. This default `errorAction` refers back to the referrer, if the referrer
was sent with it.

.. _available-annotations:

Available annotations
^^^^^^^^^^^^^^^^^^^^^

All available annotations for Extbase are placed within namespace :php:`TYPO3\CMS\Extbase\Annotation`.
They can be imported into the current namespace, e.g.::

   use TYPO3\CMS\Extbase\Annotation\Inject;

   /**
    * @Inject
    * @var Foo
    */
   public $property;

Is completely valid and will be parsed. It's considered to be best practice to
use the following instead, in order to make source of annotation more
transparent::

   use TYPO3\CMS\Extbase\Annotation as Extbase;

   /**
    * @Extbase\Inject
    * @var Foo
    */
   public $property;

The following annotations are available out of the box within Extbase:

:php:`@TYPO3\CMS\Extbase\Annotation\Validate`
   Allows to configure validators for properties and method arguments:

   .. code-block:: php

      /**
       * Existing TYPO3 validator.
       *
       * @Extbase\Validate("EmailAddress")
       */
      protected $email = '';

      /**
       * Existing TYPO3 validator with options.
       *
       * @Extbase\Validate("StringLength", options={"minimum": 1, "maximum": 80})
       */
      protected $title = '';

      /**
       * Custom validator identified by FQCN.
       *
       * @Extbase\Validate("\Vendor\ExtensionName\Validation\Validator\CustomValidator")
       */
      protected $bar;

      /**
       * Custom Validator identified by dot syntax, with additional parameters.
       *
       * @Extbase\Validate("Vendor.ExtensionName:CustomValidator", param="barParam")
       */
      public function barAction(string $barParam)
      {
          return '';
      }

   The above list provides all possible references to an validator. Available
   validators shipped with Extbase can be found within
   :file:`EXT:extbase/Classes/Validation/Validator/`.

:php:`@TYPO3\CMS\Extbase\Annotation\IgnoreValidation()`
   Allows to ignore Extbase default validation for a given argument, in context
   of an controller.

   .. code-block:: php

      /**
       * @Extbase\IgnoreValidation("param")
       */
      public function method($param)
      {
      }

:php:`@TYPO3\CMS\Extbase\Annotation\ORM\Cascade("remove")`
   Allows to remove child entities during deletion of aggregate root.

   .. code-block:: php

      /**
       * @Extbase\ORM\Cascade("remove")
       */
      public $property;

:php:`@TYPO3\CMS\Extbase\Annotation\ORM\Transient`
   Marks property as transient (not persisted).

   .. code-block:: php

      /**
       * @Extbase\ORM\Transient
       */
      public $property;

:php:`@TYPO3\CMS\Extbase\Annotation\ORM\Lazy`
   Marks property to be lazy loaded, on first access.

   .. code-block:: php

      /**
       * @Extbase\ORM\Lazy
       */
      public $property;

:php:`@TYPO3\CMS\Extbase\Annotation\Inject`
   Configures dependency injection (DI) to inject given property.
   In the following example a class :php:`ServiceClassName` should be injected.

   .. code-block:: php

      /**
       * @Extbase\Inject
       * @var ServiceClassName
       */
      public $property;

Application domain of the extension
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The domain of the extension is always located below :file:`Classes/Domain`. This folder is structured
as follows:

:file:`Model/`
    Contains the domain models itself.

:file:`Repository/`
    Contains the repositories to access the domain models.

:file:`Validator/`
    Contains specific validators for the domain models.

Domain model
------------

All classes of the domain model must inherit from one of the following two classes:

:php:`\TYPO3\CMS\Extbase\DomainObject\AbstractEntity`
    Is used if the object is an entity, i.e. possesses an identity.

:php:`\TYPO3\CMS\Extbase\DomainObject\AbstractValueObject`
    Is used if the object is a ValueObject, i.e. if its identity is defined by all of its properties.
    ValueObjects are immutable.

Repositories
------------

All repositories inherit from :php:`\TYPO3\CMS\Extbase\Persistence\Repository`. A repository is always
responsible for precisely one type of domain object. The naming of the repositories is important:
If the domain object is, for example, *Blog* (with full name `\\Ex\\BlogExample\\Domain\\Model\\Blog`),
then the corresponding repository is named *BlogRepository* (with full name
`\\Ex\\BlogExample\\Domain\\Repository\\BlogRepository`).

Public Repository API
~~~~~~~~~~~~~~~~~~~~~

Each repository provides the following public methods:

`add($object)`
    Adds a new object.

`findAll()` and `countAll()`
    returns all domain objects (or the number of them) it is responsible for.

`findByUid($uid)`
    Returns the domain object with this UID.

`findByProperty($propertyValue)` and `countByProperty($propertyValue)`
    Magic finder method. Finding all objects (or the number of them) for the property *property* having
    a value of `$propertyValue` and returns them in an array, or the number as an integer value.

`findOneByProperty($propertyValue)`
    Magic finder method. Finds the first object, for which the given property *property* has the value
    `$propertyValue`.

`remove($object)` and `removeAll()`
    Deletes an object (or all objects) in the repository.

`replace($existingObject, $newObject)`
    Replaces an object of the repositories with another.

`update($object)`
    Updates the persisted object.

Custom find methods in repositories
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A repository can be extended by own finder methods. Within this methods you can use the ``Query`` object,
to formulate a request:

::

    /**
     * Find blogs, which have the given category.
     *
     * @param \Ex\BlogExample\Domain\Model\Category $category
     *
     * @return \TYPO3\CMS\Extbase\Persistence\Generic\QueryResult
     */
    public function findWithCategory(\Ex\BlogExample\Domain\Model\Category $category)
    {
        $query = $this->createQuery();
        $query->matching($query->contains('categories', $category));
        return $query->execute();
    }

Create a ``Query`` object within the repository through `$this->createQuery()`. You can give the query
object a constraint using `$query->matching($constraint)`. The following comparison operations for
generating a single condition are available:

`$query->equals($propertyName, $operand, $caseSensitive);`
    Simple comparison between the value of the property provided by `$propertyName` and the operand.
    In the case of strings you can specified additionally, whether the comparison is case-sensitive.

`$query->in($propertyName, $operand);`
    Checks if the value of the property `$propertyName` is present within the series of values in `$operand`.

`$query->contains($propertyName, $operand);`
    Checks whether the specified property `$propertyName` containing a collection has an element
    `$operand` within that collection.

`$query->like($propertyName, $operand);`
    Comparison between the value of the property specified by `$propertyName` and a string $operand.
    In this string, the %-character is interpreted as placeholder (similar to * characters in search
    engines, in reference to the SQL syntax).

`$query->lessThan($propertyName, $operand);`
    Checks if the value of the property `$propertyName` is less than the operand.

`$query->lessThanOrEqual($propertyName, $operand);`
    Checks if the value of the property `$propertyName` is less than or equal to the operand.

`$query->greaterThan($propertyName, $operand);`
    Checks if the value of the property `$propertyName` is greater than the operand.

`$query->greaterThanOrEqual($propertyName, $operand);`
    Checks if the value of the property `$propertyName` is greater than or equal to the operand.

Since 1.1 (TYPO3 4.3) `$propertyName` is not necessarily only a simple property-name but also can be a "property path".
    Example: `$query->equals('categories.title', 'tools')` searches for objects having a category titled
    "tools" assigned. If necessary, you can combine multiple conditions with boolean operations.

`$query->logicalAnd($constraint1, $constraint2);`
    Two conditions are joined with a logical *and*, it gives back the resulting condition. Since Extbase
    1.1 (TYPO3 4.3) also an array of conditions is allowed.

`$query->logicalOr($constraint1, $constraint2);`
    Two conditions are joined with a logical *or*, it gives back the resulting condition. Since Extbase
    1.1 (TYPO3 4.3) also an array of conditions is allowed.

`$query->logicalNot($constraint);`
    Returns a condition that inverts the result of the given condition (logical *not*).

In the section ":ref:`individual_database_queries`" in Chapter 6 you can find a comprehensive example for building queries.

Validation
^^^^^^^^^^

You can write your own validators for domain models. These must be located in
the folder :file:`Domain/Validator/`, they must be named exactly as the corresponding
Domain model, but with the suffix Validator and implement the interface
:php:`\TYPO3\CMS\Extbase\Validation\Validator\ValidatorInterface`. For more details, see the
following Section.

Validation API
--------------

.. todo: Add new API must haves, empty values and configure options, etc.

Extbase provides a generic validation system which is used in many places in Extbase. Extbase
provides validators for common data types, but you can also write your own validators. Each
Validator implements the :php:`\TYPO3\CMS\Extbase\Validation\Validator\ValidatorInterface`
that defines the following methods:

`validate($value)`
    Checks whether the object that was passed to the validator is valid. If not,
    a :php:`\TYPO3\CMS\Extbase\Validation\Error` object should be returned.

`getOptions()`
    Enables you to define validator options. These options apply to any further call
    of the method validate().

You can call Validators in your own code with the method `createValidator($validatorName,
$validatorOptions)` in :php:`\TYPO3\CMS\Extbase\Validation\ValidatorResolver`. Though in
general, this is not necessary. Validators are often used in conjunction with domain objects and
controller actions.

Validation of model properties
------------------------------

You can define simple validation rules in the domain model by annotation. For
this, you use the annotation `@TYPO3\CMS\Extbase\Annotation\Validate` with properties of the object. A brief
example:

*Example B-4: validation in the domain object*

.. code-block:: php

    namespace Ex\BlogExample\Domain\Model;

    /**
     * A single blog which has multiple posts and can be read by users.
     */
    class Blog extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
    {
        /**
         * The blog's title.
         *
         * @var string
         * @TYPO3\CMS\Extbase\Annotation\Validate("Text")
         * @TYPO3\CMS\Extbase\Annotation\Validate("StringLength", options={"minimum": 1, "maximum": 80})
         */
        protected $title;

        // the class continues here
    }

In this code section, the validators for the `$title` attribute of the Blog object is defined. `$title`
must be a text (ie, no HTML is allowed), and also the length of the string is checked with the
`StringLength`-Validator (it must be between 1 and 80 characters). Several validators for a property
can be separated by commas. Parameter of the validators are set in parentheses. You can omit the
quotes for validator options if they are superfluous as in the example above. If complex validation
rules are necessary (for example, multiple fields to be checked for equality), you must implement
your own validator.

Validation of controller arguments
----------------------------------

Each controller argument is validated by the following rules:

* If the argument has a simple type (string, integer, etc.), this type is checked.
* If the argument is a domain object, the annotations `@TYPO3\CMS\Extbase\Annotation\Validate` in the domain object is taken into
  account and - if set - the appropriate validator in the folder :file:`Domain/Validator` for the
  existing domain object is run.
* If there is set an annotation :php:`@TYPO3\CMS\Extbase\Annotation\IgnoreValidation` for the argument,
  no validation is done.
* Additional validation rules can be specified via further `@TYPO3\CMS\Extbase\Annotation\Validate` annotations in the methods
  PHPDoc block.

If the arguments of an action can not be validated, then the `errorAction` is executed, which will
usually jump back to the last screen. It is important that validation is not performed in certain
cases. Further information for the usage of the annotation :php:`@TYPO3\CMS\Extbase\Annotation\IgnoreValidation` see
":ref:`case_study-edit_an_existing_object`" in Chapter 9.

Localization
^^^^^^^^^^^^

.. todo: Link to core documentation of language files.

Multilingual websites are widespread nowadays, which means that the
web-available texts have to be localized. Extbase provides the helper class
:php:`\TYPO3\CMS\Extbase\Utility\LocalizationUtility` for the translation of the labels. In addition,
there is the Fluid ViewHelper `<f:translate>`, with the help of whom you can use that
functionality in templates.

The localization class has only one public static method called translate, which
does all the translation. The method can be called like this:

`\TYPO3\CMS\Extbase\Uility\LocalizationUtility::translate($key, $extensionName, $arguments=NULL)`

`$key`
    The identifier to be translated. If then format *LLL:path:key* is given, then this
    identifier is used and the parameter `$extensionName` is ignored. Otherwise, the
    file :file:`Resources/Private/Language/locallang.xlf` from the given extension is loaded
    and the resulting text for the given key in the current language returned.

`$extensionName`
    The extension name. It can be fetched from the request.

`$arguments`
    Allows you to specify an array of arguments. In the `LocalizationUtility` this arguments will be passed to the function `vsprintf`. So you can insert dynamic values in every translation. You can find the possible wildcard specifiers under `<https://www.php.net/manual/function.sprintf.php#refsect1-function.sprintf-parameters>`__.

    *Example language file with inserted wildcards*

    .. code-block:: xml

       <?xml version="1.0" encoding="UTF-8"?>
       <xliff version="1.0" xmlns="urn:oasis:names:tc:xliff:document:1.1">
           <file source-language="en" datatype="plaintext" original="messages" date="..." product-name="...">
               <header/>
               <body>
                   <trans-unit id="count_posts">
                       <source>You have %d posts with %d comments written.</source>
                   </trans-unit>
                   <trans-unit id="greeting">
                       <source>Hello %s!</source>
                   </trans-unit>
               </body>
           </file>
       </xliff>

    *Called translations with arguments to fill data in wildcards*

    .. code-block:: php

        \TYPO3\CMS\Extbase\Uility\LocalizationUtility::translate('count_posts', 'BlogExample', [$countPosts, $countComments])

        \TYPO3\CMS\Extbase\Uility\LocalizationUtility::translate('greeting', 'BlogExample', [$userName])
