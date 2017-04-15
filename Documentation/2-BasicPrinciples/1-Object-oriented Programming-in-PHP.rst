.. include:: ../Includes.txt

Object-oriented programming in PHP
=================================================

Object-oriented programming is a Programming Paradigm versatilely
applied in extbase and the extensions built on it. In this section we will
give an overview of the basic concepts of Object Orientation.

Programs have a certain purpose which is, generally speaking, to
solve a problem. "Problem" does not necessarily mean error or defect but
rather an actual task. This Problem usually has a concrete counterpart in
real life.

A Program could for example take care of the task of booking a cruise
in the Indian Ocean. If so we obviously have a problem (a programmer that
has been working too much and finally decided to go on vacation) and a
program promising recuperation by booking a coach on one of the luxury
liners for him and his wife.

Object Orientation assumes that a concrete problem is to be solved by
a program and a concrete problem is caused by real Objects. Therefore focus
is on the Object. This can be abstract of course: it will not be something
as concrete as a car or a ship all the time but can also be a reservation,
an account or a graphical symbol.

Objects are "containers" for data and corresponding functionality. The
data of an object is stored in its *Properties*. The
functionality is provided by *Methods* which can for
example alter the Properties of the Object. In regard to the cruise liner we
can say that it has a certain amount of coaches, a length and width and a
maximum speed. Further it has Methods to start the motor (and hopefully to
stop it again also), change the direction as well as to increase thrust so
you can reach your holiday destination a bit faster.


Why Object Orientation after all?
-------------------------------------------------

Surely some users will ask themselves why they should develop object
orientated in the first place. Why not (just like until now) keep on
developing procedural thus stringing together functions. If we look at
the roughly 4.300 extensions available for TYPO3 at the moment, we'll see
that they are built with a class by default - but have been completed by
the extension developer in a procedural way in about 95% of all cases.
Procedural programming has some severe disadvantages though:

* Properties and Methods belonging together with regard to content
  can't be united. This methodology, called
  *Encapsulation* in Object Orientation, is
  necessary if only for clear arrangement.
* It is rather difficult to re-use code
* All Properties can be altered everywhere throughout the code.
  This leads to hard-to-find errors.
* Procedural code gets confusing easily. This is called Spaghetti code.

Furthermore Object Orientation mirrors the real world: Real Objects
exist and they all have properties and (most of them) methods. This fact
is now represented in programming.

In the following we'll talk about the object *Ship*. We'll invoke this
object, stock it with coaches, a motor and other useful stuff.
Furthermore there will be functions moving the ship thus turning the
motor on and off. Later we'll even create a luxury liner based on the
general ship and equip it with a golf simulator and satellite TV.

On the following pages we'll try to be as graphic as possible (but
still semantically correct) to familiarize you with object orientation.
There is a specific reason: The more you can identify with the Object and
its Methods, the more open you'll be for the Theory behind Object
Orientated Programming. Both are necessary for successful programming –
even though you'll often not be able to imagine the objects you'll later
work with as clearly as in our examples.



Classes and Objects
-------------------------------------------------

Let's now take a step back and imagine there's a blueprint for
ships in general. We now focus not on the ship but this blueprint. It is
called a *Class*, in this case it is the Class
:php:`ship`. In PHP this is written as follows::

	<?php

	class ship {

		...

	}

	?>

.. tip::

	In this piece of code note that we kept the necessary PHP tags at
	the beginning and end. We will spare them in the following examples to
	make the listings a bit shorter.

The key word :php:`class` opens the Class and
inside the curly brackets Properties and Methods are written. we'll now
add these Properties and Methods::

	class ship {

		public $name;

		public $coaches;

		public $engineStatus;

		public $speed;


		function startEngine() {}

		function stopEngine() {}

		function moveTo($location) {}

	}

Our ship now has a name (:php:`$name`), a number of coaches
(:php:`$coaches`) and a speed (:php:`$speed`). In addition we built in a
variable containing the status of the engine (:php:`$engineStatus`). A real
ship, of course, has much more properties all important somehow – for our
abstraction these few will be sufficient though. We'll focus on why every
Property is marked with the key word :php:`public` further down.


.. tip::

	For Methods and Properties we use a notation called
	*lowerCamelCase*: The first letter is lower case
	and all other parts are added without blank or underscore in upper
	case. This is a convention used in extbase (as well as FLOW3).

We can also switch on the engine
(:php:`startEngine()`), travel with the ship to the
desired destination (:php:`moveTo($location)`) and switch
off the engine again (:php:`stopEnginge()`). Note that all
Methods are empty, i.e. we have no content at all. We'll change this in
the following examples, of course. The line containing the Method name and (if
available) parameters is called the Method signature or method head. Everything
contained by the Method is called the Method body accordingly.

