.. ---------------------------------------------------
.. Review information for this page:
.. Review Status: ok
.. Last reviewed: July 14 2019 for TYPO3 version 9.5.7
.. ---------------------------------------------------

.. include:: ../Includes.txt

=============================
Install TYPO3, Extbase, Fluid
=============================

System Requirements
===================

You will need a web server like Apache or Nginx with PHP and a database (e.g. MySQL). See
:ref:`t3install:system-requirements` in the "Installation and Upgrade Guide".

Alternatives
------------

If you do not have a system available, that meets these requirements, there
are several alternatives:

XAMPP
~~~~~

You can use the **XAMPP** package (http://www.apachefriends.org/xampp.html). It
will install Apache, PHP, MySQL and other useful tools on all established
operating systems (Linux, Windows, Mac OS X).

DDEV
~~~~

You can **setup TYPO3 with DDEV**, which provides several pre-configured environments
based on Docker, including TYPO3.

You can follow the instructions on the
`DDEV page: TYPO3 Quickstart <https://ddev.readthedocs.io/en/latest/users/cli-usage/#typo3-quickstart>`__

:ref:`t3contrib:ddev` in the contribution
guide contains some more information about how to setup TYPO3 with DDEV.
The first step (git clone) is different from the explanation on the DDEV
page. but
instead of `git clone` in the first
step, you can download a release from https://get.typo3.org to setup without Composer
or setup with Composer as described on the DDEV page.

Install TYPO3
=============

The installation guide contains installation instructions:
:ref:`t3install:quick-installation`.



Install Extbase & Fluid
=======================

Without Composer
----------------

On non Composer based installations, the system extensions extbase and fluid are
already included. Activate them in the Extension Manager.

.. seealso::

   * :ref:`t3install:install-extension-without-composer` (Installation Guide)

With Composer
-------------

Since TYPO3 9 and the "subtree split" individual system extensions are installed
separately, e.g.:

.. code-block:: shell

    composer require typo3/cms-extbase:~9.5.5 typo3/cms-extbase:~9.5.5

Activate the extensions:

.. code-block:: shell

    ./vendor/bin/typo3 extension:activate extbase
    ./vendor/bin/typo3 extension:activate fluid

.. seealso::

   * `Composer: version constraints <https://getcomposer.org/doc/articles/versions.md>`__
   * :ref:`t3install:install-extension-with-composer` (Installation Guide)



