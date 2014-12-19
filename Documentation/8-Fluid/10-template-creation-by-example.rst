.. _template-creation-by-example:

Template Creation by example
================================================

In this section we will show you some of the techniques you got to
know in the course so far, in the interaction with our sample extension
*sjr_offers*. We will focus on practical solutions for
repeating problems. The directory structure of the extension is shown in
Figure 8-2. We are using both layouts and partials, to avoid double code.
Inside *Scripts* we put JavaScript code that we use for
animations and for a Date picker in the frontend.

.. figure:: /Images/8-Fluid/figure-8-2.png
	:align: center

	Figure 8-2: Folder structure of layouts, templates and partials inside the 
	extension sjr_offers

The extension *sjr_offers* has an
``OfferController`` and an ``OrganizationController``.
Using the ``OfferController``, offers can be displayed as a list
using the method ``indexAction()`` or as single view using the
method ``showAction()`` method. Also offers can be created using
the method ``newAction()`` and available offers can be edited using
the method ``editAction()``. The
``OrganizationController`` incorporates the same actions for
organizations, with exception of the creation of organizations. Within the
folder *EXT:sjr_offers/Resources/Private/Templates* we
have created a folder for each controller, without the suffix
*Controller* in the name. Each action method has its own
HTML template. There is also no suffix *Action* allowed
in the name.


Setting up the HTML basic framework
----------------------------------------------------

The various templates have many common elements. First we define the
basic framework by a common layout (see the section :ref:`fluid-using-layouts` earlier in this chapter) and store
repeating code in partials (see the section ":ref:`moving-repeating-snippets-to-partials`" earlier in this chapter). The basic
framework of our templates looks as follows::

	<f:layout name="default" />
		<f:section name="content">
		...
	</f:section>

In most templates we are referencing the layout
``default``, that should build the "frame" of our plugin output.
The actual template resides in a section with the name
``content``. The layout definition is stored in the HTML file
*EXT:sjr_offers/Resources/Private/Layouts/default.html*::

	<div class="tx-sjroffers">
	<f:render section="content" />
	<f:flashMessages id="dialog" title="Notice!"/>
	</div>

A section ``content`` of the respective template is
rendered and after this a message to the frontend user is shown if
necessary. The complete conent of the plugin is then "packed" in a
``div`` container. The message - a so called *flash
message* - will be created inside our sample extension in the
controller, e.g. at unauthorized access (see also the sections for edit and delete controller actions in :ref:`chapter 7 <controlling-the-flow-with-controllers>`)::

	public function updateAction(Tx_SjrOffers_Domain_Model_Offer $offer) {
		$administrator = $offer->getOrganization()->getAdministrator();
		if ($this->accessControlService->isLoggedIn($administrator)) {
			...
		} else {
			$this->flashMessages->add('Please log in.');
		}
		...
	}



Store functions in ViewHelper
-------------------------------------------------

With this the base framework of our plugin output is ready. In the
templates of our sample extension there still exists some repeating jobs,
which can be stored in ViewHelper classes.

One requirement for the extension is, that the organizations can
edit their (and only their) offers in the frontend. We have to control the
access at different levels, so that not every website user can change the
data. We have discussed the different level of the access control already
in chapter 7. One of those levels are the templates. Elements for editing
the data, like forms, links and icons, should only displayed when an
authorized administrator of the organization is logged in as frontend user
(see figure 8-3). In chapter 7 we suggested the
``IfAuthenticatedViewHelper`` and the
``AccessControlService``, that we had implemeted for this
purpose.


.. figure:: /Images/8-Fluid/figure-8-3.png
	:align: center

	Figure 8-3: Single view of an organization with its offers (left) and the 
	same view with shown editing symbols (right)

Another repeating job is the formatting of numbers and date
intervals, For example how the date is displayed for the
*Offerperiod* (*Angebotszeitraum*) in Figure 8-3. An offer can
have a minimum and/or a maximum amount of attendees for example. If none
of this is given, nothing should be displayed. If only one of these values
is given the value should be prefixed with from respectively to. We store
these jobs in a ``NumericalRangeViewHelper`` and call it in our
template like this:

``<sjr:format.numericRange>{offer.ageRange}</sjr:format.numericRange>``

Alternatively you can use the inline notation of Fluid (therefore
see the box :ref:`inline-notation-vs-tag-based-notation` earlier in this
chapter):

``{offer.ageRange->sjr:format.numericRange()}``

The NumericRangeViewHelper is implemented as follows:

<remark>TODO: insert code here</remark>

The method render() has the optional argument ``$range``.
This is important for the inline notation. When this argument is not set
(also ``NULL``), the code between the starting and ending tag is
processed ("normal" notation) by calling the method
``renderChildren()``. Is the result an object that implements the
NumericRangeInterface then the described use cases are checked step by
step and the resulting string is returned. In similiar manner the
``DateRangeViewHelper`` was implemented.



Design a form
-------------------------------------------------

At the end we show you another sample for designing a form for
editing the basic data of an organization. You find the associated
template *edit.html* in the folder
*EXT:sjr_offers/Resources/Private/Templates/Organization/*.

<remark>TODO: insert code here</remark>

The form is enclosed in the tags of the
``IfAuthenticatedViewHelper``. If the access is granted than the
form is displayed, otherwise the content of the partial
``accessError`` is displayed.

::

	<div id="dialog" title="Notice!">
	You are not authorized to execute this action. 
	Please first log in with your username and password.
	</div>

With the declaration of ``object="{organization}"`` the
proper form is bound to the assigned ``Organization`` object in
the ``editAction()``.<remark>TODO: Rewrite sentence</remark> The
form consists of input fields that are created by Fluid with the
``form.textbox`` ViewHelper respectively the
``form.textarea`` ViewHelper. Each form field is bound to their
specific propety of the ``Organization`` object using
``property="telefaxNumber"``. The attribute value of the concrete
object is inserted in the form fields during rendering of the page. When
submitting the form, the data is send as POST parameters to the method
``updateAction()``.

When the entered data is not valid, the method
``editActon()`` is called again and an error message is
displayed. We have stored the HTML code for the error message in a partial
``formErrors`` (see
*EXT:sjr_offers/Resources/Private/Partials/formErrors.html*).
In this partial, the name of the form that relates to the error message is
given as ``formName``::

	<f:form.errors for="formName">
	<div id="dialog" title="{error.propertyName}">
	<p>
	<f:for each="{error.errors}" as="errorDetail">
	{errorDetail.message}
	</f:for>
	</p>
	</div>
	</f:form.errors>

.. sidebar:: Localize error messages

	The error messages of the default validators that are delivered
	with Extbase are not localized in version 1.2. You can translate the
	messages yourself by replacing the before described partial
	``formErrors`` with the following code:

	<remark>TODO: insert code here</remark>

	In the file
	*EXT:sjr_offers/Resources/Private/Language/locallang.xml*
	you have to write for example::

		<label index="newOffer.title">Title of the offer</label>
		<label index="newOffer.title.1238108067">The length of the title must between 3 an 50 character.</label>

	This solution is only an agreement. The default localization of
	the error messages is planned for a future version of
	Extbase.<remark>TODO: rework for current Extbase version</remark>


