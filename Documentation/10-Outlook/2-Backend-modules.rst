.. include:: ../Includes.txt

Backend modules
===============

So far we have explained how frontend plugins can be implemented as Extbase extensions.
It is possible to create backend modules with Extbase too. 

Basically it works the same as in the frontend (see chapter 4, section "Configure the plugin"):
The functionality is typically implemented in the controller and actions. It must be defined
which group of actions are realizing the representation in the backend. The
backend module must be *registered* in the file :file:`ext_tables.php` in the
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
This function needs the name of the main area where the module can be found later. In our case this
is the ``web`` module (line 4). Also must the module have a name so that different modules of the same
extension can be distinguished from another (line 5). In line 6 the position of the module can be described in detail (not used here). The lines 7 till 11 defines the list of controller action combinations
that are available for this module like you know from the definition of the frontend plugins.
In line 12 till 16 common definitions for the access rights, the icon and the title of the module are set.

.. note::

    When registering frontend plugins there must be defined which actions are not to be stored in the
    cache. For backend modules that is not needed, because there is no caching of the output.

Now the backend module is ready equipped. You can try it out after installing the extension.
You will see that the design has not the look and feel of the TYPO3 backend. To simplify the
creation of aligned backend modules there are backend ViewHelper for adjusting the design that
you will find below ``f:be.*``. This documentation of the ViewHelper
is not covered in this documentation. So let us have a look at the templates of the current blog example.

Sometimes it is reasonable to configure the extension for the fontend in another way than the for the backend. So it is
necessary for the blog example to use different templates in frontend and backend.

Backend modules are configured via TypoScript, like frontend plugins. Frontend plugins
are configured with ``plugin.tx_[pluginkey]``. The corresponding configuration of the backend modules is under
``module.tx_[pluginkey]``. In the blog example the configuration of the templates is
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

The settings of ``settings`` and ``persistence`` are copied from the configuration
of the frontend plugins. Only the new pathes for the ``view`` are set.

Now you have a oversight how you can use Extbase to set up backend modules.
