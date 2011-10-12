First orientation
========================================

The so called *blog example* is an example
extension, which mainly focuses on showing the process of the extension
development and shows the possibilities of an extension based on Extbase.
This extension is an usual blog, which either can be administrated on the
TYPO3 backend or in the frontend. The blog example includes the standard
features, which you will know from other blogs: A blog consists of several
posts and the readers of the blog are able to comment the posts. The author
of a post can add one or more tags to his post. Figure 3-1 shows an overview
of the domain of the blog example and the relation among the domain terms.
The asterisk (* or 0..*) means "any amount", 1 has to be translated with
"exactly one". So exactly one administrator can administrate any amount of
blogs. The diamond can be translated with "has", so: "One post has any
amount of comments".

.. todo::

	TODO: Insert figure 3-1: "Domain of the blog example"

.. note::

	The blog example has been created originally by the FLOW3 team and
	has been backported to TYPO3 version 4.x. When you will work more with
	FLOW3 and TYPO3 5.x in the future, you will find this example there in a
	near identical form. You will find some notes about the relationship
	between Extbase and FLOW3 in the section "Migration to FLOW3 and TYPO3 v5"
	in chapter 10.

The complete source code can be found in a folder, which has the same
name like the extension key. In our case the folder is called
*blog_example*. Usually the folder is located in the path
:file:`typo3conf/ext/` in your TYPO3 installation.

In the top level of this folder there are the subfolders
:file:`Classes`, :file:`Resources` and
:file:`Configuration` (see figure 3-2). There also are some
files which TYPO3 requires in order to include the extension. Those files
have the prefix :file:`ext_`. All other configuration files
needed by TYPO3 are located in the subfolder
:file:`Configuration` or in one of its subfolders.

<remark>TODO: Insert figure 3-2: folder structure of the example
extension</remark>

The core of the extension is located in the folder
:file:`Classes`. There you will all files in which classes or
interfaces are defined.

.. note::

	If you are not familiar with the terms classes and interfaces, you
	should look into the section "Object oriented programming with PHP" in
	chapter 2, *Basic principles*.

In the folder :file:`Resources` you will find all files
which are included at runtime, but no classes or interfaces. Those are in
particular icons, language packages, HTML templates, but also external
libraries or scripts. These resources are structured into a public
(:file:`Public`) and a private (:file:`Private`)
block. In the folder :file:`Public` files are located which are
allowed to be called *directly* by the client - in normal
cases the web browser. Files which are processed by a PHP class before they
get delivered to the browser, are located in the folder
:file:`Private`.

