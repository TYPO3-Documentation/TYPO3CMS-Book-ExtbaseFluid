.. include:: ../Includes.txt

Structure of this book
======================

This chapter is structured into ten subchapters and three appendices. The
chapters discuss the following topics:

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
is created and progresses through the different system stages until it is
displayed.

In chapter 4, *Creating a first extension*, we show
you a minimal extension. With this extension, data is managed through the
TYPO3 backend and displayed in the Frontend.

Chapter 5, *Modeling the Domain*, shows
Domain-Driven Design with a practical example. It shows how a model can be
planned and implemented.

Once the domain model is finished, the necessary TYPO3 infrastructure
must be created: database tables and backend editing forms. The relevant
information is explained in chapter 6, *Setting up the persistence
layer*.

After chapters 5 and 6 have explained the model layer in detail, we
focus on the application flow of the extension in chapter 7,
*Controlling the flow with controllers*. These are
implemented in the controller layer.

Next, the book explains the output layer of the extension: the so-called
*view*. In chapter 8, *Styling the output with Fluid*, Fluid is explained in
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
Extensions can be ported to TYPO3 v6.

Extbase mostly uses the conventions of FLOW3. In *Appendix A, Coding Guidelines*, they are summarized.

Appendix B, *Reference of Extbase*, contains an overview of important Extbase concepts and an alphabetical listing of the API.

In Appendix C, *Reference of Fluid*, you can find a reference of all standard Fluid ViewHelpers and of the API which is needed to create your own ViewHelpers.
