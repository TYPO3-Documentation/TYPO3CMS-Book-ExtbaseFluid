.. include:: /Includes.rst.txt
.. index:: Extbase; Dispatcher
.. highlight:: php
.. _dispatching:

===========
Dispatching
===========

The dispatcher's job is to find one or more classes that can handle the current page
request. Once found, the dispatcher executes the methods *handleRequest* in the
matching classes and receives their results. These results are then combined and passed out as
website content.

.. todo: This description is not true. There is no such thing as the dispatcher
         as a root object that initiates the steps shown in the figure. We can
         talk about the process of dispatching an Extbase request instead. This
         is especially misleading as there is a Dispatcher class, which actually
         comes into play quite late.

Here's the dispatcher path, step by step:

.. uml::

   activate Bootstrap
   Bootstrap -> Bootstrap: handleRequest()

   Bootstrap -> RequestHandlerResolver: resolveRequestHandler()
   activate RequestHandlerResolver
   Bootstrap <-- RequestHandlerResolver: RequestHandler
   deactivate RequestHandlerResolver
   activate RequestHandler
   Bootstrap -> RequestHandler: handleRequest()

   activate RequestBuilder
   RequestHandler -> RequestBuilder: build()
   activate Request
   RequestHandler <-- RequestBuilder: Request
   deactivate RequestBuilder

   RequestHandler -> Request: setIsCached()
   activate Dispatcher
   RequestHandler -> Dispatcher: dispatch(Request)
   activate Controller
   Dispatcher -> Dispatcher: resolveController(Request)
   Dispatcher -> Controller: processRequest(Request)
   Controller -> Response
   activate Response

   Bootstrap <-- RequestHandler: Response
   deactivate RequestHandler
   Bootstrap -> Response: shutdown()
   deactivate Response
   Bootstrap <-- Response: content
   deactivate Bootstrap


.. index::
   Extbase; RequestHandlerResolver
   Files; Configuration/Extbase/RequestHandlers.php
.. _requesthandlerresolver:

RequestHandlerResolver
======================

Extbase innately contains a couple of classes for various requests and makes
them available via :file:`Configuration/Extbase/RequestHandlers.php`:

.. code-block:: php
   :caption: EXT:my_extension/Configuration/Extbase/RequestHandlers.php

   return [
       \TYPO3\CMS\Extbase\Mvc\Web\FrontendRequestHandler::class,
       \TYPO3\CMS\Extbase\Mvc\Web\BackendRequestHandler::class,
   ];

This is how Extbase provides a :php:`RequestHandler` for requests in frontend or
backend context.

Thanks to this configuration, one can register a custom :php:`RequestHandler`.
For example, a handler for AJAX requests can be registered here.

.. todo: We should not encourage users to write their own request handlers. Those
         are low-level API that takes care of fundamental parts of the whole plugin
         rendering and caching, so that the user does not really have a chance to
         do things differently than the default handlers. A much better approach is
         to implement a PSR-15 middleware stack that lets users add custom
         handlers that modify the request or response.

The class-specific method :php:`canHandleRequest()` decides whether the request
can be handled by its :php:`RequestHandler`. For a :php:`BackendRequestHandler`,
the check looks like this:

.. code-block:: php
   :caption: EXT:my_extension/Classes/RequestHandler/MyRequestHandler.php

   canHandleRequest()
   {
       return $this->environmentService->isEnvironmentInBackendMode()
           && !Environment::isCli();
   }

Because multiple RequestHandlers can be responsible for a request, a
prioritization system is necessary. This is because only one RequestHandler can
take responsibility. Default priority is set to `100`. If another RequestHandler
needs to take priority, the method :php:`getPriority()` should return a higher
value.

Once the definitive RequestHandler has been identified, its method
:php:`handleRequest()` is executed. This method creates an object containing all
of the necessary data for the page request, using the :php:`RequestBuilder`. It
searches through the plugin configuration in :file:`ext_localconf.php` in order
to find out which controller and action should be used as standard. The
RequestBuilder also checks the Uri, to check whether an alternative controller
or an alternative action should be loaded instead of the entries from
:file:`ext_localconf.php`.

.. todo: This description is not true. The request handlers do no longer build the
         request object. That was a flaw in the original design, and the reason why
         method canHandleRequest() did not receive the request to be handled. This
         has changed in version 11, making the request handlers a mere wrapper to
         dispatch the request via the dispatcher.
         franzholz: This seems to be still true and important to know. Maybe it is not
         the RequestHandler but an object executed before which collects the configuration.

.. note::

   Extbase does not yet use PSR-7 for requests, but
   custom implementations.

.. todo: We should mention that this unfortunately still is the case but is being
         worked on, and a PSR-7 request implementation might make it into 11 LTS.
         franzholz: It is not necessary to mention more things here for this case. Another place shall describe more.

.. _the-dispatcher:

The dispatcher
==============

The dispatcher fetches the controller name from the request object and creates
the controller.

The object :php:`Request` is passed to the controller,
and the role of the dispatcher is complete. The
Controller now returns the response, which is handed back all the way to the
:php:`Bootstrap` which calls :php:`shutdown()`. It is now up to the response to
handle further stuff, e.g., send headers and return rendered content.

That is the point when TYPO3 receives the content and integrates it into the
rendering. The response itself will already send headers, and no TYPO3 API will be
used at this place.

.. todo: It is worth mentioning that the controller that "now returns the response"
         is responsible for creating it and that it must be a PSR-7 response. It is
         not the right moment to explain how to create the response, though. Also, it
         is not up to the response "to handler further stuff". It is still the Bootstrap
         class that decides what to do. It only does it based on the returned response.
         To be more clear: The response itself does not invoke sending headers "and stuff".
         It is only a wrapper for the user data and headers to be handled by Extbase.

