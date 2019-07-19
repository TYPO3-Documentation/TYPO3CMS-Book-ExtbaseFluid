.. review information:
   - language: ok (corrected May/14 2019)

.. include:: ../Includes.txt

.. _persistence:

Setting up the Persistence Layer
================================

As discussed in previous chapters, it is the persistence layer which
takes care of conserving domain objects. In this chapter we
will describe the necessary steps for doing that.

It is important to get a grasp of the lifecycle of a domain object to fully
understand the persistence layer. When instantiating a domain object we essentially
store it in memory. At that time, it is in
a transient, i.e. volatile, state. When TYPO3 delivered the rendered website
the the allocated memory is freed up by PHP and may be overwritten with
other data. Thereby the saved data will be lost together with the domain object.

.. note::

   You can read more about the lifecycle of objects in the chapter
   :ref:`object-lifecyle`

If domain objects should be available within several page loads they have to be
transferred into a persistent state. This is being done in Extbase by putting
the domain objects into a repository. Part of job of the repository is to
ensure that the integrity of the data is maintained at all times by storing
the information into persistent data storage. Typically, this is the database
which is being used by TYPO3.

This chapter deals with the steps that have to be taken to make the data
enclosed by a domain object persistent. Firstly, the domain objects
have to be prepared to make them persistable by the underlying database. Most
extensions get their input data through the backend, thus the input forms which
receive the data have to be configured. Subsequently, the repositories are
created which serve as an interface to the domain object.

Those steps are sufficient for most of the simple extensions, however,
bigger projects often need more complex queries to the persistence layer as
you will see with the example extension *SjrOffers*. This extension
handles offers for specific age groups.
An example would be something like "Please show me all existing offers for a
5-years child close to the town centre". It should be possible to make such a
request through the website, which should contain an input form. This form then
sends the request to the extension. There, the repository will compile the
appropriate offers and send them back to the website. We will implement
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
