.. include:: ../Includes.txt

Paths on the Data-Map
=====================

The `DataMapper` object has the task to create an instance of the blog class
(whose name is stored in `$this->className`) for each tuple and "fill" this fresh
instance with the data of the tuple. It is called in the `Query` object by the
following Lines::

    $this->dataMapper->map($this->getType(), $rows);

The ``DataMapper`` object also resolves all relations. This means that it starts
requests for the posts and builds the objects with all included sub-objects
before they are written into the attribute *posts* of the corresponding ``Blog``
object.

When resolving the relations, the ``DataMapper`` object gets its information from
different sources. First of all, it knows the configuration of the database
tables (stored in the *Table Configuration Array*, short: TCA), furthermore it
"reads" the PHP comments inside the class definition standing above the
definitions (or *properties*). For example, let's look at the definition of the
property *posts* within the ``Blog`` class. You can find this in the file
:file:`EXT:blog_example/Classes/Domain/Model/Blog.php`. ::

    <?php
    namespace FriendsOfTYPO3\BlogExample\Domain\Model;

    use TYPO3\CMS\Extbase\Annotation as Extbase;
    use TYPO3\CMS\Extbase\DomainObject\AbstractEntity;

    /**
    * A blog
    */
    class Blog extends AbstractEntity
    {
        /**
        * The posts of this blog
        *
        * @var \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\FriendsOfTYPO3\BlogExample\Domain\Model\Post>
        * @Extbase\ORM\Lazy
        * @Extbase\ORM\Cascade("remove")
        */
        protected $posts;
    }


The property ``$posts`` contains within the PHP comment above some so called
annotations which start with the @ character. The annotation::

    @var \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\FriendsOfTYPO3\BlogExample\Domain\Model\Post>


tells the ``DataMapper`` to create an ``ObjectStorage`` there and fill it with the
``Post`` objects of the class :php:`\FriendsOfTYPO3\BlogExample\Domain\Model\Post`.

.. note::

    The :php:`\TYPO3\CMS\Extbase\Persistence\ObjectStorage` is a class of Extbase. This
    class takes objects and ensures that an instance is unique within the
    ``ObjectStorage``. Objects within the ``ObjectStorage`` can be accessed by the
    methods ``attach()``, ``detach()`` and ``contains()`` amongst others. The
    ``ObjectStorage`` also implements the interfaces ``Iterator``, ``Countable``,
    ``ArrayAccess``. So it is usable in ``foreach``.
    Furthermore, the ``ObjectStorage`` behaves like an array. The ``ObjectStorage``
    of Extbase is based upon the native ``SplObjectStorage`` of PHP, which is error
    free since PHP-Version 5.3.1.


The notation at first seems unusual. It is based on the so-called *Generics* of
the programming language Java. In the definition of your property, you have to
enter the type in the annotation above the method definition. Properties of a
PHP type will look like this::

    /**
     * @var int
     */
    protected $amount;


It is also possible to enter a class as type::

    /**
     * @var \FriendsOfTYPO3\BlogExample\Domain\Model\Person
     */
    protected $author;


Properties which should be bound to multiple child objects require the class
name of the child elements in angle brackets::

    /**
     * @var \TYPO3\CMS\Extbase\Persistence\ObjectStorage<\FriendsOfTYPO3\BlogExample\Domain\Model\Tag>
     */
    protected $tags;

Extbase gathers the type of the relation from the configuration of the database
table column. Let's take a look at the definition of the column ``posts``. It can be
found in the file :file:`tx_blogexample_domain_model_blog.php` within the path *Configuration/TCA/*. ::

   <?php

   return [
       // ...
       'columns' => [
           // ...
            'exclude' => true,
            'label' => 'LLL:EXT:blog_example/Resources/Private/Language/locallang_db.xml:tx_blogexample_domain_model_blog.posts',
            'config' => [
                'type' => 'inline',
                'foreign_table' => 'tx_blogexample_domain_model_post',
                'foreign_field' => 'blog',
                'foreign_sortby' => 'sorting',
                'appearance' => [
                    'collapseAll' => 1,
                    'expandSingle' => 1,
                ],
            ]
           // ...
       ],
   ];

Extbase "reads" from the configuration the table of the child objects
(``foreign_table``) and the key field where the unique identifier (UID) of the
parent object (``foreign_field``) is stored. With the help of this information and
the data given in the PHP documentation above the property definition Extbase
can read the database records and map them onto the Post class. This process
will be continued recursively over the complete object graph - the blog with all
its containing posts, comments, tags, etc. - starting from the single blog as
root object.

After our exhausting journey, let's get back to the realm of our extension.
Remember that normally you will not need to enter these paths -
except that you are into customized journeys.
