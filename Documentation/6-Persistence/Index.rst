.. include:: ../Includes.txt

Setting up the persistence layer
================================

As already insinuated in previous chapters it is the Persistence Layer which
takes care about conserving Domain Objects durably. Thus, in this chapter we
will discuss the steps being important for doing that.

It is important to get a grasp of the lifecycle of a Domain Object to fully
understand the Persistence Layer. When instantiating a Domain Object we essentially
put its data into a certain sector of the Main Memory. At that time, it is in
a transient, i.e. volatile, state. When TYPO3 delivered the rendered website
the sector of the Main Memory is freed by PHP and may be overwritten with
other data. Thereby the saved data will be lost together with the Domain Object.

.. note::

   You can read more about the lifecycle of objects in Chapter 2 "Lifecycle of Objects".

If Domain Objects should be available within several page loads they have to be
transferred into a persistent state. This is being done in Extbase by putting
the Domain objects into a Repository. When the script is finished doing its work,
the Repository takes care about saving the volatile data in a durable saving state.
Normally this is the database which is used by TYPO3 but may, for example,
also be a text file.

This chapter deals with the steps that have to be taken to make the data
enclosed by a Domain Object durably persistent. Firstly, the Domain Objects
have to be prepared to make them persistable by the underlying database. Most
extensions get their input data through the Backend, thus the input forms which
receive the data have to be configured. Subsequently, the Repositories are
created which serve as an interface to the Domain Object.

Those steps are sufficient for most of the simple extensions, however,
bigger projects often need more complex queries to the Persistence Layer as
you will see with the example extension *SjrOffers*. This exemplary extension
serves with offers for parents or teenagers for satisfying their certain needs.
An example would be something like "Please show me all existing offers for a
5-years child close to the town centre". It should be possible to make such a
request through the website, which should contain an input form. This form then
sends the request to the extension. There, the Repository will compile the
appropriate offers and send them back to the website. Thus, we will implement
the method ``findDemanded($demand)`` in a final step to find those offers.
Let's start with the database.

.. toctree::
   :maxdepth: 2

   1-prepare-the-database
   2-configure-the-backends-inputforms
   3-implement-individual-database-queries
   4-use-foreign-data-sources
   5-modeling-the-class-hierarchy
