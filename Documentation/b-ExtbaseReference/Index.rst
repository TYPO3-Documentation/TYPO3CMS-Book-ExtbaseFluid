Extbase Reference
=================

In this appendix, you can look up how Extbase interacts with the TYPO3
installation. This includes the registration of plugins and the configuration of
Extbase extensions.

.. note::

	Under http://typo3.org/go/extbasereferencesheet/ you find a useful
	Cheat Sheet for Extbase and Fluid.

.. _configuration_of_frontend_plugins:

Registration of frontend plugins
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

In classical TYPO3 extensions the front-end functionality is divided into
several front-end Plugins. Normally each has a separate code base.
In contrast, there is only one code base in Extbase (a series of controllers and
Actions). Nevertheless, it should be possible to group controllers and Actions
to make it possible to have multiple front-end plugins.

For the definition of a plugin, the files :file:`ext_localconf.php` and :file:`ext_tables.php`
have to be adjusted.

In :file:`ext_localconf.php` resides the definition of permitted Controller Action
Combinations. Also here you have to define which actions should not be cached.
In :file:`ext_tables.php` there is only the configuration of the plugin selector for the
backend. Let's have a look at the following two files:

:file:`ext_localconf.php`::

	\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
		$_EXTKEY,
		$pluginName
		$controllerActionCombinations,
		$uncachedActions
	}

In addition to the extension key and a unique name of the plugin (line 2 and 3)
the allowed combinations of the controller and actions are determined.
``$controllerActionCombinations`` is an associative array. The Keys of this array
are the allowed Controllers, and the values ​​are a comma-separated list of
allowed actions per Controller. The first action of the first controller is the
default action.

Additionally you need to specify which actions should not be cached. To do this,
the fourth parameter also is a list of Controller / Action - Combinations in the
same format as above, containing all the non-cached-actions.

:file:`ext_tables.php`::

	\TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
		$_EXTKEY,
		$pluginName,
		$backendTitle
	);

The extension key and $pluginName must be completely identical to the definition
in :file:`ext_localconf.php`. $backendTitle defines the displayed name of the plugin in
the Backend.
Below there is a complete configuration example for the registration of a
frontend plugin within the files :file:`ext_localconf.php` and :file:`ext_tables.php`.

*Example B-1: Configuration of an extension in the file ext_localconf.php*

::

	\TYPO3\CMS\Extbase\Utility\ExtensionUtility::configurePlugin(
		$_EXTKEY,
		'Pi1',
		array(
			'Blog' => 'index,show,new,create,delete,deleteAll,edit,update,populate',
			'Post' => 'index,show,new,create,delete,edit,update',
			'Comment' => 'create',
		),
		array(
			'Blog' => 'delete,deleteAll,edit,update,populate',
			'Post' => 'show,delete,edit,update',
			'Comment' => 'create',
		)
	);

*Example B-2: Configuration of an extension in the file ext_tables.php*

::

	\TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerPlugin(
		$_EXTKEY,
		'Pi1',
		'A Blog Example'
	);

The plugin name is pi1. It is important that in :file:`ext_localconf.php` and
:file:`ext_tables.php` the name is exactly the same. The default action is the action
index of the Controller *Blog* since this is the first element defined in the
array and the first action in the list.

Caching of actions and records
------------------------------

All actions which change data must not be cacheable. Above, this is for example
the delete action in the blog controller. In the backend now you can see A Blog
Example in the list of plugins (see Figure B-1).

.. Todo: Add section about backend modules.

.. figure:: /Images/b-ExtbaseReference/figure-b-1.png
	:align: center

	Figure B-1: In the selection field for frontend plugins, the name which was defined in the
	file :file:`ext_tables.php` will be displayed

.. sidebar:: Why two files?

	You may wonder why you need to edit both file :file:`ext_localconf.php` and file :file:`ext_tables.php` to
	configure a plugin. The reason lays in the architecture of TYPO3:
	file :file:`ext_localconf.php` is evaluated in the frontend and file :file:`ext_tables.php` in the
	backend. Therefore, in file :file:`ext_tables.php` we add the entry to the plugin list (for
	the back end). In addition, the list of controller / action combinations is
	required at runtime in the frontend - and therefore this must be defined in the
	file file :file:`ext_localconf.php`.

