Debugging with Xdebug
=====================


The usage of debuggers in other programming languages is default while it is special in PHP: The most PHP developer maintain bug fixing with e.q. *echo* and *var_damp* in the source code for understanding the routine. Though it's helpful to use a real debugger to comprehend errors because you can go through the source code step-by-step and look inside variables.

For debugging you need the PHP extension *Xdebug* *(http://xdebug.org)*. It changed the PHP configuration that you can run it step-by-step and you can inspect every variable. The development tools NetBeans and Eclipse can connect to Xdebug and enable graphical output.

But back to Xdebug: You can install this PHP extension on different ways. We advise to install it over the packet management (like ADT for Debian/Umbuntu or MaCPaorts for MAc OS X) or you install it in PECL (PHP Extension Community Library). The last method can run with the following command as user *root*::

	pecl install xdebug

After a successfully installation you have to introduce Xdebug in PHP. For that add the following line into the php.ini::

	zend_extension="/usr/local/php/modules/xdebug.so"

In this process you have to declare the correct path to the file *xdebug.so*.

.. tip::
	For Windows you can download a ready compiled version of Xdebug from the Xdebug website.

After a restart of Apache you can find a xdebug secton in *phpinfo()*. For a corporation of *Xdebug* with Eclipse or NetBeans you have to configure it. For that you have to set the following lines into php.ini::

	xdebug.remote_enable=on
	xdebug.remote_handler=dbgp
	xdebug.remote_host=localhost
	xdebug.remote_port=900

Again after a restart of Apache this options can be found in *phpinfo()*. Now you also have to configure the development environment for a correct start of Xdebug. In NetBeans you have to open the properties of a project by clicking with the right mouse button on the project and choose *properties*. Now you must change the *run configuration*: Declared the base URL as *project URL* in which your TYPO3 frontend of your test system is available, eq. *http://localhost/typo3v4*. Click to *Advanced...* to set the *Debug URL* into the settings to *Ask Every Time*. NetBeans is now ready for debugging.

You can set so-called *breakpoints* in the source code of projects.  At these points your program stops and you can check the program state, so you can investigate variables or continue step-by-step. If you want to set a breakpoint, click on the numbering in front of a line of the accordingly source code file. This line is marked red.

To run the debugging you have to select *Debug* -> *Debug Project*. It will open a pop-up window in which you have to enter the running URL. It's advised to copy these URL from the browser. For example if you want to debug the blog example: First open the blog module in the TYPO3 backend, second click with the right mouse button to the content frame and select *current frame* -> *open frame in new tab*. Copy the URL of this frame and paste it into NetBeans. It will open then the URL in a browser and you can see how the page looks like. If you are going back to NetBeans the debug mode is on and the run stops at the first breakpoint. Now you can investigate variables and continue step-by-step and hope to find bug quicker.

.. tip::
	If you deactivate the setting *PHP* -> *Debugging* -> *Stop at First Line* in NetBeans the run stops only at the set breakpoint.

Now let's look how to configure the settings in Eclipse. First you have to make sure in the Eclipse setting that in the section *PHP*->*PHP Servers* the entry is set for *http://localhost*. In *PHP*->*Debug* the entry for *PHP Debugger* must set to *XDebug* and in *Server* the setting is set to the server for localhost. We advise here to deactivate *Break at First Line* so that Eclipse stops only at the set breakpoint.
You can set a breakpoint in the source code of your application if you double click with your left mouse button in the editor at the required code section. Start the debugger with the right mouse button on the file which should debugged and select *Debug as*->*PHP Web Page*. In the opening dialog window, enter the URL to be called which can be found as described above.
Now change the look in Eclipse to PHP debug and you can start with debugging in your application. Also you can investigate variables or run the program step-by-step. If you want to stop debugging you have to select in the menu *Run*->*Terminate*.

.. tip::

	You will realize at the second start you don't have to enter the URL. This is because Eclipse creates the so-called *Debug Configuration* at the first start and stored also the URL. If you want to change the URL you can set it new in the menu under *Run*->*Debug Configuration*.

Debugging with IDE is a quick and efficient method to find bugs. Even if the debugger for PHP is not as sophisticated as their counterparts in Java it helps in troubleshooting.
