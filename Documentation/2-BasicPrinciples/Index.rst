Basic Principles
===============================

TYPO3 comes with an impressive variety of available extensions. As
usual with Open Source Projects, these extensions have been written by
various Programmers. Extensions are used in all sorts of projects: Some are
written for use in small clubs or even in private, others are developed in
big teams in the context of major projects. While a newbie, writing his
first extension, may hassle with some first-time problems concerning TYPO3,
many big projects are based on homemade Frameworks. So style and
architecture of today's extensions are quite inhomogeneous. Hence it is
often very difficult to extend or modify existing Extensions for own
projects: Before being able to do so, you have to intensively dig into the
way of thinking and programming of the respective author or team of
authors.

It's one of the aims of Extbase to reduce this inconsistency in
extensions. Approved paradigms of programming lead to fast success for
newbies and protect Developers from having to deal with complex database
queries or potential security holes like SQL-Injections or XSS-Attacks.
Based on Extbase small Extensions as well as big projects can be realized in
a well-structured way.

Extbase is based on four interconnected and complementary paradigms,
which we like to present in this chapter. You'll find these during the whole
project cycle, from planning to realization and maintenance of your
extension:

* Object-Oriented Programming (OOP): describes how to encapsulate
  associated real world aspects to abstract objects in a software
* Domain-Driven Design (DDD): Goal of this Approach of developing
  is to transcribe terms, rules and actions of the problem at hand in an
  adequate way.
* Model-View-Controller (MVC): This programming paradigm leads to
  a clear isolation of data, control of actions and logic of
  interaction.
* Test-Driven Development (TDD): This approach is a basic
  technique for generating code being stable, resilient to errors and
  legible - and therefore maintainable.

Each of these four paradigms are well known in professional
software development and more or less widespread. This results in a big
advantage when using Extbase. Until now an expert in developing TYPO3
extensions was mainly an expert in usage (and by-passing) of the application
programming interface (API) of TYPO3. Extbase in contrast will demand
additional knowledge and skills in domains that are useful and effective far
beyond the TYPO3 Community. Thus you can access an extensive accumulation of
experience in form of books, forums or personal contacts – an important
aspect of the future of TYPO3.

Knowledge in Object-Oriented Programming, Domain-Driven Design and the
MVC-paradigm is essential for working with extbase. Knowledge of Test-Driven
Development is not absolutely necessary for understanding nor using extbase.
Nevertheless we like to warmly recommend this technique of
developing.

.. toctree::
	:maxdepth: 2

	1-Object-oriented Programming-in-PHP
	2-Domain-Driven-Design
	3-Model-View-Controller-in-Extbase
	4-Test-Driven-Development
	5-Conclusion