.. include:: ../Includes.txt

================================
Creating controllers and actions
================================

The controller classes are stored in the folder :file:`EXT:sjr_offer/Classes/Controller/`. The name of the
controller is composed by the name of the domain model and the suffix
:php:`Controller`. So the controller
:php:`\MyVendor\SjrOffers\Controller\OfferController` is assigned
to the Aggregate Root Object
:php:`\MyVendor\SjrOffers\Domain\Model\Offer`. And the name of the
Class file is :file:`OfferController.php`.

The controller class must extend the class
:php:`\TYPO3\CMS\Extbase\Mvc\Controller\ActionController`, which is
part of Extbase. The individual actions are combined in separate methods.
The method names have to end in :php:`Action`. The body of
:php:`OfferController` thus looks like this:

.. code-block:: php
   :caption: OfferController.php
   :name: offer-controller

   <?php

   namespace MyVendor\SjrOffers\Controller;

   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

   class OfferController extends ActionController
   {
      // action methods will be following here
   }

When realizing the desired tasks through *action*
methods you will often stumble upon very similar flows and patterns. Each
task will be carried out by a single *action* or a chain
of *Actions*:

#. A list of domain objects is to be displayed.
#. A single domain object is to be displayed.
#. A new domain object is to be created.
#. An existing domain object is to be edited.
#. A domain object is to be deleted.

We will shed some light on these recurring patterns in the following
sections. Together with the schedule model, you will learn the background to
generate your own flows.

.. tip::

    Note that you are free to choose the method names for your
    *Actions* as you like. Nevertheless, we recommend to
    stick to the names presented here to help other developers to find
    their way through your code.


Flow pattern "display a list of domain objects"
===============================================

The first pattern in our example fits the action "*display
a list of all offers*". One action method usually will be enough
for implementing this. We choose :php:`indexAction` as
the name of the method:

.. code-block:: php

   // …
   /**
    * @var OfferRepository
    */
   private $offerRepository;

   /**
    * Inject the offer repository
    *
    * @param \MyVendor\SjrOffers\Domain\Repository\OfferRepository $offerRepository
    */
   public function injectOfferRepository(OfferRepository $offerRepository)
   {
      $this->offerRepository = $offerRepository;
   }

   /**
    * Index action
    *
    * @return string
    */
   public function indexAction()
   {
       $offers = $this->offerRepository->findAll();
       $this->view->assign('offers', $offers);
       return $this->view->render();
   }


This can be simplified even more. As described in chapter 4 in
the section "controlling the flow", it is unnecessary to return the rendered
content. Furthermore, we avoid initializing the variable
:php:`$offers`, which we only use once. So we get:

.. code-block:: php

   /**
    * Index action
    *
    * @return void
    */
   public function indexAction()
   {
       $this->view->assign('offers', $this->offerRepository->findAll());
   }

initializeAction
================

In old TYPO3 versions the :php:`initializeAction()` was used to get the repository instance.
Later we can use this action to modify the request before the property mapper is executed or
integrate JavaScript libraries.

The :php:`ActionController` not only calls the method :php:`initializeAction()`, which is executed before any
action in the controller, but also a method in the Form of
:php:`initialize*Foo*Action()`, which is called only before the method
:php:`*foo*Action()`.

.. tip::

    The trick of implementing an empty method body in the super
    class, which is the "filled" in the subclass is called
    *Template Pattern*.



Flow pattern "display a single domain object"
=============================================

The second pattern is best put into action by a single method as
well. We call it :php:`showAction()`. In contrast to
:php:`indexAction`, we have to tell this method from
outside which domain object is displayed. In our case, the offer to
be shown is passed to the method as Argument:

.. code-block:: php

   /**
    * Show action
    *
    * @param \MyVendor\SjrOffers\Domain\Model\Offer $offer The offer to be shown
    * @return string The rendered HTML string
    */
   public function showAction(\MyVendor\SjrOffers\Domain\Model\Offer $offer)
   {
      $this->view->assign('offer', $offer);
   }

Usually, the display of a single Object is called by a link in the
frontend. In our example extension it connects the list view by something
like the following URL:

