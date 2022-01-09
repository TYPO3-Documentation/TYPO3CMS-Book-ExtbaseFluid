.. include:: ../Includes.txt

.. _the-application-domain:

======================
The Application Domain
======================

The main difference to the common approach to develop an extension is
the concentration to the domain of the client - in our case to the domain of
the offer management inside the Stadtjugendrings Stuttgart. First the
essential core terms are to be extracted with which the employees of the
Stadtjugendring interact daily. Terms of the domain of the content
management system (e.g. "list view" or "search") are not playing roles by
this. After a first project meeting with the contact persons of the SJR
following characteristics were defined:


* Every member organization can edit their contact data via the front end.
* Every member organization can add, edit and delete their offers.
  The offers can be searched by the users and filtered by several criteria. Filter criteria are specially:

  - the duration of validity of the offer

  - the target audience for which the offer is straightened (mostly
    the age span, but also physical handicapped, swimmer and so on)

  - the target area for which the offer may be for interest (one or
    more city districts, nationwide), as well as

  - a free selectable category to which the offer is counted among
    (e.g. "sport offer" or "spare time")

* The offers are output in list form and single view in the front end.
* A single organization can be shown with its offers in a view.
* The offers can be collected to a flyer which contains all information to the offers.

.. figure:: /Images/5-Domain/figure-5-1.png
   :align: center

   Figure 5-1: The still incoherent terms of the domain

These terms are the result of a process. Some of them are modified
many times during the discussions. So the first chosen term of
*vendor* developed to the term
*organization*. Thereby a part was that the domain of the
offer management not exist isolated inside the SJR. It is in fact embedded
in the whole business. And there the term of member organization (or short
*organization*) make more sense.

.. TODO: check if vendor is the right term

.. tip::

   This development of a common language of developers (also ourselves)
   and domain experts (also the employees of the SJR) maybe is the most
   important part of the Domain Driven Design. In the literature you find the
   slightly bulky term **Ubiquitous Language**. Requirement
   for this process is that the developers communicate with the
   domain experts.

First of all the located rules and operations are written down:

* "An offer can be assigned to multiple townships if they are
  located in whose catchment area."
* "An organization can be assigned with multiple contact persons."
* "An offer can be assigned with a contact person. The contact
  persons of the organization are shown as selection."
* "Is there an offer without a contact person, the main contact
  of the organization is mentioned."
* "An offer can show different attendance fees (e.g. for member
  and non member)."

The terms and rules are taken in relationship now. From the
past thoughts a first draft of the domain is made, which you can see in
figure 5-2. Every rectangle emblematise an object of the domain. The lower
half of the bin shows an extract of its properties. Properties in
*italic* writing of a parent object are holding
references to the child objects. The chaining lines with an arrow point to
those parent child relations. An additional rhomb symbolized an
*aggregate*, also a package of child objects.

.. figure:: /Images/5-Domain/figure-5-2.png
   :align: center

   Figure 5-2: First draft of the domain.

.. tip::

   This figure was created by a drawing program. In the communication
   with the customer we are aware of using drawing programs or UML tools,
   which would be constrict the workflow in this phase. Simple hand drafts
   are enough and are more accessible for the customer as technical
   diagrams.

.. tip::

   You should have noticed that we make a big point of using a common
   language between developer and domain experts at the begin of the section
   and now we use permanent english descriptions for classes, methods and
   properties. Our experience told us that in the life time of an extension
   also developer get in contact with the source code, which are not potent
   to understand other languages as their own language and english. To not
   exclude them without change effort we choose english as lingua franca of
   the source code. This is especially true for extensions that - like our
   case - are made public via the extension repository.

Let us improve the first draft of the domain model. The offer has
several property pairs, that belong together:

* `minimumAge` and `maximumAge` (the minimal
  and maximal age)
* `minimumAttendants` and
* `maximumAttendants` (the minimal and maximal count of attendees)
* `firstDate` and `lastDate` (date of beginning and end)

These property pairs are subject to own rules, that are not
part of a single property. The minimal age limit (`minimumAge`)
for example should not be greater than the maximum age limit
(`maximumAge`). The observation of this rule can be done by the
offer itself by a corresponding validation. But it rather belongs to the
property pair. We store each property pair in an own domain object:
`AgeRange`, `AttendanceRange` and
`DateRange`. The outcome of this is the optimized second draft
(see figure 5-3).

.. figure:: /Images/5-Domain/figure-5-3.png
   :align: center

   Figure 5-3: Second draft of the domain.

The specific domain objects have a common property, they have a lower
and upper value. With this we can insert a class hierarchy in which the
three domain objects succeed these common property from a domain object
`RangeConstraint`. This has two generic properties:
`minimumValue` and `maximumValue` (see figure
5-4).

.. figure:: /Images/5-Domain/figure-5-4.png
   :align: center

   Figure 5-4: Third draft of the domain.

Our domain model has reached a certain level of maturity. Of course
there is certain space for more optimization. The risk exists, that we lose
in the details, which will be irrelevant in a later revision. We suggest that
you first implement a basic model and then - with additional knowledge of
the yet unknown details of the model - improve it step by step. Let's start
with our first lines of code.

