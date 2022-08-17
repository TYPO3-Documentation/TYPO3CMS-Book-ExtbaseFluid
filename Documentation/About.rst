.. include:: /Includes.rst.txt

.. _about:

=================
About This Manual
=================


This is an introduction to developing TYPO3 extensions with the
Extbase framework and the Fluid templating engine.

.. _target-audience:

Target Audience
===============

This book is for TYPO3 extension developers who have a basic understanding
of PHP programming and experience working with and administering TYPO3.

We are aiming at the following target audiences.

* Beginners who want to use Extbase and Fluid right as a basis for their extensions.
* Experienced developers who want to learn Extbase and Fluid before beginning a new project.
* Decision makers who want to gain a technical overview of the new framework.

.. _structure-of-this-book:

Structure of this book
======================

This chapter is structured into ten main chapters, some additional smaller chapters,
and three appendices. The chapters discuss the following topics:

.. **Introduction**

* :ref:`introduction` is a very brief introduction to the topic Extbase and Fluid.

.. **Basic principles**

* :ref:`basic-principles` begins with an
  overview of object-oriented programming concepts, which
  are essential for working with Extbase. After that, we dive into
  domain-driven design, a programming paradigm that is a core principle of
  Extbase. After that, you'll learn the design pattern model-view-controller,
  which is the technical basis of every Extbase Extension. Finally, the
  chapter explains test-driven development to the reader.

.. getting started

.. **Installation**

* :ref:`installation` leads you through the
  installation of Extbase and Fluid. To make extension development as
  effective as possible, we give suggestions for development environments and tips and
  tricks for debugging.

.. In chapter 4, **Creating a first extension**

* In :ref:`creating-store-inventory-extension`, we show
  you a minimal extension. With this extension, data is managed through the
  TYPO3 backend and displayed in the frontend.

.. Chapter 5, **Modeling the Domain**,

* :ref:`modeling-the-domain` shows
  domain-driven design with a practical example. It shows how a model can be
  planned and implemented.

.. Chapter 6, **Setting up the persistence layer**

* :ref:`persistence`
  Once the domain model is finished, the necessary TYPO3 infrastructure
  must be created: database tables and backend editing forms.

.. Chapter 7, **Controlling the flow with controllers**

* :ref:`controllers`
  After chapters 5 and 6 have explained the model layer in detail, we
  focus on the *controller* layer of the extension.

.. Chapter 8, **Styling the output with Fluid**

* :ref:`fluid-start`
  Next, this book explains the output layer of the extension: the so-called
  *view*. Fluid is explained, and several examples are given. At the end of the
  chapter, the sample functions are combined and demonstrated within the example
  extension.

.. Chapter 9, **Internationalization, validation and security**,

* :ref:`internationalization` deals with advanced topics and tasks. This includes the
  multilingual capabilities of extensions, data validation, and the
  handling of security aspects.

After the main chapters, several smaller chapters give insight into additional
Extbase features:

* *Backend Modules*: This now directly links to the chapter
  :ref:`t3coreapi:backend-modules-api` in "TYPO3 Explained"
* :ref:`extbase_command_controller_about`: This chapter also links
  to "TYPO3 Explained", as the information is now maintained there.
* :ref:`property-mapper`

Additional information is contained in several appendices:

* Appendix A, **Coding Guidelines**: Extbase mostly uses the conventions of FLOW.
* Appendix B, **Reference of Extbase**, contains an overview of important Extbase
  concepts and an API's alphabetical listing.
* Appendix C, **Fluid Viewhelpers**, links to the ViewHelper reference

.. _typographic-conventions:

Typographic conventions
=======================

This book uses the following typographic conventions:

:file:`File names and directories`

**emphasized content**

:php:`inline php code, such as class names, method names`,


.. note::

   This stands for a piece of general advice or hint.

.. tip::

   This stands for a tip or a suggestion.

.. warning::

   With this symbol, certain special behavior is explained, which could
   lead to problems or impose a risk.


.. _credits:

Credits
=======

The original version of this manual was a hardcover book in German with
the title "Zukunftssichere TYPO3-Extensions mit Extbase und Fluid" by
Jochen Rau and Sebastian Kurfürst.
This book was translated into English by the TYPO3 community.

The latest version of the book (second edition) targeted TYPO3 v6.2.

Meanwhile, the book is no longer an exact translation. Several
the TYPO3 community made changes to reflect
considerable changes in the TYPO3
Core, some parts were removed, added, or moved to other manuals.
It has - in parts - been completely rewritten.

.. todo: add some thanks to other contributors?

.. _thanks:

Thanks From Jochen and Sebastian
--------------------------------

Above all, we want to thank our families and partners for their
understanding and their support when we spent our afternoons and evenings
with the book instead of with them. Also, our customers had to be patient
from time to time, when we developed Extbase or wrote the book instead
of working on their project.

TYPO3 would not exist without the dedication and vision of Kasper
Skårhøj and without the tireless work of all community members, especially
the TYPO3 Core Team. Here, we specifically want to thank the members who
discovered and implemented many future-proof technologies for TYPO3 v6.
Extbase would not be possible without this inspiration and
these guidelines.

Also, when creating the book, we had generous support: a thank you
goes to Patrick Lobacher, as he wrote the section about Object
Oriented Programming.

Our special thanks go to our editors, Alexandra Follenius and
Inken Kiupel, who gave us a lot of feedback and comments on our texts, and
thus had a significant impact on the creating of this book. Also, we want to
thank the many unknown helping hands at O'Reilly, who ultimately created
this book.

Additionally, you are right now reading the English version of this
book, so we want to thank our translators for the dedication and work they
have put into this project over the last months!

Last but not least, we want to thank you: That you want to use
Extbase and Fluid!
