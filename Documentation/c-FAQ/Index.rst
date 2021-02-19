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

.. code-block:: ts

   plugin.tx_yourextension {
       persistence {
           storagePid = 123
       }
   }

To set it only for one plugin, replace :ts:`tx_yourextension` by
:ts:`tx_yourextension_yourplugin`. For modules it's the same syntax:

.. code-block:: ts

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


Solving "Fatal error: Maximum function nesting level of '100' reached, aborting!"
---------------------------------------------------------------------------------

That error comes from `Xdebug <http://xdebug.org>`__ and tells you, that
a recursion level of 100 is reached within your PHP code. You can get
rid of this error by disabling Xdebug or by increasing the maximum
nesting level in php.ini:


.. code-block:: code

   xdebug.max_nesting_level = 250


Fluid
=====

How can I comment out parts of my Fluid template?
-------------------------------------------------

As the Fluid syntax is basically XML, you can use CDATA tags to comment
out parts of your template:

.. code-block:: xml

   <![CDATA[
   This will be ignored by the Fluid parser
   ]]>

If you want to hide the contents from the browser, you can additionally
encapsulate the part in HTML comments:


.. code-block:: xml

   <!--<![CDATA[
   This will be ignored by the Fluid parser and by the browser
   ]]>-->

Note: This way the content will still be transfered to the browser! If
you want to completely skip parts of your template, you can make use of
the **f:comment** view helper. To disable parsing you best combine it
with CDATA tags:


.. code-block:: xml

   <f:comment><![CDATA[
   This will be ignored by the Fluid parser and won't appear in the source code of the rendered template
   ]]></f:comment>

How can I use JavaScript inside Fluid templates?
------------------------------------------------

Since Fluid & JavaScript are using JSON syntax, you should always wrap
inline scripts with CDATA tags (see above). If you want to access Fluid
variables from your scripts, you should instantiate them on top of your
script block like:


.. code-block:: xml

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


.. code-block:: code

      [...]
          <label index="culture.date.formatLong">Y-m-d H:i</label>
          <label index="culture.date.formatShort">Y-m-d</label>
      [...]

And then just refer to them in your fluid template: <HTML> {post.date ->
f:format.date(format: '{f:translate(key:
\\'culture.date.formatShort\')}')} </HTML>

If you want to use names for months, you can do so like this: locallang:


.. code-block:: code

   ::

      [...]
          <label index="culture.monthNames.1">january</label>
          <label index="culture.monthNames.2">february</label>
      [...]

Fluid:


.. code-block:: xml

   {post.date -> f:format.date(format: 'd.')}

.. code-block:: xml

   <f:translate key="culture.monthNames.{post.date -> f:format.date(format: 'n')}" />


Can ViewHelpers be nested?
--------------------------

Yes:


.. code-block:: xml

   <f:format.date format="{f:translate(key: 'culture.date.formatShort')}">{post.date}</f:format.date>

If you use the inline notation for the outer and the inner view helper,
you'll have to take care of the correct escaping:


.. code-block:: xml

   {post.date -> f:format.date(format: '{f:translate(key: \'culture.date.formatShort\')}')}

You can also use view helpers in array parameters:


.. code-block:: xml

   <f:translate key="someKey" arguments="{0: 'foo', 1: '{f:count(subject: items)}'}" />

Another nested Example

.. code-block:: xml

   <f:translate key="text" htmlEscape="false" arguments="{0: '{f:translate(key: \'here\') -> f:link.action(action: \'show\')}'}" />



.. code-block:: xml
   :caption: File: locallang.xml

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

That is currently not possible with Fluid. So its not possible to
replace *{someArray.123}* by *{someArray.{someDynamicIndex}}* for
example because that would violate the Fluid syntax. You can, however,
create a simple ViewHelper that wraps functionality of
*Tx_Extbase_Utility_ObjectAccess*. But preferably you should move that
kind of logic to your domain model.

How can I use Fluid in my Email templates?
------------------------------------------

See `Send mail with FluidEmail <t3coreapi:send-mail-with-fluidemail>`__

Can I compare strings with the if view helper?
----------------------------------------------

Starting from TYPO3 6.1 this is possible as expected and you can use
constant strings in if view helper as follows:

.. code-block:: xml

   <f:if condition="{item.status} == 'active'"> Output something </f:if>


Can I use the translate ViewHelper with FLUIDTEMPLATE
-----------------------------------------------------

By default the translate ViewHelper loads labels from the locallang file
inside *Resources/Private/Language/* of the \*current extension*.
FLUIDTEMPLATE uses the Standalone View of Fluid that is by default not
bound to an extension. But you can specify the path to your locallang
file as ViewHelper argument:

.. code-block:: xml

   <f:translate key="LLL:fileadmin/some/path/locallang.xlf:your.key" />

Alternatively, if you put your locallang files inside an extension (the
recommended way) you can tell the FLUIDTEMPLATE to use that extension by
default:

.. code-block:: ts

   10 = FLUIDTEMPLATE
   10.file = some/file
   10.extbase.controllerExtensionName = YourExtension

Now, using :xml:`<f:translate key="someKey" />` will resolve to translations
from :file:`EXT:your_extension/Resources/Private/Language/locallang.xlf`.

