.. include:: ../Includes.txt

Localizing and internationalizing an extension
==============================================

Particularly in business relationships, there is often the need to
build a website in more than one language. Therefore, the
translation of the website content needs to be completed, but the extensions
used must also be available in multiple languages.

The configuration options for localization inside TYPO3 are versatile.
You will find a comprehensive description of all concepts and options in the
*Frontend Localization Guide
(https://docs.typo3.org/typo3cms/FrontendLocalizationGuide/)*.
For the following sections, we assume a correct configuration of the
localization, which is normally done in the site configuration.

The frontend language selection is carried out with a URL parameter
(``linkVars = L``). Important is the definition of the
UID of the language (``sys_language_uid = 0``) and the language key
of the language (``language = default``). When the URL of the
website contains the parameter ``L=1``, the output occurs in German;
if the parameter is not set, the output of the website occurs in the default
language (in our example in English).

In the next section, we start with the translation of static text like
captions of links in templates. After this, we go to translate
the content of extensions, thus the domain objects. Finally, we explain how
you can adjust the date formats following the date conventions in
a particular country.


Multi-language Templates
------------------------

When you style the output of your extension using Fluid, you often
have to localize particular terms or maybe short text in the templates. In
the following sample template of the blog example displays a single
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

First of all, the text "By:" in front of the author of the post is
hardcoded in the template and the caption "Comments". For the use
of the extension on an English website, this is no problem, but if you want
to use it on a German website, the texts "By" and "Comments" would be
displayed instead of "Von" and "Kommentare". To make such text
exchangeable, it has to be removed from the template and inserted in a
language file. Every text which is to be translated is given an identifier
that can be inserted in the template later. Table 9-1 shows the identifier
used in the sample and their translations into German and English.

*Table 9-1: The texts how we want to translate them*

==============  ===========   =============
Identifier      English       German
==============  ===========   =============
author_prefix   By:           Von:
comment_header  Comments      Kommentare
==============  ===========   =============


In TYPO3 (and in Extbase), the language file in which the
translated terms are stored is named :file:`locallang.xlf`.
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
    (*https://docs.typo3.org/m/typo3/reference-coreapi/master/en-us/ApiOverview/Internationalization/XliffFormat.html*).

Now the placeholder for the translated terms must be inserted into
the template. To do this, Fluid offers the ViewHelper
``f:translate``. In this ViewHelper, you give the identifier of
the term to be inserted as argument ``key`` and the ViewHelper
inserts either the German or the English translation according to the
current language selection ::

    <f:translate key="comment_header" />
    <!-- or -->
    {f:translate(key: 'comment_header')}

.. tip::

    The used language is defined in the TypoScript template of the
    website. By default, the English texts are used; but when with
    the TypoScript setting, ``config.language = de`` you can set the
    used language to german, for example.

    To implement a language selection, normally, TypoScript conditions
    are used. These are comparable with an ``if/else``
    block

    .. code-block:: typoscript

        [globalVar = GP:L = 1]
        config.language = de
        [else]
        config.language = default
        [end]

    When the URL of the website contains a parameter L=1, then the
    output is in German; if the parameter is not set, the output is in the
    default language English.

    With the use of complex TypoScript conditions, the language
    selection could be set to depend on the forwarded language of the
    browser.

By replacing all terms of the template with the
``translate`` ViewHelper we could fit the output of the extension
to the currently selected language. Here we have a look at the Fluid
template for the output of the blog posts, now without the hardcoded
English terms:

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
    This method requires the localization key as the first and the extension's name as the second
    parameter. Then the corresponding text in the current language will be loaded from this extension's
    :file:`locallang.xlf` file .


Output localized strings using ``sprintf``
------------------------------------------

In the above example, we have outputted the blog post
author's name simply by using ``{blog.author.fullName}``. Many
languages have special rules on how names are to be used - especially in
Thailand, it is common to only show the first name and place the word
"Khan" in front of it (which is a polite form). We want to enhance our
template now as far as it can to output the blog author's name
according to the current language. In German and English, this is the
form "first name last name" and in Thai "Khan first name".

Also, for these use cases, the ``translate`` ViewHelper can
be used. With the aid of the array ``arguments,`` values can be
embedded into the translated string. To do this, the syntax of the PHP
function ``sprintf`` is used.

If we want to implement the above example, we must assign the
first name and the last name of the blog author separate to the
``translate`` ViewHelper:

``<f:translate key="name" arguments="{1:post.author.firstName, 2: post.author.lastName}" />``

How should the corresponding string in the
:file:`locallang.xml` file looks like? It describes in
which position the placeholder is to be inserted. For English and
German it looks like this:

``<label index="name">%1$s %2$s</label>``

Important are the placeholder strings ``%1$s`` and
``%2$s``. These will be replaced with the assigned parameters.
Every placeholder starts with the % sign, followed by the position
number inside the arguments array, starting with 1, followed by the $
sign. After that, the usual formatting specifications follow - in the
example, it is the data type ``string (s)``. Now we can define
for Thai that "Khan" followed by the first name should be
output:

``<label index="name">Khan %1$s</label>``

.. tip::

    The keys in the argument array of the ViewHelper have no
    relevance. We recommend to give them numbers like the positions
    (starting with 1), because it is easily understandable.

.. tip::

    For a full reference of the formatting options for
    ``sprintf`` you should have a look at the PHP documentation:
    *http://php.net/manual/de/function.sprintf.php*.

Changing localized terms using TypoScript
--------------------------------------------------------------------------------------------------
If you use an existing extension for a customer project, you
sometimes find out that the extension is insufficient translated or that
the translations have to be adjusted. TYPO3 offers the possibility to
overwrite the localization of a term by TypoScript. Fluid also supports
this.

If, for example, you want to use the text "Remarks" instead of the
text "Comments", you have to overwrite the identifier
``comment_header`` for the English language. For this, you can
add the following line to your TypoScript template:

``plugin.tx_blogexample._LOCAL_LANG.default.comment_header = Remarks``

With this, you will overwrite the localization of the term
``comment_header`` for the default language in the blog
example. So you can adjust the translation of the texts like you wish,
without changing the :file:`locallang.xml` file.

Until now, we have shown how to translate a static text of templates.
Of course, an extension's data must be
translated according to the national language. We will show this in the
next section.




Multi-language domain objects
-----------------------------

With TYPO3, you can localize the data sets in the backend. This also
applies to domain data because they are treated as "normal" data sets
in the TYPO3 backend. To make your domain objects translatable, you have
to create additional fields in the database and tell TYPO3 about them. The
class definitions must not be changed. Let's look at the required
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
names we use here are common in the world of TYPO3. In any case, you have
to tell TYPO3 which name you have chosen. This is done in the ``ctrl``
section of the TCA configuration file
:file:`Configuration/TCA/tx_blogexample_domain_model_blog.php`

::

   <?php

   return [
       'ctrl' => [
           // ...
           'languageField' => 'sys_language_uid',
           'transOrigPointerField' => 'l10n_parent',
           'transOrigDiffSourceField' => 'l10n_diffsource',
           // ...
       ]
   ];

The field ``sys_language_uid`` is used for storing
the UID of the language in which the blog is written. Based on this UID
Extbase choose the right translation depending on the current
TypoScript setting in ``config.sys_language_uid``. In the field
``l10n_parent`` the UID of the original blog created in the
default language, which the current blog is a translation of. The third
field, ``l10n_diffsource`` contains a snapshot of the source of
the translation. This snapshot is used in the backend for the creation of a
differential view and is not used by Extbase.

In the section ``columns`` of the ``TCA`` you have
to configure the fields accordingly. The following configuration adds two
fields to the backend form of the blog: one field for the editor to define
the language of a data record and one field to select the data record the
translation relates to.

::

   <?php

   return [
       // ...
       'types' => [
           '1' => ['showitem' => 'l18n_parent , sys_language_uid, hidden, title,
                       description, logo, posts, administrator'],
       ],
       'columns' => [
           'sys_language_uid' => [
               'exclude' => 1,
               'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.php:LGL.language',
               'config' => [
                   'type' => 'select',
                   'foreign_table' => 'sys_language',
                   'foreign_table_where' => 'ORDER BY sys_language.title',
                   'items' => [
                       ['LLL:EXT:core/Resources/Private/Language/locallang_general.php:LGL.allLanguages',-1],
                       ['LLL:EXT:core/Resources/Private/Language/locallang_general.php:LGL.default_value',0]
                   ],
               ],
           ],
           'l18n_parent' => [
               'displayCond' => 'FIELD:sys_language_uid:>:0',
               'exclude' => 1,
               'label' => 'LLL:EXT:core/Resources/Private/Language/locallang_general.php:LGL.l18n_parent',
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
translation of a blog, it will be shown. Otherwise, the blog is output in
the default language.

.. tip::

    You can control this behavior. If you set the option
    ``config.sys_language_mode`` to ``strict`` in the
    TypoScript configuration, then only these objects are shown, which really
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
for a language with no data record in the default language, you have
to create the latter before. But with what content?

Let's have an example for illustration: You create a blog in the
default language English (=default). It is stored in the database like
this::

    uid:              7 (given by the database)
    title:            "My first Blog"
    sys_language_uid: 0 (selected in backend)
    l10n_parent:      0 (no translation original exists)

After a while, you create a German translation in the backend. In the
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
In Table 9-2, you find for different actions in the frontend the behavior
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
displayed: While in Germany, the date is displayed in the form
``Day.Month.Year``, in the USA the form
``Month/Day/Year`` is used. Depending on the language, the date
must be formatted different.

Generally the date or time is formatted by the
``format.date`` ViewHelper::

    <f:format.date date="{dateObject}" format="d.m.Y" />
    <!-- or -->
    {dateObject -> f:format.date(format: 'd.m.Y')}

The date object ``{dateObject}`` is displayed with the date
format given in the parameter ``format``. This format string must
be in a format that is readable by the PHP function ``date()``
and declares the format of the output. Table 9-3 shows some important
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

But the ViewHelper has to be configured differently. Depending on the
language area, which is controlled by the language of the user, another
format string should be used. Here we combine the ``format.date``
ViewHelper with the ``translate`` ViewHelper which you got to
know in the section "Multi-language templates".

::

    <f:format.date date="{dateObject}" format="{f:translate(key: 'date_format')}" />

Then you can store another format string for every language in the
:file:`locallang.xml` file, and you can change the format
string via TypoScript if needed. This method to translate the content you got
to know in the section "Multi-language templates".

.. tip::

    There are other formatting ViewHelpers for adjusting the output of
    currencies or big numbers. These ViewHelpers all starts with
    ``format``. You can find an overview of these ViewHelpers in
    Appendix C. These ViewHelpers can be used like the
    ``f:format.date`` ViewHelper you have just learned.

In this section, you have learned how you can translate and localize
an extension. First, we have worked on the localization of single terms in
the template. After this, we had a look at the content of the extension.
Finally, the customization of date information for country-specific formats
where explained. In the next section, you will see how constraints of the
domain objects can be preserved.


TYPO3 v9 and higher
===================

Starting with version 9, Extbase renders the translated records in the same way TypoScript rendering does.
The new behavior is controlled by the Extbase feature switch :typoscript:`consistentTranslationOverlayHandling`.

.. code-block:: typoscript

     config.tx_extbase.features.consistentTranslationOverlayHandling = 1

The new behavior is enabled by default in TYPO3 v9. The feature switch will be removed in TYPO3 v10, so there will be just
one way of fetching records.
You can override the setting using normal TypoScript.

Users relying on the old behavior can disable the feature switch.

The change modifies how Extbase interprets the TypoScript settings
:ts:`config.sys_language_mode` and :ts:`config.sys_language_overlay` and the
:php:`Typo3QuerySettings` properties :php:`languageOverlayMode` and :php:`languageMode`.

Changes in the rendering:

1) Setting :php:`Typo3QuerySettings->languageMode` does **not** influence how Extbase queries records anymore.
   The corresponding TypoScript setting :ts:`config.sys_language_mode` is used by the core
   to decide what to do when a page is not translated to the given language (display 404 or try page with a different language).
   Users who used to set :php:`Typo3QuerySettings->languageMode` to `strict` should use
   :php:`Typo3QuerySettings->setLanguageOverlayMode('hideNonTranslated')` to get translated records only.

   The old behavior was confusing because `languageMode` had a different meaning and accepted different
   values in the TypoScript context and the Extbase context.

2) Setting :php:`Typo3QuerySettings->languageOverlayMode` to :php:`true` makes Extbase fetch records
   from default language and overlay them with translated values. So, e.g., when a record is hidden in
   the default language, it will not be shown. Also, records without translation parents will not be shown.
   For relations, Extbase reads relations from a translated record (so it’s not possible to inherit
   a field value from translation source) and then passes the related records through :php:`$pageRepository->getRecordOverlay()`.
   So, e.g., when you have a translated `tt_content` with FAL relation, Extbase will show only those
   `sys_file_reference` records which are connected to the translated record (not caring whether some of
   these files have `l10n_parent` set).

   Previously :php:`Typo3QuerySettings->languageOverlayMode` had no effect.
   Extbase always performed an overlay process on the result set.

3) Setting :php:`Typo3QuerySettings->languageOverlayMode` to :php:`false` makes Extbase fetch aggregate
   root records from a given language only. Extbase will follow relations (child records) as they are,
   without checking their `sys_language_uid` fields, and then it will pass these records through
   :php:`$pageRepository->getRecordOverlay()`.
   This way, the aggregate root record's sorting and visibility don't depend on default language records.
   Moreover, the relations of a record, which are often stored using default language uids,
   are translated in the final result set (so overlay happens).

   For example:
   Given a translated `tt_content` having relation to 2 categories (in the mm table translated
   tt_content record is connected to category uid in default language), and one of the categories is translated.
   Extbase will return a `tt_content` model with both categories.
   If you want to have just translated category shown, remove the relation in the translated `tt_content`
   record in the TYPO3 backend.

Note that by default :php:`Typo3QuerySettings` uses the global TypoScript configuration like
:ts:`config.sys_language_overlay` and :php:`$GLOBALS['TSFE']->sys_language_content`
(calculated based on :ts:`config.sys_language_uid` and :ts:`config.sys_language_mode`).
So you need to change :php:`Typo3QuerySettings` manually only if your Extbase code should
behave different than other `tt_content` rendering.

Setting :php:`setLanguageOverlayMode()` on a query influences **only** fetching of the aggregate root. Relations are always
fetched with :php:`setLanguageOverlayMode(true)`.

When querying data in translated language, and having :php:`setLanguageOverlayMode(true)`, the relations
(child objects) are overlaid even if the aggregate root is not translated.
See :php:`QueryLocalizedDataTest->queryFirst5Posts()`.

The following examples show how to query data in Extbase in different scenarios, independent of the global TS settings:

1) Fetch records from the language uid=1 only, with no overlays.
   Previously (:ts:`consistentTranslationOverlayHandling = 0`):

   This was not possible.


   Now (:ts:`consistentTranslationOverlayHandling = 1`):

.. code-block:: php

    $querySettings = $query->getQuerySettings();
    $querySettings->setLanguageUid(1);
    $querySettings->setLanguageOverlayMode(false);

2) Fetch records from the language uid=1, with overlay, but hide non-translated records
   Previously (:ts:`consistentTranslationOverlayHandling = 0`):

.. code-block:: php

    $querySettings = $query->getQuerySettings();
    $querySettings->setLanguageUid(1);
    $querySettings->setLanguageMode('strict');

   Now (:ts:`consistentTranslationOverlayHandling = 1`):

.. code-block:: php

    $querySettings = $query->getQuerySettings();
    $querySettings->setLanguageUid(1);
    $querySettings->setLanguageOverlayMode('hideNonTranslated');


+------------------------+-------------------------------------------------------------------------------------------------+----------------------------------------------+------------------------------+
| QuerySettings property | old behavior                                                                                    | new behavior                                 | default value (TSFE|Extbase) |
+========================+=================================================================================================+==============================================+==============================+
| languageUid            |                                                                                                 | same                                         | 0                            |
+------------------------+-------------------------------------------------------------------------------------------------+----------------------------------------------+------------------------------+
| respectSysLanguage     |                                                                                                 | same                                         | `true`                       |
+------------------------+-------------------------------------------------------------------------------------------------+----------------------------------------------+------------------------------+
| languageOverlayMode    | not used                                                                                        | values: `true`, `false`, `hideNonTranslated` | 0 | `true`                   |
|                        |                                                                                                 |                                              |                              |
+------------------------+-------------------------------------------------------------------------------------------------+----------------------------------------------+------------------------------+
| languageMode           | documented values: `null`, `content_fallback`, `strict` or `ignore`.                            | not used                                     | `null`                       |
|                        | Only `strict` was evaluated. Setting `LanguageMode` to `strict`                                 |                                              |                              |
|                        | caused passing `hideNonTranslated` param to `getRecordOverlay` in :php:`Typo3DbBackend`         |                                              |                              |
|                        | and changing the query to work similar to TypoScript `sys_language_overlay = hideNonTranslated` |                                              |                              |
+------------------------+-------------------------------------------------------------------------------------------------+----------------------------------------------+------------------------------+


Identifiers
-----------

Domain models have a main identifier `uid` and two additional properties `_localizedUid` and `_versionedUid`.
Depending on whether the `languageOverlayMode` mode is enabled (`true` or `'hideNonTranslated'`) or disabled (`false`),
the identifier contains different values.
When `languageOverlayMode` is enabled, then the `uid` property contains the `uid` value of the default language record,
the `uid` of the translated record is kept in the `_localizedUid`.

+----------------------------------------------------------+-------------------------+---------------------------+
| Context                                                  | Record in language 0    | Translated record         |
+==========================================================+=========================+===========================+
| Database                                                 | uid:2                   | uid:11, l10n_parent:2     |
+----------------------------------------------------------+-------------------------+---------------------------+
| Domain Object values with `languageOverlayMode` enabled  | uid:2, _localizedUid:2  | uid:2, _localizedUid:11   |
+----------------------------------------------------------+-------------------------+---------------------------+
| Domain Object values with `languageOverlayMode` disabled | uid:2, _localizedUid:2  | uid:11, _localizedUid:11  |
+----------------------------------------------------------+-------------------------+---------------------------+

See tests in :file:`extbase/Tests/Functional/Persistence/QueryLocalizedDataTest.php`.

The :php:`$repository->findByUid()` (or :php:`$persistenceManager->getObjectByIdentifier()`) method takes current
rendering language into account (e.g. L=1). It does not take `defaultQuerySetting` set on the repository into account.
This method always performs an overlay.
Values in braces show previous behavior (disabled flag) if different than current.

The bottom line is that with the feature flag on, you can now use  :php:`findByUid()` using translated record uid to get
translated content independently from language set in the global context.

+-------------------+----------------+----------------------+----------------------+----------------------+----------------------+
|                   |                | L=0                                         | L=1                                         |
+-------------------+----------------+----------------------+----------------------+----------------------+----------------------+
| repository method | property       | Overlay              | No overlay           | Overlay              | No overlay           |
+===================+================+======================+======================+======================+======================+
| findByUid(2)      | title          | Post 2               | Post 2               | Post 2 - DK          | Post 2 - DK          |
+-------------------+----------------+----------------------+----------------------+----------------------+----------------------+
|                   | uid            | 2                    | 2                    | 2                    | 2                    |
+-------------------+----------------+----------------------+----------------------+----------------------+----------------------+
|                   | _localizedUid  | 2                    | 2                    | 11                   | 11                   |
+-------------------+----------------+----------------------+----------------------+----------------------+----------------------+
| findByUid(11)     | title          | Post 2 - DK (Post 2) | Post 2 - DK (Post 2) | Post 2 - DK          | Post 2 - DK          |
+-------------------+----------------+----------------------+----------------------+----------------------+----------------------+
|                   | uid            | 2                    | 2                    | 2                    | 2                    |
+-------------------+----------------+----------------------+----------------------+----------------------+----------------------+
|                   | _localizedUid  | 11 (2)               | 11 (2)               | 11                   | 11                   |
+-------------------+----------------+----------------------+----------------------+----------------------+----------------------+

.. note::

   Note that :php:`$repository->findByUid()` internally sets :php:`respectSysLanguage(false)` so it behaves differently
   than a regular query by an `uid` like :php:`$query->matching($query->equals('uid', 11));`
   The regular query will return :php:`null` if passed `uid` doesn't match
   the language set in the :php:`$querySettings->setLanguageUid()` method.

Filtering & sorting
-------------------

When filtering by an aggregate root property like `Post->title`,
both filtering and sorting take translated values into account, and you will get correct results, same with pagination.

When filtering or ordering by a child object property, Extbase does a left join between the aggregate root
table and the child record table.
Then the filter is applied as where clause. This means filtering or ordering by a child record property
only takes values from child records whose uids are stored in the database (in most cases, its default language record).
See :php:`TranslationTest::fetchingTranslatedPostByBlogTitle()`

This limitation also applies to Extbase, with the feature flag being disabled.

Summary of the important code changes compared to previous versions.
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

1) :php:`DataMapper` gets a :php:`Query` as a constructor parameter. This allows to use the aggregate root's :php:`QuerySettings` (language)
   when fetching child records/relations. See :php:`DataMapper->getPreparedQuery` method.
