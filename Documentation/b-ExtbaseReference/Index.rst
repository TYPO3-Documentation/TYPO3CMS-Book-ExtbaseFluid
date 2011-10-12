Extbase Reference
==================================

In this appendix, you can look up how Extbase interacts with the TYPO3 
installation. This includes the registration of plugins and the configuration of 
Extbase-Extensions.

.. note::

	Under http://typo3.org/go/extbasereferencesheet/ you find a useful Cheat Sheet for Extbase and Fluid.

Configuration of frontend plugins
----------------------------------

In classical TYPO3 extensions the front-end functionality is divided into 
several front-end Plugins. Normally each has a separate code base.
In contrast, there is only one code base in Extbase (a series of controllers and 
Actions). Nevertheless, it should be possible to group controllers and Actions 
to make it possible to have multiple front-end plugins.

For the definition of a plugin, the files ext_localconf.php and ext_tables.php 
have to be adjusted.

In ext_localconf.php resides the definition of permitted Controller Action 
Combinations. Also here you have to define which actions should not be cached. 
In ext_tables.php there is only the configuration of the plugin selector for the 
backend. Let's have a look at the following two files:

ext_localconf.php::

	Tx_Extbase_Utility_Extension::configurePlugin(
		$_EXTKEY,
		$pluginName
		$controllerActionCombinations,
		$uncachedActions
	}

In addition to the extension key and a unique name of the plugin (line 2 and 3) 
the allowed combinations of the controller and actions are determined. 
$controllerActionCombinations is an associative array. The Keys of this array 
are the allowed Controllers, and the values ​​are a comma-separated list of 
allowed actions per Controller. The first action of the first controller is the 
default action.

Additionally you need to specify which actions should not be cached. To do this, 
the fourth parameter also is a list of Controller / Action - Combinations in the 
same format as above, containing all the non-cached-actions.

ext_tables.php::

	Tx_Extbase_Utility_Extension::registerPlugin(
		$ _EXTKEY,
		$pluginName,
		$backendTitle
	);


The extension key and $pluginName must be completely identical to the definition 
in ext_localconf.php. $backendTitle defines the displayed name of the plugin in 
the Backend.
Below there is a complete configuration example for the registration of a 
frontend plugin within the files ext_localconf.php and ext_tables.php.