`http://localhost/index.php?id=123&amp;tx_sjroffers_pi1[offer]=3&amp;tx_sjroffers_pi1[action]=show&amp;tx_sjroffers_pi1[controller]=Offer`

Due to the 2 Arguments
`tx_sjroffers_pi1[controller]=Offer` and
`tx_sjroffers_pi1[action]=show`, the dispatcher of Extbase
passes the request to the :php:`OfferController`. In the
request we find the information that the action *show* is to be called. Before passing on the further processing to
the method :php:`showAction()`, the controller tries to
map the Arguments received by the URL on the method's arguments.
Extbase maps the arguments by their names. In our example Extbase detects,
that the GET Argument `tx_sjroffers_pi1[offer]=3` corresponds to the method argument
:php:`$offer`:
:php:`showAction(\MyVendor\SjrOffers\Domain\Model\Offer *$offer*)`.
Extbase fetches the type of this Argument from the method signature:
:php:`showAction(*\MyVendor\SjrOffers\Domain\Model\Offer* $offer)`.
In case this so called *Type Hint* should not be present,
Extbase reads the type from the annotation written above the method:
:php:`@param *\MyVendor\SjrOffers\Domain\Model\Offer* $offer`.

After successfully assigning, the incoming argument's value has
to be cast in the target type and checked for validity (read more
about validation in chapter 9 in the section "Validating domain objects"). In
our case, the incoming value is "3". Target type is the class
:php:`\MyVendor\SjrOffers\Domain\Model\Offer`. So Extbase
interprets the incoming value as uid of the object to be created and sends
a request to the *Storage Backend* to find an Object
with this uid. If the object can be reconstructed fully valid it is passed
to the method as argument. Inside of the method
:php:`showAction()`, the newly created object is passed on
to the view, taking care of the HTML output.

.. tip::

    Inside of the template, you can access all properties of the
    domain object, including all existing child objects. Thus this Flow
    Pattern does not only cover single domain objects but, in the event,
    also a complex aggregate.

If an Argument is identified as invalid, the already implemented
method :php:`errorAction()` of
:php:`ActionController` is called instead of the method
:php:`showAction()`. The method then generates a message
for the frontend user and passes the processing to the previous action, in
case it is given. The latter is handy with invalid form field
input, as you'll see in the following.


Flow pattern "creating a new domain object"
===========================================

For the third Flow Pattern, the one for creating a new Domain
Object, two steps are required: First, a form for inputting the Domain
Data has to be shown in Frontend. Second, a new domain object has to be
created (using the incoming form data) and put in the appropriate
repository. We're going to implement these two steps in the methods
:php:`newAction() `and
:php:`createAction()`.

.. tip::

    We already described these steps in chapter 3 in section
    "Alternative route: creating a new posting". We now shortly revise
    this Flow using our example extension and focus on some further
    aspects.

First the method :php:`newAction()` is called by a
Link in frontend with the following URL:

`http://localhost/index.php?id=123&amp;tx_sjroffers_pi1[organization]=5&amp;tx_sjroffers_pi1[action]=new&amp;tx_sjroffers_pi1[controller]=Offer`

Extbase instantiates the :php:`Organization `Object
mapped to the Argument :php:`$organization,` just
as it was the case with the :php:`Offer` object in the
method :php:`showAction()`. In the URL, there is no information
(yet), though, which value the Argument :php:`$newOffer` shall have. So the default value
(:php:`=null`) set in the method signature is used. With
these Arguments, the controller passes the further processing to the
method :php:`newAction()`.

.. code-block:: php

   <?php
   declare(strict_types = 1);

   namespace MyVendor\SjrOffers\Controller;

   use TYPO3\CMS\Extbase\Annotation as Extbase;
   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

   class OfferController extends ActionController
   {
       // ...

       /**
        * @param \MyVendor\SjrOffers\Domain\Model\Organization $organization The organization
        * @param \MyVendor\SjrOffers\Domain\Model\Offer $offer The new offer object
        * @return string An HTML form for creating a new offer
        * @Extbase\IgnoreValidation("newOffer")
        */
       public function newAction(\MyVendor\SjrOffers\Domain\Model\Organization $organization, \MyVendor\SjrOffers\Domain\Model\Offer $newOffer = null)
       {
           $this->view->assign('organization', $organization);
           $this->view->assign('newOffer', $newOffer);
           $this->view->assign('regions', $this->regionRepository->findAll());
       }

       // ...
   }

