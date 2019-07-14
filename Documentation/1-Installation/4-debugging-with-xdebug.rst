.. ---------------------------------------------------
.. Review information for this page:
.. Review Status: ok
.. Last reviewed: July 14 2019 for TYPO3 version 9.5.7
.. ---------------------------------------------------

.. include:: ../Includes.txt

=====================
Debugging With Xdebug
=====================

For debugging you can use the PHP extension *Xdebug* (http://xdebug.org).

Install Xdebug
==============

You can install this PHP extension in different ways.
We advise to install it with the packet manager (like APT for
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

After a restart of your webserver (or your Docker or DDEV
environment) you can find an xdebug section in
*phpinfo()*.

.. tip::

   You can see a dump of phpinfo in the backend of your TYPO3
   installation: :guilabel:`Environment > PHP Info`

   .. image:: ../Images/1-Installation/environment-php-info.png
      :class: with-shadow

Configure Xdebug
================

Next, you have to configure it. For that you have to set the
following lines in :file:`php.ini`::

   xdebug.remote_enable=on
   xdebug.remote_host=localhost
   xdebug.remote_port=9000

Again after a restart these options can be found in
*phpinfo()*.


Configure your IDE
==================

* `Configurating Xdebug in PhpStorm <https://www.jetbrains.com/help/phpstorm/configuring-xdebug.html#integrationWithProduct>`__

Use Xdebug Browser Plugin
=========================

* `Browser Debugging Extensions <https://www.jetbrains.com/help/phpstorm/browser-debugging-extensions.html>`__




