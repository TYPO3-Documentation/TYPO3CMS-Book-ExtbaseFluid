.. include:: /Includes.rst.txt

Introduction
============

TYPO3 is a powerful and mature content management system containing many
features and a large degree of flexibility. However, the architecture
of version 4 and the programming techniques which form
the basis of it were the state of the art around the year 2000. That's why
in the year 2006, after a thorough analysis of the current status, the
decision was made to rewrite TYPO3 from scratch. A separation into a
framework part and the real content management system TYPO3 seemed to make
sense. Today, the framework FLOW_ is used and TYPO3 CMS v6 has been widely adopted.
The birth of Extbase and Fluid also took place in this phase of re-orientation.

.. _FLOW: https://flow.neos.io/

.. sidebar:: TYPO3 v4 and TYPO3 v6

   Because the internal structures of TYPO3 v4 grew organically, they
   could be quite confusing. When developing NEOS (formerly TYPO3 5), the
   TYPO3 team decided to start from scratch. Special attention was placed on
   clean code and an easy and powerful infrastructure. It quickly emerged that the first
   priority would be a web application framework, before the CMS itself
   was to be developed. This web application framework is FLOW, on which NEOS is developed.

Extbase is a PHP-based framework which supports developers in creating clean and easily
maintainable TYPO3 extensions. The template engine Fluid makes sure that the user interface
of the extension can easily be created individually.

Extbase ensures a clear separation between different concerns, which makes maintenance a lot
more simple thanks to modular code. Because of this modular design, the development time
and associated costs are reduced for initial development and for adjustments. Extbase
also lessens the burden on the developer when it comes to security-relevant and repetitive tasks:
for example the validation of arguments, the persistence of data, and access to TypoScript and
FlexForm settings. Developers can therefore focus on solving the problems of their clients much more efficiently.

Because of the modern architecture and the usage of up-to-date software
development paradigms, using Extbase needs different knowledge than before.
Instead of "hacking together" an extension, programmers now must understand
some concepts like Domain-Driven Design, whilst planning and modeling the extension
more thoroughly before implementation. In return, the source code
of the extension becomes a lot more readable, more flexible and more
extensible. Moreover, the concepts are also applicable within other
programming languages and frameworks, as development paradigms like
Domain-Driven Design or Model-View-Controller architecture can be used
universally.

We hope that Extbase and Fluid are the introduction to a completely
new world of programming for you. You will learn a lot of new concepts but over time,
you will notice that Extbase and Fluid makes you a lot more productive.
With a bit of luck, you'll hopefully get into the "flow" which drove us while we developed Extbase and Fluid.

.. toctree::
   :maxdepth: 2

   1-short-history
   2-target-audience
   3-structure
   4-typographic-conventions
   5-thanks