This action passes to the view in :php:`organization` the :php:`Organization` object, in :php:`newOffer`
:php:`null` (to begin with) the and in :php:`region` all :php:`Region` Objects contained in the
:php:`RegionRepository`. The view creates the output of
the form in the frontend, using a template, which we focus on in chapter 8 in
section "Template Creation by example". After the user filled in the offer's data
and submitted the form, the Method
:php:`createAction()` shall be called. It expects as Arguments
an :php:`Organization` Object and an Object of the class
:php:`\MyVendor\SjrOffers\Domain\Model\Offer`. Therefore Extbase
instantiates the Object and "fills" its Properties with the appropriate
Form data. If all Arguments are valid, the action
:php:`createAction()` is called.

.. code-block:: php

   /**
    * @param \MyVendor\SjrOffers\Domain\Model\Organization $organization The organization the offer belongs to
    * @param \MyVendor\SjrOffers\Domain\Model\Offer $newOffer A fresh Offer object which has not yet been added to the repository
    * @return void
    */
   public function createAction(\MyVendor\SjrOffers\Domain\Model\Organization $organization, \MyVendor\SjrOffers\Domain\Model\Offer $newOffer)
   {
      $organization->addOffer($newOffer);
      $newOffer->setOrganization($organization);
      $this->redirect('show', 'Organization', NULL, ['organization' => $organization]);
   }

The new offer is allocated to the organization, and inversely the
organization is allocated to the offer. Thanks to this allocation, Extbase
will cause the persistence of the new offer in the dispatcher before
returning to TYPO3.

After creating the new offer, the appropriate organization is to be
displayed with all of its offers. We, therefore, start a new request
(*request-response-cycle*) by redirecting to
:php:`showAction()` of the
:php:`OrganizationController` using the Method
:php:`redirect()`. The actual organization is hereby
passed on as an argument. Inside the
:php:`ActionController` you have the following Methods for
redirecting to other action controllers at your disposal:

.. code-block:: php

   redirect($actionName, $controllerName = NULL, $extensionName = NULL,
      array $arguments = NULL, $pageUid = NULL, $delay = 0, $statusCode = 303)
   redirectToURI($uri, $delay = 0, $statusCode = 303)
   return new :php:`ForwardResponse('actionName')`;

Using the :php:`redirect()` Method, you can start a
new request-response-cycle on the spot, similar to clicking on a link: The
given action (specified in :php:`$actionName`) of the
appropriate controller (specified in
:php:`$controllerName`) in the given extension (specified
in :php:`$extensionName`) is called. If you did not
specify a controller or extension, Extbase assumes that you stay in the
same context. In the fourth parameter :php:`$arguments`
you can pass an Array of arguments. In our example :php:`['organization' => $organization]`
would look like this in the URL:
:php:`tx_sjroffers_pi1[organization]=5`. The Array key is
transcribed to the parameter name, while the organization object in
:php:`$organization` is transformed into the number 5,
which is the appropriate UID. If you want to link to another page inside
the TYPO3 installation, you can pass its uid in the 5th parameter
(:php:`$pageUid`). A delay before redirecting can be
achieved by using the 6th parameter (:php:`$delay`). By
default the reason for redirecting is set to status code 303 (which means
*See Other*).You can use the 7th parameter
(:php:`$statusCode`) to override this (for example, with
301, which means *Moved Permanently*).

In our example, the following code is sent to the Browser. It
provokes the immediate reload of the page with the given URL:

.. code-block:: html

   <html><head><meta http-equiv="refresh" content="0;url=http://localhost/
   index.php?id=123&amp;tx_sjroffers_pi1[organization]=5&amp;tx_sjroffers_
   pi1[action]=show&amp;tx_sjroffers_pi1[controller]=Organization"/></head></html>

