.. include:: ../Includes.txt

Model-View-Controller in Extbase
================================

Object oriented programming and Domain Driven Design specify a structure
for our Extension on different levels. Object oriented programming provides
the basic building blocks of software development: Objects as combination of data
and associated methods. Domain Driven Design provides tools for creating a Model
that represents the real world rules in Software. However, we still lack a component
that specifies how to react on user requests and what functionality the application
will ultimately have. The Model View Controller Paradigm provides exactly that.
It ensures a clean separation of the Domain Model from the View. This clean separation
is the foundation of the smooth interaction between Extbase and Fluid.

The Model-View-Controller design pattern is the infrastructure that we build our
application on. It provides us a rough *roadmap* and the separation
of the presentation logic from the Model.

The MVC pattern divides our application into three rough layers: the
*Model*, which implements the Domain Model including the domain logic,
the *controller*, which controls the flow of the application,
and the *view*, which prepares and outputs the data to the user
(see Figure 2-1).

The lowest layer, the *Model* encapsulates the application
logic and data as well as the according access and storage logic. 
Domain Driven Design divides this layer even further. In an Extbase extension you can usually find 
the classes for this layer in the folder :file:`Classes/Domain`.

The Controller represents external ( that is: directly callable by the user )
functionality. It coordinates the interaction of model and view to dispatch the
actual request.
It fetches data from the model and hands it to the view for presentation.
Important: The Controller only *coordinates*, the actual functionality
is usually implemented in the *Model* layer. Because the controller is
difficult to test, it should stay as slim as possible.

.. figure:: /Images/2-BasicPrinciples/figure-2-1.png
   :align: center

   Figure 2-1: The MVC pattern divides the application into three global layers


The top layer, the *View* encapsulates the whole
presentation logic and everything related to the presentation of data.

The Interaction of Model, View and Controller
---------------------------------------------

The functionality of many applications can be split into modules.
These modules can be further differentiated.
The functionality of a Blog e.g. can be split as follows:

Functionality related to Blog Posts:

* List View of all Blog Posts
* Create a Blog Post
* Show a Blog Post
* Edit a Blog Post
* Delete a Blog Post

Functionality related to Comments:

* Create Comments
* Delete Comments

These modules are implemented in a controller.
Inside of this controller is an *Action* for every single function.
In the above example we have a *PostController*, which implements
the actions to create, show, edit and delete posts.
In addition there is a *CommentController*, which implements
the actions to create and delete comments.

The listing of comments is not implemented as separate action here,
as the comments usually should be display directly with the
blog post and there is no view showing all comments.

Both examples show that a controller is mainly a container
for associated actions.

Let's now look at an example how model, view and controller
work together. The first request we look at should display a
list of blog posts (see Figure 2-2):

The user sends a request (1). The request object contains information
about the controller and action that should be called and optionally
additional parameters. In this example the controller is `Post`
and the action `list`.

To respond to the request the action has to query data from the Model.
(2) In return it receives one or several domain objects.
In our example the action queries all blog posts and receives
an array with all blog post objects as response.(3)

Thereafter the action calls the according view and hands over the data for
presentation (4) - the array with blog posts in our case.

The view displays the data and returns the response to the user.(5)

.. figure:: /Images/2-BasicPrinciples/figure-2-2.png
   :align: center

   Figure 2-2: In this request a list of blog posts is displayed.

Now as the first request is completely dispatched the user has a list of all
blog posts displayed in the browser. Now the user clicks on a single
blog post and gets the complete blog post.
In addition the user can add a comment to this post.
With the help of figure 2-6 we want to understand how the comment is stored.

When submitting the comment form the user creates a new request (1)
containing the according controller and action.
In our example the controller is `Comment` and the action is `new`.
Furthermore the request contains the comment text and a reference
to the commented blog post.

The called action now has to modify the model and add the new comment to the
according blog post. (2)


After that the action forwards to another action (3). In our case we forward
to the `showAction` in the `PostController`,
which displays the blog post and the freshly added comment.


Now the `show`-Action calls the according view and hands
over the blog post that should be displayed. (4)

The view now displays the data and returns the result to the user. (5)

.. figure:: /Images/2-BasicPrinciples/figure-2-3.png
   :align: center

   Figure 2-3: In this request a comment is stored.

You will often see that actions can be sorted into two categories:
Some actions control the display of a model, while other actions modify the
model and usually forward to displaying actions. In the above example we first
saw a displaying action and then a modifying action.

