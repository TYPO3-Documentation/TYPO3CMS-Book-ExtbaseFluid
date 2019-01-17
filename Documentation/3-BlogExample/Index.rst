.. include:: ../Includes.txt

.. _The-Blog-Example:

A journey through the Blog Example
==================================

.. attention::

   About the code of the blog example:

   * The latest version is:
     `plobacher/extbasebookexamplev8 <https://github.com/plobacher/extbasebookexamplev8>`__,
     see the `Extbase book <https://leanpub.com/typo3extbase-en>`__ ,
     `Extbase book in German <https://leanpub.com/typo3extbase>`__ or
     `Extbase book in Italian <https://leanpub.com/typo3extbase-it>`__.

In this chapter we accompany you on a journey through a simple TYPO3 extension.
While travelling on this round trip, you will get to know more about extension
development with Extbase and Fluid and learn the most important stations and
coordinates of extension development with the help of an example extension. You
will first familiarize yourself with the geography and the typical
characteristics of an extension and find out which processes run in the
background. This knowledge will then help you in the creation of your own
extension.

If you are looking for a manual specifically on creating an extension,
chapter 4 will show you the right set of tools. However, we recommend to
work on the fundamentals in this chapter. The journey that lies ahead
of us could also have the title "Europe in five days." If you discover nice
places, you should visit them later without the travel group.

You will find it beneficial to look at the original source code while
reading the text, so you will have an easier time getting your bearings in your
own extension later.

.. note::

   If you use a debugger, it can be interesting to follow a full cycle
   in single step mode. For that you have to set a breakpoint in the
   file :file:`Dispatcher.php`. You will find this class - like
   every other class of Extbase - in the folder
   :file:`typo3/sysext/extbase/Classes/`.

At the end of this chapter you will find a short comparison of the
traditional way to code an extension and an approach with Extbase and
Fluid.

.. toctree::
   :maxdepth: 2

   1-first-orientation
   2-the-stations-of-the-journey
   3-calling-the-extension
   4-and-action
   5-Get-Blog-from-the-Repository
   6-An-excursion-to-the-database
   7-Paths-on-the-Data-Map
   8-Back-in-the-controller
   9-Rendering-the-output-with-fluid
   10-Returning-the-result-to-TYPO3
   11-Alternative-route-creating-a-new-posting
   12-automatic-persistence-of-the-domain-logic
   13-notes-for-migrating-users
