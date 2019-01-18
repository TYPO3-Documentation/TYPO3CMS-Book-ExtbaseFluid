.. include:: ../Includes.txt

Localizing and internationalizing an extension
==============================================

Particularly in business relationships there is often the need to
build a website in more than one language. Therefore not only does the
translation of the websites content need to be completed, but also the extensions
which are used must also be available in multiple languages.

The configuration options for localization inside TYPO3 are versatile.
You will find a comprehensive description of all concepts and options in the
*Frontend Localization Guide
(https://docs.typo3.org/typo3cms/FrontendLocalizationGuide/)*.
For the following sections we assume a correct configuration of the
localization, which is normally done in the TypoScript root template and
looks like this:

.. code-block:: typoscript

   config {
     linkVars = L
     uniqueLinkVars = 1
     sys_language_uid = 0
     language = default
     locale_all = en_GB
     htmlTag_langKey = en
   }

   [globalVar = GP:L = 1]
   config {
     sys_language_uid = 1
     language = de
     locale_all = de_DE.utf8
     htmlTag_langKey = de
   }
   [global]


The selection of the frontend language is carried out with a parameter
in the URL (``linkVars = L``). Important is the definition of the
UID of the language (``sys_language_uid = 0``) and the language key
of the language (``language = default``). When the URL of the
website contains the parameter ``L=1`` the output occurs in german,
if the parameter is not set the output of the website occurs in the default
language (in our example in english).

In the next section, we start with the translation of static text like
captions of links which appear in templates. After this we go to translate
the content of extensions, thus the domain objects. Finally we explain how
you can adjust the date formats in accordance with the date conventions in
the particular country.


Multi language Templates
------------------------

When you style the output of your extension using Fluid, you often
have to localize particular terms or maybe short text in the templates. In
the following sample template of the blog example which displays a single
blog post with its comments there are some constant terms:

.. code-block:: html

   <h3>{post.title}</h3>
   <p>By: {post.author.fullName}</p>
   <p>{post.content -> f:format.nl2br()}</p>

   <h3>Comments</h3>
   <f:for each="{post.comments}" as="comment">
     {comment.content -> f:format.nl2br()}
     <hr>
   </f:for>

.. tip::

    The template is a little bit simplified and reduced to the
    basic.

First of all the text "By:" in front of the author of the post is
hard coded in the template, as well as the caption "Comments". For the use
of the extension on an English website this is no problem but if you want
to use it on a German website, the texts "By" and "Comments" would be
displayed instead of "Von" and "Kommentare". To make such text
exchangeable it has to be removed from the template and inserted in a
language file. Every text which is to be translated is given an identifier
that can be inserted in the template later. Table 9-1 shows the identifier
used in the sample and their translations into german and english.

*Table 9-1: The texts how we want to translate them*

==============  ===========   =============
Identifier      English       German
==============  ===========   =============
author_prefix   By:           Von:
comment_header  Comments      Kommentare
==============  ===========   =============


In TYPO3 (and also in Extbase) the language file, in which the
translated terms are stored, is named :file:`locallang.xlf`.
It should contain all terms that have to be translated, in our example
"By:" and "Comments", and their translations. Using Extbase the the file
:file:`locallang.xlf` must reside in the folder
:file:`Resources/Private/Language/`. To localize the above
terms we create the :file:`locallang.xlf` file the following
way:

.. code-block:: xml

    <?xml version="1.0" encoding="UTF-8"?>
    <xliff version="1.0" xmlns="urn:oasis:names:tc:xliff:document:1.1">
       <file source-language="en" datatype="plaintext" original="messages" date="2011-10-18T18:20:51Z" product-name="my-ext">
           <header/>
           <body>
               <trans-unit id="author_prefix">
                   <source>By:</source>
               </trans-unit>
               <trans-unit id="comment_header">
                   <source>Comments</source>
               </trans-unit>
           </body>
       </file>
    </xliff>

.. tip::

    The TYPO3 Core API describes in detail the construction of the
    :file:`locallang.xlf` file
    (*https://docs.typo3.org/typo3cms/CoreApiReference/ApiOverview/Internationalization/XliffFormat.html*).

Now the placeholder for the translated terms must be inserted into
the template. To do this, Fluid offers the ViewHelper
``f:translate``. In this ViewHelper you give the identifier of
the term to be inserted as argument ``key`` and the ViewHelper
inserts either the german or the english translation according to the
current language selection ::

    <f:translate key="comment_header" />
    <!-- or -->
    {f:translate(key: 'comment_header')}

.. tip::

    The used language is defined in the TypoScript template of the
    website. By default the english texts are used; but when with setting of
    the TypoScript setting ``config.language = de`` you can set the
    used language to german for example.

    To implement a language selection normally TypoScript conditions
    are used. These are comparable with an ``if/else``
    block

    .. code-block:: typoscript

        [globalVar = GP:L = 1]
        config.language = de
        [else]
        config.language = default
        [end]

    When the URL of the website contains a parameter L=1, then the
    output is in German; if the parameter is not set the output is in the
    default language English.

    With the use of complex TypoScript conditions the language
    selection could be set to depend on the forwarded language of the
    browser.

By replacing all terms of the template with the
``translate`` ViewHelper we could fit the output of the extension
to the currently selected language. Here we have a look at the Fluid
template for the output of the blog posts, now without the hardcoded
english terms:

.. code-block:: html

   <h3>{post.title}</h3>
   <p><f:translate key="author_prefix"> {post.author.fullName}</p>
   <p>{post.content -> f:format.nl2br()}</p>
   <h3><f:translate key="comment_header"></h3>
   <f:for each="{post.comments}" as="comment">
      {comment.content -> f:format.nl2br()}
      <hr>
   </f:for>


.. tip::

    Sometimes you have to localize a string in the PHP code, for
    example inside of a controller or a ViewHelper. In that case you
    can use the static method
    `\TYPO3\CMS\Extbase\Utility\LocalizationUtility::translate($key, $extensionName)`.
    This method requires the localization key as the first and the name of the extension as the second
    parameter. Then the corresponding text in the current language will be loaded from this extension's
    :file:`locallang.xlf` file .


Output localized strings using ``sprintf``
------------------------------------------

In the above example we have outputted the name of the blog post
author simply by using ``{blog.author.fullName}``. Many
languages have special rules on how names are to be used - especially in
Thailand it is common to only show the first name and place the word
"Khan" in front of it (which is a polite form). We want to enhance our
template now as far as it can to output the name of the blog author
according to the current language. In German and English this is the
form "first name last name" and in Thai "Khan first name".

Also for this use cases the ``translate`` ViewHelper can
be used. With the aid of the array ``arguments,`` values can be
embedded into the translated string. To do this, the syntax of the PHP
function ``sprintf`` is used.

If we want to implement the above example, we must assign the
first name and the last name of the blog author separate to the
``translate`` ViewHelper:

``<f:translate key="name" arguments="{1:post.author.firstName, 2: post.author.lastName}" />``

How should the corresponding string in the
:file:`locallang.xml` file looks like? It describes on
which position the placeholder are to be inserted. For English and
German it looks like this:

``<label index="name">%1$s %2$s</label>``

Important are the placeholder strings ``%1$s`` and
``%2$s``. These will be replaced with the assigned parameters.
Every placeholder starts with the % sign, followed by the position
number inside the arguments array, starting with 1, followed by the $
sign. After that the usual formatting specifications follows - in the
example it is the data type ``string (s)``. Now we can define
for Thai, that "Khan" followed by the first name should be
output:

``<label index="name">Khan %1$s</label>``

.. tip::

    The keys in the arguments array of the ViewHelper have no
    relevance. We recommend to give them numbers like the positions
    (starting with 1), because it is easy understandable.

.. tip::

    For a full reference of the formatting options for
    ``sprintf`` you should have a look at the PHP documentation:
    *http://php.net/manual/de/function.sprintf.php*.

Changing localized terms using TypoScript
--------------------------------------------------------------------------------------------------
If you use an existing extension for a customer project, you
sometimes find out that the extension is insufficient translated or that
the translations have to be adjusted. TYPO3 offers the possibility to
overwrite the localization of a term by TypoScript. Fluid also support
this.

If, for example, you want use the text "Remarks" instead of the
text "Comments", you have to overwrite the identifier
``comment_header`` for the English language. For this you can
add following line to your TypoScript template:

``plugin.tx_blogexample._LOCAL_LANG.default.comment_header = Remarks``

With this you will overwrite the localization of the term
``comment_header`` for the default language in the blog
example. So you can adjust the translation of the texts like you wish,
without changing the :file:`locallang.xml` file.

Until now we have shown how to translate static text of templates.
Of course it is important that also the data of an extension is
translated according to the national language. We will show this in the
next section.




Multi language domain objects
-----------------------------

With TYPO3 you can localize the data sets in the backend. This also
applies to domain data, because they are treated like "normal" data sets
in the TYPO3 backend. To make your domain objects translatable you have
to create additional fields in the database and tell TYPO3 about them. The
class definitions must not be changed. Lets have a look at the required
steps based on the ``blog`` class of the blog example. TYPO3
needs three additional database fields which you should insert in the
:file:`ext_tables.sql` file::

    CREATE TABLE tx_blogexample_domain_model_blog {
        // ...
        sys_language_uid int(11) DEFAULT '0' NOT NULL,
        l10n_parent int(11) DEFAULT '0' NOT NULL,
        l10n_diffsource mediumblob NOT NULL,
        // ...
    };

You are free to choose the names of the database fields, but the
names we use here are common in the world of TYPO3. In any case you have
to tell TYPO3 which name you have chosen. This is done in the file
:file:`ext_tables.php` in the section ``ctrl`` of
the corresponding database table.

::

    $TCA['tx_blogexample_domain_model_blog'] = array (
    'ctrl' => array (
    // ...
    'languageField' => 'sys_language_uid',
    'transOrigPointerField' => 'l10n_parent',
    'transOrigDiffSourceField' => 'l10n_diffsource',
    // ...
    )
    );

The field ``sys_language_uid`` is used for storing
the UID of the language in which the blog is written. Based on this UID
Extbase choose the right translation depending on the current
TypoScript setting in ``config.sys_language_uid``. In the field
``l10n_parent`` the UID of the original blog created in the
default language, which the current blog is a translation of. The third
field ``l10n_diffsource`` contains a snapshot of the source of
the translation. This snapshot is used in the backend for creation of a
differential view and is not used by Extbase.

In the section ``columns`` of the ``TCA`` you have
to configure the fields accordingly. The following configuration adds two
fields to the backend form of the blog: one field for the editor to define
the language of a data record and one field to select the data record the
translation relates to.

.. code-block:: php

   $TCA['tx_blogexample_domain_model_blog'] = [
     // ...
     'types' => [
       '1' => ['showitem' => 'l18n_parent , sys_language_uid, hidden, title,
                     description, logo, posts, administrator'],
     ],
     'columns' => [
       'sys_language_uid' => [
         'exclude' => 1,
         'label' => 'LLL:EXT:lang/locallang_general.php:LGL.language',
         'config' => [
           'type' => 'select',
           'foreign_table' => 'sys_language',
           'foreign_table_where' => 'ORDER BY sys_language.title',
           'items' => [
             ['LLL:EXT:lang/locallang_general.php:LGL.allLanguages',-1],
             ['LLL:EXT:lang/locallang_general.php:LGL.default_value',0]
           ],
         ],
       ],
       'l18n_parent' => [
         'displayCond' => 'FIELD:sys_language_uid:>:0',
         'exclude' => 1,
         'label' => 'LLL:EXT:lang/locallang_general.php:LGL.l18n_parent',
         'config' => [
           'type' => 'select',
           'items' => [
             ['', 0],
           ],
           'foreign_table' => 'tx_blogexample_domain_model_blog',
           'foreign_table_where' => 'AND tx_blogexample_domain_model_blog.uid=###REC_FIELD_
                 l18n_parent### AND tx_blogexample_domain_model_blog.
                 sys_language_uid IN (-1,0)',
         ],
       ],
       'l18n_diffsource' => [
         'config' => [
           'type' =>'passthrough'
         ],
       ],
       // ...
     ],
   ];

With it, the localization of the domain object is already
configured. By adding ``&amp;L=1`` to the URL, the language of
the frontend will be changed to german. If there is an existing
translation of a blog, it will be shown. Otherwise the blog is output in
the default language.

.. tip::

    You can control this behavior. If you set the option
    ``config.sys_language_mode`` to ``strict`` in the
    TypoScript configuration, then only these objects are shown which really
    have content in the frontend language. More information for this you
    will find in the *Frontend Localization Guide* of the
    *Core Documentation*.

How TYPO3 handles the localization of content offers two
important specific features: The first is that all translations of a data
record respectively a data record that is valid for all languages (UID of
the language is 0 or -1) will be "added" to the data record in the default
language. The second special feature is that always the UID of the record
in the default language is bound for identification although the
translated data record in the database table has another UID. This
conception has a serious disadvantage: If you want to create a data record
for a language that has no data record in the default language, you have
to create the latter before. But with what content?

Lets have an example for illustration: You create a blog in the
default language English (=default). It is stored in the database like
this::

    uid:              7 (given by the database)
    title:            "My first Blog"
    sys_language_uid: 0 (selected in backend)
    l10n_parent:      0 (no translation original exists)

After a while you create a German translation in the backend. In the
database the following record is stored::

    uid:              42 (given by the database)
    title:            "Mein erster Blog"
    sys_language_uid: 1 (selected in backend)
    l10n_parent:      7 (selected in backend respectively given automatically)

A link that references the single view of a blog looks like
this:

``http://www.example.com/index.php?id=99&amp;tx_blogexample_pi1[controller]=Blog&amp;tx_blogexample_pi1[action]=show&amp;tx_blogexample_pi1[blog]=7``

By adding ``&amp;L=1`` we referencing now the German
version:

``http://www.example.com/index.php?id=99&amp;tx_blogexample_pi1[controller]=Blog&amp;tx_blogexample_pi1[action]=show&amp;tx_blogexample_pi1[blog]=7&amp;L=1``

Notice that the given UID in tx_blogexample_pi1[blog]=7 is not
changed. There is not UID of the data record of the german translation
(42). This has the advantage that only the parameter for the language
selection is enough. Concurrently it has the disadvantage of a higher
administration effort during persistence. Extbase will do this for you by
carrying the UID of the language of the domain model and the UID of the
data record in which the domain data is effectively stored as "hidden"
properties of the :php:`AbstractDomainObject` internally.
In Table 9-2 you find for different actions in the frontend the behavior
of Extbase for localized domain objects.

*Table 9-2: Behavior of Extbase for localized domain
objects in the frontend.*

+-----------------+-----------------------------------+------------------------------------+
|                 |No parameter L given, or L=0       |L=x (x>0)                           |
+-----------------+-----------------------------------+------------------------------------+
|Display (index,  |Objects in the default language    |The objects are shown in the        |
|list, show)      |(``sys_language_uid=0``)           |selected language x. If an object   |
|                 |respectively object for all        |doesn't exist in the selected       |
|                 |languages (``sys_language_uid=-1``)|language the object of the default  |
|                 |are shown                          |language is shown (except by        |
|                 |                                   |``sys_language_mode=strict``)       |
+-----------------+-----------------------------------+------------------------------------+
|Editing (edit,   |Like displaying an object. The domain data is stored in the "translated"|
|update)          |data record, in the above example in the record with the UID 42.        |
+-----------------+------------------------------------------------------------------------+
|Creation (new,   |Independent of the selected frontend language the data is stored in a   |
|create)          |new record in whose field ``sys_language_uid`` the number 0 is inserted.|
+-----------------+-----------------------------------+------------------------------------+

Extbase also supports all default functions of the localization of
domain objects. It has its limits when a domain object should be created
exclusively in a target language. Especially when no data record exists in
the default language.



Localization of date output
---------------------------

It often occurs that a date or time must be displayed in a template.
Every language area has its own convention on how the date is to be
displayed: While in Germany the date is displayed in the form
``Day.Month.Year``, in the USA the form
``Month/Day/Year`` is used. Depending on the language the date
must be formatted different.

Generally the date or time is formatted by the
``format.date`` ViewHelper::

    <f:format.date date="{dateObject}" format="d.m.Y" />
    <!-- or -->
    {dateObject -> f:format.date(format: 'd.m.Y')}

The date object ``{dateObject}`` is displayed with the date
format given in the parameter ``format``. This format string must
be in a format which is readable by the PHP function ``date()``
and declares the format of the output. Table 9-3 shows the some important
placeholders.

*Table 9-3: Some place holder of date.*

================ =========================================================== =========
Format character Description                                                 Example
================ =========================================================== =========
d                Day of the month as number, double-digit, with leading zero 01 ... 31
m                Month as number, with leading zero                          01 ... 12
Y                Year as number, with 4 digits                               2011
y                Year as number, with 2 digits                               11
H                Hour in 24 hour format                                      00 ... 23
i                Minutes, with leading zero                                  00 ... 59
================ =========================================================== =========

But the ViewHelper has to be configured different. Depending on the
language area, which is controlled by the language of the user, an other
format string should be used. Here we combine the ``format.date``
ViewHelper with the ``translate`` ViewHelper which you got to
know in the section "Multilanguage templates"

::

    <f:format.date date="{dateObject}" format="{f:translate(key: 'date_format')}" />

Than you can store an other format string for every language in the
:file:`locallang.xml` file and you can change the format
string via TypoScript if needed. This method to translate content you got
to know in the section "Multilanguage templates".

.. tip::

    There are other formatting ViewHelpers for adjusting the output of
    currencies or big numbers. These ViewHelpers all starts with
    ``format``. You can find an overview of these ViewHelpers in
    Appendix C. These ViewHelpers can be used like the
    ``f:format.date`` ViewHelper you have just learned.

In this section you have learned how you can translate and localize
an extension. First we have worked on the localization of single terms in
the template, after this we had a look at the content of the extension.
Finally the customization of date information for country-specific formats
where explained. In the next section you will see how constraints of the
domain objects can be preserved.
