.. include:: ../Includes.txt
.. _extbase_reference:

Extbase Reference
=================

In this appendix, you can look up how Extbase interacts with the TYPO3
installation. This includes the registration of plugins and the configuration of
Extbase extensions.

.. note::

    Under https://docs.typo3.org/typo3cms/CheatSheets.html you find a useful Cheat Sheet for Extbase
    and Fluid.

.. _registration_of_frontend_plugins:

Registration of frontend plugins
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
        'Vendor.ext_key',
        $pluginName,
        $controllerActionCombinations,
        $uncachedActions
    );

In addition to the extension key and a unique name of the plugin (line 2 and 3),
the allowed combinations of the controller and actions are determined.
`$controllerActionCombinations` is an associative array. The Keys of this array
are the allowed controllers, and the values are a comma-separated list of
allowed actions per controller. The first action of the first controller is the
default action.

Additionally you need to specify which actions should not be cached. To do this,
the fourth parameter also is a list of controller action Combinations in the
same format as above, containing all the non-cached-actions.

:file:`Configuration/TCA/Overrides/tt_content.php`:

.. code-block:: php

    $extensionKey = 'example_extensionkey';
    $pluginName = 'ExamplePlugin';
    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
        'Vendor.' . $extensionKey,
        $pluginName,
        $backendTitle,
        $pluginIcon
    );

The extension key (`$extensionKey` or `example_extensionkey`) and `$pluginName`
must be completely identical to the definition in :file:`ext_localconf.php`.
`$extensionKey` must be filled with the extension key by
yourself.`$backendTitle` defines the displayed name of the plugin in the
Backend.

Below there is a complete configuration example for the registration of a
frontend plugin within the files :file:`ext_localconf.php` and :file:`Configuration/TCA/Overrides/tt_content.php`.

*Example B-1: Configuration of an extension in the file ext_localconf.php*

.. code-block:: php

    $pluginName = 'Blog';
    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
        'Vendor.ext_key',
        $pluginName,
        [
            'Blog' => 'index,show,new,create,delete,deleteAll,edit,update,populate',
            'Post' => 'index,show,new,create,delete,edit,update',
            'Comment' => 'create',
        ],
        [
            'Blog' => 'delete,deleteAll,edit,update,populate',
            'Post' => 'show,delete,edit,update',
            'Comment' => 'create',
        ]
    );

*Example B-2: Configuration of an extension in the file Configuration/TCA/Overrides/tt_content.php*

.. code-block:: php

    $extensionKey = 'example_extensionkey';
    $pluginName = 'Blog';
    \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
        'Vendor.' . $extensionKey,
        $pluginName,
        'A Blog Example',
        'EXT:blog/Resources/Public/Icons/Extension.svg'
    );

The plugin name (`$pluginName`) is ``Blog``. It is important that the name is exactly the same in
:file:`ext_localconf.php` and :file:`Configuration/TCA/Overrides/tt_content.php`. The default action is ``index`` of controller
``blog`` since it's the first element defined in the array and the first action in the list.

All actions which change data must not be cacheable. Above, this is for example
the ``delete`` action in the ``blog`` controller. In the backend you can see "*A Blog
Example*" in the list of plugins (see Figure B-1).

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

    These options are allways available. Integrators can use them to configure the behaviour, even
    if not intended or provided by the author of the extension.

**plugin.tx_[lowercasedextensionname]**

The TypoScript configuration of the extension is always located below this
TypoScript path. The "lowercased extension name" is the extension key with no
underscore (_), as for example in ``blogexample``. The configuration is divided into
the following sections:

.. _typoscript_configuration-features:
.. _features-skipDefaultArguments:
.. _features-ignoreAllEnableFieldsInBe:
.. _features-requireCHashArgumentForActionArguments:

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
    Only available below `config.tx_extbase`, not for individual plugins!

    Do not force a cHash for arguments used in actions. If this is turned on, all requests with
    arguments but no, or an invalid cHash, are handled as `pageNotFoundOnCHashError`.
    Default is `true`.