The method :php:`redirectToURI()` corresponds to the
method :php:`redirect()`, but you can directly set a URL
respectively URI as string, e.g. `<html><head><meta http-equiv= "refresh" content="0;url=http://example.com/foo/bar.html"/></head></html>`.
With this, you have all the freedom to do what you need. Returning
a :php:`ForwardResponse` object redirects the request
to another action, just as the other two redirect methods do. In
contrast to them, no new request-response cycle is started, though. The
request object is updated with the details concerning the action,
controller and extension. It is then being passed back to the dispatcher for
processing. Then the dispatcher passes on the actual
:php:`Request` object to the appropriate controller.
Here, too, applies: If no controller or extension is set, the actual
context is kept.

This procedure can be done multiple times when calling a page. The
risk, though, is that the process runs into an infinite loop (A
redirects to B, B redirects to A again). In this case, Extbase stops the
processing after some steps.

There is another important difference between the redirect methods. Using
the :php:`ForwardResponse()` to redirect, new objects
will not (yet) be persisted to database. They will be persisted at the end
of the request-response-cycle. Therefore no UID has been assigned to a
new object yet, and therefore the transcription to a URL parameter fails. You can
manually trigger the persisting before you return the :php:`ForwardResponse`,
by using :php:`$persistenceManager->persistAll()`,
though.

When calling the method :php:`createAction(),` we
already described the case of all Arguments being valid. But what happens
if a frontend user inserts invalid data or even manipulates the form to
attack the website deliberately?

.. tip::

    You find detailed information about validation and security in
    chapter 9

Fluid adds multiple hidden fields to the form generated by the
Method :php:`newAction()`. These contain information about
the origin of the form (:php:`__referrer`) as well as, in
encrypted form (:php:`__trustedProperties`), the structure of the form
(shorted in the example below).

.. code-block:: html

   <input type="hidden" name="tx_sjroffers_list[__referrer][extensionName]"
       value="SjrOffers" />
   <input type="hidden" name="tx_sjroffers_list[__referrer][controllerName]" value="Offer" />
   <input type="hidden" name="tx_sjroffers_list[__referrer][actionName]" value="edit" />
   <input type="hidden" name="tx_sjroffers_list[__trustedProperties]"
          value="a:4:{s:5:&quot;offer&quot;;a:12:
   ...
   s:10:&quot;__identity&quot;;i:1;}s:12:&quot;organization&quot;;i:1;
   s:6:&quot;action&quot;;i:1;s:10:&quot;controller&quot;;
   i:1;}8888b05fbf35fc96d0e3aadd370a8856a9edad20" />

If now a validation error occurs when calling the Method
:php:`createAction()`, an error message is saved and the
processing is passed back to the previous action, including all already
inserted form data. Extbase reads the necessary information from the
hidden fields :php:`__referrer`. In our case the Method
:php:`newAction()` is called again. In contrast to the
first call, Extbase now tries to create an (invalid)
:php:`Offer` Object from the form data and pass it to
the Method in :php:`$newOffer`. Due to the annotation
:php:`@Extbase\IgnoreValidation("newOffer")` Extbase this time accepts
the invalid object and displays the form once more. Formerly filled in
data is put in the fields again, and the previously saved error message is
displayed if the template is intending so.

.. figure:: /Images/7-Controllers/figure-7-1.png
    :align: center

    Figure 7-1: Wrong input in the form of an offer leads to an error message
    (in this case, a modal JavaScript window)

.. tip::

    Standard error messages of Extbase are not yet localized in
    Version 1.2 (TYPO3 4.4). In the section "Localize error messages" in chapter 8, we
    describe a possibility to translate them too, though.

Using the hidden field :php:`__trustedProperties`, the Extbase property
mapper compares the incoming property data with the allowed ones.
If the request contains data for non-whitelisted properties, the property
mapper throws an exception.

Using the :php:`\TYPO3\CMS\Extbase\Annotation\IgnoreValidation("parameterName")` annotation,
you tell Extbase that the argument is not to be validated. If the argument is an Object, the
validation of its properties is also bypassed.


Flow pattern "editing an existing domain object"
================================================

