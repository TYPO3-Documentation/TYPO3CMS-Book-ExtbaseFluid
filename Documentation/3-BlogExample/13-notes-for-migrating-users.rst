Notes for migrating users
========================================

This section is for developer which have already get some experience
with the traditional extension development. Should this apply to you, you
will find tips for the change here. If you are new to get on the programming
of extensions you confidently skip this section. The previous manner what we
calle "traditionel" here, even though it can be used furthermore equal is
characterized by:

* the structure of directories, files and classes oriented for
  (frontend) plugins and (backend) modules and accordingly.
* the highly mixture of tasks inside less classes (which are most
  called ``pi1, pi2`` and so on),
* the usage of methods of the base ``class
  tslib_pibase``, from which the most classes have to inherit from,
  as well as
* the creation of extensions centered to database tables with the kickstarter.

All mentioned points are changing by extbase on a more or
less radical manner. The complete development of an extension concentrates
on the domain of the problem - whose terms, sequences, rules and think
pattern. Objects from the real world, like customer, invoice, member, rental
car, foods and so on are come out as so called domain objects inside the
extension. In relation to this,plugins and modules are playing a minor- more
on input and output related role.

Plugins and modules in extbase are not their own classes, but rather
"virtual" collections of actions which can be apply to the domain objects.
The displaying of a list of posts or the changing of a blog title are
examples for such actions, which are found as methods - also called actions
- in the extension. Were plugins and modules are so far stored as class
files in own directories (*pi1, pi2* and
*mod*), you will find them now exclusively as
configuration in the two files *ext_localconf.php* and
*ext_tables.php*. In *ext_tables.php*
a plugin or module can be registered for selecting it in the backend. In the
*ext_localconf.php* consists the configuration of the
action which can be called. How to register and configure plugins and
modules we will explain in detail in the section "Configuring and embedding
Frontend Plugins" in chapter 7.

All actions based on a domain object are combined in an own object,
the controller. For example, all actions that display a blog, change it,
delete it and so on are combined in the ``BlogController``. One
action is defined as the standard action. These action is called when
nothing else is defined by the user of the web site. This default action is
the equivalent to the method ``main()`` inside a traditional plug
in class. Inside ``main()`` so far often was made the selection
which action (for example the list view, single view, archive view, create a
new news entry) should be called. Extbase moved the decision outside of your
extension in to the conneced dispatcher. This results in an increased
flexibility and modularity inside your extension.

Table 3-2 shows a comparison of the directory structures and
configuration files. On the left are the typical places of the most
important files of a traditional extension, right aside you find the
corresponding places and files, how they are used in extbase.

*Table 3-2: Comparison of the directory structures and
configuration files ("EXT:" stands for the path to the extension
directory.)*

<table>

<thead>
<tr>
<th>What</th>

<th>So far</th>

<th>With extbase</th>
</tr>
</thead>

<tbody>
<tr>
<td>Basic configuration files</td>

<td>Files *ext_** on top level in the extension folder</td>

<td>Location as before; Changes in the contents (see below)</td>
</tr>

<tr>
<td>Configuration of a plugin</td>

<td>In *ext_localconf.php*:
``t3lib_extMgm::addPItoST43()``
In *ext_tables.php*:
``t3lib_extMgm::addPlugin()``</td>

<td>In *ext_localconf.php*:
``Tx_Extbase_Utility_Extension::configurePlugin()``
(see "Configuring and embedding Frontend Plugins" in chapter 7)
In *ext_tables.php*:
``Tx_Extbase_Utility_Extension::registerPlugin()``
(see "Configuring and embedding Frontend Plugins" in chapter 7)</td>
</tr>

<tr>
<td>Configuration of database tables</td>

<td>SQL definition in *ext_tables.sql*</td>

<td>As before; Pay attention for the naming conventions of table 
and field names (see chapter 6)</td>
</tr>

<tr>
<td>Configuration of the backend</td>

<td>Basic configuration in *ext_tables.php*
TCA default in *EXT:my_ext/tca.php;*
Location configurable in *ext_tables.php*</td>

<td>As before</td>
</tr>

<tr>
<td>User configuration</td>

<td>TypoScript in *EXT:my_ext/static/constants.txt* 
and *EXT:my_ext/static/setup.txt;*
Location configurable in *ext_localconf.php*</td>

<td>TypoScript in *EXT:my_ext/Configuration/TypoScript/constants.txt* 
and *EXT:my_ext/Configuration/TypoScript/setup.txt;*
Location configurable in *ext_localconf.php*</td>
</tr>
</tbody>
</table>

