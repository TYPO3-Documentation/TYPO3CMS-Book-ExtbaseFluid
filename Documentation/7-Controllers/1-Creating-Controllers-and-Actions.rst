Creating Controllers and Actions
================================================

The Controller classes are stored in the folder <link
linkend="???">EXT:sjr_offer/Classes/Controller/</link>. The name of the
Controller is composed by the name of the Domain Model and the Suffix
<classname>*Controller*</classname>. So the Controller
<classname>Tx_SjrOffers_Controller_OfferController</classname> is assigned
to the Aggegate Root Object
<classname>Tx_SjrOffers_Domain_Model_Offer</classname>. And the Name of the
Class file is <filename>OfferController.php</filename>.

The Controller class must extend the class
<classname>Tx_Extbase_MVC_Controller_ActionController</classname> which is
part of Extbase. The individual Actions are combined in seperate methods.
The method names have to end in <classname>Action</classname>. The body of
<classname>OfferController</classname> thus looks like this:

``class Tx_SjrOffers_Controller_OfferController extends
Tx_Extbase_MVC_Controller_ActionController {``

``// Action methods will be following here``

``}``

When realizing the desired tasks through *Action*
methods you will often stumble upon very similar flows and patterns. Each
task will be carried out by a single *Action* or a chain
of *Actions*:

#. A list of Domain Objects is to be displayed.
#. A single Domain Object is to be displayed.
#. A new Domain Object is to be created.
#. An existing Domain Object is to be edited.
#. A Domain Object is to be deleted.

We will shed some light on these recurring patterns in the following
sections. Together with the schedule model you will learn the background to
generate your own Flows.

.. tip::
	Note that you are free to choose the method names for your
	*Actions* as you like. Nevertheless we recommend to
	stick to the names presented here, to help other Developers to find
	their way through your Code.


Flow Pattern "display a list of Domain Objects"
--------------------------------------------------------------------------------------------------

The first pattern in our example fits the Action "*display
a list of all offers*". One Action Method usually will be enough
for implementing This. we choose <methodname>indexAction</methodname> as
name of the Method:

``public function indexAction() { ``

``$offerRepository =
t3lib_div_makeInstance('Tx_SjrOffers_Domain_Repository_OfferRepository');
``

``$offers = $offerRepository-&gt;findAll(); ``

``$this-&gt;view-&gt;assign('offers', $offers); ``

``return $this-&gt;view-&gt;render(); ``

``}``

This can be simplified even more. As described in chapter 4 in
section "controlling the flow", it is not necessary to return the rendered
content. Furthermore we avoid initializing the variable
<methodname>$offers</methodname>, which we only use once. So we
get:

``public function indexAction() { ``

``$offerRepository =
t3lib_div_makeInstance('Tx_SjrOffers_Domain_Repository_OfferRepository');
``

``$this-&gt;view-&gt;assign('offers',
$offerRepository-&gt;findAll()); ``

``}``

This Flow is prototypic for a task which merely has to give out
data. Domain Objects are fetched from a Repository previously instatiated
and passed to the View for future processing. Inside of our
<classname>OfferController</classname> we have to make use of
<classname>OfferRepository</classname> in the different Actions again and
again. For that we don't have to intantiate the Repository in each and
every Action, extbase offers the Method
<classname>initializeAction()</classname>. It can be used for tasks
concerning multiple Actions and is called before any Action is executed.
In the class <classname>ActionController</classname> the body of this
Method is empty. You can overwrite it in your own Controller though. In
our case we assign the instance of our Repository to the Class Variable
<classname>$offerRepository</classname>. Our Controller thus looks like
this:

``protected $offerRepository;``

``pubilc function initializeActio() {``

``$this-&gt;offerRepository =
t3lib_div::makeInstance('Tx_JjrOffers_Domain_Repository_OfferRepository');``

``}``

``public function indexAction() {``

``$this-&gt;view-&gt;assign('offers',
$offerRepository-&gt;findAll()); ``

``}``

