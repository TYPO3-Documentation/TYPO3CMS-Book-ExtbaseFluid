.. include:: /Includes.rst.txt

.. _basic-principles:

=======================
Basic design principles
=======================

.. tip::

   None of the design principles here are specific to TYPO3 or
   Extbase / Fluid. If you are familiar with object-oriented
   programming in PHP, model-view-controller, domain-driven design
   and test-driven development, you can safely skip to the
   next chapter :ref:`The-Blog-Example`.

TYPO3 comes with an impressive variety of available extensions. As
usual with Open Source projects, these extensions have been written by
various programmers. Extensions are used in all sorts of projects: some are
written for use in small organizations or even in private,
others are developed in big teams in the context of major projects.
As a newbie writing your first extension, you may struggle with some
first-time problems concerning TYPO3, as many big projects are based
on homemade Frameworks. So style and architecture of today's extensions
are quite heterogeneous. Hence, it is often complicated to extend or
modify existing extensions for your own projects. Before you can do that,
you will have to wrap your head around the development style of the respective
author or team of authors.

It's one of the goals of Extbase to reduce this inconsistency in
extensions. Approved programming paradigms lead to fast success for
newbies and protect developers from having to deal with complex database
queries or potential security holes like SQL injections or XSS attacks.
Using Extbase, small extensions, as well as big projects, can be implemented in
a well-structured way.

Extbase is based on four interconnected and complementary paradigms.
You'll encounter these during the whole project cycle, from planning to
realization and maintenance of your extension:

* Object-oriented programming (OOP): describes how to encapsulate
  associated real-world aspects to abstract objects in a software
* Domain-driven design (DDD): The goal of this approach
  is to transcribe terms, rules, and actions of the problem at hand in an
  adequate way.
* Model-view-controller (MVC): This programming paradigm leads to
  clear isolation of data, control of actions, and logic of
  interaction.
* Test-driven development (TDD): This approach is a basic
  technique for generating code that is stable, resilient to errors and
  legible - and therefore maintainable.

Each of these four paradigms is well known in professional
software development and more or less widespread. This results in a big
advantage when using Extbase as knowledge on these paradigms is easy to
find and accessible to everyone.

Knowledge in object-oriented programming, domain-driven design and the
MVC paradigm is essential for working with Extbase. Knowledge of test-driven
development is not necessary for understanding nor using Extbase.
Nevertheless, we would like to recommend this development technique warmly.

The next chapter explains how the paradigms come together and how the MVC
pattern is implemented in Extbase.

.. toctree::
   :hidden:

   1-Model-View-Controller-in-Extbase
   2-Conclusion
