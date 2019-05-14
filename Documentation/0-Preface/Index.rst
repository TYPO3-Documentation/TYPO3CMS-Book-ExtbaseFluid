.. review information:
   - language: ok (corrected May/14 2019)


.. include:: ../Includes.txt

=======
Preface
=======

.. _about:

About This Manual
=================

This is an introduction into developing TYPO3 extensions with the
Extbase framework and the Fluid templating engine.

.. _target-audience:

Target Audience
===============

This book is for TYPO3 extension developers who have a basic understanding
of PHP programming and experience working with and administering TYPO3.

We are aiming at the following target audiences.

* Beginners, who want to use Extbase and Fluid right as a basis for their own extensions.
* Experienced developers, who want to learn Extbase and Fluid before beginning a new project.
* Decision makers, who want to gain a technical overview of the new framework.

.. _structure-of-this-book:

Structure of this book
======================

This chapter is structured into ten main chapters, some additional smaller chapters
and three appendices. The chapters discuss the following topics:

Chapter 1, *Installation*, leads you through the
installation of Extbase and Fluid. To make extension development as
effective as possible, we give suggestions for development environments as well as tips and
tricks for debugging.

Chapter 2, *Basic principles*, begins with an
overview of the concepts of object oriented programming, which
are essential for working with Extbase. After that, we dive into
Domain-Driven Design, a programming paradigm which is a core principle of
Extbase. After that, you'll learn the design pattern Model-View-Controller,
which is the technical basis of every Extbase Extension. Finally, the
chapter explains Test-Driven Development to the reader.

Chapter 3, *Journey through the Blog Example*,
should give you a feeling how the concepts from chapter 2 are implemented
in Extbase. Based on a provided example extension, we explain how a blog post
is created and progresses through various stages until it is
displayed.

In chapter 4, *Creating a first extension*, we show
you a minimal extension. With this extension, data is managed through the
TYPO3 backend and displayed in the frontend.

Chapter 5, *Modeling the Domain*, shows
Domain-Driven Design with a practical example. It shows how a model can be
planned and implemented.

Once the domain model is finished, the necessary TYPO3 infrastructure
must be created: database tables and backend editing forms. The relevant
information is explained in chapter 6, *Setting up the persistence
layer*.

After chapters 5 and 6 have explained the model layer in detail, we
focus on the *controller* layer of the extension in chapter 7,
*Controlling the flow with controllers*.

Next, the book explains the output layer of the extension: the so-called
*view*. In chapter 8, *Styling the output with Fluid*, Fluid is explained
and several examples are given. At the end of the
chapter, the sample functions are combined and demonstrated within the example
extension.

Chapter 9, *Internationalization, validation and
security*, deals with advanced topics and tasks. This includes the
multilingual capabilities of extensions, the validation of data, and the
handling of security aspects.

After the main chapters, several smaller chapters give insight into additional
extbase features:

* *Backend Modules*: This now directly links to the chapter
  :ref:`t3coreapi:backend-modules-api` in "TYPO3 Explained"
* :ref:`extbase_command_controller_about`: This chapter also links
  to "TYPO3 Explained", as the information is now maintained there.
* :ref:`property-mapper`

Additional information is contained in several appendices:

* Extbase mostly uses the conventions of FLOW. In *Appendix A, Coding Guidelines*,
  they are summarized.
* Appendix B, *Reference of Extbase*, contains an overview of important Extbase
  concepts and an alphabetical listing of the API.
* In Appendix C, *Fluid ViewHelpers*, we link to the ViewHelper reference

.. _typographic-conventions:

Typographic conventions
=======================

This book uses the following typographic conventions:

:file:`File names and directories`

**emphasized content**

:php:`inline php code, such as class names, method names`,


.. note::

   This stands for a general advice or hint.

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

The latest version of the book (second edition) targeted TYPO3 6.2.

Meanwhile, the book is no longer an exact translation. Several
changes were made by the TYPO3 community to reflect
considerable changes in the TYPO3
core, some parts were removed, added or moved to other manuals.
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
the TYPO3 core team. Here, we specifically want to thank the members who
discovered and implemented many future-proof technologies for TYPO3 v6.
Extbase would not be possible without this inspiration and
these guidelines.

Also when creating the book, we had generous support: a thank you
goes to Patrick Lobacher, as he wrote the section about Object
Oriented Programming.

Our special thanks goes to our editors, Alexandra Follenius and
Inken Kiupel, who gave us a lot of feedback and comments to our texts, and
thus had a great impact on the creating of this book. Also we want to
thank the many unknown helping hands at O'Reilly, who ultimately created
this book.

Additionally, you are right now reading the English version of this
book, so we want to thank our translators for the dedication and work they
have put into this project over the last months!

Last but not least, we want to thank you: That you want to use
Extbase and Fluid!
