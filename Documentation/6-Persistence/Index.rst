.. review information:
- language: ok (corrected May/14 2019)

.. include:: ../Includes.txt

.. _persistence:

Setting up the Persistence Layer
================================

As discussed in previous chapters, it is the persistence layer that
takes care of conserving domain objects. In this chapter, we
will describe the necessary steps for doing that.

It is important to understand the lifecycle of a domain object to
understand the persistence layer fully. When we instantiate a domain object, we essentially
store it in memory. It is then in a transient (or volatile) state.
When TYPO3 delivers the rendered website, PHP frees up this allocated memory.
This means that the saved data will be lost and thus also the domain object.

.. note::

   You can read more about the lifecycle of objects in the chapter
   :ref:`object-lifecycle`

Domain Objects need to be transferred into a persistent state if the need to be available
across several page loads. This is done in Extbase by putting
the Domain objects into a Repository. When the script finished its work,
the Repository saves the volatile data in a persistent state.
Normally, this is the database that is used by TYPO3 but may, for example,
also, be a text file.

This chapter deals with the necessary steps to persist the data
of a Domain Object. First, the Domain Objects
have to be prepared to make them persistable in the underlying database. Most
extensions get their input data from the Backend; thus, the input forms that
receive the data must be configured. Subsequently, the Repositories which serve
as an interface to the Domain Object are created.

Those steps are sufficient for most of the simple extensions. However,
bigger projects often need more complex queries to the persistence layer, as
you will see with the example extension *SjrOffers*. This exemplary extension
deals with leisure and educational offers for parents or teenagers.
An example request would be something like, "Please show me all existing offers for a
5-years child close to the town centre". It should be possible to make such a
request through the website, containing an input form. This form then
sends the request to the extension. There, the Repository will retrieve the
appropriate offers and send them back to the website. Thus, we will implement
the method ``findDemanded($demand)`` in a final step to find those offers.

Let's start with the database.

.. toctree::
   :hidden:

   1-prepare-the-database
   2-configure-the-backends-inputforms
   2a-creating-the-repositories
   3-implement-individual-database-queries
   4-use-foreign-data-sources
   5-modeling-the-class-hierarchy
