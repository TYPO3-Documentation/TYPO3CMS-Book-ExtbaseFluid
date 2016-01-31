.. include:: ../Includes.txt
.. _extbase_command_controller_about:

Command controllers
===================

Command controllers will make logic available to the command line and the scheduler backend module.

This way, you can provide functionality for recurring tasks like mail queues, clean ups, imports and
others, to administrators and backend users.

.. _extbase_command_controller_creating:

Creating command controllers
----------------------------

`CommandController` are located at :file:`/Classes/Command/`.
This is a simple example, meeting the minimum requirements.

:file:`/Classes/Command/SimpleCommandController.php`::

    <?php
    namespace Vendor\Example\Command;

    use \TYPO3\CMS\Extbase\Mvc\Controller\CommandController;

    class SimpleCommandController extends CommandController
    {

        public function simpleCommand()
        {

        }
    }

The requirements are:

#. Classname must match file name.
#. Class must extend :class:`\\TYPO3\\CMS\\Extbase\\Mvc\\Controller\\CommandController`.
#. Method name must end with `Command`.

After creating the controller, you need to register him. Add the following line to
:file:`ext_localconf.php` to let TYPO3 know about the controller.

:file:`/ext_localconf.php`::

    <?php

    if (TYPO3_MODE === 'BE') {
        $GLOBALS['TYPO3_CONF_VARS']['SC_OPTIONS']['extbase']['commandControllers'][$_EXTKEY] =
            \Vendor\Example\Command\SimpleCommandController::class;
    }

.. _extbase_command_controller_calling:

Calling commands
----------------

Once a command is registered and available, you can check the availability by calling
`typo3/cli_dispatch.phpsh extbase help`.

The output should look like::

    EXTENSION "EXAMPLE":
    -------------------------------------------------------------------------------
      simple:simple

To call your command, call `typo3/cli_dispatch.phpsh extbase simple:simple`.

.. note::

    Commands are run within TYPO3 Backend mode. So there is no Frontend and therefore no page from
    where TypoScript can be fetched.

.. Todo:

    Document how to configure command controller.

.. _extbase_command_controller_arguments:

Command arguments
-----------------

Some commands will be flexible and therefore need some arguments, some are optional and some are
required.

As with `ActionController`, you can define them the same way::

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

You can check whether the documentation worked, by calling `typo3/cli_dispatch.phpsh extbase help
simple:arguments`. The result will be something like::

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

Until now, you have to know what the command does and what the arguments mean. To hep others, you
can provide further information within the PHPDoc, that will be displayed on CLI::

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

This further information will be displayed like `typo3/cli_dispatch.phpsh extbase help
simple:arguments`::

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