2) :php:`DataMapper` is passed to  :php:`LazyLoadingProxy` and  :php:`LazyObjectStorage`, so the settings don't get lost when fetching data lazily.
3) :php:`Query` object gets a new property `parentQuery` which is useful to detect whether we're fetching the aggregate root or a child object.
4) Extbase model for  :php:`FileReference` uses `_localizedUid` for fetching `OriginalResource`
5) :php:`DataMapper` forces child records to be fetched using  :php:`setLanguageOverlayMode(true)`.
6) When getRespectSysLanguage is set,  :php:`DataMapper` uses aggregate root's language to overlay child records to the correct language.
7) The `where` clause used for finding translated records in overlay mode (`true`, `hideNonTranslated`) has been fixed in version 9.
   It filters out the non translated records on the database side in case `hideNonTranslated` is set.
   It allows for filtering and sorting by translated values. See :php:`Typo3DbQueryParser->getLanguageStatement()`


Most important known issues
^^^^^^^^^^^^^^^^^^^^^^^^^^^
- The persistence session uses the same key for the default language record and the translation - https://forge.typo3.org/issues/59992
- Extbase allows fetching deleted/hidden records - https://forge.typo3.org/issues/86307


For more information about rendering, please refer to the TypoScript reference_.

.. _reference: https://docs.typo3.org/typo3cms/TyposcriptReference/Setup/Config/Index.html?highlight=sys_language_mode#sys-language-overlay