Furthermore, Extbase is clearing the TYPO3 cache automatically for update
processes. This is called *Automatic cache clearing*. This functionality is
activated by default. If a domain object is inserted, changed or deleted, then
the cache of the corresponding page in which the object is located is cleared.
Additionally the setting of TSConfig ``TCEMAIN.clearCacheCmd`` is evaluated for this
page.

Figure B-2 is an example that is explained below:

.. figure:: /Images/b-ExtbaseReference/figure-b-2.png
	:align: center

	Figure B-2: For the sysfolder in which the data was stored, the setting
	``TCEMAIN.clearCacheCmd`` defines that the cache of the page *Blog* should be
	emptied.


The frontend plugin is on the page *Blog* with the ID 11. As a storage folder
for all the blogs and posts the SysFolder *BLOGS* is configured. Now, if an entry
is changed, then the cache of the sysFolder *BLOGS* is emptied and also the
TSConfig configuration ``TCEMAIN.clearCacheCmd`` for the sysFolder is evaluated.
This contains a comma-separated list of Page IDs, for which the cache should be
emptied. In this case, when updating a record in the SysFolder *BLOGS* (e.g.
Blogs, Posts, Comments) automatically the cache of the page *Blog* (with ID 11)
is cleared, so the changes are immediately visible.

Even if the user enters incorrect data in a form (and this form will be
displayed again), the cache of the current page is deleted to force a new
representation of the form.

The automatic cache clearing is enabled by default, you can use TypoScript
configuration to disable it (see next section).

TypoScript Configuration
^^^^^^^^^^^^^^^^^^^^^^^^

Each Extbase-based extension has some settings which can be modified using
TypoScript. Many of these settings affect aspects of the internal Configuration
of Extbase and Fluid. There is also a block ``settings`` in which you can set
Extension-specific settings, which can be accessed in the Controllers and
Templates of your extensions.

**plugin.tx_[lowercasedextensionname]**

The TypoScript configuration of the extension is always located below this
TypoScript path. The "lowercased extension name" is the extension key with no
underscore (_), as for example in blogexample. The configuration is divided into
the following sections:

features
--------

Activate features for extbase or a specific plugin.

``features.skipDefaultArguments``
	Skip default arguments in URLs. If a link to the default controller or action
	is created, the parameters are omitted.
	Default is ``false``.

persistence
-----------

Here are settings relevant to the persistence layer of Extbase.

``persistence.classes``
	This settings are used with individual classes. That includes in particular the
	mapping of classes and property names to tables and field names.

``persistence.classes.Vendor\MyExt\Domain\Model\Foo.mapping.columns``
	Here you can configure fields which differ from the regular naming conventions.
	You use the form ``field_name.mapOnProperty = propertyName``.

``persistence.classes.Vendor\MyExt\Domain\Model\Foo.mapping.recordType``
	Here you can specify a string literal, which - if set - should be stored in the
	type field of the table.

``persistence.classes.Vendor\MyExt\Domain\Model\Foo.mapping.tableName``
	Here you can set a table name which differs from the regular naming conventions.

``persistence.classes.Vendor\MyExt\Domain\Model\Foo.newRecordStoragePid``
	Page-ID in which new records of the given class should be saved.

``persistence.classes.Vendor\MyExt\Domain\Model\Foo.subclasses``
	List all subclasses of the class given in the form *ClassName = ClassName*.

``persistence.enableAutomaticCacheClearing``
	Enables the automatic cache clearing when changing data sets (see also the
	section "Configuration of frontend plugins" above in this chapter).
	Enabled by default.

