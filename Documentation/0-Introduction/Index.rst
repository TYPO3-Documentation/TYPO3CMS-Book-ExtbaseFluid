.. include:: ../Includes.txt

.. _introduction:

Introduction
============

TYPO3 is a powerful and mature content management system containing many
features and a large degree of flexibility. However, the architecture
of version 4 and the programming techniques which form
the basis of it were the state of the art around the year 2000. That's why
in the year 2006, after a thorough analysis of the current status, the
decision was made to rewrite TYPO3 from scratch. A separation into a
framework part and the real content management system TYPO3 seemed to make
sense. In 2015, TYPO3 CMS v6 has been widely adopted.
The birth of Extbase and Fluid also took place in this phase of re-orientation.

Extbase is a PHP-based framework which supports developers in creating clean and easily
maintainable TYPO3 extensions. The template engine Fluid makes sure that the user interface
of the extension can easily be created individually.

Extbase ensures a clear separation between different concerns, which makes maintenance a lot
more simple thanks to modular code. Because of this modular design, the development time
and associated costs are reduced for initial development and as for adjustments. Extbase
also lessens the burden ofon the developer when it comes to security-relevant and repetetive tasks:
for example the validation of arguments, the persistence of data, and access to TypoScript and
FlexForm settings. Developers can therefore focus on solving the problems of their clients much more efficiently.

Because of the modern architecture and the usage of up-to-date software
development paradigms, using Extbase needs different knowledge than before.
Instead of "hacking together" an extension, programmers now must understand
some concepts like Domain-Driven Design, whilst planning and modelling the extension
more thoroughly before implementation. In return, the source code
of the extension becomes a lot more readable, more flexible and more
extensible. Moreover, the concepts are also applicable within other
programming languages and frameworks, as development paradigms like
Domain-Driven Design or Model-View-Controller architecture can be used
universally.

.. toctree::
    :maxdepth: 2

    1-short-history
    2-target-audience
    3-structure
    4-typographic-conventions
    5-thanks
