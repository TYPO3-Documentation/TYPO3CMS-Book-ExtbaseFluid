Rendering the output with fluid
===============================

The TemplateView of Fluid now tries to load the coresponding HTML-Template. 
Since there is none specified by ``this->view->setTemplatePathAndFilename($template-PathAndFilename)``
Fluid searches at an place defined by conventions.

All frontend templates can ba found in :file:`EXT:blog_example/Resources/Private/Templates`
by default. There for exmample are the two subfolders ``Blog`` and ``Post``. 
Since the call was made by the indexAction() of the BlogController fluid 
searches in the folder Blog for a file named *index* and - if not setup up 
differently - the suffix *.html*. So every action method has its own template. 
Possible other formats are e.g. *.pdf*, *.json* or *.xml*. In table 3.1 you 
can find some examples for these convention.

*Table 3-1: Examples for the convention of template paths*

+----------+----------+----------+--------------------------------------------+
|Controller|Action    |Format    |Path and filename                           |
|Blog      |index     |k.A.      |Resources/Private/Templates/Blog/index.html |
|Blog      |index     |txt       |Resources/Private/Templates/Blog/index.txt  |
|Blog      |new       |k.A.      |Resources/Private/Templates/Blog/new.html   |
|Post      |k.A.      |k.A.      |Resources/Private/Templates/Post/index.html |
+----------+----------+----------+--------------------------------------------+

In our case the file *index.html* will be loaded. The content will be parsed step 
by step, line by line. Here you see an extract of the template file:

:: 

	<p>Welcome to the Blog Example!</p>
	<f:if condition="{blogs}">
		<f:then>
			<p>Here is a list of blogs:</p>
			<dl>
				<f:for each="{blogs}" as="blog">
					<dt>
						<f:link.action action="index" controller="Post"
						arguments="{blog : blog}">
							{blog.title} (<f:count subject="{blog.posts}" />)
						</f:link.action>
					</dt>
					<dd>
						<f:format.nl2br>{blog.description}</f:format.nl2br>
						<f:link.action action="edit"
							arguments="{blog : blog}">Edit</f:link.action>
						<f:link.action action="delete"
							arguments="{blog : blog}">Delete</f:link.action>
					<dd>
				</f:for>
			</dl>
			<p>
				<f:link.action action="new">Create another blog</f:link.action>
					<br /><f:link.action action="populate">Create example data</f:link.action>
					<br /><f:link.action action="deleteAll">Delete all Blogs [!!!]
				</f:link.action>
			</p>
		</f:then>
		<f:else>
			<p>
				<strong><f:link.action action="new">Create your first blog
				</f:link.action></strong>
				<br /><f:link.action action="populate">Create example data</f:link.action>
			</p>
		</f:else>
	</f:if>

At first all the unknown XML tags with namespace »f« stand out, like ``<f:if>``, 
``<f:for>`` or ``<f:link.action>``. These Tags are provided by Fluid and 
represent different functionalities.

* ``<f:format.nl2br>[...]</f:format.nl2br>`` modifies linebreaks (new lines) to ``<br />`` tags.
*  ``<f:link.action action="new">`` creates a link tag that links to the ``newAction()`` of the actual controller.
* ``<f:for each="{blogs}" as="blog">[...]</f:for>`` iterates over all Blog-objects found in Blogs.

Let's have a closer look at the latter exmaple. In the variable ``{blogs}`` all 
blogs are "included". The curly brackets tell Fluid that it is a variable that 
was "assigned" to the template before. In our case this was done in the 
``indexActon()`` of the ``BlogController``. With the attribute ``each`` the 
``for`` ViewHelper gets the ``blog`` objects over whom is to be iterated. The 
attribute ``as`` holds the name of the variable with which the ``blog`` object is 
available inside of ``<f:for>[...]</f:for>``. Here it can be called with ``{blog}``. 

.. note::

	The string "blog" is not surrounded by brackets when assigned to the ``as`` 
	attribute since the string is passed as a name for the varible and should not be 
	parsed by Fluid. An ``as="{blog}"`` would be parsed as if you would have liked 
	to make the name of the variable configurable. Rule of thumb: Curly brackets in 
	each, none in as.


Objects can not be renderd by Fluid directly. An exception make objects that 
have a ``__toString()`` method. The single properties of such an object can be 
accessed with a point-notation. If Fluid crosses a string like ``{blog.title}`` it 
tries to parse it. Fluid expects the variable ``blog`` to be an object. Insode of 
this object it searches vor a method named ``getTitle()``. The name of the method is 
created by extracting the part after the point, capitalizes the first letter and 
prefixes a »get«. With this the call looks something like this: 
``$blog->getTitle()``. The return value will replace ``{blog.title}`` in the 
template. Analogously ``{blog.descripiton}`` will be replaced with the description. 
Parsing the point goes recursively. That means Fluid can parse a string 
``{blog.administrator.name}`` by calling a method that equals 
``$blog->getAdministrator()->getName()``.

.. note::

	The return value is "tidied up" by htmlspecialchars(). That protects from 
	Cross Site Scripting-Attacks (XSS).

As soon as Fluid is done with the whole template the result is appended to the 
``Response`` object. This is done in the :class:`Tx_Extbase_MVC_Controller_ActionController`
by the call ``$this->response->appendContent($this->view->render())``.

Our journey slowly comes to an end. The *Request* is been fully answered by a 
corresponding Action. The ``Response`` object carries the completely generated 
content. We now sally forth heavy hearted the return trip stopping once more at 
the dispatcher of Extbase.