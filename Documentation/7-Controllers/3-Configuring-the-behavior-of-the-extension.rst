.. include:: ../Includes.txt

=========================================
Configuring the behavior of the extension
=========================================

Not all organizations are to be displayed in our example extensions,
but just the ones belonging to a certain status (like, e.g., internal,
external, non-member). In the TypoScript template of our page, we therefore
establish an option `allowedStates` under the path
`tx_sjroffers.settings`:

.. code-block:: typoscript

   plugin.tx_sjroffers {
       settings {
           allowedStates = 1,2
       }
   }

Extbase makes the settings inside of the path
:php:`plugin.tx_sjroffers.settings` available as an array in
the class variable :php:`$this->settings`. Our action
thus looks like this:

::

   public function indexAction()
   {
       $this->view->assign(
           'organizations',
           $this->organizationRepository->findByStates(
               \TYPO3\CMS\Core\Utility\GeneralUtility::intExplode(',', $this->settings['allowedStates'])
           )
       );

       // ...
   }

In the :php:`OrganizationRepository`, we implemented a
Method :php:`findByStates()`, which we do not further
investigate here (see more in chapter 6, section "Implement individual
database queries"). The method expects an array containing the allowed
states. We generate it from the comma-separated list using the TYPO3 API
function :php:`\TYPO3\CMS\Core\Utility\GeneralUtility::intExplode()`.
We then pass on the returned choice of organizations to the view, just as
we are used to doing.

.. tip::

   Of course, we could also have passed the comma-separated list
   directly to the Method :php:`findByStates()`. We do
   recommend, though, to prepare all parameter coming from outside
   (settings, form input) before passing them on to the two other
   components Model and View.


In this chapter, you've learned how to set the Objects of your domain
in motion and how to control the flow of a page visit. You now can
realize the two components *model* and
*Controller* of the MVC paradigm inside your extension.
In the following chapter, we will address the third component, the
*View*. We'll present the substantial scope of the
template engine Fluid.