The flow pattern we now present you is quite similar to the
previous one. We again need two action Methods, which this time we call
:php:`editAction()` and
:php:`updateAction()`. The Method
:php:`editAction()` provides the form for editing, while
:php:`updateAction()` updates the Object in the
repository. In contrast to :php:`newAction()` it is not
necessary to pass an organization to the Method
:php:`editAction()`. It is sufficient to pass the offer to
be edited as an Argument.

.. code-block:: php

   <?php
   declare(strict_types = 1);

   namespace MyVendor\SjrOffers\Controller;

   use TYPO3\CMS\Extbase\Annotation as Extbase;
   use TYPO3\CMS\Extbase\Mvc\Controller\ActionController;

   class OfferController extends ActionController
   {
       // ...

       /**
        * @param \MyVendor\SjrOffers\Domain\Model\Offer $offer The existing, unmodified offer
        * @return string Form for editing the existing organization
        * @Extbase\IgnoreValidation("offer")
        */
       public function editAction(\MyVendor\SjrOffers\Domain\Model\Offer $offer)
       {
          $this->view->assign('offer', $offer);
          $this->view->assign('regions', $this->regionRepository->findAll());
       }

       // ...
   }

Note once again the annotation :php:`@Extbase\IgnoreValidation("offer")`.
The Method :php:`updateAction()`
receives the changed offer and updates it in the repository. Afterward, a
new request is started, and the organization is shown with its updated
offers.

.. code-block:: php

   /**
    * @param \MyVendor\SjrOffers\Domain\Model\Offer $offer The modified offer
    * @return void
    */
   public function updateAction(\MyVendor\SjrOffers\Domain\Model\Offer $offer)
   {
      $this->offerRepository->update($offer);
      $this->redirect('show', 'Organization', NULL, ['organization' => $offer->getOrganization()]);
   }

.. warning::
    Do not forget to explicitly update the changed domain object
    using :php:`update()`. Extbase will not do this
    automatically for you, for doing so could lead to unexpected results.
    For example, if you have to manipulate the incoming domain object
    inside your action method.

At this point, we have to ask ourselves how to prevent
unauthorized changes in our Domain data. The organization and offer data
are not to be changed by all visitors after all. An
*administrator* is allocated to each organization,
authorized to change the organization's data. The administrator can
change the organization's contact data, create and delete offers, and
contact persons as well as edit existing offers. Securing against
unauthorized access can be done on different levels:

* On the level of TYPO3, access to the page and/or plugin is prohibited.
* Inside the action, it is checked if access is authorized. In
  our case, it has to be checked if the administrator of the
  organization is logged in.
* In the template, links to Actions, to which the frontend user
  has no access, are blinded.

Of these three levels, only the first two offer reliable
protection. We do not take a closer look at the first level in this book.
You can find detailed information for setting up permissions in
your TYPO3 system in the :ref:`Core API <t3coreapi:access>`.
The second level, we are going to implement in all "critical" Actions.
Let's look at an example with the Method
:php:`updateAction()`.

.. code-block:: php

   use TYPO3\CMS\Core\Utility\GeneralUtility;
   use \MyVendor\SjrOffers\Service\AccessControlService;

   public function initializeAction()
   {
      $this->accessControlService = GeneralUtility::makeInstance(AccessControlService::class);
   }

   public function updateAction(\MyVendor\SjrOffers\Domain\Model\Offer $offer)
   {
      $administrator = $offer->getOrganization()->getAdministrator();
      if ($this->accessControlService->isLoggedIn($administrator)) {
         $this->offerRepository->update($offer);
      } else {
         $this->flashMessages->add('Please sign in.');
      }
      $this->redirect('show', 'Organization', NULL, ['organization' => $offer->getOrganization()]);
   }

We ask a previously instantiated
:php:`AccessControlService` if the organization's administrator is
responsible for the offer is logged in the frontend. If yes, we
do update the offer. If no, an error message is generated, which is
displayed in the subsequently called organization overview.

Extbase does not yet offer an API for access control. We therefore
implement an :php:`AccessControlService` on ourselves.
The description of the class is to be found in the file :file:`EXT:sjr_offers/Classes/Service/AccessControlService.php`.

