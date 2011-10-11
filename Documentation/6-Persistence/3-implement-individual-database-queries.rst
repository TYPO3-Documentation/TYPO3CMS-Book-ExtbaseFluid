Individual Database Queries
================================================


The previous descriptions about generic methods of queries to a Repository are 
sufficient for simple use-cases. However, there are many cases where they are 
not adequate and require more flexible solutions. On the requirements list of 
our application is the functionality to print a list of all the offers. In 
natural language this would sound as follows:

* "Find all the offers for a certain region."
* "Find all the offers corresponding to a certain category."
* "Find all the offers containing a certain word."
* "Find offers that are associated to a selected set of organizations."

There are principally two ways of implementing such methods. On the one hand you 
could request all the offers from the Backend and filter them manually. On the 
other hand you could use a certain request matching exactly your criteria and 
just execute it. Contrary to the first case, the latter method would only build 
the objects that are really needed which positively affects the performance of 
your application. Therefore, the first method is more flexible and easier to 
implement.


.. note::

	You may start developing your application using the first method and then, 
	seeing your application growing, veering to the second method. Luckily, all 
	the changes are encapsulated in the Repository and you therefore don't have 
	to change any code out of the Persistence Backend.


You can use Extbase's *Query*-object for implementing individual queries by 
giving it all the essential information needed for a qualified request to the 
database backend. Those information contain:

* The request's class (*Type*) to which the request applies.
* An (optional) *Constraint* which restricts the result set.
* (Optional) Parameters which configure a section of the result set by a *limit* or an *offset*.
* (Optional) Parameters concerning the *Orderings* of the result set.



Within a Repository you can create a Query object by using the command 
``$this->createQuery()``. The Query object is already customized to the class 
which is managed by the Repository. Thus, the result set only consists of 
objects of that class, i.e. it consists of Offer objects within the 
``OfferRepository``. After giving all needed information to the Query object 
(detailed information will be given later on) you execute the request by using 
``execute()`` which returns a sorted Array with the properly instantiated 
objects (or a via limit and offset customized section of it). For example, the 
generic method ``findAll()`` looks as follows::

	public function findAll() {
		return $this->createQuery()->execute();
	}


In this simple first use-case we don't any constraining parameter to the Query 
object. However, we have to define such a parameter to implement the first 
specified request "Find all the offers for a certain region". Thus, the 
corresponding method looks as follows::

	public function findInRegion(Tx_SjrOffers_Domain_Model_Region $region) {
		$query = $this->createQuery();
		$query->matching($query->contains('regions', $region));
		return $query->execute();
	}

Using the method ``matching()`` we give the Query the following condition: The 
property *regions* of the object *Offer* (which is managed by the Repository) 
should contain the region that is referenced by the variable ``$region``. The 
method ``contains()`` returns a *Constraint* object. The Query object has some 
other methods each of which returns a *Constraint* object. Those methods may be 
roughly splitted into two groups: Comparing operations and Boolean operations. 
The first mentioned lead to a comparison between the value of a given property 
and another operand. The latter mentioned operations connect two conditions to 
one condition by the rules of Boolean Algebra and may negate a result 
respectively. Following Comparing operations are acceptable::

	equals($propertyName, $operand, $caseSensitive = TRUE)
	in($propertyName, $operand)
	contains($propertyName, $operand)
	like($propertyName, $operand)
	lessThan($propertyName, $operand)
	lessThanOrEqual($propertyName, $operand)
	greaterThan($propertyName, $operand)
	greaterThanOrEqual($propertyName, $operand)
	



The method ``equals()`` executes a simple comparison between the property's 
value and the operand which may be a simple PHP data type or a Domain object. 



Contrary, the methods ``in()`` and ``contains()`` accept multi-value data types 
as arguments (e.g. Array, ObjectStorage). As ``in()`` checks if a single-valued 
property exists in a multi-value operand, the latter method ``contains()`` 
checks if a multi-valued property contains a single-valued operand. The opposite 
of the introduced method ``findInRegion()`` is ``findOfferedBy()`` which accepts 
a multi-valued operand (``$organizations``). 

::

	public function findOfferedBy(array $organizations) {
	$query = $this->createQuery();
	$query->matching($query->in('organization', $organizations));
	return $query->execute();
	}
	

.. note::

	The methods ``in()`` and ``contains()`` were introduced in Extbase version 
	1.1. If you pass an empty multi-valued property value or an empty 
	multi-valued operand (e.g. an empty Array) to them you always get a *false* 
	as return value for the test. Thus you have to prove if the operand 
	``$organizations`` of the method call ``$query->in('organization', 
	$organizations)`` contains sane values or if it is just an empty Array. This 
	is dependent on your domain logic. In the last example the method 
	``findOfferedBy()`` would return an empty set of values.


It's possible to use comparison operators that are reaching deep into the tree 
of object hierarchy. Let's assume you want to filter the organizations whether 
they have offers for youngsters older than 16. You may define the request in the 
``OrganizationRepository`` as follows::

	$query->lessThanOrEqual('offers.ageRange.minimalValue', 16)


Extbase	solves the path ``offers.ageRange.minimalValue`` by seeking every 
organization which has offers whose age values have a minimum which is less or 
equal 16. Assuming that a Relational Database System is used in the Persistence 
Backend, this is internally solved by a so-called *INNER JOIN*. All relational 
types (1:1, 1:n, m:n) and all comparison operators are covered by this feature.

.. note::

	The path notation was introduced in Extbase 1.1 and is derived from the 
	*Object-Accessor* notation of Fluid (see Ch. 8). In Fluid you may access 
	object properties with the notation ``{organization.administrator.name}``. 
	However, Fluid does not support the notation 
	``{organization.offers.categories.title}`` whereas 
	``$query->equals('offers.categories.title', 'foo')`` is possible die to the 
	limitation in Fluid that the access of properties is not possible in a 
	"concatenated way".

Besides of the comparison operators the ``Query`` object supports Boolean 
Operators like::

	logicalAnd($constraint1, $constraint2)
	logicalOr($constraint1, $constraint2)
	logicalNot($constraint)

The methods above return a ``Constraint`` object. The resulting ``Constraint`` 
object of ``logicalAnd()`` is true if both given params ``$constraint1`` and 
``$constraint2`` are true whereas it's sufficient when using ``logicalOr()`` to 
be true if only one of the given params is true. Since Extbase 1.1 both methods 
accept an Array of constraints. Last but not least, the function 
``logicalNot()`` inverts the given ``$constraing`` to it's opposite, i.e. *true* 
gets *false* and *false* gets *true*. Given this information, you can create 
complex queries like::

	public function findMatchingOrganizationAndRegion(Tx_SjrOffers_Domain_Model_Organization $organization, Tx_SjrOffers_Domain_Model_Region $region) {
	$query = $this->createQuery();
	$query->matching(
		$query->logicalAnd(
			$query->equals('organization', $organization), 
			$query->contains('regions', $region) 
			)
		); 
	return $query->execute();
	}

The method ``findMatchingOrganizationAndRegion()`` returns those offers that 
match both the given organization and the given region. 



For our example extension we need the 


