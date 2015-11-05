.. include:: ../Includes.txt

.. todo I think we can remove this chapter

Migration to FLOW3 and TYPO3 v5
===============================

Extbase and FLOW3 have many similarities, because at last Extbase is a port of some FLOW3 concept
for TYPO3 v4. The structure of an extension is already extensive based on the package structure
of FLOW3 packages (see appendix A). Also the basically approach of the domain driven design and
its support by Extbase is solved just as is FLOW3. Also the design pattern *Model-View-Controller*
is implemented similiar on both platforms. Because so many concepts of FLOW3 are found in Extbase,
extensions based on this almost looks like FLOW3 packages and uses as far as possible the same
interfaces. This is a great advantage also for the migration of data and extension code.

Even if the concept are very similar from the development view, the internal implementation
has great differences especially in the persistence layer. Because TYPO3 v4 is implemented based
on a relational database schema, Extbase must be compatible to it. However in FLOW3 the internal
data storage is completely apart from the developer.

Extbase does not implement all core concepts of FLOW3. Especially dependency injection and aspect
oriented programming can be found in FLOW3, but not in Extbase. Therefore there is the question
how easy a migration of an Extbase based extension to FLOW3 is practicable.

As Extensions based on Extbase mostly uses the same API as FLOW3 packages, a migration of the
source code is quite easy. For this a wizard should be offered, that for example generate
FLOW3 equivalent class names with namespaces out of the Extbase class names. Probable the
conversion will be two pass: First the wizard converts automatically many parts of the code
and then checks the extension source code for places that must be rewritten for using by FLOW3.
This could be for example count for own repositories, if there are manually created SQL queries.

Not only the source code of the extension is important - also the data that are originated
during their usage. Also these would be converted mostly because they are represented by
the domain model, that looks the same (with little syntactical differences) in Extbase and FLOW3.

Extbase is a bridge technology - we hope that with this book you have no shrinking, to use
it for solving your problems. Now where you know Extbase better, the change to FLOW3 will be
no problem: you have gone already 70% of the way.

We will be happy about your comments, suggestions and assistance. You will find us in the
newsgroup *typo3.projects.typo3v4mvc* at *lists.typo3.org* - we look forward for your feedback!

