Introduction
==============================

TYPO3 is a powerful and mature content management system, which has a
lot of features and a large degree of flexibility. However, the architecture
of the currently used version 4 and the programming techniques which form
the basis of it were the state of the art around the year 2000. That's why
in the year 2006, after a thorough analysis of the current status, the
decision was made to rewrite TYPO3 from scratch. A separation into a
framework part and the real content management system TYPO3 seemed to make
sense. Today, the framework FLOW3 is approaching production quality, and
TYPO3 v5 is taking shape. The birth of Extbase and Fluid also took place in
this phase of re-orientation.

Extbase is a PHP based framework which supports developers in creating
clean and easy-to-maintain TYPO3 extensions, which are also future proof, as
the porting to TYPO3 v5 is eased a lot. The template engine Fluid makes sure
that the user interface of the extension can easily be created
individually.

Extbase makes sure that there is a clear separation between different
concerns, which make maintenance a lot more simple, because the code is
structured modularily. Because of this modular design, the development time
for initial development, but also for adjustments, drops, and thus also the
costs associated with that. Extbase also lessens the burden of the developer
when it comes to security-relevant and repeating tasks, for example the
validation of arguments, the persistence of data, and the reading of
TypoScript and FlexForm settings. Because of that, developers can focus on
solving the problems of their clients.

Because of the modern architeture and the usage of up-to-date software
development paradigms, using Extbase needs different knowledge than before:
Instead of "hacking together" an extension, programmers now must understand
some concepts like Domain-Driven Design, and plan and model the extension
more thoroughly before the implementation starts. In return, the source code
of the extension becomes a lot better readable, more flexible and more
extensible. Moreover, the used concepts are also applicable to other
programming languages and frameworks, as the development paradigms like
Domain-Driven Design or Model-View-Controller architecture can be used
universally.

Extensions which build on Extbase can be ported to TYPO3 v5 and FLOW3
in a manageable fashion, as the structure of the extension, the naming
conventions and the used APIs are almost the same. Hence, Extbase eases the
transition to FLOW3 and TYPO3 v5 -- if you use Extbase, you can later easily
switch to FLOW3 and TYPO3 v5.

.. sidebar:: TYPO3 v4 and TYPO3 v5

	In the TYPO3 community, some products are developed in parallel
	right now. Here, they should be presented shortly. TYPO3 v4 is the
	established branch of TYPO3, which powers hundreds of thousands of
	installations world-wide. Right now, version 4.4 is the current version,
	and version 4.5 is in development.

	Because the internal structures of TYPO3 v4 were growing
	organically, and thus can be quite confusing, the TYPO3 team decided to
	begin a new development branch parallel to TYPO3 v4: TYPO3 v5 should be
	developed from scratch. While doing that, special attention has been on
	clean code and an easy and powerful infrastructure.<remark>The last
	sentence is strange -> REWORK.</remark> It quickly emerged that we
	first needed to write a web application framework, before the CMS itself
	should be developed. This web application framework is FLOW3, and on that
	basis, TYPO3 v5 is now developed.

We hope that Extbase and Fluid are the introduction to a completely
new world of programming for you, such that you can now start learning the
new concepts of FLOW3. At the beginning, you will learn a lot of new
concepts, but over time, you will notice that Extbase and Fluid makes you a
lot more productive than before. With a bit of luck, you might get into the
"flow" which drove us while we developed Extbase and Fluid.

Not only you as developer can profit from Extbase: Also the FLOW3
development team can test many concepts for their real-world applicability,
and remove bugs and inconsistencies, which occur in Extbase and
Fluid.

.. toctree::
	:maxdepth: 2

	1-short-history
	2-target-audience
	3-structure
	4-typographic-conventions
	5-thanks