.. code-block:: php

   <?php

   namespace MyVendor\SjrOffers\Service;

   use TYPO3\CMS\Core\SingletonInterface;

   class AccessControlService implements SingletonInterface
   {

      public function isLoggedIn($person = NULL)
      {
         if (is_object($person)) {
            if ($person->getUid() === $this->getFrontendUserUid()) {
                return TRUE;
            }
         }
         return FALSE;
      }

      public function getFrontendUserUid()
      {
         if($this->hasLoggedInFrontendUser() && !empty($GLOBALS['TSFE']->fe_user->
                user['uid'])) {
            return intval($GLOBALS['TSFE']->fe_user->user['uid']);
         }
         return NULL;
      }

      public function hasLoggedInFrontendUser()
      {
         return $GLOBALS['TSFE']->loginUser === 1 ? TRUE : FALSE;
      }

   }

The third level can easily be bypassed by manually typing the link
or the form data. It, therefore, only reduces the confusion for honest
visitors and the stimulus for the bad ones. Let's take a short look at
this snippet from a template:

.. code-block:: html

   {namespace sjr=MyVendor\SjrOffers\Viewhelpers}
   <!-- ... -->
   <sjr:security.ifAuthenticated person="{organization.administrator}">
      <f:link.action controller="Offer" action="edit" arguments="{...}">
         <f:image src="EXT:sjr_offers/Resources/Public/Icons/edit.gif" alt="edit" />
      </f:link.action>
      <!-- ... -->
   </sjr:security.ifAuthenticated>

.. tip::

    A *Service* is often used to implement
    functionalities that are needed in multiple places in your extensions
    and are not related to one domain object.

    Services are often stateless. In this context, that means that
    their function does not depend on previous access. This does not
    rule out the dependency on the "environment". In our example, you can be
    sure, that a verification by :php:`isLoggedIn()`
    always leads to the same result, regardless of any earlier
    verification - given that the "environment" has not changed
    (considerably), e.g., by the Administrator logging out or even losing
    his access rights.

    Services usually can be built as *Singleton*
    (:php:`implements t3lib_Singleton`). You can find
    detailed information on *Singleton* in chapter 2 in
    section "Singleton".

    The :php:`AccessControlService` is not part of
    the Domain of our extension. It "belongs" to the Domain of the Content
    Management System. There are Domain Services also, of course, like a
    Service creating a continuous invoice number. They are usually located
    in `EXT:my_ext/Classes/Domain/Service/`.

We make use of an :php:`IfAuthenticatedViewHelper`
to access the :php:`AccessControlService`. The class file
`IfAuthenticatedViewHelper.php` is in our case
located in :file:`EXT:sjr_offers/Classes/ViewHelpers/Security/`.

.. code-block:: php

   namespace MyVendor\SjrOffers\Viewhelper\Security;

   use MyVendor\SjrOffers\Service\AccessControlService;
   use TYPO3Fluid\Fluid\ViewHelpers\IfViewHelper;
   use TYPO3\CMS\Core\Utility\GeneralUtility;

   class IfAuthenticatedViewHelper extends IfViewHelper
   {
      /**
       * @param mixed $person The person to be tested for login
       * @return string The output
       */
      public function render($person = NULL)
      {
         $accessControlService = GeneralUtility::makeInstance(AccessControlService::class);
         if ($accessControlService->isLoggedIn($person)) {
            return $this->renderThenChild();
         } else {
            return $this->renderElseChild();
         }
      }

   }

The :php:`IfAuthenticatedViewHelper` extends the
:php:`If`-Viewhelper of Fluid and therefore provides the
opportunity to use if-else branches. It delegates the access check to the
:php:`AccessControlService`. If the check gives a positive
result, in our case, a link with an edit icon is generated, which leads to
the method :php:`editAction()` of the
:php:`OfferController`.


Flow pattern "deleting a domain object"
=======================================

The last flow pattern realizes the deletion of an existing domain
Object in one single action. The appropriate Method
:php:`deleteAction()` is kind of straightforward:

