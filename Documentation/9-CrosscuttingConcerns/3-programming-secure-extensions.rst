.. include:: /Includes.rst.txt

.. _programming-secure-extensions:

Programming Secure Extensions
=============================

If you are not familiar with basic security best practices, we recommend that you
take some time to lookup basic principles. Insecure extensions can seriously
compromise the integrity of the database, lead to leaking of private
information and other problems, which may be just annoying or have serious
consequences.

.. tip::

   You will find some hints for secure programming with PHP in the PHP handbook:
   http://php.net/security


In this section, we cover some relevant security aspects.
Specifically, we will show you some concepts implemented by Extbase
that increase the security of an extension.

.. tip::

   Basic principle #1: Never trust user input.

All input data your extension gets from the user can be potentially malicious.
That applies to all data being transmitted via GET and POST. You can never trust
that the data really came from your form as it could have been manipulated.
Cookies should be classified as potentially malicious as well, because they may
have been manipulated.

Always check if the format of the data corresponds
with the format you expected. For example, for a
field that contains an email address, you should check that a valid email address was entered
and not any other text. For this, the :ref:`validating framework <validating-domain-objects>`
of Extbase (which we covered in the previous chapter), may be helpful.

All data that comes from the user should be validated. This is especially critical
where data is written to the database.

In the next section we will show what you can do to handle this.
We also present some concepts that
Extbase and Fluid use internally to increase the security of an extension.
We will show you how queries that change data are secured by Extbase.
Next we cover Cross Site Scripting and illustrate how to secure your
extensions.


.. _create-own-database-queries:

Create Own Database Queries
---------------------------

Even though you will mostly use the :ref:`query language of Extbase
<individual_database_queries>`  to create database
queries, there is an option to directly create SQL queries. That might
be necessary for performance optimization. Always
create your own SQL queries in repository classes, to have the potential
unsafe code at a defined place.

If you create your own SQL queries you always have to convert the input
data to the desired format, for example to a number with the use of
``intval()``.

.. _trusted-properties:

Trusted Properties
------------------

.. danger::

   Be aware that request hashes (HMAC) don't protect against **Identity** field manipulation.
   An attacker can modify the identity field value and then can update the value of
   another record, even if he doesn't usually have access to it. You have to
   implement your own validation for the Identity field value (verify ownership
   of the record, add another hidden field which validates the identity field
   value, etc..).

In the section :ref:`mapping arguments <mapping-arguments>` we
explained the transparent argument mapping: All properties that
are to be sent, are changed transparently on the object. Certainly this
implies a safety risk, that we will explain with an example: Assume we
have a form to edit a ``user`` object. This object has the
properties ``username, email, password`` and
``description``. We want to provide the user a form to change all
properties, except the username (because the username should not be
changed in our system).

The form basically looks like this:

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
the cloned object - although we did not want this property to
be changed by the user itself.

To avoid this problem, Fluid creates a hidden form field `__trustedProperties`
which contains information about what properties are to be trusted.
Once a request reaches the server, the property mapper of Extbase
compares the incoming fields with the property names, defined by the
`__trustedProperties` argument.

As the content of said field could also be manipulated by the client, the
field does not only contain a serialized array of trusted properties but
also a hash of that array. On the server side, the hash is also compared
to ensure the data has not been tampered with on the client side.

So, only the form fields that are generated by Fluid with the
appropriate ViewHelpers are transferred to the server. If an attacker
tries to add a field on the client side, this is
detected by the property mapper and an exception will be thrown.

In general `__trustedProperties` should work completely transparently
for you, you don't have to know how it works in detail. You have to know
this background knowledge only if you want to change data via JavaScript
or webservices.



.. _prevent-cross-site-scripting:

Prevent Cross Site Scripting
----------------------------

Fluid contains some integrated techniques to secure web applications
by default. One of the important parts for this is the automatic
prevention against cross site scripting, which is a common
attack against web applications. In this section we give you a problem
description and show how you can avoid cross site scripting (XSS).

Assume you have programmed a forum. An "evil" user will get access
to the admin account. For this he posted the following harmful looking message
in the forum to try to embed JavaScript code::

   <script type="text/javascript">alert("XSS");</script>

When the forum post gets displayed, if the programmer of the
forum has made no additional preventions, a JavaScript popup "XSS" will be
displayed. The
attacker now knows that every JavaScript he write in a post, is executed
when displaying the post - the forum is vulnerable for cross site
scripting. Now the attacker can replace the code with a more complex
JavaScript program, that for example can read the cookies of the visitors
of the forum and send them to a certain URL.

If an administrator retrieves this prepared forum post, his session
ID (that is stored in a cookie) is transferred to the attacker. In the worst case
the attacker gets administrator privileges.

How can we prevent this? We must encode all special characters with a call
of ``htmlspecialchars()``. With this instead of
``<script>..</script>`` the safe result is delivered
to the browser:
``&amp;lt;script&amp;gt;...&amp;lt;/script&amp;gt;``. So the
content of the script tag is no longer executed as JavaScript, but only
displayed.

But there is a problem with this: If you miss just once the encoding
of the data, a XSS vulnerability exists in the
system.

In Fluid the output of every object accessor that occurs in a
template is automatically processed by ``htmlspecialchars()``. But
Fluid uses ``htmlspecialchars()`` only for templates with the
extension *.html*, e.g. if the output format is set to
HTML. If you use other output formats it is disabled and you have to make
sure to convert the special characters correctly.

It is also deactivated for
object accessors that are used in arguments of a ViewHelper. A short
example for this::

   {variable1}
   <f:format.crop append="{variable2}">a very long text</f:format.crop>

The content of ``{variable1}`` is sent to
htmlspecialchars(), the content of ``{variable2}`` is not
changed. The ViewHelper must retrieve the unchanged data because we can not
foresee what should be done with the data. For this reason ViewHelpers
that output parameter directly have to handle special characters correctly.


