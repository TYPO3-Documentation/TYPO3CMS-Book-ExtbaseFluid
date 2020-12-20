First orientation
=================

The *blog example* is an example
extension, which mainly focuses on showing the process of extension
development and shows the possibilities of an extension based on Extbase.
This extension is a common blog, which can be administrated either through the
TYPO3 backend or in the frontend. The blog example includes the standard
features, which you will know from other blogs: A blog consists of several
posts, and the readers of the blog can comment on the posts. The author
of a post can add one or more tags to his post. Figure 3-1 shows an overview
of the blog example's domain and the relation among the domain terms.
The asterisk (* or 0..*) means "any amount", 1 has to be translated with
"exactly one". So exactly one administrator can administrate any amount of
blogs. The diamond can be translated with "has", so: "One post has any
amount of comments".

.. figure:: /Images/3-BlogExample/figure-3-1.png
   :align: center

   Figure 3-1: Domain of the blog example

The complete source code can be found in a folder with the same
name as the extension key. In our case, the folder is called
*blog_example*. Usually, the folder is located in the path
:file:`typo3conf/ext/` in your TYPO3 installation.

In the top level of this folder there are the subfolders
:file:`Classes`, :file:`Resources` and
:file:`Configuration` (see figure 3-2). There also are some
files that TYPO3 requires to include the extension. Those files
have the prefix :file:`ext_`. All other configuration files
needed by TYPO3 are located in the subfolder
:file:`Configuration` or in one of its subfolders.

.. figure:: /Images/3-BlogExample/figure-3-2.png
   :align: center

   Figure 3-2: folder structure of the example extension

The core of the extension is located in the folder
:file:`Classes`. There you will all files in which classes or
interfaces are defined.

.. note::

   If you are not familiar with the terms "classes" and "interfaces", you
   should look into "Object-oriented programming with PHP".

In the folder :file:`Resources`, you will find all files
included at runtime, but no classes or interfaces. Those are icons, language packages, HTML templates, and external
libraries or scripts. These resources are structured into a public
(:file:`Public`) and a private (:file:`Private`)
block. The folder :file:`Public` holds files allowed to be called *directly* by the client - in normal
cases, the web browser. Files processed by a PHP class before they
get delivered to the browser are located in the folder
:file:`Private`.

