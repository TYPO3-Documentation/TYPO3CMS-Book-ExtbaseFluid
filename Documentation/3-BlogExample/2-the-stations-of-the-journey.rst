.. include:: /Includes.rst.txt

===========================
The stations of the journey
===========================

Now that you have had a look at your journey destination and hopefully
don't feel disoriented when we stop at the several steps, you can start.
Figure 3-3 gives you an overview of the stations on the journey,
which you will get to know in more detail during the upcoming sections.

.. figure::  /Images/Graphics/3-BlogExample/figure-3-3.png
   :align: center

   Figure 3-3: The several stations of the journey

When an extension like the blog example is called, the following
happens behind the scenes:

.. index:: Extbase; Dispatcher

TYPO3 digs into the page content and discovers the extension's content
elements (plugins) on the page. It does not call the extension directly,
but hands over the control to the Extbase *Dispatcher*
(1).

.. index:: Extbase; Request
.. index:: Extbase; Controller

TYPO3 calls Extbase's Bootstrap, which then uses a RequestBuilder to create an Extbase Request.
Then Extbase tries to find a suitable RequestHandler which then uses a class called Dispatcher.

, which just creates the Controller instance and calls
         processRequest().

The *Dispatcher* handles all bundled information in the
request object and hands it over to the extension. Depending on the action parameter of the url,
it sends the request to the appropriate
part of the extension. This  is the so-called
*Controller* (2) , which takes over the flow control and processes the request.
The *Dispatcher* calls the `__construct` and the appropriate action method of the controller.


.. index:: Extbase; Repository

Within the controller, the appropriate storage facility which is in charge
of the blogs — the *repository* — is instructed to
return all the stored blog posts using the method :php:`findAll()`
(3).

The *repository* returns a collection of the
already present ``Blog`` objects with all of their posts, comments and
tags (4).

.. index:: Extbase; View

The *Controller* sends these blogs to the part of
the extension responsible for the output generation — the *View* —
and advises it to render the content in the requested output format
(5).

.. index:: Extbase; Response

The *View* returns the rendered content in HTML format back to the "Controller".
This returns the output result encapsulated in a *Response* object to the
*Dispatcher*, which in turn returns it to
the calling TYPO3 process (6).