Now we will finally create an Object from our Class. The Class
:php:`ship` will be the blueprint and :php:`$fidelio` the concrete Object.

::

	$fidelio = new Ship();

	// Display the Object

	var_dump($fidelio);

The key word *new* is used to create a concrete Object from the Class.
This Object is also called an *Instance* and the creation
process consequentially *Instantiation*. We can use the
command `var_dump()` to closely examine the object. We'll see
the following::

	object(Ship)#1 (3) {

		["name"] => NULL

		["coaches"] => NULL

		["engineStatus"] => NULL

		["speed"] => NULL

	}

We can clearly see that our Object has 4 Properties with a concrete
value, at the moment still NULL, for we did not yet assign anything. We
can instantiate as many Objects from a class as we like and every single
one will differ from the others – even if all of the Properties have the
same values.

::

	$fidelio1 = new Ship();
	$fidelio2 = new Ship();

	if ($fidelio1 === $fidelio2) {
		echo 'Objects are identical!'

	} else {
		echo 'Objects are not identical!'
	}

In this example the output is `Objects are not identical!`


The arrow operator
-------------------------------------------------

We are able to create an Object now but of course it's Properties
are still empty. We'll hurry to change this by assigning values to the
Properties. For this we use a special operator, the so called arrow
operator (->). We can use it for getting access to the properties of
an Object or calling Methods. In the following example we set the name
of the ship and call some Methods::

	$ship = new Ship();

	$ship->name = "FIDELIO";

	echo "The ship's Name is ". $ship->name;

	$ship->startEngine();

	$ship->moveTo('Bahamas');

	$ship->stopEngine();



$this
-------------------------------------------------

Using the arrow operator we can now comfortably access Properties
and Methods of an Object. But what if we want to do this from
inside a Method, e.g. to set :php:`$speed` inside of the
Method :php:`startEngine()`? We don't know at this
point what an object to be instantiated later will be called. So we need
a mechanism to do this independent from the name. This is done with the
special variable :php:`$this`.

::

	class Ship {

		...

		public $speed;

		...

		function startEngine() {

			$this->speed = 200;

		}

	}

With `$this->speed` you can access the Property
"speed" in the actual Object independently of it's name.



Constructor
-------------------------------------------------

It can be very useful to initialize an Object at the Moment of instantiating it.
Surely there will be a certain number of coaches built
in right away when a new cruise liner is created - so that the future
guest will not be forced to sleep in emergency accommodation. So we can
define the number of coaches right when instantiating. The processing of
the given value is done in a Method automatically called on creation of
an Object, the so called *Constructor*. This special
Method always has the name :php:`__construct()` (the
first two characters are underscores).

The values received from instantiating are now passed on to the
constructor as Argument and then assigned to the Properties
:php:`$coaches` and
:php:`$name` respectively.


<remark>TODO: Enter Code</remark>



Inheritance of Classes
-------------------------------------------------

With the class we created we can already do a lot. We can create
many ships and send them to the oceans of the world. But of course the
shipping company always works on improving the offer of cruise liners.
Increasingly big and beautiful ships are built. Also new offers for the
passengers are added. FIDELIO2, for example, even has a little golf course
based on deck.

If we look behind the curtain of this new luxury liner though, we
find that the shipping company only took a ship type FIDELIO and altered
it a bit. The basis is the same. Therefore it makes no sense to completely
redefine the new ship – instead we use the old definition and just add the
golf course – just as the shipping company did. Technically speaking we
extend an "old" Class definition by using the key word
`extends`.

::

	class LuxuryLiner extends Ship {

		public $luxuryCoaches;

		function golfSimulatorStart() {

			echo 'Golf simulator on ship ' . $this->name . '
			started.';

		}

		function golfSimulatorStop() {

			echo 'Golf simulator on ship ' . $this->name . '
			stopped.';

		}
	}

	$luxuryShip = new LuxuryLiner('FIDELIO2','600')

Our new luxury liner comes into existence as easy as that. We
define that the luxury liner just extends the Definition of the class
:php:`Ship`. The extended class (in our example
:php:`Ship`) is called the *parent class*
or *superclass*. The class formed by
Extension (in our example :php:`LuxuryLiner`) is called the
*child class* or *sub class*.

The class :php:`LuxuryLiner` now contains the
complete configuration of the base class :php:`Ship`
(including all Properties and Methods) and defines additional Properties
(like the amount of luxury coaches in
:php:`$luxuryCoaches`) and additional Methods (like
:php:`golfSimulatorStart()` and
:php:`golfSimulatorStop()`). Inside these Methods you can
again access the Properties and Methods of the parent class by using
:php:`$this`.


