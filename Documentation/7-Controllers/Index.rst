.. include:: /Includes.rst.txt
.. _controlling-the-flow-with-controllers:
.. _controllers:

=====================================
Controlling the flow with controllers
=====================================

In the previous chapters, we already transcribed the Domain of our
example extension *SJROffers* to a software-based domain
model. This leads to multiple files with class definitions in
the extension subfolder :file:`sjr_offers/Classes/Domain/Model/`. Furthermore, we
set up the persistence layer. As a result, we are already able to deposit
our domain's data in the form of domain Objects and retrieve it
again.

In this chapter, you'll see how to control the flow inside of your
extension. The bottom line is to evaluate requests of the website user, in
order to trigger the appropriate action. Regarding our example extension
*SJROffers*, it may make sense to show a list of all
offers or to give out all relevant information to one offer. Further
examples of actions are:

* Deleting a specific offer
* Deleting all offers of one organization
* Displaying a form to change the data of an offer
* Updating an offer
* Listing the newest offers

The code for receiving the request and for executing the
appropriate action is combined in controllers. A controller is a component
of the model-view-controller architecture, of which the basics are described
in chapter 2, section "model-view-controller in Extbase". The operation of a
Controller interconnected with the other components is described in chapter
3.

A controller is an object of an extension, which is instantiated and
called inside of Extbase by the :php:`Dispatcher` object.
The controller takes care of the complete flow inside of the extension. It
is the link between the :php:`Request`, the domain model, and the reaction in the form
of the :php:`Response`. Inside of the *controller*, the data
necessary for the flow is fetched from the respective repositories, prepared
according to the demand from outside, and passed to the code responsible for
the output (*View*). Besides this main task, a controller
is responsible for:

* accepting the :php:`Request` object, respectively rejecting it,
  in case it cannot be processed.
* inducing a check of the data coming in from the URL (especially
  from links) or the Frontend forms. This data has to be checked for
  type and validity.
* checking which method (*Action*) of the
  controller shall be called for further processing.
* preparing the incoming data so that it can be passed to the method
  in charge (*Argument Mapping*)
* initiating the rendering process.
* creating the :php:`Response` object.

In the following section, we'll create the necessary
Controller Classes of our extension and therein implement the adequate
*Action* methods. For this, we'll first have to decide
which Actions have to be implemented. For an extension usually needs
multiple different Actions, we'll group them in different controller
Classes. A very "natural" way of grouping would be: Every Aggregate Root
Class, containing objects on which an action shall be applied, is
administered by a proper controller. In our case, the two classes
:php:`Organization` and :php:`Offer` are
indicated. Now let's start with our first controller.

.. toctree::
   :hidden:

   1-Creating-Controllers-and-Actions
   2-Configuring-and-embedding-Frontend-Plugins
   3-Configuring-the-behavior-of-the-extension