<classname>ActionController</classname> not only calls hte Method
<classname>initializeAction()</classname>, which is executed before any
Action in the Controller, but also a Method in the Form of
<classname>initialize*Foo*Action()</classname>, which
is called only before the Method
<classname>*foo*Action()</classname>. The Method for
the initializing of Action is of course not only useful for preparing
Repositories. You can also use them for integrating JavaScript libraries
or to check if a specific FE user is logged in.

.. tip::
	The trick of implementing an empty Method body in the super
	class, which is the "filled" in the subclass is called
	*Template Pattern*.



Flow Pattern "display a single Domain Object"
--------------------------------------------------------------------------------------------------

The second pattern is best put into action by a single Mehod as
well. We call it <classname>showAction()</classname>. In contrast to
<classname>indexAction</classname> we have to to tell this Method from
outside which Domain Object is to be displayed. In our case, the offer to
be shown is passed to the Method as Argument:

``/**``

`` * @param Tx_SjrOffers_Domain_Model_Offer $offer The offer to
be shown``

`` * @return string The rendered HTML string``

`` */``

``public function showAction(Tx_SjrOffers_Domain_Model_Offer
$offer) {``

``$this-&gt;view-&gt;assign('offer', $offer);``

``}``

Ususally the display of a single Object is called by a link in
Forntend. In our example extension it connects the list view by something
like the following URL:

``http://localhost/index.php?id=123&amp;tx_sjroffers_pi1[offer]=3&amp;tx_sjroffers_pi1[action]=show&amp;tx_sjroffers_pi1[controller]=Offer``

Due to the 2 Arguments
``tx_sjroffers_pi1[controller=Offer]`` and
``tx_sjroffers_pi1[action]=show``, the dispatcher of Extbase
passes the request to the <classname>OfferController</classname>. In the
request we find the information that the Action *show
*is to be called. Before passing on the further processing to
the Method <classname>showAction()</classname>, the Controller tries to
map the Arguments received by the URL on the arguments of the Method.
Extbase maps the arguments by their names. In our example Extbase detects,
that the GET Argument <classname>tx_sjroffers_pi1[offer]=3
</classname>corresponds to the Method Argument
<classname>$offer</classname>:
<classname>showAction(Tx_SjrOffers_Domain_Model_Offer
*$offer*)</classname>. The type of this Argument is
fetched by Extbase from the Method signature:
<classname>showAction(*Tx_SjrOffers_Domain_Model_Offer*
$offer)</classname>. In case this so called *Type Hint
*should not be present, or (e.g. for the types *string
*or *int* in PHP) not possible, Extbase reads
the type from the commentary written above the Method: <classname>@param
*Tx_SjrOffers_Domain_Model_Offer*
$offer</classname>.

After successful assigning, the value of the incoming Argument has
to be casted in the target type as well as checked for validity (read more
about validation in chapter 9 in section "Validating Domain Objects"). In
our case the incoming value is "3". Target type is the class
<classname>Tx_SjrOffers_Domain_Model_Offer</classname>. So Extbase
interprets the incoming value as uid of the Object to be created and sends
a request to the *Storage Backend* to find an Object
with this uid. If the Object can be reconstructed fully valid it is passed
to the Method as argument. Inside of the Method
<classname>showAction()</classname> the newly created Object is passed on
to the view, which is taking care of the HTML output as usual.

.. tip::
	Inside of the Template you can access all Properties of the
	Domain Object, including all existing child objects. Thus this Flow
	Pattern does not only cover single Domain Objects but, in the event,
	also a complex Aggregate.

If an Argument is identified as invalid, the already implemented
Method <classname>errorAction()</classname> of
<classname>ActionController</classname> is called instead of the Method
<classname>showAction()</classname>. The Method then generates a message
for the frontend user and passes the processing to the previous Action, in
case it is given. The latter is especially useful with invalid form field
input as you'll see in the following.



Flow Pattern "creating a new Domain Object"
--------------------------------------------------------------------------------------------------