Overriding Properties and Methods
-------------------------------------------------

Inside an inherited class you can not only access Properties and
Methods of the parent class or define new ones. It's even possible to
override the original Properties and Methods. This can be very useful,
e.g. for giving a Method of a child class a new functionality. Let's
have a look at the Method :php:`startEngine()` for
example:

<remark>TODO: Enter Code</remark>

Our luxury liner (of course) has an additional motor so this has
to be switched on also if the Method
:php:`startEngine()` is called. The child class now
overrides the Method of the parent class and so only the Method
:php:`startEngine()` of the child class is
called.



Access to the parent class through "parent"
--------------------------------------------------------------------------------------------------

Overriding a Method comes in handy but has a serious
disadvantage. When changing the Method
:php:`startEngine()` in the parent class, we'd also have
to change the Method in the child class. This is not only a source for
errors but also kind of inconvenient. It would be better to just call
the Method of the parent class and then add additional code before or
after the call. That's exactly what can be done by using the key word
:php:`parent`. With
:php:`parent::methodname()` <remark>TODO: "methodname"
should be "emphasis" in addition to "classname". I did not get it,
sorry!</remark> the Method of the parent class can be accessed
comfortably - so our former example can be re-written in a smarter
way:

<remark>TODO: Enter Code</remark>



Abstract classes
-------------------------------------------------

Sometimes it is useful to define "placeholder Methods" in the
parent class which are filled in the child class. These "placeholders"
are called *abstract Methods*. A class containing
abstract Methods is called *abstract Class*. For our
ship there could be a Method :php:`setupCoaches()`. Each
type of ship is to be handled differently for each has a proper
configuration. So each ship must have such a Method but the concrete
implementation is to be done separately for each ship type.

<remark>TODO: Enter Code</remark>

In the parent class we have defined only the body of the Method
:php:`setupCoaches()`. The key word
:php:`abstract` makes sure that the Method must be
implemented in the child class. So using abstract classes we can define
which Methods have to be present later without having to implement them
right away.



Interfaces
-------------------------------------------------

Interfaces are a special case of abstract classes in which
*all Methods* are abstract. Using Interfaces,
specification and implementation of functionality can be kept apart. In
our cruise example we have some ships supporting satellite TV and some
who don't. The ships who do have the Methods
:php:`enableTV()` and
:php:`disableTV()`. It is useful to define an interface
for that:

<remark>TODO: Enter Code</remark>

Using the key word :php:`implements` it is made
sure that the class implements the given interface. All Methods in the
interface definition then have to be realized. The object
:php:`LuxuryLiner` now is of the type
:php:`Ship` but also of the type
:php:`SatelliteTV`. It is also possible to implement not
only one interface class but multiple separated by comma. Of course
interfaces can also be inherited by other interfaces.




Visibilities: public, private and protected
--------------------------------------------------------------------------------------------------

Access to Properties and Methods can be restricted by different
visibilities to hide implementation details of a class. The meaning of a
class can be communicated better like this, for implementation details in
internal Methods can not be accessed from outside. The following
visibilities exist:

* *public*: Properties and Methods with this
  visibility can be accessed from outside the Object. If no Visibility
  is defined, the behavior of :php:`public` is
  used.
* *protected*: Properties and Methods with
  visibility :php:`protected` can only be accessed
  from inside the class and it's child classes.
* *private*: Properties and Methods set to
  :php:`private` can only be accessed from inside the
  class itself, not from child classes.

Access to Properties
-------------------------------------------------

This small example demonstrates how to work with protected
properties:

<remark>TODO: Enter Code</remark>

The :php:`LuxuryLiner` may alter the property
:php:`coaches`, for this is
:php:`protected`. If it was
:php:`private` no access from inside of the child class
would be possible. Access from outside of the hierarchy of inheritance
(like in the last line of the example) is not possible. It would only be
possible if the Property was :php:`public`.

We recommend to define all Properties as
:php:`protected`. Like that they can not be altered any
more from outside and you should use special Methods (called getter and
setter) to alter or read them. We'll explain the use of these Methods in
the following section.



Access to Methods
-------------------------------------------------

All Methods the Object makes available to the outside have to be
defined as :php:`public`. All Methods containing
implementation details, e.g. :php:`setupCoaches()` in
the above example, should be defined as
:php:`protected`. The visibility
:php:`private` should be used most rarely, for it
prevents Methods from being overwritten or extended.

Often you'll have to read or set Properties of an Object from
outside. So you'll need special Methods that are able to set or get a
property. These Methods are called *setter*
respectively *getter*. See the example.

