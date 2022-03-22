.. include:: /Includes.rst.txt

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
manipulated by the user.

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

Now we want to present some concepts that are used by extbase and fluid
to increase the security of an extension. First we explain how requests
that changes data are verified by extbase. After that we explain Cross
Site Scripting in order that you can secure your extension for that
effect.



Trusted Properties
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

.. code-block:: none

   [
      __identity => ...
      email =>  ...
      password => ...
      description => ...
   ],

Because the ``__identity`` property and further properties
are set, the argument mapper gets the object from the persistence layer,
makes a copy and then applies the changed properties to the object. After
this normally we call the method ``update($user)`` for the
corresponding repository to make the changes persistent.

What happened if an attacker manipulates the form data and transfers
an additional field ``username`` to the server? In this case the
argument mapping would also change the ``$username`` property of
the cloned object - although we actual said that this property should not
be changed by the user itself.

To avoid this problem fluid creates a hidden form field `__trustedProperties`
which contains information about what properties are to be trusted.
Once a request reaches the server, the property mapper of Extbase
compares the incoming fields with the property names, defined by the
`__trustedProperties` argument.

As the content of said field could also be manipulated by the client, the
field does not only contain a serialized array of trusted properties but
also a hash of that array. On the server side, the hash is also compared
to ensure the data has not been tampered with on the client side.

So only the form fields that are generated by Fluid with the
appropriate ViewHelpers are transferred to the server. If an attacker
tries, like described above, to add a field on the client side, this is
detected by the property mapper and an exception will be thrown.

In general `__trustedProperties` should work completely transparent
for you, you don't have to know how it works in detail. You have to know
this background knowledge only if you want to change data via JavaScript
or webservices.



Prevent Cross Site Scripting
-------------------------------------------------

Fluid contains some integrated techniques to secure web applications
per default. One of the important parts for this is the automatic
prevention against cross site scripting, that counts to the most used
attack against web applications. In this section we give you a problem
description and show how you can avoid cross site scripting (XSS).

Assume you have programmed a forum. An "evil" user will get access
to the admin account. For this he posted following harmful looking message
in the forum to try to embed JavaScript code::

   <script type="text/javascript">alert("XSS");</script>

When he let display the forum post he gets, if the programmer of the
forum has made no additional preventions, a JavaScript popup "XSS". The
attacker now knows that every JavaScript he write in a post, is executed
when displaying the post - the forum is vulnerable for cross site
scripting. Now the attacker can replace the code with a more complex
JavaScript program, that for example can read the cookies of the visitors
of the forum and send them to a certain URL.

If an administrator retrieve this prepared forum post, his session
ID (that is stored in a cookie) is transferred to the attacker. By setting
the cookie at the attacker himself, in the worst case he can get
administrator privileges.

How can we prevent this now? The forum post don't have to put out
unchanged - before we have to mask out all special characters with a call
of ``htmlspecialchars()``. With this instead of
``<script>..</script>`` the safe result is delivered
to the browser:
``&amp;lt;script&amp;gt;...&amp;lt;/script&amp;gt;``. So the
content of the script tag is no longer executed as JavaScript, but only
displayed.

But there is a problem with this: If you miss *only at one
place* the clean masking of the data, a XSS hole exists in the
system.

In Fluid the output of every object accessor that occurs in a
template is automatically processed by ``htmlspecialchars()``. But
Fluid uses ``htmlspecialchars()`` only for templates with the
extension *.html*, e.g. if the output format is set to
HTML. If you use other output formats it is disabled and you have to make
sure to mask the special characters correct. Also deactivated is is it for
object accessors that are used in arguments of a ViewHelper. A short
example for this::

   {variable1}
   <f:format.crop append="{variable2}">a very long text</f:format.crop>

The content of ``{variable1}`` is send thru
htmlspecialchars(), instead the content of ``{variable2}`` is not
changed. The ViewHelper must get the unchanged data because ewe can not
foresee what he will be done with the data. For this reason ViewHelper
that output parameter directly have to mask them correct.


