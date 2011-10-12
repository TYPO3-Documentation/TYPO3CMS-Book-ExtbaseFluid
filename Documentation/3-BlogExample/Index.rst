A journey through the Blog Example
======================================================

In this chapter we accompany you on a journey through a simple TYPO3
extension. While traveling on this round trip you get to know more about the
extension development with Extbase and Fluid and learn the most important
stations and coordinates of the extension development with the help of a
example extension. You first familiarize with the geography and the typical
characteristics of a extension and find out, which processes run in the
background. This knowledge will then help you in the creation of an own
extension

If you search for a specific manual for the creation of an extension,
chapter 4 will show you the right set of tools. However we recommend you to
build the fundamentals for that in this chapter. The journey that lies ahead
of us, could also have the title "Europe in five days. If you discover nice
places, you should visit them later without the travel group.

It is a benefit, if you look into the original sourcecode while
reading the text so the orientation in your own extension later will be much
easier.

.. note::

	If you use a debugger, it can be interesting to follow a full cycle
	in the single step modus. For that you have to set a breakpoint in the
	file :file:`Dispatcher.php`. You will find this class - like
	every other class of Extbase also - in the folder
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
	12-automatic-persistence-of-the-domain-logic
	13-notes-for-migrating-users	