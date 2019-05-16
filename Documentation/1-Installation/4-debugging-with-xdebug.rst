.. include:: ../Includes.txt

=====================
Debugging with Xdebug
=====================

.. warning::

   **Review information for this page:**

   * Should be reviewed to check if correct and up-to-date
   * Or, can we just link to identical information elsewhere?
   * Shorten the text as much as possible!

Debugging with an IDE is a quick and efficient method to find bugs.


Install and Configure Xdebug
============================

For debugging you need the PHP extension *Xdebug* *(http://xdebug.org)*.
The development tools PhpStorm, NetBeans and Eclipse
can connect to Xdebug.

You can install this PHP extension in different ways.
We advise to install it over the packet management (like APT for
Debian/Ubuntu or MacPorts for Mac OS X) or you install it in PECL
(PHP Extension Community Library). The last method can be run with
the following command as user *root*::

   pecl install xdebug

After a successful installation you have to introduce Xdebug to PHP.
For that add the following line to the :file:`php.ini`::

   zend_extension="/usr/local/php/modules/xdebug.so"

In this process you have to declare the correct path to the
file :file:`xdebug.so`.

.. tip::

   For Windows you can download an already compiled version of
   Xdebug from the Xdebug website.

After a restart of your webserver you can find an xdebug section in
*phpinfo()*.

Additionally, you have to configue it.

Use the following lines or adjust them according to your setup.

php.ini::

   xdebug.remote_enable=on
   xdebug.remote_handler=dbgp
   xdebug.remote_host=localhost
   xdebug.remote_port=9000

Again after a restart of your webserver these options can be found in
*phpinfo()*.

Setup Your IDE
==============

Now you also have to configure the development environment
for a correct start of Xdebug.

PhpStorm
--------

The "Contribution Guide" contains a chapter about :ref:`Debugging With
PhpStorm <t3contrib:phpstorm-setup-xdebug>`.

Netbeans
--------

#. Open the properties of a project by clicking with the right mouse button on
   the project and choose *properties*.
#. Change the *run configuration*: Declare the base URL as *project URL* in
   which your TYPO3 frontend of your test system is available, eg.
   *http://localhost/typo3v4*.
#. Click on *Advanced...* to set the *Debug URL* into the settings
   to *Ask Every Time*.


NetBeans is now ready for debugging.

You can set so-called *breakpoints* in the source code of projects.
At these points your program stops and you can check the program
state, so you can investigate variables or continue step-by-step.
If you want to set a breakpoint, click on the numbering in front
of a line of the accordingly source code file. This line is
marked red.

To run the debugging you have to select *Debug* -> *Debug Project*.
It will open a pop-up window in which you have to enter the running
URL. It's advised to copy these URL from the browser. For example
if you want to debug the blog example: First open the blog module
in the TYPO3 backend, second click with the right mouse button to
the content frame and select *current frame* -> *open frame in new tab*.
Copy the URL of this frame and paste it into NetBeans. It will open
then the URL in a browser and you can see how the page looks like.
If you are going back to NetBeans the debug mode is on and the run
stops at the first breakpoint. Now you can investigate variables and
continue step-by-step and hope to find bug quicker.

.. tip::

   If you deactivate the setting *PHP* -> *Debugging* ->
   *Stop at First Line* in NetBeans the run stops only at
   the set breakpoint.

Eclipse
-------

Now let's look how to configure the settings in Eclipse. First you
have to make sure in the Eclipse setting that in the section
*PHP*->*PHP Servers* the entry is set for *http://localhost*.
In *PHP*->*Debug* the entry for *PHP Debugger* must be set to
*XDebug* and in *Server* the setting is set to the server for
localhost. We advise to deactivate *Break at First Line*
so that Eclipse/NetBeans stops only at the set breakpoint.

You can set a breakpoint in the source code of your application
if you double click with your left mouse button in the editor
at the required code section. Start the debugger with the right
mouse button on the file which should get debugged and select
*Debug as*->*PHP Web Page*. In the opening dialog window, enter
the URL to be called which can be found as described above.

Now change the look in Eclipse/NetBeans to PHP debug and you can
start with debugging in your application. Also you can investigate
variables or run the program step-by-step. If you want to stop
debugging you have to select in the menu *Run*->*Terminate*.

.. tip::

   You will realize at the second start you don't have to enter
   the URL. This is because Eclipse creates the so-called
   *Debug Configuration* at the first start and stored also
   the URL. If you want to change the URL you can set it new
   in the menu under *Run*->*Debug Configuration*.

