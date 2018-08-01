.. include:: ../Includes.txt

Model-View-Controller in Extbase
================================

Object-oriented programming and Domain-Driven Design specify a structure
for our extension on different levels. Object-oriented programming provides us with
the basic building blocks of software development: Objects as combination of data
and associated methods. Domain Driven Design provides us tools for creating a model
that represents the real world rules in software. However, we still lack a component
that specifies how to react on user requests and what functionality the application
will ultimately have. The Model View Controller Paradigm provides us exactly that.
It ensures a clean separation of the domain model from the view. This clean separation
is the foundation of the smooth interaction between Extbase and Fluid.

The Model-View-Controller design pattern is the infrastructure that we build our
application on. It provides us a rough *roadmap* and the separation
of the presentation logic from the Model.

The MVC pattern divides our application into three rough layers: the
*Model*, which implements the domain model including the domain logic,
the *controller*, which controls the flow of the application,
and the *view*, which prepares and outputs the data to the user
(see Figure 2-4).

*Model* is the lowest layer. It encapsulates the application
logic and data as well as the according access and storage logic. Domain Driven Design
divides this layer even further. In a Extbase extension you can find the classes for this
layer in the folder *Classes/Domain*.

The controller presents externally ( that is: directly callable by the user )
functionality. It coordinates the interaction of model and view to dispatch the
actual request. It fetches data from the model and hands it to the View for presentation.
Important: The controller only *coordinates*, the actual functionality
is usually implemented in the *Model*. Because the Controller is
difficult to test, it should stay as slim as possible.

.. figure:: /Images/2-BasicPrinciples/figure-2-4.png
   :align: center

   Figure 2-4: The MVC pattern divides the application into three global layers


The top layer, the *View* encapsulates the whole
presentation logic and everything related with the presentation of data.

.. sidebar:: Firsthand Report

   About 2 years ago I started to deal with the MVC-paradigm.
   I consulted various sources and tried to get an idea how I could fit my extensions
   to this structure. At this point i failed due to the enormous variations of MVC.
   No source was able to help me structure my usual, plugin oriented code. It was clear
   to me that database queries belong to the model and the template is part of the view.
   But where should subject-oriented source be held? And how can you prevent that
   objects of the model mix SQL-code, domain specific parts and persistence methods again?
   All in all, getting started with MVC demanded a high frustration tolerance. Finally,
   Domain Driven Design ( DDD ) showed me a way to the MVC paradigm, because DDD enables
   a clean separation of concerns inside the model that finally slims the view and
   controller.
   With the further separation of the model layer into the domain model
   ( the heart of the application ), the repositories ( as database layer ) and the
   validators ( which contain the invariants of the Model ) the MVC scheme is easier
   to implement and understand.
   - Jochen Rau

The Interaction of Model, View and Controller
---------------------------------------------

The functionality of many applications can be split into modules. This modules can
be further differentiated. The functionality of a Blog e.g. can be split as follows:


Functionality related to blog posts:

* List View of all blog posts
* Create a blog post
* Show a blog post
* Edit a blog post
* Delete a blog post

Functionality related to comments:

* Create comments
* Delete comments

These modules are implemented in a controller. Inside of this controller there is a
*Action* for every single function. In figure 2-5 we have a
*PostController*, which implements the actions to create, show, edit
and delete posts. In addition there is a *CommentController*, which
implements the actions to create and delete comments.

The Listing of Comments is not implemented as separate Action here, as the Comments
usually should be display directly with the Blog-Post and there is no View showing all
Comments.

Both Examples show that a Controller is mainly a Container for associated Actions.

Now we show by example how Model, View and Controller work together. The first request
we look at should display a list of blog posts (see Figure 2-5):

The User sends a request (1). The request Object contains information about the controller
and action that should be called and optionally additional parameters. In this example the
Controller is `Post` and the action `list`

To respond to the request the action has to query certain data from the Model.(2)
In return it receives on or several domain Objects. In our example the action queries
all blog posts and receives a array with all Blog-Post Objects as response.(3)

Thereafter the action calls the according view and hands over the data for
presentation (4) - the array with Blog-Posts in our case.

The View displays the data and returns the Response to the user.(5)

.. figure:: /Images/2-BasicPrinciples/figure-2-5.png
   :align: center

   Figure 2-5: In this request a list of Blog-Post is displayed.

Now as the first request is completely dispatched the user has a list of all
Blog-Posts displayed in the browser. Now the user clicks on a single Blog-Post and gets
the complete blog post. In addition the user can add a comment to this post.
With the help of Figure 2-6 we want to understand how the comment is stored.

When submitting the comment form the user creates a new request (1)
containing the according controller and action. In our example the controller is
`Comment` and the action is `new`. Furthermore the request
contains the comment text and a reference to the commented Blog-Post.

The called action now has to modify the Model and add the new comment to the
according Blog-Post. (2)


After that the action forwards to another action (3). In our case we forward
to the `show-Action` in the `PostController`,
which displays the Blog-Post and the freshly added comment.


Now the `show`-Action calls the according view and hands
over the Blog-Post that should be displayed. (4)

The view now displays the data and returns the result to the user. (5)

.. figure:: /Images/2-BasicPrinciples/figure-2-6.png
   :align: center

   Figure 2-6: In this request a comment is stored.

You will often see that actions can be sorted into two categories:
Some actions control the display of a Model, while other actions modify the
Model and usually forward to displaying actions. In the above example we first
saw a displaying action and then a modifying action.

Now we have all the Modules we need for developing our Application.
You got to know the Object-oriented basics, modeled the application domain
with Domain Driven Design and introduced the clean separation between the
Domain Model and the Presentation Logic

At last we want to introduce you to a development Model that can drastically
improve the stability and quality of the source code: Test-Driven Development.
This approach can be used independently of the previously introduced concepts, but
is another helpful Module for the extension development with Extbase and Fluid.

.. sidebar:: Differences to the classic MVC-Pattern

   If you previously have developed desktop applications with the MVC-Pattern you will
   notice some differences to the mentioned MVC Variant.
   Strictly speaking we have only mentioned the server-side components of the view,
   but there is a client-side component involved too: The Webbrowser ultimately displays
   the data from our web application, so it has to be part of the view-layer. Furthermore
   the view can be modified on the client-side with JavaScript. As a consequence, the
   view is even more separated as in the classic MVC Pattern.


   In the *Desktop*-MVC-Pattern the View listens for changes
   in the Model ( usually using the *Observer* Design Pattern ).
   This enables the view to react immediately to changes in the Model. As we only discuss
   the server side of the view and the server and the client don't share a persistent
   connection changes in the Model can not be visible in the browser immediately.