``persistence.storagePid``
	List of Page-IDs, from which all records are read (see the section "Creating the
	repositories" in Chapter 6).

settings
--------

Here reside are all the domain-specific extension settings. This setting are
available as an array in the controllers in ``$this->settings`` and in any Fluid
template with ``{settings}``.

view
----

View and template settings.

``view.layoutRootPath``
	This can be used to specify the root path for all fluid layouts in this
	extension. If nothing is specified, the path
	:file:`extensionName/Resources/Private/Layouts` is used. All layouts that are necessary
	for this extension should reside in this folder.

``view.partialRootPath``
	This can be used to specify the root path for all fluid partials in this
	extension. If nothing is specified, the path
	:file:`extensionName/Resources/Private/Partials` is used. All partials that are
	necessary for this extension should reside in this folder.

``view.pluginNamespace``
	This can be used to specify an alternative namespace for the plugin.
	Use this to shorten the extbase default plugin namespace or to access
	arguments from other extensions by setting this option to their namespace.

``view.templateRootPath``
	This can be used to specify the root path for all fluid templates in this
	extension. If nothing is specified, the path
	:file:`extensionName/Resources/Private/Templates` is used. All layouts that are necessary
	for this extension should reside in this folder.

	There is no fallback to the files that are delivered with an extension!
	Therefore you need to copy all original templates to this folder before you set
	this TypoScript setting.

_LOCAL_LANG
-----------

Under this key you can modify localized strings for this extension.
If you specify for example ``plugin.tx_blogexample._LOCAL_LANG.default.read_more =
More>>`` then the standard translation for the key read_more is overwritten by the
string *More>>*.

Class Hierarchy
^^^^^^^^^^^^^^^

The MVC Framework is the heart of Extbase. Below we will give you an overview of
the class hierarchy for the controllers and the API of the ActionControllers.

Normally you will let your controllers inherit from ActionController. If you
have special requirements that can not be realized with the ActionController,
you should have a look at the controllers below.

:class:`\\TYPO3\\CMS\\Extbase\\Mvc\\Controller\\ControllerInterface`
	The basic interface that must be implemented by all controllers.

:ref:`t3api:TYPO3\\CMS\\Extbase\\Mvc\\Controller\\AbstractController`
	Abstract controller with basic functionality.

:ref:`t3api:TYPO3\\CMS\\Extbase\\Mvc\\Controller\\ActionController`
	The most widely used controller in Extbase. An overview of its API is given in
	the following section.

:ref:`t3api:TYPO3\\CMS\\Extbase\\Mvc\\Controller\\CommandController`
	Extend this controller if you want to provide commands to the scheduler or command line
	interface.

ActionController API
--------------------

The action controller is usually the base class for your own controller. Below
you see the most important properties of the action controller:

``$actionMethodName``
	Name of the executed action.

``$argumentMappingResults``
	Results of the argument mapping. Is used especially in the errorAction.

``$defaultViewObjectName``
	Name of the default view, if no fluid-view or an action-specific view was found.

``$errorMethodName``
	Name of the action that is performed when generating the arguments of actions
	fail. Default is errorAction. In general, it is not sensible to change this.

``$request``
	Request object of type :class:`\\TYPO3\\CMS\\Extbase\\Mvc\\RequestInterface`.

``$response``
	Response object of type :class:`\\TYPO3\\CMS\\Extbase\\Mvc\\ResponseInterface`.

``$settings``
	Domain-specific extension settings from TypoScript (as array).

``$view``
	The view used of type :class:`\\TYPO3\\CMS\\Extbase\\Mvc\\View\\ViewInterface`.

``$viewObjectNamePattern``
	If no fluid template is found for the current action, extbase attempts to find a
	PHP-View-Class for the action. The naming scheme of the PHP-View-Class can be
	changed here. By default names are used according to the scheme
	*@vendor\@extension\View\@controller\@action@format*. All string-parts marked with @
	are replaced by the corresponding values. If no view class with this name is
	found, @format is removed from the pattern and again tried to find a view class
	with that name.

Most important API methods of the action controller
---------------------------------------------------

:code:`Action()`
	Defines an action.

:code:`errorAction()`
	Standard error action. Needs to be adjusted only in very rare cases. The name of
	this method is defined by the property $errorMethodName.

:code:`forward($actionName, $controllerName = NULL, $extensionName = NULL, array $arguments = NULL)`
	Issues an immediate internal forwarding of the request to another controller.

:code:`initializeAction()`
	Initialization method for all actions. Can be used to e.g. register arguments.

:code:`initialize[actionName]Action()`
	Action-specific initialization, which is called only before the specific action.
	Can be used to e.g. register arguments.

:code:`initializeView(\TYPO3\CMS\Extbase\Mvc\View\ViewInterface $ view)`
	Initialization method to configure and initialize the passed view.

:code:`redirect($actionName, $controllerName = NULL, $extensionName = NULL, array $arguments = NULL, $pageUid = NULL, $delay = 0, $statusCode = 303)`
	External HTTP redirect to another controller (immediately)

:code:`redirectToURI($uri, $delay = 0, $statusCode = 303)`
	Redirect to full URI (immediately)

:code:`resolveView()`
	By overriding this method you can build and configure a completely individual
	view object. This method should return a complete view object. In general,
	however, it is sufficient to overwrite resolveViewObjectName().

:code:`resolveViewObjectName()`
	Resolves the name of the view object, if no suitable fluid template could be
	found.

:code:`throwStatus($statusCode, $statusMessage = NULL, $content = NULL)`
	The specified HTTP status code is sent immediately.

Actions
-------

All public methods that end in action (for example ``indexAction`` or ``showAction``),
are automatically registered as actions of the controller.

Many of these actions have parameters. These appear as annotations in the Doc-Comment-Block
of the specified method, as shown in Example B-3:

*Example B-3: Actions with parameters*

::

	/**
	  * Displays a form for creating a new blog
	  *
	  * @param \Ex\BlogExample\Domain\Model\Blog $newBlog A fresh blog object which should be taken
	           as a basis for the form if it is set.
	  * @return string An HTML form for creating a new blog
	  * @dontvalidate $newBlog
	  */
	public function newAction(\Ex\BlogExample\Domain\Model\Blog $newBlog = NULL) {
	  $this->view->assign('newBlog', $newBlog);
	);

	public function newAction(\Ex\BlogExample\Domain\Model\Blog $newBlog = NULL) {
	  $this->view->assign('newBlog', $newBlog);
	);

It is important to specify the full type in the *@param* annotation as this is used for the validation
of the object. Note that not only simple data types such as String, Integer or Float can be validated,
but also complex object types (see also the section "validating domain objects" in Chapter 9).

In addition, on actions showing the forms used to create or edit domain View objects, the validation of
domain objects must be explicitly disabled - therefore the annotation *@dontvalidate* is necessary.

Default values ​​can, as usual in PHP, just be indicated in the method signature. In the above case,
the default value of the parameter ``$newBlog`` is set to NULL. If an action returns NULL or nothing,
then automatically ``$this->view->render()`` is called, and thus the view is rendered.

Define initialization code
--------------------------

Sometimes it is necessary to execute code before calling an action. This is the case, for example,
if complex arguments must be registered or required classes must be instantiated.

There is a generic initialization method called :code:`initializeAction()`, which is called after
the registration of arguments, but before calling the appropriate action method itself. After that
generic :code:`initializeAction()`, if it exists, a method named *initialize[ActionName]()* is called.
Here you can perform action specific initializations (e.g. :code:`initializeShowAction()`).
Only then the action itself is called.

Catching validation errors with errorAction
-------------------------------------------

If an argument validation error has occurred, the method :code:`errorAction()` is called. There,
in ``$this->argumentsMappingResults`` you have a list of occurred warnings and errors of the argument
mappings available. This default ``errorAction`` refers back to the last sent form, if the referrer
was sent with it.

Application domain of the extension
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The domain of the extension is always located below :file:`Classes/Domain`. This folder is structured
as follows:

:file:`Model/`
	Contains the domain model itself.

:file:`Repository/`
	Contains the repositories to access the domain model.

:file:`Validator/`
	Contains specific validators for the domain model.

Domain model
------------

All classes of the domain model must inherit from one of the following two classes:

:class:`\\TYPO3\\CMS\\Extbase\\DomainObject\\AbstractEntity`
	Is used if the object is an entity, i.e. possesses an identity.

:class:`\\TYPO3\\CMS\\Extbase\\DomainObject\\AbstractValueObject`
	Is used if the object is a ValueObject, i.e. if its identity is defined by all of its properties.
	ValueObjects are immutable.

Repositories
------------

All repositories inherit from :class:`Tx_Extbase_Persistence_Repository`. A repository is always
resposible for precisely one type of domain object. The naming of the repositories is important:
If the domain object is for example Blog (with full name :class:`Tx_BlogExample_Domain_Model_Blog`),
then the corresponding repository is named *BlogRepository* (with full name
:class:`Tx_BlogExample_Domain_Repository_BlogRepository`).

Public Repository API
~~~~~~~~~~~~~~~~~~~~~

Each repository provides the following public methods:

:code:`add($object)`
	Adds a new object.

:code:`findAll()` and :code:`countAll()`
	returns all domain objects (or the number of them) it is responsible for.

:code:`findByUid($uid)`
	Returns the domain object with this UID.

:code:`findByProperty($propertyValue)` and :code:`countByProperty($propertyValue)`
	Magic finder method. Finding all objects (or the number of them) for the property *property* having
	a value of ``$propertyValue`` and returns them in an array, or the number as an integer value.

:code:`findOneByProperty($propertyValue)`
	Magic finder method. Finds the first object, for which the given property *property* has the value
	$propertyValue.

:code:`remove($object)` and :code:`removeAll()`
	Deletes an object (or all objects) in the repository.

:code:`replace($existingObject, $newObject)`
	Replaces an object of the repositories with another.

:code:`update($object)`
	Updates the persisted object.

Custom find methods in repositories
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

A repository can be extended by own finder methods. Within this methods you can use the ``Query`` object,
to formulate a request:

::

	public function findWithCategory(\Ex\BlogExample\Domain\Model\Category $region) {
	  $query = $this->createQuery();
	  $query->matching($query->contains('categories', $category));
	  return $query->execute();
	}

Create a ``Query`` object within the repository through ``$this->createQuery()``. You can give the query
object a constraint using ``$query->matching($constraint)``. The following comparison operations for
generating a single condition are available:

:code:`$query->equals($propertyName, $operand, $caseSensitive);`
	Simple comparison between the value of the property provided by $propertyName and the operand.
	In the case of strings you can specified additionally, whether the comparison is case-sensitive.

:code:`$query->in($propertyName, $operand);`
	Checks if the value of the property _$propertyName_ is present within the series of values ​​in ``$operand``.

:code:`$query->contains($propertyName, $operand);`
	Checks whether the specified property ``$propertyName`` containing a collection has an element
	``$operand`` within that collection.

:code:`$query->like($propertyName, $operand);`
	Comparison between the value of the property specified by $propertyName and a string $operand.
	In this string, the %-character is interpreted as placeholder (similar to * characters in search
	engines, in reference to the SQL syntax).

:code:`$query->lessThan($propertyName, $operand);`
	Checks if the value of the property $propertyName is less than the operand.

:code:`$query->lessThanOrEqual($propertyName, $operand);`
	Checks if the value of the property $propertyName is less than or equal to the operand.

:code:`$query->greaterThan($propertyName, $operand);`
	Checks if the value of the property $propertyName is greater than the operand.

:code:`$query->greaterThanOrEqual($propertyName, $operand);`
	Checks if the value of the property $propertyName is greater than or equal to the operand.

Since 1.1 ``$propertyName`` is not necessarily only a simple property-name but also can be a "property path".
    Example: ``$query->equals('categories.title', 'tools')`` searches for objects having a category titled
    "tools" assigned. If necessary, you can combine multiple conditions with boolean operations.

:code:`$query->logicalAnd($constraint1, $constraint2);`
	Two conditions are joined with a logical *and*, it gives back the resulting condition. Since Extbase
	1.1 also an array of conditions is allowed.

:code:`$query->logicalOr($constraint1, $constraint2);`
	Two conditions are joined with a logical *or*, it gives back the resulting condition. Since Extbase
	1.1 also an array of conditions is allowed.

:code:`$query->logicalNot($constraint);`
	Returns a condition that inverts the result of the given condition (logical *not*).

In the section "Individual queries," in Chapter 6  you can find a comprehensive example for building queries.

Validation
^^^^^^^^^^

You can write your own validators for domain models. These must be located in
the folder :file:`Domain/Validator/`, they must be named exactly as the corresponding
Domain model, but with the suffix Validator and implement the interface
:class:`\\TYPO3\\CMS\\Extbase\\Validation\\Validator\\ValidatorInterface`. For more details, see the
following Section.

Validation API
--------------

Extbase provides a generic validation system which is used in many places in
Extbase and Fluid. Extbase provides validators for common data types, but you
can also write your own validators. Each Validator implements the
:class:`\\TYPO3\\CMS\\Extbase\\Validation\\Validator\\ValidatorInterface` that defines the following
methods:

:code:`getErrors()`
	Returns any error messages of the last validation.

:code:`isValid($value)`
	Checks whether the object that was passed to the validator is valid. If yes,
	returns true, otherwise false.

:code:`setOptions(array $validationOptions)`
	Sets specific options for the validator. These options apply to any further call
	of the method isValid().

You can call Validators in your own code with the method
:code:`createValidator($validatorName, $validatorOptions)` in
:class:`\\TYPO3\\CMS\\Extbase\\Validation\\ValidatorResolver`. Though in general, this is not
necessary. Validators are often used in conjunction with domain objects and
controller actions.

Validation of model properties
------------------------------

You can define simple validation rules in the domain model by annotation. For
this, you use the annotation *@validate* with properties of the object. A brief
example:

*Example B-4: validation in the domain object*

::

	namespace Ex\BlogExample\Domain\Model;

	class Blog extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity {
		/**
		 * The blog's title.
		 *
		 * @var string
		 * @validate Text, StringLength(minimum = 1, maximum = 80)
		 */
		protected $title;
		// the class continues here
	};

In this code section, the validators for the $title attribute of the Blog object
is defined. $title must be a text (ie, no HTML is allowed), and also the length
of the string is checked with the StringLength-Validator (it must be between 1
and 80 characters). Several validators for a property can be separated by
commas. Parameter of the validators are set in parentheses. You can omit the
quotes for validator options if they are superfluous as in the example above.
If complex validation rules are necessary (for example, multiple fields to be
checked for equality), you must implement your own validator.

Validation of controller arguments
----------------------------------

Each controller argument is validated by the following rules: If the argument
has a simple type (string, integer, etc.), this type is checked. If the argument
is a domain object, the annotation *@validate* in the domain object is taken into
account and - if set - the appropriate validator in the folder :file:`Domain/Validator`
for the existing domain object is run. If there is set an annotation
*@dontvalidate* for the argument, no validation is done. Additional validation
rules can be specified via further *@validate* annotations in the methods PHPDoc
block. The syntax is *@validate $variableName Validator1, Validator2, ...* The
syntax is almost the same as with validators in the domain model, you only needs
to set explicitly the variable name.

If the arguments of an action can not be validated, then the errorAction is
executed, which will usually jump back to the last screen. It is important that
validation is not performed in certain cases. Further information for the usage
of the annotation *@dontvalidate* see 'case studies Example: Editing an existing
object' in Chapter 9


Localization
^^^^^^^^^^^^

Multilingual websites are widespread nowadays, which means that the
web-available texts have to be localized. Extbase provides the helper class
:class:`\\TYPO3\\CMS\\Extbase\\Utility\\LocalizationUtility` for the translation of the labels. In addition,
there is the Fluid ViewHelper translate, with the help of whom you can use that
functionality in templates.

The localization class has only one public static method called translate, which
does all the translation. The method can be called like this:

``\TYPO3\CMS\Extbase\Utility\LocalizationUtility::translate($key, $extensionName, $arguments=NULL)``

``$key``
	The identifier to be translated. If then format *LLL:path:key* is given, then this
	identifier is used and the parameter $extensionName is ignored. Otherwise, the
	file :file:`Resources/Private/Language/locallang.xml` from the given extension is loaded
	and the resulting text for the given key in the current language returned.

``$extensionName``
	The extension name. It can be fetched from the request.

``$arguments``
	Allows you to specify an array of arguments passed to the function vsprintf. Allows you to fill
	wildcards in localized strings with values.

In Fluid there is the translate ViewHelper, which works by the same rules. For a
case study for localization, see Chapter 9.