.. _typoscript_configuration-persistence:
.. _persistence-enableAutomaticCacheClearing:

persistence
-----------

Settings relevant to the persistence layer of Extbase.

`persistence.classes`
    This settings are used with individual classes. That includes in particular the
    mapping of classes and property names to tables and field names.

`persistence.classes.Vendor\MyExt\Domain\Model\Foo.mapping.columns`
    Configure fields which differ from the regular naming conventions.
    Use the form `field_name.mapOnProperty = propertyName`.

`persistence.classes.Vendor\MyExt\Domain\Model\Foo.mapping.recordType`
    Specify a string literal, which - if set - should be stored in the
    type field of the table.

`persistence.classes.Vendor\MyExt\Domain\Model\Foo.mapping.tableName`
    Set a table name which differs from the regular naming conventions.

`persistence.classes.Vendor\MyExt\Domain\Model\Foo.newRecordStoragePid`
    Page-ID in which new records of the given class should be saved.

`persistence.classes.Vendor\MyExt\Domain\Model\Foo.subclasses`
    List all subclasses of the class given in the form `Identifier = ClassName`.

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

    The settings allow you to pass orbitary information to a template, even for 3rd party extensions.
    Just make sure you prefix them with a unique vendor to prevent collisions with further updates
    of the extensions.

.. _typoscript_configuration-view:

view
----

View and template settings.

`view.layoutRootPath`
    This can be used to specify the root path for all fluid layouts in this
    extension. If nothing is specified, the path
    :file:`extensionName/Resources/Private/Layouts` is used. All layouts that are necessary
    for this extension should reside in this folder.

`view.partialRootPath`
    This can be used to specify the root path for all fluid partials in this
    extension. If nothing is specified, the path
    :file:`extensionName/Resources/Private/Partials` is used. All partials that are
    necessary for this extension should reside in this folder.

`view.pluginNamespace`
    This can be used to specify an alternative namespace for the plugin.
    Use this to shorten the Extbase default plugin namespace or to access
    arguments from other extensions by setting this option to their namespace.

`view.templateRootPath`
    This can be used to specify the root path for all fluid templates in this
    extension. If nothing is specified, the path
    :file:`extensionName/Resources/Private/Templates` is used. All layouts that are necessary
    for this extension should reside in this folder.

There is no fallback to the files that are delivered with an extension!
Therefore you need to copy all original templates to this folder before you set
this TypoScript setting.

.. Todo: Add feature #66111, multiple paths for fluid.

.. tip::

    Since TYPO3 CMS 7.3, it's possible to use multiple paths. The feature was introduced by
    `Feature: #66111 - Add TemplateRootPaths support to cObject FLUIDTEMPLATE
    <https://docs.typo3.org/typo3cms/extensions/core/latest/Changelog/7.3/Feature-66111-AddTemplaterootpathsSupportToCobjectFluidtemplate.html#feature-66111-add-templaterootpaths-support-to-cobject-fluidtemplate>`_.
    We will update the documentation in the near future to reflect this new possibilities.
    In the meantime, just check out the documentation for the feature.


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

.. _class_hierarchy:

Class Hierarchy
^^^^^^^^^^^^^^^

The MVC Framework is the heart of Extbase. Below we will give you an overview of
the class hierarchy for the controllers and the API of the `ActionControllers`.

Normally you will let your controllers inherit from `ActionController`. If you
have special requirements that can not be realized with the `ActionController`,
you should have a look at the controllers below.

:php:`\TYPO3\CMS\Extbase\Mvc\Controller\ControllerInterface`
    This basic interface that must be implemented by all controllers.

:php:`TYPO3\CMS\Extbase\Mvc\Controller\AbstractController`
    Abstract controller with the basic functionality of the ControllerInterface.

