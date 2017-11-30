.. include:: ../Includes.txt

.. _modeling-the-domain:

Modeling the Domain
===================

In this chapter you are going to learn how to subject an area of the
real world - a so called *Domain* - to a process of
abstraction, in order to present it within an extension - the so called
Domain model. This first step of extension development is the most important
as well. It provides the foundation for all following stages of development.
Don't worry: You'll only need common sense and a few tools to model a
domain. The latter we are going to introduce in this chapter.

The central theme is provided by a complex example, which exhausts all
essential characteristics of Extbase and Fluid. We will use this central
theme constantly in the following chapters. The example is based on a real
project, which was worked on at the same time as writing the text on behalf
of *SJR (Stadtjugendring Stuttgart e.V.)*. The SJR is an
umbrella organization for about 400 youth organizations in Stuttgart, such
as sports clubs, cultural clubs and religious communities. Among other
things the SJR assists those societies to publish their offers in the
Greater Stuttgart. Currently a lot of effort goes into research and involves
high costs by printing flyer. In the future those offers will be managed by
the youth organizations via the Internet. At the same time parents, children
and teenager should be able to find suitable offers and display them easily.
You can download the originated extension with the extension-key
*sjr_offers* at the extension repository
(`http://typo3.org/extensions/repository/view/sjr_offers/current/ <http://typo3.org/extensions/repository/view/sjr_offers/current/>`_).

The example is also being used to demonstrate the approach of
Test-Driven Development close to reality. We manage those Unit-Tests with
extension *phpunit*, which is also available for download
at the TER.

.. tip::

	Please note that we, the authors are also in a proceeding learning process. With our todays knowledge, the printed code can be described as

	*good*

	in terms of the right use of Extbase and Fluid. Good software does not sprout as a one-off product even of a meticulous approach but as something which has to be optimized and readjusted steadily. Therefore we are advocates of an

	*agile*

	approach and a continuous

	*Refactoring*

	of software architecture and code.

Development with Extbase starts with, as stated before, the domain's
characterization and their implementation as a model. If you are not
familiar with the terms of Domain Driven Design, we suggest to scan through
:ref:`chapter 2 <basic-principles>`.

.. toctree::
	:maxdepth: 2

	1-the-application-domain
	2-implementing-the-domain-model
