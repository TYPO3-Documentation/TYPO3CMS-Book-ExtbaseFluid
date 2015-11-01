Paths on the Data-Map
=====================

The ``DataMapper`` object has the task to create an instance of the Blog-Class
(whose name is stored in ``$this->className``) for each tuple and "fill" this fresh
instance with the data of the tuple. It is called in the ``Query`` object by the
following Lines::

	$this->dataMapper->map($this->getType(), $rows);

The ``DataMapper`` object also resolves all relations. This means that it starts
requests for the posts and builds the objects with all included sub objects
before they are written into the attribute *posts* of the corresponding ``Blog``
object.

When resolving the relations, the ``DataMapper`` object gets its information from
different sources. First of all it knows the configuration of the database
tables (stored in the *Table Configuration Array*, short: TCA), furthermore it
"reads" the PHP comments inside the class definition standing above the
definitions (or *properties*). Let's for example look at the definition of the
property *posts* within the ``Blog`` class. You can find this in the file
:file:`EXT:blog_example/Classes/Domain/Model/blog.php`

::

	class Tx_BlogExample_Domain_Model_Blog extends Tx_Extbase_DomainObject_AbstractEntity {
		...

		/**
		 * The posts of this blog
		 *
		 * @var Tx_Extbase_Persistence_ObjectStorage<Tx_BlogExample_Domain_Model_post>
		 *
		 */
		protected $posts;

		...
	}


The property ``$posts`` contains within the PHP comment above some so called
annotations which start with the @ character. The annotation:

::

	@var Tx_Extbase_Persistence_ObjectStorage<Tx_BlogExample_Domain_Model_Post>


tells the ``DataMapper`` to create an ``ObjectStorage`` there and fill it with the
``Post`` objects of the class :class:`Tx_BlogExample_Domain_Model_Post`.

.. note::

	The :class:`Tx_Extbase_Persistence_ObjectStorage` is a class of Extbase. This
	class takes objects and ensures that an instance is unique within the
	``ObjectStorage``. Objects within the ``ObjectStorage`` can be accessed by the
	methods ``attach()``, ``detach()`` and ``contains()`` amongst others. The
	``ObjectStorage`` also implements the interfaces ``Iterator``, ``Countable``,
	``ArrayAccess``. So it is usable in ``foreach`` constructs.
	Furthermore the ``ObjectStorage`` behaves like an array. The ``ObjectStorage``
	of Extbase is based upon the native ``SplObjectStorage`` of PHP, which is error
	free since PHP-Version 5.3.1.


The notation at first seems unusual. It is based on the so called *Generics* of
the programming language Java. In the definition of your property you have to
enter the type in the annotation above the method definition. Properties of a
PHP-type will look like this:

::

	/**
	 * @var int
	 */
	protected $amount;


It is also possible to enter a class as type:

::

	/**
	 * @var Tx_BlogExample_Domain_Model_Author
	 */
	protected $author;


Properties which should be bound to multiple child objects require the class name of the child elements in angle brackets:

::

	/**
	 * @var Tx_Extbase_Persistence_ObjectStorage<Tx_BlogExample_Domain_model_Tags>
	 */
	protected $tags;


Extbase gathers the type of the relation from the configuration of the database
table column. Lets take a look at the definition of the column posts. It can be
found in the file :file:`tca.php` within the path *Configuration/TCA/*.

::

	$TCA['tx_blogexample_domain_model_blog'] = array(
		...
		'columns' => array(
			...
			'posts' => array(
				'exclude' => 1,
				'label' => 'LLL:EXT:blog_example/Resources/Private/Language/locallang_db.xml:tx_blogexample_domain_model_blog.posts',
				'config' => array(
					'type' => 'inline',
					'foreign_table' => 'tx_blogexample_domain_model_post',
					'foreign_field' => 'blog',
					'foreign_sortby' => 'sorting',
					'maxitems' => 999999,
					'appearance' => array(
						'newRecordLinkPosition' => 'bottom',
						'collapseAll' => 1,
						'expandSingle' => 1,
					),
				)
			),
			...
	);

Extbase "reads" from the configuration the table of the child objects
(``foreign_table``) and the key field where the unique identifier (UID) of the
parent object (``foreign_field``) is stored. With the help of these information and
the data given in the PHP-documentation above the property definition extbase
can read the database records and map them onto the Post-class. This process
will be continued recursively over the complete object graph - the blog with all
its containing posts, comments, tags etc. - starting from the single blog as
root object.

After our exhausting journey lets get back to the realm of our extension.
Remember that normally you will not need to enter these paths - except the case
that you are into customised journeys.