:php:`TYPO3\CMS\Extbase\Mvc\Controller\ActionController`
    The most widely used controller in Extbase. It extends the AbstractController. An overview of its API is given in
    the following section.

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

`$viewObjectNamePattern`
    If no fluid template is found for the current action, Extbase attempts to find a
    PHP-View-Class for the action. The naming scheme of the PHP-View-Class can be
    changed here. By default names are used according to the scheme
    *@vendor\@extension\View\@controller\@action@format*. All string-parts marked with @
    are replaced by the corresponding values. If no view class with this name is
    found, @format is removed from the pattern and again tried to find a view class
    with that name.


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

    /**
      * Displays a form for creating a new blog, optionally prefilled with partial information.
      *
      * @param \Ex\BlogExample\Domain\Model\Blog $newBlog A fresh blog object which should be taken
      *        as a basis for the form if it is set.
      *
      * @return void
      *
      * @ignorevalidation $newBlog
      */
    public function newAction(\Ex\BlogExample\Domain\Model\Blog $newBlog = NULL)
    {
        $this->view->assign('newBlog', $newBlog);
    )

It is important to specify the full type in the `@param` annotation as this is used for the validation
of the object. Note that not only simple data types such as String, Integer or Float can be validated,
but also complex object types (see also the section ":ref:`validating-domain-objects`" in Chapter 9).

In addition, on actions showing the forms used to create domain objects, the validation of domain
objects must be explicitly disabled - therefore the annotation `@ignorevalidation` is necessary.

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

Since 1.1 `$propertyName` is not necessarily only a simple property-name but also can be a "property path".
    Example: `$query->equals('categories.title', 'tools')` searches for objects having a category titled
    "tools" assigned. If necessary, you can combine multiple conditions with boolean operations.

`$query->logicalAnd($constraint1, $constraint2);`
    Two conditions are joined with a logical *and*, it gives back the resulting condition. Since Extbase
    1.1 also an array of conditions is allowed.

`$query->logicalOr($constraint1, $constraint2);`
    Two conditions are joined with a logical *or*, it gives back the resulting condition. Since Extbase
    1.1 also an array of conditions is allowed.

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

.. note::

    The API for Validation has changed slightly, we will update the reference accordingly.

`getErrors()`
    Returns any error messages of the last validation.

`isValid($value)`
    Checks whether the object that was passed to the validator is valid. If yes,
    returns true, otherwise false.

`setOptions(array $validationOptions)`
    Sets specific options for the validator. These options apply to any further call
    of the method isValid().

You can call Validators in your own code with the method `createValidator($validatorName,
$validatorOptions)` in :php:`\TYPO3\CMS\Extbase\Validation\ValidatorResolver`. Though in
general, this is not necessary. Validators are often used in conjunction with domain objects and
controller actions.

Validation of model properties
------------------------------

You can define simple validation rules in the domain model by annotation. For
this, you use the annotation `@validate` with properties of the object. A brief
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
         * @validate Text, StringLength(minimum = 1, maximum = 80)
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
* If the argument is a domain object, the annotations `@validate` in the domain object is taken into
  account and - if set - the appropriate validator in the folder :file:`Domain/Validator` for the
  existing domain object is run.
* If there is set an annotation `@ignorevalidation` for the argument, no validation is done.
* Additional validation rules can be specified via further `@validate` annotations in the methods
  PHPDoc block. The syntax is *@validate $variableName Validator1, Validator2, ...* The syntax is
  almost the same as with validators in the domain model, you only need to set explicitly the
  variable name.

If the arguments of an action can not be validated, then the `errorAction` is executed, which will
usually jump back to the last screen. It is important that validation is not performed in certain
cases. Further information for the usage of the annotation `@dontvalidate` see
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
    Allows you to specify an array of arguments passed to the function `vsprintf`. Allows you to
    fill wildcards in localized strings with values.
