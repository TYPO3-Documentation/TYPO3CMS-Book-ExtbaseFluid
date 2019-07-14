.. include:: ../Includes.txt

.. _basic-principles:

Basic Design Principles
===============================

.. tip::

   None of the design principles here are specific to TYPO3 or
   Extbase / Fluid. If you are familiar with Object Oriented
   Programming in PHP, Model-View-Controller, Domain Driven Design
   and Test-Driven Development, you can safely skip to the
   next chapter :ref:`The-Blog-Example`.

TYPO3 comes with an impressive variety of available extensions. As
usual with Open Source projects, these extensions have been written by
various programmers. Extensions are used in all sorts of projects: some are
written for use in small organizations or even in private, others are developed in
big teams in the context of major projects. As a newbie writing your
first extension, you may struggle with some first-time problems concerning TYPO3,
as many big projects are based on homemade Frameworks. So style and
architecture of today's extensions are quite heterogeneous. Hence, it is
often very difficult to extend or modify existing extensions for your own
projects. Before you can do that, you will have to wrap your head around the
development style of the respective author or team of authors.

It's one of the aims of Extbase to reduce this inconsistency in
extensions. Approved paradigms of programming lead to fast success for
newbies and protect developers from having to deal with complex database
queries or potential security holes like SQL-Injections or XSS-Attacks.
Using Extbase, small Extensions as well as big projects can be realized in
a well-structured way.

Extbase is based on four interconnected and complementary paradigms,
which we would like to present in this chapter. You'll encounter these during the whole
project cycle, from planning to realization and maintenance of your
extension:

* Object-Oriented Programming (OOP): describes how to encapsulate
  associated real world aspects to abstract objects in a software
* Domain-Driven Design (DDD): The goal of this approach
  is to transcribe terms, rules and actions of the problem at hand in an
  adequate way.
* Model-View-Controller (MVC): This programming paradigm leads to
  a clear isolation of data, control of actions, and logic of
  interaction.
* Test-Driven Development (TDD): This approach is a basic
  technique for generating code which is stable, resilient to errors and
  legible - and therefore maintainable.

Each of these four paradigms are well known in professional
software development and more or less widespread. This results in a big
advantage when using Extbase. Until now an expert in developing TYPO3
extensions was mainly an expert in the usage (and bypassing) of the application
programming interface (API) of TYPO3. In contrast, Extbase will demand
additional knowledge and skills in domains that are useful and effective far
beyond the TYPO3 Community. Thus, you can rely on an extensive record of
experience in the form of books, forums or personal contacts – an important
aspect of the future of TYPO3.

Knowledge in Object-Oriented Programming, Domain-Driven Design and the
MVC-paradigm is essential for working with extbase. Knowledge of Test-Driven
Development is not absolutely necessary for understanding nor using extbase.
Nevertheless we would like to warmly recommend this development technique.

.. toctree::
   :hidden:

   1-Object-oriented Programming-in-PHP
   2-Domain-Driven-Design
   3-Model-View-Controller-in-Extbase
   4-Test-Driven-Development
   5-Conclusion
