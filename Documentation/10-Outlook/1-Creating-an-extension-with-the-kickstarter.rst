.. include:: ../Includes.txt

Creating an extension with the kickstarter
==========================================

How you have seen in chapter 5 and chapter 6, when creating an extension you have to write a lot
of recurrent code. For every property of the domain model there are normally getter and setter
methods required and also the corresponding entry in the TCA definition of TYPO3 and in the
SQL table definition. Setting up these things by hand can be very exhausting. For this with
the Extbase Kickstarter a TYPO3 extension is developed that dramatically reduce the effort.
With the kickstarter you can create the model of your extension with a graphical user interface,
and then the correct domain models, the TCA definition and SQL files are automatically created.

.. warning::

    Currently the kickstarter is in further development, for this the screenshots in the following
    should only give a rough presentation of the kickstarter.

You can find the kickstarter in the TYPO3 Extension Repository with the extension key
*extbase_kickstarter*. If you are interested for current development version it is recommend
to get the version out of the subversion repository at *https://svn.typo3.org/TYPO3v4/Extensions/extbase_kickstarter*.
If you have enhancement issues or find bugs you can post them to the development team at
*forge.typo3.org*.

Concept
-------

The modelling of the domain model of an extension is the core functionality of the Etbase Kickstarter.
In a graphical user interface the new domian objects are created, with performing properties
and methods and applying the relations between the domain objects.

During this phase of development the focus lies on the functionality of the domain model, and the
controller and view layer are ignored by trend. Often it is anyway preferable yet to see the models
in action at this stage, and for example to use a list and edit view. The kickstarter attaches at
this point and approves a lot of work from you: He offers th so called *dynamic Scaffolding*, by
which the controller actions and Fluid templates for viewing, creating and editing are automaticly
created out of the domain model. This functionality is activated by default for all objects that are
marked as aggregate root and enables the simple testing of the model, because every change of the
domain model is directly mirrored in the presentation.

Later, when the model of the extension is matured finish, the formatting of the output and the
change of the control flow comes to the foreground - the developer concentrates now at the
controller and view layer of the extension. Because now the templates are to be aligned, the
*dynamic Scaffolding* should be changed into a *static Scaffolding*. This results in writing
the templates to disk and can be used as a base for manual customizing.

Sample modelling
----------------

We want to demponstrate the usage of the kickstarter with an example of a little news extension.
First we create a domian object ``News``, with the properties ``title``, ``author`` and ``text``.
Because we additionally want to create a comment funktion for news, the doamin objects needs a
list of ``Comment`` objects in which the comments are to be stored.

Now choose the module *Extbase Kickstarter* in the TYPO3 backend. To create a new extension you
have to select the sub module *Domain Modeller*. THen a graphical user interface (like figure 10-1)
is shown, with it you can model the domain objects.

.. figure:: /Images/10-Outlook/figure-10-1.png

	Figure 10-1: The domain modeller consists of a large workspace and retractable tabs at the
	left and right side, in wich the meta data can be entered.

To create a new domain object click at the box with the title *New Model Object* and pull it to
the desired place on the workspace. Now you can enter the name of the model object, in our case
``News``. Also we need a repository for this domain object and therefor we have to define it
as *Aggregate Root*. This is possible in the settings of *Domain Object Settings*. Beneath the
entry *Properties* can now be made the desired properties for the domain object (see figure 10-2).

.. figure:: /Images/10-Outlook/figure-10-2.png

	Figure 10-2: The domain object News has the properties title, author and text, and is defined
	as Aggregate Root.

Now we have doe modelling the domain object ``Comment`` and connect it to the just created
``News`` object. For this we create like just described a second object with the name ``Comment``
and a property for the comment text. To make the connection between the ``News`` and the
``Comment`` object, a new relation must be add to the ``News``` object. We take ``comments``
as name for the relation and configure *type* for a ``0..*`` relation with foreign key.
Now we can connect the two objects with drawing a connection line from *Related Object* to
the ``Comment`` object. The screen now looks like figure 10-3.

.. figure:: /Images/10-Outlook/figure-10-3.png

	Figure 10-3: Now the relation between the News and the Comment object is mold.

Now some meta data for the extension must be set, like title and extension key. For this we
open the tab on the left side of the workspace and fill in the needed information. With a
click on *Save* the extension is saved and all files are generated.

The extension can be installed with the extension manager now, and can be added to a page
in the TYPO3 frontend. If you call this page you will see that automaically a list, single
and edit view for editing of news entries are generated - this is the dynamic Scaffolding.
To change this to explicit templates the sub module *Convert Dynamic to Static Scaffolding*
can be used.

Now you have implement a simple extension with the kickstarter and can further enhance it.

The extbase kickstarter resides - like said at the beginning - heavy in the development stage.
At the moment there are plans of the development team to use a standarized desciption language
for the emerging models. Also the team around the kickstarter will try to implement functions
to edit existing extensions.

