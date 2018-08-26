.. include:: ../Includes.txt

programming secure extensions
=============================

While mostly the functionality of an extension is set of great value,
the safety aspect of the programmed code is clearly less respected. In this
section we will make you sensible for safety relevant aspects you should
take care of during extension development. In addition we will show you some
concepts implemented by extbase that increase the safety of an
extension.

A basic principle that you don't have to disregard when programming
extensions is, that you should never trust the user input. All input data
your extension gets from the user can be potentially malicious. That applies
for all data that are transferred via GET and POST over from a form. But
also cookies should be classified as malicious, because they can be
manipuated by the user.

In the daily programming, all the data that comes from the user should
be treated with carefulness - check always if the format of the data
corresponds with the format you expected. For example you should check for a
field that contains an email address, that a valid email address was entered
and not any other text. Here is the validating framework of extbase, you
have learned about in the past section, much helpful.

Especially critical are the positions where directly communicated with
the database, e.g. with the SQL query language. In the next section we will
show what is to care of with it. After this we present some concepts that
extbase and fluid uses internally to increase the security of an extension.
We will show you how queries that changes data are to be secured by extbase.
Next we addict to the Cross Site Scripting and illustrate how to secure your
own extensions.


create own database queries
-------------------------------------------------

Even though you will mostly use the query language of extbase (see
section "implementing custom queries" in chapter 6) to formulate database
queries, there is an option to directly formulate SQL queries. That is
very helpful for example when you need performance optimization. Always
create your own SQL queries in repository classes, to have the potential
unsafe code at a defined place.

If you create own SQL queries you always have to convert the input
data to the desired format, for example to a number with the use of
``intval()``.

.. tip::

   More hints for safety programming with PHP you find also in the PHP handbook at
   *http://php.net/security*
   .

Now we want to present some concepts that used by extbase and fluid
to increase the safeness of an extension.First we explain how requests
that changes data are verified by extbase. After that we explain Cross
Site Scripting in order that you can secure your extension for that
effect.



Request hashes (HMAC)
-------------------------------------------------

In the section "mapping arguments" above in this chapter we have
explained the transparent argument mapping. For this all properties that
are to be send, were changed transparent on the object. Certainly this
implies a safety risk, that we will explain with an example: Assume we
have a form to edit a ``user`` object. This object has the
properties ``username, email, password`` and
``description``. We want to provide the user a form to change all
properties, except the username (because the username should not be
changed in our system).

The form looks (shortened) like this:

.. code-block:: html

   <f:form name="user" object="{user}" action="update">
      <f:form.textbox property="email" />
      <f:form.textbox property="password" />
      <f:form.textbox property="description" />
   </f:form>

If the form is sent, the argument mapping for the user object gets
this array:

.. code-block:: raw

   array(
      __identity => ...
      email =>  ...
      password => ...
      description => ...
   )

Because the ``__identity`` property and further properties
are set, the argument mapper gets the object from the persistence layer,
makes a copy and then applies the changed properties to the object. After
this normally we call the method ``update($user)`` for the
corresponding repository to make the changes persistent.

What happend if an attacker manipulates the form data and transfers
an additional field ``username`` to the server? In this case the
argument mapping would also change the ``$username`` property of
the cloned object - although we actual said that this property should not
be changed by the user itself.

To avoid this problem fluid creates a so called *Request
Hash*. This is a check field to secure the transmission of the
data to the server. The request hash consist of the names of all form
fields that are allowed to transferred to the server at maximum.
Additional these information is signed with the TYPO3 encryption key, so
the client can't manipulate the request hash undetected. The request hash
is stored in the form in a hidden field with the name
``__hmac``.

So only the form fields that are generated by Fluid with the
appropriate ViewHelpers are transferred to the server. If an attacker
tries, like described above, to add a field on the client side, this is
detected via the request hash and the request is stopped with an
exception.

.. tip::

  If you write an API with extbase to change data with other
  webservices you have to disable the request hash, bacause without the
  knowledge of the private key of the other server you can not generate a
  valid request hash.

  The checking of the request hash can be deactivated with the
  following annotation: ``@dontverifyrequesthash``

In general the request hash should be work completely transparent
for you, you don't have to know how it works in detail. You have to know
this background knowledge only if you want to change data via JavaScript
or webservices.



Prevent Cross Site Scripting
-------------------------------------------------

Fluid contains some integrated technics to secure web applications
per default. One of the importand parts for this is the automatic
prevention against cross site scripting, that counts to the most used
attack against web applications. In this section we give you a problem
description and show how you can avoid cross site scripting (XSS).

Assume you have programmed a forum. An "evil" user will get access
to the admin account. For this he posted following harmful looking message
in the forum to try to embed JavaScript code::

   <script type="text/javascript">alert("XSS");</script>

When he let display the forum post he gets, if the programmer of the
forum has made no additional prevetions, a JavaScript popup "XSS". The
attacke now knows that every JavaScript he write in a post, is executed
when displaying the post - the forum is vulnerable for cross site
scripting. Now the attacker can replace the code with a more complex
JavaScript program, that for example can read the cookies of the visitors
of the forum and send them to a certain URL.

If an administrator retrieve this prepared forum post, his session
ID (that is stored in a cookie) is transferred to the attacker. By setting
the cookie at the attacker himself, in the worsest case he can get
administrator privileges.

How can we prevent this now? The forum post don't have to put out
unchanged - before we have to mask out all special charaters with a call
of ``htmlspecialchars()``. With this instead of
``<script>..</script>`` the safe result is delivered
to the browser:
``&amp;lt;script&amp;gt;...&amp;lt;/script&amp;gt;``. So the
content of the script tag is no longer executed as JavaScript, but only
displayed.

But there is a problem with this: If you miss *only at one
place* the clean masking of the data, a XSS hole exists in the
system.

In Fluid the output of every object accessor that occures in a
template is automaicly processed by ``htmlspecialchars()``. But
Fluid uses ``htmlspecialchars()`` only for templates with the
extension *.html*, e.g. if the output format is set to
HTML. If you use other output formats it is disabled and you have to make
sure to mask the special caracters correct. Also deactivated is is it for
object accessors that are used in arguments of a ViewHelper. A short
example for this::

   {variable1}
   <f:format.crop append="{variable2}">a very long text</f:format.crop>

The content of ``{variable1}`` is send thru
htmlspecialchars(), instead the content of ``{variable2}`` is not
changed. The ViewHelper must get the unchanged data becaus ewe can not
foresee what he will be done with the data. For this reason ViewHelper
that output parameter directly have to mask them correct.


