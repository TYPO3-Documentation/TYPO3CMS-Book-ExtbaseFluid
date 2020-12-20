.. include:: ../Includes.txt

.. _modeling-the-domain:

===================
Modeling the Domain
===================

In this chapter, you are going to learn how to create an abstraction
(the **Domain Model**) as described in :ref:`ddd`.

This first step of extension development is the most important
as well. It provides the foundation for all following stages of development.
Don't worry: You'll only need common sense and a few tools to model a
domain. The latter we are going to introduce in this chapter.

The central theme is provided by a complex example, which exhausts Extbase's and Fluid's essential characteristics. We will use this central
theme constantly in the following chapters. The example is based on a real
project, which was worked on simultaneously as writing the text on behalf
of *SJR (Stadtjugendring Stuttgart e.V.)*. The SJR is an
umbrella organization for about 400 youth organizations in Stuttgart, such
as sports clubs, cultural clubs, and religious communities. Among other
things, the SJR assists those societies to publish their offers in the
Greater Stuttgart. Currently, a lot of effort goes into research and involves
high costs for printing a flyer. In the future, those offers will be managed by
the youth organizations via the Internet. At the same time parents, children
and teenagers should find suitable offers and display them easily.
You can download the extension with the extension-key
*sjr_offers* at the extension repository
(`http://typo3.org/extensions/repository/view/sjr_offers/current/ <http://typo3.org/extensions/repository/view/sjr_offers/current/>`_).

The example is also being used to demonstrate the approach of
Test-Driven Development close to reality. We manage those Unit-Tests with
extension *phpunit*, which is also available for download
at the TER.



.. toctree::
   :hidden:

   1-the-application-domain
   2-implementing-the-domain-model