For the third Flow Pattern, the one for creating a new Domain
Object, two steps are required: First, a form for inputting the Domain
Data has to be shown in Frontend. Second, a new Domain Object has to be
created (using the incoming form data) and put in the appropriate
Repository. We're going to implement these two steps in the Methods
<classname>newAction() </classname>and
<classname>createAction()</classname>.

.. tip::
	We already described these steps in chapter 3 in section
	"Alternative route: creating a new posting". We now shortly revise
	this Flow using our example extension and focus on some further
	aspects.

First the Method <classname>newAction() </classname>is called by a
Link in frontend with the following URL:

``http://localhost/index.php?id=123&amp;tx_sjroffers_pi1[oranization]=5&amp;tx_sjroffers_pi1[action]=new&amp;tx_sjroffers_pi1[controller]=Offer``

Extbase instantiates the <classname>Organization </classname>Object
which is mapped to the Argument <classname>$organization, </classname>just
as it was the case with the <classname>Offer </classname>Object in the
Method <classname>showAction()</classname>. In the URL are no information
(yet) though, which value the Argument <classname>$newOffer
</classname>shall have. So the default value
(<classname>=NULL</classname>) set in the Method signature is used. With
these Arguments, the controller passes the further processing to the
Method <classname>newAction()</classname>.

``/**``

`` * @param Tx_SjrOffers_Domain_Model_Organization $organization
The organization``

`` * @param Tx_SjrOffers_Domain_Model_Offer $offer The new offer
object``

`` * @return string An HTML form for creating a new
offer``

`` * @dontvalidate $newOffer``

`` */``

``public function
newAction(Tx_SjrOffers_Domain_Model_Organization $organization,
Tx_SjrOffers_Domain_Model_Offer $newOffer = NULL) {``

``$this-&gt;view-&gt;assign('organization',$organization);``

``$this-&gt;view-&gt;assign('newOffer',$newOffer);``

``$this-&gt;view-&gt;assign('regions',$this-&gt;regionRepository-&gt;findAll());``

``}``

This Action passes to the view: in
<classname>organization</classname> the <classname>Organization
</classname>Object, in <classname>newOffer</classname>
<classname>NULL</classname> (to begin with) the and in <classname>region
</classname>all <classname>Region </classname>Objects contained in the
<classname>RegionRepository</classname>. The view creates the output of
the form in frontend, using a template, which we focus on in chapter 8 in
section "Template Creation by example". After the user filled in the data
of the offer and submitted the form, the Method
<classname>createAction()</classname> is called. It expects as Arguments
an <classname>Organization </classname>Object and an Object of the class
<classname>Tx_SjrOffers_Domain_Model_Offer</classname>. Therefore Extbase
instantiates the Object and "fills" its Properties with the appropriate
Form data. If all Arguments are valid, the Action
<classname>createAction()</classname> is called.

<remark>TODO: Insert Code</remark>

The new offer is allocated to the organization and inversly the
organization is allocated to the offer. Thanks to this allocation Extbase
will cause the persistence of the new offer in the dispatcher before
returning to TYPO3.

After creating the new offer, the appropriate organization is to be
displayed with all of its offers. We therefore start a new request
(*request-response-cycle*) by redirecting to
<classname>showAction()</classname> of the
<classname>OrganizationController</classname> using the Method
<classname>redirect()</classname>. The actual organization is hereby
passed on as an argument. Inside the
<classname>ActionCotroller</classname> you have the following Methods for
redirecting to other Actions at your disposal:

<remark>TODO: Insert Code</remark>

