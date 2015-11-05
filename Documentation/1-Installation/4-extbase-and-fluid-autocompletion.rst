.. include:: ../Includes.txt

.. _extbase-and-fluid-autocompletion:

Extbase and Fluid Autocompletion
================================

When developing your own Extensions you'll often work with classes of
Extbase and Fluid. That's why it helps to set up the autocompletion feature.
It will enable suggestions for complete class names as soon as you press
Ctrl + Space (see fig. 1-2). To activate this functionality you have to
configure the project you're currently developing, making it depend on
Extbase and Fluid. After that the IDE will activate autocompletion for
Extbase and Fluid classes.


.. figure:: /Images/1-Installation/figure-1-2.png
    :align: center

    Figure 1-2: The autocompletion feature will show you possible class names
    and their code documentation.


In NetBeans right-click your Extension project and choose
*Properties* in the opened context menu to edit the
project properties. Select the category *PHP Include
Path* and use *Add Folder...* to add the
directories of Extbase and Fluid.

In Eclipse this works pretty similar. Right-click the project in which
you want to enable the autocompletion feature and select
*Properties*. Now choose the category *PHP
include Path*. Now click on *Projects*, because
you want to create a reference to another Eclipse project. Click on the
*Add...* button and choose the Extbase and Fluid Projects
that you've created before.
