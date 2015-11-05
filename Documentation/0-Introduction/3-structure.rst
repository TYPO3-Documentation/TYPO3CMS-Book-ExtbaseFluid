.. include:: ../Includes.txt

.. _structure-of-this-book:

Structure of this book
======================

This chapter is structured into ten subchapters and two appendices. The
chapters discuss the following topics:

Chapter 1, :ref:`installation`, leads you through the
installation of Extbase and Fluid. To make extension development as
effective as possible, we give suggestions for development environments as well as tips and
tricks for debugging.

Chapter 2, :ref:`basic-principles`, begins with an
overview of the concepts of object oriented programming, which
are essential for working with Extbase. After that, we dive into
Domain-Driven Design, a programming paradigm which is a core principle of
Extbase. After that, you'll learn the design pattern Model-View-Controller,
which is the technical basis of every Extbase extension. Finally, the
chapter explains Test-Driven Development to the reader.

Chapter 3, :ref:`a-journey-through-the-blog-example`,
should give you a feeling how the concepts from chapter two are implemented
in Extbase. Based on a provided example extension, we explain how a blog post
is created and progresses through the different system stages until it is
displayed.

In chapter 4, :ref:`creating-a-first-extension`, we show
you a minimal extension. With this extension, data is managed through the
TYPO3 backend and displayed in the Frontend.

Chapter 5, :ref:`modeling-the-domain`, shows
Domain-Driven Design with a practical example. It shows how a model can be
planned and implemented.

Once the domain model is finished, the necessary TYPO3 infrastructure
must be created: database tables and backend editing forms. The relevant
information is explained in chapter 6, :ref:`setting-up-the-persistence-layer`.

After chapters 5 and 6 have explained the model layer in detail, we
focus on the application flow of the extension in chapter 7,
:ref:`controlling-the-flow-with-controllers`. These are
implemented in the controller layer.

Next, the book explains the output layer of the extension: the so-called
*view*. In chapter 8, :ref:`styling-the-output-with-fluid`, Fluid is explained in
detail and its function is shown through several examples. At the end of the
chapter, the sample functions are combined and demonstrated within the example
extension.

Chapter 9, *Internationalization, validation and
security*, deals with advanced topics and tasks. This includes the
multilingual capabilities of extensions, the validation of data, and the
handling of security aspects.

Chapter 10, *Outlook*, gives a glimpse into code which is currently being developed.
The focus lies on the kickstarter and the use of Extbase in the TYPO3 Backend.
Additionally, this chapter shows you parts of FLOW3 and explains how Extbase
extensions can be ported to TYPO3 v6.

Extbase mostly uses the conventions of FLOW3. In *Appendix A, Coding Guidelines*, they are summarized.

Appendix B, *Reference of Extbase*, contains an overview of important Extbase concepts and an alphabetical listing of the API.