.. code-block:: php

   /**
    * @param \MyVendor\SjrOffers\Domain\Model\Offer $offer The offer to be deleted
    * @return void
    */
   public function deleteAction(\MyVendor\SjrOffers\Domain\Model\Offer $offer)
   {
      $administrator = $offer->getOrganization()->getAdministrator();
      if ($this->accessControlService->isLoggedIn($administrator) {
         $this->offerRepository->remove($offer);
      } else {
         $this->flashMessages->add('Please sign in.');
      }
      $this->redirect('show', 'Organization', NULL, ['organization' => $offer->getOrganization()]);
   }

The important thing here is that you delete the given Offer from the
repository using the method :php:`remove()`. After running
through your extension, Extbase will delete the associated record from
the Database by marking it as deleted.

.. tip::

    In principle, it doesn't matter how you generate the result
    (usually HTML code) inside the action. You can even decide to use the
    traditional way of building extensions in your action - with SQL
    Queries and maker-based Templating. We invite you to pursue the path
    we chose up till now, though.

The flow patterns we present here are meant to be blueprints for
your own flows. In real-life projects, they may get way more complex. The
Method :php:`indexAction()` of the
:php:`OfferController` looks like this in it's "final
stage":

.. code-block:: php

   /**
    * @param \MyVendor\SjrOffers\Domain\Model\Demand $demand A demand (filter)
    * @return string The rendered HTML string
    */
   public function indexAction(\MyVendor\SjrOffers\Domain\Model\Demand $demand = NULL)
   {
      $allowedStates = (strlen($this->settings['allowedStates']) > 0) ?
            t3lib_div::intExplode(',', $this->settings['allowedStates']) : [];
      $listCategories = (strlen($this->settings['listCategories']) > 0) ?
            t3lib_div::intExplode(',', $this->settings['listCategories']) : [];
      $selectableCategories = (strlen($this->settings['selectableCategories']) > 0) ?
            t3lib_div::intExplode(',', $this->settings['selectableCategories']) : [];
      $propertiesToSearch = (strlen($this->settings['propertiesToSearch']) > 0) ?
            t3lib_div::trimExplode(',', $this->settings['propertiesToSearch']) : [];

      $this->view->assign('offers',
         $this->offerRepository->findDemanded(
            $demand,
            $propertiesToSearch,
            $listCategories,
            $allowedStates
         )
      );
      $this->view->assign('demand', $demand);
      $this->view->assign('organizations',
         array_merge(
            [0 => 'All Organisations'],
            $this->organizationRepository->findByStates($allowedStates)
         )
      );
      $this->view->assign('categories',
         array_merge(
            [0 => 'All Categories'],
            $this->categoryRepository->findSelectableCategories($selectableCategories)
         )
      );
      $this->view->assign('regions',
         array_merge(
            [0 => 'All Districts'],
            $this->regionRepository->findAll()
         )
      );
   }

In the script's first few lines, configuration options, set in
the TypoScript template as a comma-separated list, are transcribed to
arrays. Then this information is passed to the *View*
piece by piece.

One requirement our extension has to realize is that a website visitor
can define a special demand, which is then used to filter the
range of offers. We already implemented an appropriate Method
:php:`findDemanded()` (see :ref:`chapter 6 <individual_database_queries>`).
To define his demand, the visitor chooses
the accordant options in a form (see pic. 7-2).

.. figure:: /Images/7-Controllers/figure-7-2.png
    :align: center

    Figure 7-2: The buildup of the "demand" in a form above the offer list.

.. warning::
    Watch out that you do not implement logic, which
    belongs in the controller domain. Concentrate on the
    mere Flow.

.. tip::

    In real life, you will often need similar functionality in some
    or even all controllers. The previously mentioned access control is a
    simple example. In our example extension, we sourced it out to a
    *service* object. Another possibility is to create
    a basis controller which extends the
    :php:`ActionController` of Extbase. Inside, you
    implement the shared functionality. Then the concrete controllers with
    your Actions extend this Basis controller again.

The Flow inside of a controller is triggered from outside by
TYPO3. For extensions that generate content for the frontend, this is
usually done by a plugin placed on the appropriate page. How to configure
such a plugin you'll see in the following section.
