The stations of the journey
===========================================

Now that you have had a look at your journey destination and hopefully
don't feel disoriented when we stop at the several steps, you can start. Figure 3-3 gives you an overview of the stations on the journey,
which you will get to know in more detail during the upcoming sections.

.. figure:: /Images/3-BlogExample/figure-3-3.png
   :align: center

   Figure 3-3: The several stations of the journey

When an extension like the blog example is called, the following
happens behind the scenes:

TYPO3 digs into the page content and discovers the extension's content elements (plugins) on the page. It does not call the extension directly,
but hands over the control to the Extbase *Dispatcher*
(1).

The *Dispatcher* bundles all information of the
request in a *Request* and sends it to the appropriate
part of the extension, which takes over the flow control — the so-called
*Controller* (2).

Within the controller, the appropriate storage facility which is in charge
of the blogs — the *Repository* — is instructed to
return all the stored blog posts using the method :php:`findAll()`
(3).

The *Repository* returns a collection of the
already present ``Blog`` objects with all of their posts, comments and
tags (4).

The *Controller* sends these blogs to the part of
the extension responsible for the output — the *View* —
and advises it to render the content in the requested output format
(5).

The *View* returns the rendered content
encapsulated in a *Response* back to the
*Dispatcher*, which in turn returns the HTML code to
the calling TYPO3 process (6).