Using the <classname>redirect(</classname>) Method, you can start a
new request-response-cycle on the spot, similar to clicking on a link: The
given Action (specified in <classname>$actionName</classname>) of the
appropriate controller (specified in
<classname>$controllerName</classname>) in the given extension (specified
in <classname>$extensionName</classname>) is called. If you did not
specify a controller or extension, Extbase assumes, that you stay in the
same context. In the fourth parameter <classname>$arguments</classname>
you can pass an Array of arguments. In our example<classname>
array('organization' =&gt; $organization)</classname> <remark>TODO:
"organization" should be "emphasis" in addition to "classname". I did not
get it, sorry!</remark> would look like this in the URL:
<classname>tx_sjroffers_pi1[organization]=5</classname>. The Array key is
transcribed to the parameter name, while the organization object in
<classname>$organization</classname> is transformed into the number 5,
which is the appropriate UID. If you want to link to another page inside
the TYPO3 installation, you can pass its uid in the 5th parameter
(<classname>$pageUid</classname>). A delay before redirecting can be
achieved by using the 6th parameter (<classname>$delay</classname>). By
default the reason for redirecting is set to status code 303 (which means
*See Other*).You can use the 7th parameter
(<classname>$statusCode</classname>) to override this (for example with
301, which means *Moved Permanentely*).

In our example, the following code is sent to the Browser. It
provokes the immedeate reload of the page with the given URL:

<remark>TODO: insert Code</remark>

The Method <classname>redirectToURI()</classname> corresponds to the
Method <classname>redirect()</classname>, but you can directly set a URL
respectively URI as string, e.g. <remark>TODO: insert Code</remark>. With
this, you have all the freedom to do what you need. The Method
<classname>forward()</classname>, at last, does a redirect of the request
to another Action on the spot, just as the two redirect Methods. In
contrast to them, no request-response-cycle ist started, though. The
request Object is only updated with the details concerning Action,
Controller and Extension, and then passed back to the dispatcher for
processing. The dispatcher then passes on the actual
<classname>Request-</classname> and
<classname>Response-</classname>Objects to the appropriate Controller.
Here, too, applies: If no Controller or Extension is set, the actual
context is kept.

This procedure can be done multiple times when calling a page. There
is the risk, though, that the process runs into an infinite loop (A
redirects to B, B redirects to A again). In this case, Extbase stops the
processing after some steps.

There is another important difference to the redirect Methods. When
redirecting using the Method <classname>forward()</classname>, new objects
will not (yet) be persisted to database. This is not done until at the end
of a request-response-cycle. Therefore no UID has yet been assigned to a
new Object and the transcription to a URL parameter fails. You can
manually trigger the action of persisting before the redirection, by using
<classname>Tx_Extbase_Dispatcher::getPersistenceManager()-&gt;persistAll()</classname>,
though.

When calling the Method <classname>createAction(),</classname> we
already described the case of all Arguments being valid. But what happens,
if a Frontend user inserts invalid data - or even manipulates the form to
deliberately attack the website?

.. tip::
	You find detailed information about validation and security in
	chapter 9

Fluid adds multiple hidden fields to the form generated by the
Method <classname>newAction()</classname>. These contain information about
the origin of the form (<classname>__referrer</classname>) as well as, in
encrypted form (<classname>__hmac</classname>), the structure of the form
(shorted in the example below).

<remark>TODO: Insert Code</remark>

If now a validation error occurs when calling the Method
<classname>createAction()</classname>, an error message ist saved and the
processing is passed back to the previous Action, including all already
inserted form data. Extbase reads the neccessary information from the
hidden fields<classname>__referrer</classname>. In our case the Method
<classname>newAction()</classname> is called again. In contrast to the
first call, Extbase now tries to create an (invalid)
<classname>Offer</classname> Object from the form data, and to pass it to
the Method in <classname>$newOffer</classname>. Due to the annotation
<classname>@dontvalidate $newOffer</classname> Extbase this time acceptes
the invalid object and displays the form once more. Formerly filled in
data is put in the fields again and the previously saved error message is
displayed if the template is intenting so.

<remark>TODO: Insert OImage with caption: Fig. 7-1: Wrong input in
the form of an offer leads to an error mesage (in this case a modal
JavaScript window) </remark>

.. tip::
	Standard error messages of Extbase are not yet localized in
	Version 1.2. In section "Localize error messages" in chapter 8, we
	describe a possibility to translate them too, though.

