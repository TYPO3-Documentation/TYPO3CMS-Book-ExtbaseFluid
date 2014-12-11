.. _controlling-the-flow-with-controllers:

Controlling the flow with controllers
=====================================================


In the previous chapters we already transcribed the Domain of our
example extension *SJROffers* to a software based Domain
Model. This lead to multiple files with class definitions, to be found in
the subfolder <link
linkend="???">EXT:sjr_offers/Classes/Domain/Model/</link>. Furthermore we
set up the persistence layer. As a result we are alredy able to deposit the
data of our Domain in the form of Domain Objects and to retrieve it
again.

In this chapter you'll see how to control the flow inside your
extension. The bottom line is to evaluate requests of the website user, in
order to trigger the appropriate action. Regarding our example extension
*SJROffers*, it may make sense to show a list of all
offers or to give out all relevant information to one offer. Further
examples of such actions are:

* Deleting a specific offer
* Deleting all offers of one organizatin linkion
* Displaying a form to change the data of an offer
* Updating an offer
* Listing the newest offers

The code receiving the request and executing the
appropriate action is combined in Controllers. A Controller is a component
of the Model-View-Controller architecture, of which the basics are described
in chapter 2, section "Model-View-Controller in Extbase". The operation of a
Controller interconnected with the other components was described in chapter
3.

A Controller is an object of an extension, which is instantiated and
called inside of extbase by the :class:`Dispatcher` object.
The controller takes care of the complete flow inside of the extension. It
is the link between the Request, the Domain Model and the reaction in form
of the Response. Inside the *Controller*, the data
necessary for the flow is fetched from the respective Repositories, prepared
according to the demand from outside and passed to the code responsible for
the output (*View*). Besides this main task, a Controller
is responsible for:

* accepting the :class:`Request` and
  :class:`Response` object, respectively rejecting them,
  in case they can not be processed.
* inducing a check of the data coming in from the URL (especially
  from links) or forms of the Frontend. This data has to be checked for
  type and validity.
* checking which method (*Action*) of the
  Controller shall be called for further processing.
* preparing the incoming data, so it can be passed to the method
  in charge (*Argument Mapping*)
* initiating the rendering process.
* passing the output of the rendering process to the
  :class:`Response` object.

In the following section, we'll create the necessary
Controller Classes of our extension and and therein implement the adequate
*Action* methods. For this, we'll first have to decide,
which Actions have to be implemented. For an extension usually needs
multiple different Actions, we'll group them in different Controller
Classes. A very "natural" way of grouping would be: Every Aggregate Root
Class, containing objects on which an Action shall be applied, is
administered by a proper Controller. In our case the two classes
:class:`Organization` and :class:`Offer` are
indicated. Now let's start with our first Controller. 

.. toctree::
	:maxdepth: 2
	
	1-Creating-Controllers-and-Actions
	2-Configuring-and-embedding-Frontend-Plugins
	3-Configuring-the-behavior-of-the-extension