<remark>TODO: Enter Code</remark>

We now have a Method :php:`setCoaches()` which
sets the number of coaches. Furthermore it changes - depending on the
number of coaches - the ship category. You now see the advantage: When
using Methods to get and set the Properties, you can perform more
complex operations, as e.g. setting of dependent Properties. This
preserves consistency of the object. If you set
:php:`$coaches` and
:php:`$classification` to :php:`public`,
we could set the number of cabins to 1000 and classification to
:php:`NORMAL` - and our ship would end up being
inconsistent.

.. tip::

	In extbase you'll find getter and setter Methods all over. No
	Property in extbase is set to :php:`public`.


Static Methods and Properties
-------------------------------------------------

Until now we worked with Objects instantiated from classes.
Sometimes though it does not make sense to generate a complete object
just to be able to use a function of a class. For this php offers the
possibility to directly access Properties and Methods. These are then
referred to as :php:`static Properties` respectively
:php:`static Methods`. Take as a rule of thumb: static
Properties are necessary every time two instances of a class are to have
a common Property. Static Methods are often used for function
libraries.

Transferred to our example this means that all ships are
constructed by the same shipyard. In case of technical emergency all
ships need to know the actual emergency phone number of this shipyard. So
we save this number in a static Property
:php:`$shipyardSupportTelephoneNumber`:

<remark>TODO: Enter Code</remark>

What happens here? We instantiate two different ships which both
have a problem and do contact the shipyard. Inside the method
:php:`reportTechnicalProblem()` you see that if you want
to use static properties you have to trigger them with the key word
:php:`self::`. If the emergency phone number now changes,
the shipyard has to tell all the ships about the new number. For this is
uses the *static method*
:php:`setShipyardSupportTelephoneNumber($newNumber)`. For
the Method is static, it is called through the scheme
:php:`classname::methodname() <remark>TODO: "methodname" should be
"emphasis" in addition to "classname". I did not get it,
sorry!</remark><remark></remark>`, in our case
:php:`LuxuryLiner::setShipyardSupportTelephoneNumber(...)`.
If you check the latter two problem reports you see that all instances of
the class use the new phone number. So both ship objects have access to the
same static variable
:php:`$shipyardSupportTelephoneNumber`.



Important design- and architectural patterns
--------------------------------------------------------------------------------------------------

In software engineering you'll sooner or later stumble upon design
problems that are connatural and solved in a similar way. Clever people
thought about *design patterns* aiming to be a general
solution to a problem. Each design pattern is so to speak a solution
template for a specific problem. We by now have multiple design patterns
that are successfully approved in practice and therefore have found there
way in modern programming and especially extbase. In the following we
don't want to focus on concrete implementation of the design patterns, for
this knowledge is not necessary for the usage of extbase. Nevertheless
deeper knowledge in design patterns in general is indispensable for modern
programming style, so it might be fruitful for you to learn about
them

.. tip::

	Further information about design patterns can e.g. be found on
	<link linkend="???">http://sourcemaking.com/</link> or in the book
	*PHP Design Patterns* by Stephan Schmidt, published
	by O'Reilly.

From the big number of design patterns, we will have a closer look
on two that are essential when programming with extbase:
*Singleton* &amp;
*Prototype*.


Singleton
-------------------------------------------------

This design pattern makes sure that only one instance of a class
can exist *at a time*. In TYPO3 you can mark a class
as singleton by letting it implement the interface
:php:`t3lib_Singleton`. An example: our luxury liners
are all constructed in the same shipyard. So there is no sense in having
more than one instance of the shipyard object:

<remark>TODO: Enter Code</remark>

In order to have the singletons correctly created you have to use
the static TYPO3 Method
:php:`GeneralUtility::makeInstance()`. This method gives back
- as seen in the example above - always the same object, if you request
a singleton.



Prototype
-------------------------------------------------

Prototype is sort of the antagonist to Singleton. While for each
class only one object is instantiated when using Singleton, it is
explicitly allowed to have multiple instances when using Prototype. Each
class not implementing the Interface
:php:`t3lib_Singleton` automatically is of the type
*Prototype*.

.. tip::

	Originally for the design pattern
	*Prototype* is specified that a new Object is to
	be created by cloning an Object prototype. We use Prototype as
	counterpart to Singleton without a concrete pattern implementation
	in the background though. For the functionality we experience, this
	does not make any difference: We invariably get back a new instance
	of a class.

Now that we refreshed your knowledge of object oriented
programming we can take a look at the deeper concepts of extbase:
Domain Driven Design, Model View Controller and Test Driven Development.
You'll spot the basics we just talked about in the following
frequently.