Using the hidden field <classname>__hmac</classname>, Extbase
compares in an early stage the structure of a form inbetween delivery to
the browser and arrival of the form data. If the structure has changed,
Extbase assumes an evil assault and aborts the request with an error
message. You can skip this check by annotting the Method with
@dontverifyrequesthash, though. So you have two annotiations for Action
Methods at your disposal:

* <classname>@dontvalidate*$argumentName*</classname>
* <classname>@dontverifyrequesthash</classname>

Using the annotation <classname>@dontvalidate
*$argumentName*</classname> you tell Extbase that the
argument is not to be validated. If the argument is an Object, the
validation of its properties is also bypassed.

The annotation <classname>@dontverifyrequesthash</classname> makes
Extbase skip the check of integrity of the form. It is not checked any
more, if the frontend user has e.g. added a
<classname>password</classname> field. This annotation comes in handy for
example, if you have to work with data of a form which you did not create
yourself.



Flow Pattern "Editing an existing Domain Object"
--------------------------------------------------------------------------------------------------

The flow pattern we will now present is quite similar to the
previuos one. We again need two action Methods, which this time we call
<classname>editAction()</classname> and
<classname>updateAction()</classname>. The Method
<classname>editAction()</classname> provides the form for editing, while
<classname>updateAction()</classname> updates the Object in the
Repository. In contrast to <classname>newAction()</classname> it is not
necessary to pass an organization to the Method
<classname>editAction()</classname>. It is sufficient to pass the offer to
be edited as an Argument.

<remark>TODO: Insert Code</remark>

Note once again the annotation <classname>@donvalidate
$offer</classname>. The Method <classname>updateAction()</classname>
receives the changed offer and updates it in the repository. Afterwards a
new request is started and the organization is shown with its updated
offers.

.. warning::
	Do not forget to expicitly update the changed Domain Object
	using <classname>update()</classname>. Extbase will not do this
	automatically for you, for doing so could lead to unexpected results.
	For example if you have to manipulate the incoming Domain Object
	inside your Action Method.

At this point we have to ask ourselves how to prevent
unauthorized changes of our Domain data. The organization and offer data
are not to be changed by all visitors after all. So an
*administrator* is allocated to each organization,
authorized to change the data of that organization. The administrator can
change the contact data of the organization, create and delete offers and
contact persons as well as edit existing offers. Securing against
unauthorized acces can be done on different levels:

* On the level of TYPO3, access to the page and/or plugin is prohibited.
* Inside the Action, it is checked, if access is authorized. In
  our case it has to be checked if the administrator of the
  organization is logged in.
* In the template, links to Actions, to which the frontend user
  has no access are blinded out.

Of these three levels, only the first two offer reliable
protection. We do not take a closer look on the first level in this book.
You can find detailed information for setting up the rights framework in
your TYPO3 system in the *Core Documentation*
"*Inside TYPO3*" at <link
linkend="???">http://typo3.org/documentation/document-library/core-documentation/doc_core_inside/4.2.0/view/2/4/</link>.
The second level, we are going to implement in all "critcal" Actions.
Let's look at an example with the Method
<classname>updateAction()</classname>.

<remark>TODO: Insert Code</remark>

We ask a previously instantiated
<classname>AccessControlService</classname> if the administrator of the
organization reponsible for the offer is logged in in frontend. If yes, we
do update the offer. If no, an error message is generated, which is
displayed in the subsequently called organization overview.

Extbase does not yet offer an API for access control. We therefore
implemented an <classname>AccessControlService</classname> on ourselves.
The description of the class is to be found in the file <link
linkend="???">EXT:sjr_offers/Classes/Service/AccessControlService.php</link>.

<remark>TODO: Insert Code</remark>

The third level can easily be bypassed by manually typing the link
or the form data. It therefore only reduces the confusion for honest
visitors and the stimulus for the bad ones. Let's take a short look on
this snippet from a template:

<remark>TODO: Insert Code</remark>