Example B-1: Configuration of an extension in the file ext_localconf.php::

	Tx_Extbase_Utility_Extension::configurePlugin(
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

_Example B-2: Configuration of an extension in the file ext_tables.php

::

	Tx_Extbase_Utility_Extension::registerPlugin(
		$_EXTKEY,
		'Pi1',
		'A Blog Example'
	);

The plugin name is pi1. It is important that in ext_localconf.php and 
ext_tables.php the name is exactly the same. The default action is the action 
index of the Controller Blog since this is the first element defined in the 
array and the first action in the list.

All actions which change data must not be cacheable. Above, this is for example 
the delete action in the blog controller. In the backend now you can see A Blog 
Example in the list of plugins (see Figure B-1).

TODO: insert image

.. sidebar:: Why two files?

	You may wonder why you need to edit both ext_localconf.php and ext_tables.php to 
	configure a plugin. The reason lays in the architecture of TYPO3: 
	ext_localconf.php is evaluated in the frontend and ext_tables.php in the 
	backend. Therefore, in ext_tables.php we add the entry to the plugin list (for 
	the back end). In addition, the list of controller / action combinations is 
	required at runtime in the frontend - and therefore this must be defined in the 
	file ext_localconf.php.

Furthermore, Extbase is clearing the TYPO3 cache automatically for update 
processes. This is called Automatic cache clearing. This functionality is 
activated by default. If a domain object is inserted, changed or deleted, then 
the Cache of the corresponding page in which the object is located iscleared. 
Additionally the setting of TSConfig TCEMAIN.clearCacheCmd is evaluated for this 
page.

Figure B-2 is an example that is explained below:

TODO: insert image

Figure B-2: For the sysfolder in which the data was stored, the setting 
"TCEMAIN.clearCacheCmd" defines that the cache of the page "Blog" should be 
emptied.

The frontend plugin is on the page "Blog" with the ID 11. As a storage folder 
for all the blogs and posts the SysFolder BLOGS is configured. Now, if an entry 
is changed, then the cache of the sysFolder "BLOGS" is emptied and also the 
TSConfig configuration TCEMAIN.clearCacheCmd for the sysFolder is evaluated. 
This contains a comma-separated list of Page IDs, for which the cache should be 
emptied. In this case, when updating a record in the SysFolder "BLOGS" (e.g. 
Blogs, Posts, Comments) automatically the cache of the page "Blog" (with ID 11) 
is cleared, so the changes are immediately visible.

Even if the user enters incorrect data in a form (and this form will be 
displayed again), the cache of the current page is deleted to force a new 
representation of the form.

The automatic cache clearing is enabled by default, you can use TypoScript 
configuration to disable it (see next section).

TypoScript Configuration
-------------------------

Each Extbase-based extension has some settings which can be modified using 
TypoScript. Many of these settings affect aspects of the internal Configuration 
of Extbase and Fluid. There is also a block "settings" in which you can set 
Extension-specific settings, which can be accessed in the Controllers and 
Templates of your extensions.

plugin.tx_[lowercasedextensionname]

The TypoScript configuration of the extension is always located below this 
TypoScript path. The "lowercased extension name" is the extension key with no 
underscore (_), as for example in blogexample. The configuration is divided into 
the following sections:


persistence

Here are settings relevant to the persistence layer of Extbase.

persistence.classes

This settings are used with individual classes. That includes in particular the 
mapping of classes and property names to tables and field names.

persistence.classes.Tx_MyExt_Domain_Model_Foo.mapping.columns

Here you can configure fields which differ from the regular naming conventions. 
You use the form field_name.mapOnProperty = propertyName. This is especially 
necessary for Single Table Inheritance (see section "Using external data 
sources" and "map class hierarchies" in Chapter 6).

persistence.classes.Tx_MyExt_Domain_Model_Foo.mapping.recordType

Here you can specify a string literal, which - if set - should be stored in the 
type field of the table. This is especially necessary for Single Table 
Inheritance (see section "Using external data sources" and "map class 
hierarchies" in Chapter 6).

persistence.classes.Tx_MyExt_Domain_Model_Foo.mapping.tableName

Here you can set a table name which differs from the regular naming conventions. 
This is especially necessary for Single Table Inheritance (see section "Using 
external data sources" and "map class hierarchies" in Chapter 6).

persistence.classes.Tx_MyExt_Domain_Model_Foo.newRecordStoragePid

Page-ID in which new records of the given class should be saved.

persistence.classes.Tx_MyExt_Domain_Model_Foo.subclasses

List all subclasses of the class given in the form ClassName = Class Name here 
(see "map class hierarchies" in Chapter 6).

persistence.enableAutomaticCacheClearing

Enables the automatic cache clearing when changing data sets (see also the 
section "Configuration of frontend plugins" above in this chapter). 
Enabled by default.

persistence.storagePid
List of Page-IDs, from which all records are read (see the section "Creating the repositories" in Chapter 6).

settings

Here reside are all the domain-specific extension settings. This setting are 
available as an array in the controllers in $this->settings and in any Fluid 
template with {settings}.

view

View and template settings.

view.layoutRootPath

This can be used to specify the root path for all fluid layouts in this 
extension. If nothing is specified, the path 
extensionName/Resources/Private/Layouts is used. All layouts that are necessary 
for this extension should reside in this folder.

view.partialRootPath

This can be used to specify the root path for all fluid partials in this 
extension. If nothing is specified, the path 
extensionName/Resources/Private/Partials is used. All partials that are 
necessary for this extension should reside in this folder.

view.templateRootPath
This can be used to specify the root path for all fluid templates in this 
extension. If nothing is specified, the path 
extensionName/Resources/Private/Templates is used. All layouts that are necessary for this extension should reside in this folder.

There is no fallback to the files that are delivered with an extension! 
Therefore you need to copy all original templates to this folder before you set 
this TypoScript setting.

_LOCAL_LANG

Under this key you can modify localized strings for this extension.
If you specify for example plugin.tx_blogexample._LOCAL_LANG.default.read_more = 
More>> then the standard translation for the key read_more is overwritten by the 
string "More>>".

Using Model View Controller
===========================

The MVC Framework is the heart of Extbase. Below we will give you an overview of 
the class hierarchy for the controllers and the API of the ActionControllers.

Class Hierarchy
---------------

Normally you will let your controllers inherit from ActionController. If you 
have special requirements that can not be realized with the ActionController, 
you should have a look at the controllers below.

Tx_Extbase_MVC_Controller_ControllerInterface

The basic interface that must be implemented by all controllers.

Tx_Extbase_MVC_Controller_AbstractController

Abstract controller with basic functionality.

Tx_Extbase_MVC_Controller_ActionController

The most widely used controller in Extbase. An overview of its API is givben in 
the following section.

ActionController API
---------------------

The action controller is usually the base class for your own controller. Below 
you see the most important properties of the action controller:

$actionMethodName

Name of the executed action.

$argumentMappingResults

Results of the argument mapping. Is used especially in the errorAction.

$defaultViewObjectName

Name of the default view, if no fluid-view or an action-specific view was found.

$errorMethodName

Name of the action that is performed when generating the arguments of actions 
fail. Default is errorAction. In general, it is not sensible to change this.

$request

Request object of type Tx_Extbase_MVC_RequestInterface.

$response

Response object of type Tx_Extbase_MVC_ResponseInterface.

$settings

Domain-specific extension settings from TypoScript (as array).

$view

The view used (of type Tx_Extbase_MVC_View_ViewInterface).

$viewObjectNamePattern

If no fluid template is found for the current action, extbase attempts to find a 
PHP-View-Class for the action. The naming scheme of the PHP-View-Class can be 
changed here. By default names are used according to the scheme 
Tx@extension_View_@controller_@action_@format_. All string-parts marked with @ 
are replaced by the corresponding values​​. If no view class with this name is 
found, @format is removed from the pattern and again tried to find a view class 
with that name.

Now follow the most important API methods of the action controller:

Action()

Defines an action.

errorAction()

Standard error action. Needs to be adjusted only in very rare cases. The name of 
this method is defined by the property $errorMethodName.

forward($actionName, $controllerName = NULL, $extensionName = NULL, array 
$arguments = NULL)

Issues an immediate internal forwarding of the request to another controller.

initializeAction()

Initialization method for all actions. Can be used to e.g. register arguments.

initialize[actionName]Action()

Action-specific initialization, which is called only before the specific action. 
Can be used to e.g. register arguments.

initializeView(Tx_Extbase_MVC_ViewInterface $ view)

Initialization method to configure and initialize the passed view.

redirect($actionName, $controllerName = NULL, $extensionName = NULL, array 
$arguments = NULL, $pageUid = NULL, $delay = 0, $statusCode = 303)

External HTTP redirect to another controller (immediately)

redirectToURI($uri, $delay = 0, $statusCode = 303)

Redirect to full URI (immediately)

resolveView()

By overriding this method you can build and configure a completely individual 
view object. This method should return a complete view object. In general, 
however, it is sufficient to overwrite resolveViewObjectName().

resolveViewObjectName()

Resolves the name of the view object, if no suitable fluid template could be 
found.

throwStatus($statusCode, $statusMessage = NULL, $content = NULL)

The specified HTTP status code is sent immediately.



TODO: text missing page 267 + 268 + 269 + 270



Validators
----------

You can write your own validators for domain models. These must be located in 
the folder Domain/Validator/, they must be named exactly as the corresponding 
Domain model, but with the suffix Validator and implement the interface 
Tx_Extbase_Validation_Validator_ValidatorInterface. For more details, see the 
following Section.

Validation
==========

Extbase provides a generic validation system which is used in many places in 
Extbase and Fluid. Extbase provides validators for common data types, but you 
can also write your own validators. Each Validator implements the 
Tx_Extbase_Validation_Validator_ValidatorInterface that defines the following 
methods:

getErrors()

Returns any error messages of the last validation.

isValid($value)

Checks whether the object that was passed to the validator is valid. If yes, 
returns true, otherwise false.

setOptions(array $validationOptions)

Sets specific options for the validator. These options apply to any further call 
of the method isValid().

You can call Validators in your own code with the method 
createValidator($validatorName, $validatorOptions) in 
Tx_Extbase_Validation_ValidatorResolver. Though in general, this is not 
necessary. Validators are often used in conjunction with domain objects and 
controller actions.

Validating properties of the domain model
------------------------------------------

You can define simple validation rules in the domain model by annotation. For 
this, you use the annotation @validate with properties of the object. A brief 
example:


Example B-4: validation in the domain object

::

	class Tx_BlogExample_Domain_Model_Blog extends Tx_Extbase_DomainObject_AbstractEntity {
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
--------------------------------------

Each controller argument is validated by the following rules: If the argument 
has a simple type (string, integer, etc.), this type is checked. If the argument 
is a domain object, the annotation @validate in the domain object is taken into 
account and - if set - the appropriate validator in the folder Domain/Validator 
for the existing domain object is run. If there is set an annotation 
@dontvalidate for the argument, no validation is done. Additional validation 
rules can be specified via further @validate annotations in the methods PHPDoc 
block. The syntax is @validate $variableName Validator1, Validator2, ... The 
syntax is almost the same as with validators in the domain model, you only needs 
to set explicitly the variable name.

If the arguments of an action can not be validated, then the errorAction is 
executed, which will usually jump back to the last screen. It is important that 
validation is not performed in certain cases. Further information for the usage 
of the annotation @dontvalidate see 'case studies Example: Editing an existing 
object' in Chapter 9


Localization
=============

Multilingual websites are widespread nowadays, which means that the 
web-available texts have to be localized. Extbase provides the helper class 
Tx_Extbase_Utility_Localization for the translation of the labels. In addition, 
there is the fluid ViewHelper translate, with the help of whom you can use that 
functionality in templates.

The localization class has only one public static method called translate, which 
does all the translation. The method can be called like this:

Tx_Extbase_Utility_Localization::translate($key, $extensionName, 
$arguments=NULL)

$key

The identifier to be translated. If then format LLL:path:key is given, then this 
identifier is used and the parameter $extensionName is ignored. Otherwise, the 
file Resources/Private/Language/locallang.xml from the given extension is loaded 
and the resulting text for the given key in the current language returned.

$extensionName

The extension name. It can be fetched from the request.

$arguments

Allows you to specify an array of arguments passed to the function vsprintf. Allows you to fill wildcards in localized strings with values.

In Fluid there is the translate-ViewHelper, which works by the same rules. For a 
Case study for localization, see Chapter 9.