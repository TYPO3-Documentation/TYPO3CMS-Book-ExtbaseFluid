.. include:: ../Includes.txt

Backend modules
===============

So far we have elucidated how frontend plugins can be implemented as Extbase extensions.
It is basically possible to create backend modules with Extbase. Because of not so much
testing of the implementation like for frontend plugins, we only have a short look at it.

Basically all works the same as in the frontend (see chapter 4, section "Configure the plugin"):
The functionality is implemented normal in the controller and actions, now it must be defined
which group of actions are realizing the representation in the backend - that is, the
backend module must be *registered*. This is done in the file :file:`ext_tables.php` in the
root directory of our extension. Lets look at our blog example how it defines a backend module::

    if (TYPO3_MODE === 'BE') {
        \TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerModule(
            'Vendor.ExtensionName',
            'web',          // Main area
            'mod1',         // Name of the module
            '',             // Position of the module
            array(          // Allowed controller action combinations
                'Blog' => 'index,show,new,create,delete,deleteAll,edit,update,populate',
                'Post' => 'index,show,new,create,delete,edit,update',
                'Comment' => 'create,delete,deleteAll',
            ),
            array(          // Additional configuration
                'access'    => 'user,group',
                'icon'      => 'EXT:blog_example/ext_icon.gif',
                'labels'    => 'LLL:EXT:ext_key/Resources/Private/Language/locallang_mod.xml',
            )
        );
    }

In line 2 the backend module is registered using the API function ``\TYPO3\CMS\Extbase\Utility\ExtensionUtility::registerModule``.
This function needs the name of the main area where the module can be found later, in our case this
is the ``web`` module (line 4). Also the module must have a name, so that different modules of the same
extension can be distinct (line 5). In line 6 the position of the module can be described in detail,
but this is not done here. The lines 7 till 11 defines the list of controller action combinations
that are available for this module, like you know from the definition of the frontend plugins.
In line 12 till 16 common definitions for the access rights, the icon and the title of the module are set.

.. note::

    When registering frontend plugins there must be defined which actions are not to be stored in the
    cache. For backend modules that is not needed, because there is no caching of the output.

Now the backend module is ready equipped. You can try it out after installing the extension.
Now you perhaps discover that the design has not the look and feel of a TYPO3 backend. To simplify the
creation of aligned backend modules there are backend ViewHelper for ajustment of the design, that
you will find below ``f:be.*``. Because these ViewHelper are heavy in enhancement, their documentation
is not covered in this book. We approve instead to look at the templates of the current blog example.
There you will find the recommended ViewHelper in action.

Sometimes it is reasonable to configure the extension different in the fontend and backend. So it is
necessary for the blog example to use different templates in frontend and backend.

Backend modules can, like frontend plugins, be configured via TypoScript. While the frontend plugins
are configured below ``plugin.tx_[pluginkey]``, for the configuration of the backend
``module.tx_[pluginkey]`` is used. In the blog example the configuration of the templates are
changed like this::

    module.tx_blogexample {
        settings < plugin.tx_blogexample.settings
        persistence < plugin.tx_blogexample.persistence
        view < plugin.tx_blogexample.view
        view {
            templateRootPath = EXT:blog_example/Resources/Private/Backend/Templates/
            partialRootPath = EXT:blog_example/Resources/Private/Partials/
            layoutRootPath = EXT:blog_example/Resources/Private/Backend/Layouts/
        }
    }

Here are all the settings of ``settings`` and ``persistence`` are copied from the configuration
of the frontend plugins, only the new pathes for the ``view`` are set.

Now you have a good oversight how you can use Extbase also for development of backend modules.