.. tip::
	A *Service* is often used to implement
	functionalitites that are needed on mulitple places in your extensions
	and are not related to one Domain Object.

	Services are often stateless. In this context that means that
	their function does not dependend on previous access. This does not
	rule out dependency to the "environment". In our example you can be
	sure, that a verification by <classname>isLoggendIn()</classname>
	always leads to the same result, regardless of any earlier
	verification - given that the "environment" has not changed
	(considerably), e.g. by the Administrator logging out or even losing
	his acces rights.

	Services usually can be built as *Singleton*
	(<classname>implements t3lib_Singleton</classname>). You can find
	detailed information to *Singleton* in chapter 2 in
	section "Singleton".

	The <classname>AccessControlService</classname> is not Part of
	the Domain of our extension. It "belongs" to the Domain of the Content
	Management System. There are Domain Services also of course, like a
	Service creating a continuous invoice number. They are usually located
	in <link
	linkend="???">EXT:my_ext/Classes/Domain/Service/</link>.

We make use of an <classname>IfAuthenticatedViewHelper</classname>
to acces the <classname>AccessControlService</classname>. The class file
<link linkend="???">IfAuthenticatedViewHelper.php</link> is in our case
located in <link
linkend="???">EXT:sjr_offers/Classes/ViewHelpers/Security/</link>.

<remark>TODO: Insert Code</remark>

The <classname>IfAuthenticatedViewHelper</classname> extends the
<classname>If</classname>-ViewHelper of fluid and therefore provides the
opportunity to use if-else branches. It delegates the access check to the
<classname>AccessControlService</classname>. If the check gives a positive
result, in our case a link with an edit icon is generated, which leads to
the Method <classname>editAction()</classname> of the
<classname>OfferController</classname>.



Flow Pattern "Deleting a Domain Object"
--------------------------------------------------------------------------------------------------

The last Flow pattern realizes the deletion of an existing Domain
Object in one single Action. The appropriates Method
<classname>deleteAction()</classname> is kind of straightforward:

<remark>TODO: Insert Code</remark>

The importat thing here is that you delete the given Offer from the
Repository using the method <classname>remove()</classname>. After running
through your extension, Extbase will delete the assosciated record from
the Database respectively mark it as deleted.

.. tip::
	In principle it doesn't matter how you generate the result
	(usually HTML code) inside the Action. You can even decide to use the
	traditional way of building extensions in your Action - with SQL
	Queries and maker-based Templating. We invite you to pursue the path
	we chose up till now, though.

The flow patterns we present here are meant to be blueprints for
your own flows. In real life projects they may get way more complex. The
Method <classname>indexAction()</classname> of the
<classname>OfferController</classname> looks like this in it's "final
stage":

<remark>TODO: Insert Code</remark>

In the first few lines of the script, configuration options, set in
the TypoScript template as comma seperated list, are transcribed to
arrays. Then this information is passed to the *View*
piece by piece.

One requirement our extension has to realize, is that a visitor of
the website can define a special demand, which is then used to filter the
range of offers. We already implemented an appropriate Method
<classname>findDemanded()</classname> (see chaper 6, <remark>TODO: enter
correct section name</remark>). To define his demand, the visitor chooses
the accordant options in a form (see pic. 7-2).

<remark>TODO: Insert Image with caption: Fig. 7-2: The buildup of
the "demand" in a form above the offer list. </remark>

.. warning::
	Watch out, that you do not implement logic, which actually
	belongs in the domain, inside of the Controller. Concentrate on the
	mere Flow.

.. tip::
	In real life you will often need similar functionality in some
	or even all Controllers, the previously mentioned access control is a
	good example. In our example extension we sourced it out to a
	*service* object. Another possibility is to create
	a basis Controller which extends the
	<classname>ActionController</classname> of Extbase. Inside you
	implement the shared functionality. Then the concrete controllers with
	you Actions extend this Basis Controller again.

The Flow inside of a Controller is triggered from outside by
TYPO3. For extensions which generate content for the frontend, this is
usually done by a plugin, placed on the appropriate page. How to configure
such a plugin you'll see in the following section:


