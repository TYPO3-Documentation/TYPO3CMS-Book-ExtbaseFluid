.. include:: /Includes.rst.txt

Command controllers
===================

Command controllers make logic available at the command line and in the scheduler backend module.

They can provide functionality for recurring tasks like mail queues, cleanups, imports and
more, which is then available for administrators and regular backend users.

.. _extbase_command_controller_creating:

Creating command controllers
----------------------------

A `CommandController` needs to be located at :file:`Classes/Command/`.
This following simple example meets the minimum requirements.

:file:`Classes/Command/SimpleCommandController.php`::

    <?php
    namespace Vendor\Example\Command;

    use \TYPO3\CMS\Extbase\Mvc\Controller\CommandController;

    class SimpleCommandController extends CommandController
    {

        public function simpleCommand()
        {

        }
    }

Requirements are:

#. Classname must match file name.
#. Class must extend :php:`\TYPO3\CMS\Extbase\Mvc\Controller\CommandController`.
#. Method names must end with `Command`.

After creation of the controller you need to register it. Add the following line to
:file:`ext_localconf.php` to let TYPO3 know about the controller.

:file:`/ext_localconf.php`::

    <?php

    if (TYPO3_MODE === 'BE') {
        $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['extbase']['commandControllers']['ExtensionName-MeaningFullName'] =
            \Vendor\ExtKey\Command\SimpleCommandController::class;
    }

.. _extbase_command_controller_calling:

Calling commands
----------------

Clear the backend-cache to complete the registration. Once a command is registered and available, you can check the availability by calling
`
/cli_dispatch.phpsh extbase help`.

The output should look like::

    EXTENSION "EXAMPLE":
    -------------------------------------------------------------------------------
      simple:simple

To execute your command call `typo3/cli_dispatch.phpsh extbase simple:simple`.

.. note::

    Commands are running in TYPO3 Backend context.
    Therefore you cannot directly access TypoScript of frontend pages
    for example.

.. Todo: Document how to configure command controller.

.. _extbase_command_controller_arguments:

Command arguments
-----------------

Some commands need to be flexible and therefore need some arguments which may be optional
or required.

As with `ActionController` you can define them the same way::

    /**
     * @param int $required
     * @param bool $optional
     */
    public function argumentsCommand($required, $optional = false)
    {

    }

As soon as you have parameter for your command, you must document them, to enable TYPO3 to detect
there types for mapping, and whether they are required or not. To make an argument optional, provide
a default value.

TYPO3 will map the incoming values to the documented type.

You can check whether the documentation is correct, by calling `typo3/cli_dispatch.phpsh extbase help
simple:arguments`. The result will be something like:

.. code-block:: none

    COMMAND:
      example:simple:arguments

    USAGE:
      /typo3/cli_dispatch.phpsh typo3/cli_dispatch.phpsh extbase simple:arguments [<options>] <required>

    ARGUMENTS:
      --required

    OPTIONS:
      --optional

.. _extbase_command_controller_documentation:

Command documentation
---------------------

So far you have provided information on what the command and its arguments. To help others, you
may want to provide further information within the PHPDoc that is to be displayed on the
commandline::

    /**
     * This is a short description.
     *
     * This will be further information available to everyone asking for it
     * from the cli.
     *
     * @param int $required This is an required argument.
     * @param bool $optional And this is an optional argument.
     */
    public function argumentsCommand($required, $optional = false)
    {

    }

The information is shown when calling `typo3/cli_dispatch.phpsh extbase help
simple:arguments`:

.. code-block:: none

    This is a short description.

    COMMAND:
      example:simple:arguments

    USAGE:
      /typo3/cli_dispatch.phpsh typo3/cli_dispatch.phpsh extbase simple:arguments [<options>] <required>

    ARGUMENTS:
      --required           This is an required argument.

    OPTIONS:
      --optional           And this is an optional argument.

    DESCRIPTION:
      This will be further information available to everyone asking for it
      from the cli.
