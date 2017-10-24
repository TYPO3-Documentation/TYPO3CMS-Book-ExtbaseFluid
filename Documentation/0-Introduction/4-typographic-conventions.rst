.. include:: ../Includes.txt

Typographic conventions
=======================

This book uses the following typographic conventions:

:file:`File names and directories`

*emphasized content*

:php:`class names`,

`method names`,

.. example of how we set the default textrole:

.. default-role:: code

``inline code`` or, better: `inline code`

.. comment:

   Explanation of reST Syntax:

   This line:
      `$s = 'a code snippet';`

   is equivalent to:
      :code:`$s = 'a code snippet';`

   as we have told Sphinx in the above ../Includes.txt that 'code'
   is the *default textrole*.

   End of comment.


.. |example_substitution_text| replace:: Substituted text here...

|example_substitution_text| is used to have certain code part automatically replaced.

.. note::

   This stands for a general advice or hint.

.. tip::

   This stands for a tip or a suggestion.

.. warning::

   With this symbol, certain special behavior is explained, which could
   lead to problems or impose a risk.

Each and every reST file of :file:`*.rst` should include :file:`Includes.txt`
at the very beginning. Specify the relative path.

Headlines in the reST source look nicer when the punctuation lines are
of the same length as the text.

.. highlight:: rst

To switch the default highlighting use the 'highlight' directive::

   .. highlight:: php
   .. highlight:: javascript
   .. highlight:: typoscript

To start a code-block with the default highlighting write::

   .. highlight:: php

   And this is the PHP code::  <- renders as a single ':'

      $result = 1 + 2;

Or::

   .. highlight:: php

   What may be the problem here? ::  <- no ':' is in the output

      $result = 091;

Or::

   .. highlight:: php

   What may be the problem here?

   ::          <- no ':' is in the output
               <- this line is ignored
         $result = 091;