.. _the-controller:

The controller
==============

The controller generates a :php:`\Psr\Http\Message\ResponseInterface` object. The
controller can also set further response headers and access arguments from the
:php:`Request`.


.. _accessing-the-request:

.. todo: This is no longer true. The user is responsible for creating a response
         object in the action. It seems we can drop this short intro.

Accessing the request
---------------------

Within the controller, :php:`$this->request` allows to access the incoming
request. This way, it is possible to access all arguments provided to the
request directly. Still, it is better to use argument mapping instead.

In case of a forward, the request also enables access to the original request.

.. todo: This will most likely change when there is no ActionController
         anymore that can hold the request instance. Nothing to do here now, but we
         need to keep this part in mind in the future.

Further information like the controller name and plugin name can be retrieved
from the request.

Arguments can be accessed through:

.. code-block:: php
   :caption: EXT:my_extension/Classes/Controller/MyController.php

   $this->request->getArgument('argumentName');

In order to make arguments available within the request or for mapping, they
need to conform to Extbase's naming standard in order to be mapped to the
extension. The default is to prefix arguments with the plugin signature. This can be
adjusted via TypoScript option :typoscript:`view.pluginNamespace`, see
:ref:`typoscript_configuration-view`.

.. todo: This is something that might be deprecated in version 11.

.. _using-the-response:

Creating a response
-------------------

Extending the :php:`ActionController` usually makes it unnecessary to
manually create a response, as the :php:`callActionMethod()` already takes
care of it. However, to gain better control over the returned response, a
PSR-7 response can be created and returned, for example, if headers should
be set explicitly.

.. todo: Since not returning a response object will trigger a deprecation error, we
         should state that returning a PSR-7 response object is mandatory.

Responses need to implement :php:`\Psr\Http\Message\ResponseInterface`.
To create a response, it is recommended to use the
:ref:`PSR-17 response factory <t3coreapi:request-handling-psr-17>`:


.. code-block:: php
   :caption: EXT:my_extension/Classes/Controller/MyController.php

   use Psr\Http\Message\ResponseFactoryInterface;
   use Psr\Http\Message\ResponseInterface;

   // ...

   public function __construct(ResponseFactoryInterface $responseFactory)
   {
      $this->responseFactory = $responseFactory;
   }

   public function yourAction(): ResponseInterface
   {
       $response = $this->responseFactory
           ->createResponse()
           ->withHeader('Content-Type', 'application/json; charset=utf-8');
       $response->getBody()->write(json_encode($data));
       return $response;
   }


.. _returning-content:

.. todo: This is a technically correct way but PSR-17 actually doesn't bring any benefits
         at all for the user IMHO. We should recommend the response factory of the core
         here along with its optional methods (those not forced to exist by interface) to
         create responses like `\TYPO3\CMS\Core\Http\ResponseFactory::createJsonResponse`.
         Also, when dealing with just html, there is a helper method `htmlResponse` in
         `ActionController` which renders the given string or the current view.

Returning content
-----------------

Each action within the controller can optionally return content. If nothing is
returned, the default implementation will render :php:`$this->view` and return
the rendering result.

Content can be returned as string or object with :php:`__toString()`
implementation.

.. todo: Again, this should be rewritten. It's plain false in version 11.0.

.. _forwarding-a-request:

Forwarding a request
--------------------

Within an action the current request can be forwarded to another action by
returning a `ForwardResponse`:


.. code-block:: php
   :caption: EXT:my_extension/Classes/Controller/MyController.php

   use Psr\Http\Message\ResponseInterface;
   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;
   use TYPO3\CMS\Extbase\Http\ForwardResponse;

   class MyController extends ActionController
   {
      public function listAction(): ResponseInterface
      {
           // do something

           return (new ForwardResponse('show'))
               ->withControllerName('ForeignController')
               ->withExtensionName('ForeignExtension')
               ->withArguments(['foo' => 'bar'])
          ;
      }
   }

.. todo: We could add, that method `forward()` of `ActionController` is deprecated.

.. _redirecting-a-request:

Redirecting a request
---------------------

Within an action the current request can be redirected to another action
by returning the redirect method:

.. code-block:: php
   :caption: EXT:my_extension/Classes/Controller/MyController.php

   return $this->redirect(
      'newAction',
      'ForeignController',
      'ForeignExtension',
      ['param1' => $param1, 'param2' => $param2]
   );

or to another uri:

.. code-block:: php
   :caption: EXT:my_extension/Classes/Controller/MyController.php

   return $this->redirectToUri('https://example.org');

.. note::

   A redirection leads to a reload of the page. All the $_REQUEST variable is
   lost. Therefore all data needed on the
   destination must be passed as an array in parameter 4.
   If the redirection happens after a new / create form, then it must be taken
   care that the database record is stored
   into the database before the redirection:

   .. code-block:: php
      :caption: EXT:my_extension/Classes/Controller/MyController.php

      // use \TYPO3\CMS\Extbase\Persistence\Generic\PersistenceManager
      $persistenceManager->persistAll();

   `Data Transfer Objects in Extbase <https://usetypo3.com/dtos-in-extbase.html>`__ are an alternative solution
   to store the form data between redirections.

In the first example, Extbase will build the URL and call :php:`redirectToUri()`.

.. versionchanged:: 11.3
   Formerly the methods :php:`redirect` and :php:`redirectToUri` depended on
   throwing a :php:`StopActionException`. This Exception has however been
   deprecated with 11.3 as it is not PSR-7 conform. Therefore returning the
   results of the redirect methods becomes mandatory with TYPO3 v12.
