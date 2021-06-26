.. include:: /Includes.rst.txt
.. index::
   MVC
   Model-view-controller
   see: Model-view-controller; MVC
   pair: MVC; Extbase

======================================
Model-view-controller (MVC) in Extbase
======================================

Object-oriented programming and domain-driven design specify a structure
for our extension on different levels. Object-oriented programming provides
the basic building blocks of software development: Objects as a combination of data
and associated methods. Domain-driven design provides tools for creating a model
that represents the real world rules in Software. However, we still lack a component
that specifies how to react to user requests and what functionality the application
will ultimately have. The model–view–controller paradigm provides exactly that.
It ensures a clean separation of the domain model from the view. This clean separation
is the foundation of the smooth interaction between Extbase and Fluid.

The model–view–controller design pattern is the infrastructure that we build our
application on. It provides us a rough *roadmap* and the separation
of the presentation logic from the model.

The MVC pattern divides our application into three rough layers: the
*model*, which implements the domain model including the domain logic,
the *controller*, which controls the flow of the application,
and the *view*, which prepares and outputs the data to the user
(see Figure 2-1).

The lowest layer, the *model* encapsulates the application
logic and data, as well as the according access and storage logic.
Domain-driven design divides this layer even further. In an Extbase extension, you can usually find
the classes for this layer in the folder :file:`Classes/Domain`.

The controller represents external ( that is: directly callable by the user )
functionality. It coordinates the interaction of the model and view to dispatch the
actual request.
It fetches data from the model and hands it to the view for presentation.
Important: The controller only *coordinates*, the actual functionality
is usually implemented in the *model* layer. Because the controller is
difficult to test, it should stay as slim as possible.

.. figure::  /Images/ManualScreenshots/2-BasicPrinciples/figure-2-1.png
   :align: center

   Figure 2-1: The MVC pattern divides the application into three global layers


The top layer, the *view* encapsulates the whole
presentation logic and everything related to the presentation of data.


.. index:: MVC; Interaction

The interaction of model, view, and controller
==============================================

The functionality of many applications can be split into modules.
These modules can be further differentiated.
The functionality of a blog e.g., can be split as follows:

.. todo: maybe we should replace the term "modules" with "contexts". This also reflects the
         term "bounded contexts" of DDD better. Also, modules is a reserved word in TYPO3 and
         has a different meaning.

Functionality related to blog posts:

* List View of all blog posts
* Create a blog post
* Show a blog post
* Edit a blog post
* Delete a blog post

Functionality related to comments:

* Create comments
* Delete comments

These modules are implemented in a controller.
Inside of this controller is an *action* for every single function.
In the above example, we have a :php:`PostController`, which implements
the actions to create, show, edit and delete posts.
Also, there is a :php:`CommentController`, which implements
the actions to create and delete comments.

The listing of comments is not implemented as separate action here,
as the comments usually should be displayed directly with the
blog post, and there is no view showing all comments.

Both examples show that a controller is mainly a container
for associated actions.

Let's now look at an example of how model, view, and controller
work together. The first request we look at should display a
list of blog posts (see Figure 2-2):

The user sends a request (1). The request object contains information
about the controller and action that should be called and optionally
additional parameters. In this example, the controller is :php:`PostController`
and the action :php:`listAction()`.

To respond to the request, the action has to query data from the model.
(2) In return, it receives one or several domain objects.
In our example, the action queries all blog posts and receives
an array with all blog post objects as response.(3)

Thereafter the action calls the according view and hands over the data for
presentation (4) - the array with blog posts in our case.

The view displays the data and returns the response to the user.(5)

.. todo: 1) The figure contains german texts
         2) The figure shows a false flow. The view does not return a response, the controller does.
            We should try to have another figure created here.

.. figure::  /Images/ManualScreenshots/2-BasicPrinciples/figure-2-2.png
   :align: center

   Figure 2-2: In this request, a list of blog posts is displayed.

As the first request is completely dispatched, the user has a list of all
blog posts displayed in the browser. Now the user clicks on a single
blog post and gets the complete blog post.
Besides, the user can add a comment to this post.
With the help of figure 2-6 we want to understand how the comment is stored.

.. todo: figure 2-6 does not exist, should be 2-3, I guess.

When submitting the comment form, the user creates a new request (1)
containing the according controller and action.
In our example, the controller is `Comment`, and the action is `new`.
Furthermore, the request contains the comment text and a reference
to the commented blog post.

The called action now has to modify the model and add the new comment to the
according blog post. (2)

After that, the action forwards to another action (3). In our case, we forward
to the `showAction` in the `PostController`,
which displays the blog post and the freshly added comment.

Now the `show` action calls the according view and hands
over the blog post that should be displayed. (4)

The view now displays the data and returns the result to the user. (5)

.. figure::  /Images/ManualScreenshots/2-BasicPrinciples/figure-2-3.png
   :align: center

   Figure 2-3: In this request, a comment is stored.

You will often see that actions can be sorted into two categories:
Some actions control a model's display, while other actions modify the
model and usually forward to displaying actions. In the above example, we first
saw a displaying action and then a modifying action.

