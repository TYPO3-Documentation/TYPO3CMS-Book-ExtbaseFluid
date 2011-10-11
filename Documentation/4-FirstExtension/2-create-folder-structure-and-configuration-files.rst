Create Folder Structure And Configuration Files
================================================================================================

Before we write the first line of code, we must arrange the
infrastructure of the extension. Beside the folder structure there are some
minimum needed configuration files counting. We put the unique identifier of
our extension (extension-key) as <firstterm>inventory</firstterm>, and thus
we specify at the same time the name of the extension as
*Inventory*.

.. tip::
	The name of an extension is always written in
	*UpperCamelCase* (beginning with a capital letter, then
	upper and lower letters; no underscore), while the extension key may only
	contain small letters and underscore (lower_underscore). You will find an
	overview of the name conventions in appendix A, *Coding
	Guidelines*.

Extensions can be stored at different places in TYPO3. Locally
installed extensions are the rule. These are in the folder
<filename>typo3conf/ext/</filename>. Globaly installed extensions are
available to all websites using the same installation. They are stored in
<filename>typo3/ext/</filename>. System extensions are delivered with the
TYPO3-distribution and are in the folder *typo3/sysext/*.
Extbase or Fluid are examples of system extensions. All three paths are
below the installation folder of TYPO3, in which also lies the file
index.php.

Then, in the folder for local extensions
<filename>typo3conf/ext/</filename> we create the folder
*<filename>inventory</filename>*. The name of this folder
must be written like the extension key and therefore in lower-case letters,
and where appropriate, with underscores. On the uppermost level lie the
folders *Classes* and *Resources*. The
folder *<filename>Classes</filename>* contains all PHP
classes, with the exception of external PHP libraries. The folder
*<filename>Resources</filename>* contains all other files
that are also processed by our extension (e.g. HTML templates) or delivered
directly to the front end (e.g. icons,javascript). Within the folder
*<filename>Classes</filename>* are the folders
*<filename>Controller</filename>* and
*Domain*. In our example, the folder
*Controller* contains only one class that will control
the entire process of listing creation later. The folder
*Domain* again contains the two folders
*<filename>Model</filename>* and
*<filename>Repository</filename>*. Resulting from all
this, the folder structure within the extension folder
*inventory/* should look as in image 4-1.

<remark>TODO: Image 4-1</remark>

So that the extension can be loaded by TYPO3, we require two
configuration files. These are discarded into the extension folder
<filename>inventory/</filename> on the uppermost level. You can copy and
adapt these files from an existing extension. Later you will let them be
created by the kickstarter.

The file <filename>ext_emconf.php</filename> contains the meta
information for the extension, e.g. the title, a description, the status,
the name of the author etc.. It does not differ to conventional extensions.
It is recommended to indicate the dependence to Extbase and Fluid (if
appropriate, also a certain version).

::

	&lt;?php
	$EM_CONF[$_EXTKEY] = array(
	'title' =&gt; 'Inventory List', 
	'description' =&gt; 'An extension to manage a stock.',
	'category' =&gt; 'plugin',
	'author' =&gt; 'Jochen Rau',
	'author_company' =&gt; '',
	'author_email' =&gt; '',
	*'dependencies' =&gt; 'extbase,fluid'*
	'state' =&gt; 'alpha',
	'clearCacheOnLoad' =&gt; '1',
	'version' =&gt; '0.0.0',
	'constraints' =&gt; array(
	  'depends' =&gt; array(
		'typo3' =&gt; '4.3.0-4.3.99',
		*'extbase' =&gt; '1.0.0-0.0.0',*
		*'fluid' =&gt; '1.0.0-0.0.0',*
	  )
	)
	);
	?&gt;

The file <filename>ext_icon.gif</filename> contains the icon of the
extension. For this you can use any graphic stored in GIF format. It should
not exceed a width of 18 pixels and a height of 16 pixels. The icon appears
in the extension manager and in the extension repository (TER).

After the basic structure was constructed, the extension can already
be shown in the extension manager and can be installed. But first we turn to
our domain.

