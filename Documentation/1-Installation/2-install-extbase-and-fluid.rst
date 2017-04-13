.. include:: ../Includes.txt

Install Extbase and Fluid
=========================

Since TYPO3 version 4.3 Extbase and Fluid are included into the TYPO3
core as so called *System Extensions*. To install these,
go to the Extension Manager and select *Install
Extensions*. Click the little plus icon at the beginnings of the
entries for the Extensions *extbase* and
*fluid*. Afterwards -if necessary- there will by a
dialog, adjusting the TYPO3 database a little, because Extbase will need a
new database table to store cache informations.

Now you have installed Extbase and Fluid and can use them for
Extension development. To check if Extbase and Fluid are working, we will
install a Blog Example Extension, which was created for testing Extbase and
Fluid. We will have a closer look at this Extension in chapter 3.

Again open the Extension Manager and open the submodule
*Import extensions* this time. Click
*Retrieve/Update* to download the current list of
available Extensions. Now you can search for the Extension
*blog_example*. With a click on the red arrow next to the
result, you will start to download the Extension to your TYPO3 instance.
After that you can click *Install extension* right away,
to have it installed.

After completing that, you'll find a new submodule
*Blogs* inside the *Web* module. If
you can't see it, you should reload the TYPO3 backend in your browser. With
a click on *Create example data*, some dummy records will
be created. The Blog Example is now working and can go on with Extbase and
Fluid.

The development of Extbase and Fluid proceeds quite fast. If you miss
certain functionalities or experiencing an issue, you should install the
development versions of Extbase and Fluid from the software versioning
system Subversion. Open the *typo3conf/ext/* directory of
your TYPO3 instance on the command line and get the development versions
(called trunk) of Extbase and Fluid with the command line tool
Subversion:

::

	svn checkout https://svn.typo3.org/TYPO3v4/CoreProjects/MVC/extbase/trunk extbase

	svn checkout https://svn.typo3.org/TYPO3v4/CoreProjects/MVC/fluid/trunk fluid


.. sidebar:: Report issues or help at development

	If you find an issue in Extbase or Fluid, you should have a look
	at the development platform forge.typo3.org. These projects are
	developed there by the community and you will find a bug tracker and a
	wiki for the projects:

	* Development of Extbase:
	  http://forge.typo3.org/projects/show/typo3v4-mvc
	* Development of Fluid:
	  http://forge.typo3.org/projects/show/package-fluid

	Additionally there is a special newsgroup and mailing list, which
	you can use for your Extbase and Fluid related questions. You'll find
	the mailing list called *TYPO3-project-typo3v4mvc* on
	*http://lists.typo3.org*. The according newsgroup is
	also found on *lists.typo3.org* by searching for
	*typo3.projects.typo3v4mvc*. Questions posted to the
	mailing list and newsgroup normally are answered by committed members of
	the community.

