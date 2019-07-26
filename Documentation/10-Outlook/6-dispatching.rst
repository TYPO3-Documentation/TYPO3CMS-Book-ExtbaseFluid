.. include:: ../Includes.txt
.. highlight:: php

.. _dispatching:

===========
Dispatching
===========

The Dispatcher's job is to find a class which can handle the current page
request. Once found, the dispatcher executes the method *handleRequest* in the
matching class and receives the result. This result is then passed out as
website content.

Here's the dispatcher path, step by step:

.. figure:: dispatching-flow.svg
   :align: center

   Figure 1-1: Extbase dispatching process

.. requesthandlerresolver:

RequestHandlerResolver
======================

Extbase innately contains a couple of classes for various requests and makes
them available via :file:`Configuration/Extbase/RequestHandlers.php`::

   return [
       \TYPO3\CMS\Extbase\Mvc\Web\FrontendRequestHandler::class,
       \TYPO3\CMS\Extbase\Mvc\Web\BackendRequestHandler::class,
   ];

This is how Extbase provides a :php:`RequestHandler` for requests in frontend or
backend context.

Thanks to this configuration, one can registering custom :php:`RequestHandler`.
For example, a handler for AJAX requests can be registered here.

The class-specific method :php:`canHandleRequest()` decides whether the request
can be handled by its :php:`RequestHandler`. For a :php:`BackendRequestHandler`,
the check looks like this::

   canHandleRequest()
   {
       return $this->environmentService->isEnvironmentInBackendMode()
           && !Environment::isCli();
   }

Because multiple RequestHandlers can be responsible for a request, a
prioritisation system is necessary. This is because only one RequestHandler can
take responsibility. Default priority is set to `100`. If another RequestHandler
needs to take priority, the method :php:`getPriority()` should return a higher
value.

Once the definitive RequestHandler has been identified, its method
:php:`handleRequest()` is executed. This method creates an object containing all
of the necessary data for the page request, using the :php:`RequestBuilder`. It
searches through the plugin configuration in :file:`ext_localconf.php` in order
to find out which Controller and Action should be used as standard. The
RequestBuilder also checks the Uri, to check whether an alternative Controller
or an alternative action should be loaded instead of the entries from
:file:`ext_localconf.php`.

.. note::

   Extbase does not use PSR-7 implementation for Request and Response, but
   custom implementations.

.. _response:

Response
========

A Response object is now created, which contains the header data and content.
These include status codes (like *Error 404*), as well as the necessary
JavaScript and CSS files. This object is empty at this point, ready to be filled
by the :php:`Dispatcher`.

.. _the-dispatcher:

The Dispatcher
==============

The Dispatcher fetches the Controller name from the Request object and creates
the Controller.

The object :php:`Request` and the currently empty object :php:`Response` are
passed to the the Controller, and the role of the Dispatcher is complete. The
Controller now modifies the response, which is handed back all the way to the
:php:`Bootstrap` which calls :php:`shutdown()`. It's now up to the response to
handle further stuff, e.g. send headers and return rendered content.

That's the point when TYPO3 receives the content and integrates it into the
rendering. The response itself will already send headers, no TYPO3 API will be
used at this place.

.. _the-controller:

The Controller
==============

The Controller generates output and appends it to the :php:`Response`. The
Controller also can set further response headers and access arguments from the
:php:`Request`.

.. _accessing-the-request:

Accessing the request
---------------------

Within the controller, :php:`$this->request` allows to access the incoming
Request. This way it's possible to directly access all arguments provided to the
request. Still it's better to use argument mapping instead.

In case of an forward, the request also enables access to the original request.
Further information like the controller name and plugin name can be retrieved
from the request.

Arguments can be accessed through::

   $this->request->getArgument('argumentName');

In order to make arguments available within the Request, or for mapping, they
need to conform to Extbase naming standard, in order to be mapped to the
extension. The default is to prefix arguments with plugin signature. This can be
adjusted via TypoScript option :ts:`view.pluginNamespace`, see
:ref:`typoscript_configuration-view`.

.. _using-the-response:

Using the response
------------------

Useful API calls include:

:php:`setStatus()`
   Allows to define the return status, e.g. 200 or 404. E.g.::

      $this->response->setStatus(404);

:php:`setHeader()`
   Allows to set a specific response header. E.g.::

      $this->response->setHeader('Content-Type', 'application/json; charset=utf-8');

:php:`setContent()`
   Allows to replace the whole content. E.g.::

      $this->response->setContent('Replaces existing content');

:php:`appendContent()`
   Allows to add further content. E.g.::

      $this->response->appendContent('Add this content');
      $this->response->appendContent('Add more content');

.. _returning-content:

Returning content
-----------------

Each action within the controller can optionally return content. If nothing is
returned, the default implementation will render :php:`$this->view` and return
the rendering result.

Content can be returned as string or object with :php:`__toString()`
implementation.

.. _forwarding-a-request:

Forwarding a request
--------------------

Within an action the current request can be forwarded to another action::

   $this->forward('newAction', 'ForeignController', 'ForeignExtension');

Extbase will modify the current request and mark it as not dispatched. An
exception is thrown which stops current execution and starts dispatching the
request again.

.. _redirecting-a-request:

Redirecting a request
---------------------

Within an action the current request can be redirected to another action or uri::

   $this->redirect('newAction', 'ForeignController', 'ForeignExtension');
   $this->redirectToUri('https://example.com');

In first example Extbase will build the url and call :php:`redirectToUri()`.

Extbase will adjust the response to contain the redirect and stop execution by
throwing an exception.
