Alternative route: creating a new posting
=========================================

After out first journey through the blog example, in this chapter we will follow a more complex example. As an example we have choosen the creation of a new post. The user should be offered a form in the frontend, in which he could put in the title and the content of a new post entry and select an existing author for this post. After clicking the *submit* button, the list of the last posts of the current blog should be displayed - now with the just created post at the first place. There are multiple steps, each based on the previous step, to be implemented that are mirrored in the actions :class:`new` and :class:`create`. The method :class:`newAction()` displays the form, while the method :class:`createAction()` really creates the post, put it in the repository and routes the process to the method :class:`indexAction()`.

Calling the method :class:`newAction()` is done in our case with a link in the frontend, that looks - a bit purged - like this:

::
	<a href="index.php?id=99&tx_blogexample_pi1[blog]=6&tx_blogexample_pi1[action]=new&tx_blogexample_pi1[controller]=post">Create a new Post</a>
	
This was created with the following Fluid code in the template *EXT:blog_example/Resources/Private/Templates/Post/index.html*:

::
	<f:link.action action="new" controller="Post" argumenta="{blog : blog}">Create a new Post</f:link.action>
	
The tag ``<f:link.action>`` creates a link to a special controller action combination: ``tx_blogexample_pi1[controller]=Post`` and ``tx_blogexample_pi1[action]=new``. Also the current blog is given as an argument with ``tx_blogexample_pi1[blog]=6``. Because the blog cannot be send as an object, it must be translated into an unique identifier - the *UID*. In our case this is the UID 6. Extbase creates out of these three informations the request and routes it to the according ``PostController``. The translation of the UID back to the corresponding ``blog`` object is done automaticly by Extbase.

Lets take a look at the to called method :class:`newAction()`:

::
	/**
	 * Displays a form for creating a new post
	 *
	 * @param Tx_BlogExample_Domain_Model_Blog $blog The blog the post blongs to
	 * @param Tx_BlogExample_Domain_Model_Post $newPost An invalid new post object passed by a rejected createAction()
	 * @return string An HTML form for creating a new post
	 * @dontvalidate $newPost
	 */
	public function newAction(Tx_BlogExample_Domain_Model_Blog $blog, Tx_BlogExample_Domain_Model_Post $newPost = NULL) {
		$this->view->assign('authors', $this->personRepoitory->findAll();
		$this->view->assign('blog', $blog);
		$this->view->assign('newPost', $newPost);
	}

The method :class:`newAction()` expected a ``blog`` object and an optional ``post`` object as parameter. It should be weird at first, because we have no blog and no post object, that has to be created with the form. Actually the parameter ``$newPost`` is empty (``NULL``) at the first call.

Our ``PostController``, that is derived from ``ActionController``, prepares all parameters before an action is called. The controller delegates this  to an instance of the class :class:`PropertyManager`, that has mainly two functions: it converts the parameter from the call (from our link) into the target object and checks if it is valid. The target for the parameter ``$blog`` is an instance of the class :class:`Tx_BlogExample_Domain_Model_Blog`, for the parameter ``$newPost`` it is an instance of the class :class:`Tx_BlogExample_Domian_Model_Post`.

How does Extbase know what the target of the conversion is? It takes this information from the information above the argument. If there is nothing declared it takes the destination type from the PHP documentation above the method, from the line:

::
	* @param Tx_BlogExample_Domain_Model_Blog $blog The blog the post belongs to
