INSTALLATION
============

We need *Sphinx* (http://sphinx.pocoo.org/) to render documentation.
If you have python easy_install available, use the following command:

  easy_install -U Sphinx

If you have "make" installed (you probably have on Linux / Mac),
just run:

  make html

Otherwise, you can run:

  sphinx-build -b html . _build/html

Then, browswe to _build/html and enjoy :-)

After every change to the documentation, run the above command again.

Pushing documentation
=====================

Make sure to push to Gerrit, so you need the following configuration:

  scp -p -P 29418 [yourusername]@review.typo3.org:hooks/commit-msg .git/hooks/
  git config remote.origin.pushurl ssh://[yourusername]@review.typo3.org:29418/FLOW3/Documentation.git
  git config remote.origin.push HEAD:refs/for/master

Closing Notes
=============

Thanks for the fish and enjoy :-)
