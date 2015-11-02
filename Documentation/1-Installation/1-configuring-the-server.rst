.. include:: ../Includes.txt

Configuring the Server
======================

Since TYPO3 is written in the PHP scrpting language, you will need a
webserver like Apache with PHP (version 5.2 or 5.3) support, for your TYPO3
development. Additionally TYPO3 requires a MySQL database for data storage.
If you don't have a local development server yet, we recommend the XAMPP
package (*http://www.apachefriends.org/xampp.html*). It
will install Apache, PHP, MySQL and other useful tools on all established
operating systems (Linux, Windows, Mac OS X). Now you can install TYPO3 on
your test system.

For production systems you are advised to use a PHP Opcode Cache like
eAccelerator (*http://eaccelerator.net*), as it caches
the compiled PHP code often reducing script loading times by more than half.
By default eAccelerator will not cache PHP comments. However, as Extbase
uses these comments to retrieve important information, eAccelerator must not
omit them. To achieve this you need to configure eAccelerator with the
option ``--with-eaccelerator-doc-comment-inclusion``. A complete
installation of eAccelerator will then work as follows: First download the
eAccelerator source code and navigate to the source directory using the
console. You have to adjust the eAccelerator source to your installed PHP
version by running the command ``phpize``. After this you can
configure the eAccelerator source code not to remove the PHP comments by
running ``./configure --with-eaccelerator-doc-comment-inclusion``.
Now compile eAccelerator with the command ``make``. To finish the
installation run ``make install`` as the *root*
user.

It might be neccessary to adjust your PHP configuration to load
eAccelerator. Now you can check if your source code comments are preserved
by using a TYPO3 instance. Install the *extbase*
Extension in the TYPO3 backend by using the Extension Manager and then open
the *Reports* module. Select the *Status
Report* submodule and have a look at the
*extbase* section, which will tell you whether the PHP
comments are preserved or not.

.. figure:: /Images/1-Installation/figure-1-1.png
	:height: 400px
	:align: center

	Figure 1-1: In the Reports-Module you can check if Extbase has access
	to the source code comments of the PHP files.