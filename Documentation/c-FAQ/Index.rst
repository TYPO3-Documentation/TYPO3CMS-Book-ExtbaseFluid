.. include:: /Includes.rst.txt
.. _faq_extbase_fluid:

=====================
Extbase und Fluid FAQ
=====================

Extbase
=======

How can I change the actions of a plugin via TypoScript?
--------------------------------------------------------

To define which controller/action pairs belong to a plugin and which
actions are not cacheable, you should always use
:php:`ExtensionUtility::configurePlugin`. However, you can
override the order of actions via TypoScript but you can't define
non-cacheable actions or add new Controllers that way!

How can I specify a storage Pid for my plugins?
-----------------------------------------------

You can specify a global storage Pid for all plugins of your extension
in your TypoScript setup like this:

.. code-block:: typoscript
   :caption: EXT:my_extension/Configuration/TypoScript/setup.typoscript

   plugin.tx_yourextension {
       persistence {
           storagePid = 123
       }
   }

To set it only for one plugin, replace :typoscript:`tx_yourextension` by
:typoscript:`tx_yourextension_yourplugin`. For modules it's the same syntax:


.. code-block:: typoscript
   :caption: EXT:my_extension/Configuration/TypoScript/setup.typoscript

   module.tx_yourextension {
       persistence {
           storagePid = 123
       }
   }

What is the "Extension Name"?
-----------------------------

These are the Extbase naming conventions:

Extension key
   blog_example (= $_EXTKEY)

Extension name
   BlogExample (used e.g. in class names)

Plugin name
   MyPlugin

Plugin key
   myplugin (lowercase, no underscores)

Plugin signature
   blog_example_myplugin (used in TypoScript, TCA)

Plugin namespace
   tx_blogexample_myplugin (used to namespace GET/POST vars)


Fluid
=====

How can I comment out parts of my Fluid template?
-------------------------------------------------

.. note::

   The part was moved to TYPO3 Explained :ref:`t3coreapi:fluid-comments`.

How can I use JavaScript inside Fluid templates?
------------------------------------------------

Since Fluid & JavaScript are using JSON syntax, you should always wrap
inline scripts with CDATA tags (see above). If you want to access Fluid
variables from your scripts, you should instantiate them on top of your
script block like:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/SomeTemplate.html

   <script type="text/javascript">
   var someSetting = "{settings.someSetting}";
   /* <![CDATA[ */
     alert(someSetting);
   /* ]]> */
   </script>

But - if possible - it's even better to extract your scripts to external
files!

How can I get translated validation error messages?
---------------------------------------------------

There will be support for localized error labels at some point.
Currently you can use the error code in order to output the error
message in the current language. See `Translated validation error
messages for Fluid <translated-validation-error-messages-for-fluid>`__.

How can I render localized dates?
---------------------------------

Similar to the localized error messages, you can put date formats in
your locallang files:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/SomeTemplate.html

   [...]
      <label index="culture.date.formatLong">Y-m-d H:i</label>
      <label index="culture.date.formatShort">Y-m-d</label>
   [...]

And then just refer to them in your fluid template: <HTML> {post.date ->
f:format.date(format: '{f:translate(key:
\\'culture.date.formatShort\')}')} </HTML>

If you want to use names for months, you can do so like this:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/SomeTemplate.html

   [...]
      <label index="culture.monthNames.1">january</label>
      <label index="culture.monthNames.2">february</label>
   [...]

Fluid:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/SomeTemplate.html

   {post.date -> f:format.date(format: 'd.')}

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/SomeTemplate.html

   <f:translate key="culture.monthNames.{post.date -> f:format.date(format: 'n')}" />


Can ViewHelpers be nested?
--------------------------

Yes:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/SomeTemplate.html

   <f:format.date format="{f:translate(key: 'culture.date.formatShort')}">{post.date}</f:format.date>

If you use the inline notation for the outer and the inner view helper,
you'll have to take care of the correct escaping:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/SomeTemplate.html

   {post.date -> f:format.date(format: '{f:translate(key: \'culture.date.formatShort\')}')}

You can also use view helpers in array parameters:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/SomeTemplate.html

   <f:translate key="someKey" arguments="{0: 'foo', 1: '{f:count(subject: items)}'}" />

Another nested Example

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/SomeTemplate.html

   <f:translate key="text" htmlEscape="false" arguments="{0: '{f:translate(key: \'here\') -> f:link.action(action: \'show\')}'}" />

.. code-block:: xml
   :caption: File: EXT:my_extension/Resources/Private/Language/locallang.xlf

   <label index="here">this link</label>
   <label index="text">You can use %1$s to register.</label>

The output will be a linked text: You can use **this link** to register.

These are the escaping rules for quotes:

-  Single quotes (') must be escaped with a single backslash, if
   surrounded by a higher level single quote of the outer ViewHelper
-  Single quotes within an escaped quote must be escaped, the number of
   backslashes is @n*2 + 1@, with @n@ the number of backslashes of the
   previous quotation

How can I use dynamic array indexes?
------------------------------------

An array can be accessed dynamically by recursively inserting its index:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/SomeTemplate.html

   <!-- Recursive variable resolving -->
   <f:variable name="array" value="{0: 'foo', 1: 'bar'}" />
   <f:variable name="index" value="1" />
   Variable "index" contains the array position we need.
   Dynamic array index #{index}: {array.{index}} <!-- bar -->

It is even possible to call variables dynamically that way:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/SomeTemplate.html

   <f:variable name="typeOne" value="This is type 1" />
   <f:variable name="typeTwo" value="This is type 2" />
   <f:variable name="selectedType" value="Two" />
   Variable "selectedType" is a string that's part of a variable name.
   Dynamic named variable: {type{selectedType}} <!-- This is type 2 -->

See `Fluid supports variable access with dynamic names/parts of name
<https://twitter.com/NamelessCoder/status/937995733873184768>`__

How can I use Fluid in my Email templates?
------------------------------------------

See `Send mail with FluidEmail <t3coreapi:send-mail-with-fluidemail>`__

Can I compare strings with the if view helper?
----------------------------------------------

Starting from TYPO3 v6.1 this is possible as expected and you can use
constant strings in if view helper as follows:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/SomeTemplate.html

   <f:if condition="{item.status} == 'active'"> Output something </f:if>


Can I use the translate ViewHelper with FLUIDTEMPLATE
-----------------------------------------------------

By default the translate ViewHelper loads labels from the locallang file
inside *Resources/Private/Language/* of the \*current extension*.
FLUIDTEMPLATE uses the Standalone View of Fluid that is by default not
bound to an extension. But you can specify the path to your locallang
file as ViewHelper argument:

.. code-block:: html
   :caption: EXT:my_extension/Resources/Private/Templates/SomeTemplate.html

   <f:translate key="LLL:fileadmin/some/path/locallang.xlf:your.key" />

Alternatively, if you put your locallang files inside an extension (the
recommended way) you can tell the FLUIDTEMPLATE to use that extension by
default:

.. code-block:: typoscript
   :caption: EXT:my_extension/Configuration/TypoScript/setup.typoscript

   10 = FLUIDTEMPLATE
   10.file = some/file
   10.extbase.controllerExtensionName = YourExtension

Now, using :xml:`<f:translate key="someKey" />` will resolve to translations
from :file:`EXT:your_extension/Resources/Private/Language/locallang.xlf`.

