.. include:: ../Includes.txt
.. _extbase_error_action:

============
Error action
============

Extbase offers an out of the box handling for errors. Errors might occur during
the mapping of incoming action arguments. E.g., an argument can not be mapped or
validation did not pass.

How it works
============

.. rst-class:: bignums-xxl

#. Extbase will try to map all arguments within :php:`ActionController`. During
   this process arguments will also be validated.

#. If an error occurred, the class will call the :php:`$this->errorMethodName`
   instead of determined :php:`$this->actionMethodName`.

#. The default is to call :php:`errorAction()` which will:

   #. Clear cache in case :ts:`persistence.enableAutomaticCacheClearing` is
      activated and current scope is frontend.

   #. Add an error :ref:`Flash Message <t3coreapi:flash-messages>`
      by calling :php:`addErrorFlashMessage()`.
      Which in turn will call :php:`getErrorFlashMessage()` to retrieve the
      message to show.

   #. Forward back to referring request. If no referrer exists, a plain text
      message will be displayed, fetched from
      :php:`getFlattenedValidationErrorMessage()`.


Overloading behavior
====================

Each of the above steps can be adjusted by implementing custom methods or
replacing values within properties. All of the above is `protected` and, therefore,
can be replaced.

.. todo: This is something that will change eventually. There will be a possibility
         to implement custom error handling but it will no longer happen by overloading
         methods.

:php:`errorMethodName` property
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Replacing the default value `errorAction` will result in a different method to
be called in case of an error.

:php:`errorAction()` method
^^^^^^^^^^^^^^^^^^^^^^^^^^^

Replacing the default implementation can be used to define custom error
handling. E.g., the requested format could be checked, and a prepared JSON result
could be returned.

:php:`getErrorFlashMessage()` method
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

It can be replaced to return :php:`false` to prevent the generation of a flash
message. It can also return any other custom string which will be placed inside the
generated flash message.

:php:`getFlattenedValidationErrorMessage()` method
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Can be replaced in order to display some other error message if no referrer
exists.

.. todo: Well, we don't want the user to overload/override methods to achieve desired
         behavior. Most methods of `ActionController` are marked internal already and
         users shouldn't rely on them any longer. Overriding those methods is often
         done as a quirk, for example to disable flash messages that cumulate and are
         displayed automatically by the f:form.validationResults view helper. There is
         no other mechanism in place but when forwarding to the referring request, no
         flash messages are needed. In that case, validation errors should not be stored
         as flash messages but passed along to the re-dispatched request.
