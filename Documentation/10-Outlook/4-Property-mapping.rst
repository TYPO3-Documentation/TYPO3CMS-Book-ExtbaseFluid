.. include:: ../Includes.txt
.. _extbase_property_mapping:

Last Update 01 Feb 2016.

.. _property-mapper:

Property Mapper
===============

Extbase provides a Property Mapper to convert different values, like integers or arrays, to other
types, like strings or object.
In this example, we provide a string that will be converted to an integer::

        $output = $this->objectManager->get(\TYPO3\CMS\Extbase\Property\PropertyMapper::class)
            ->convert('10', 'integer');

Conversion is done by using the :php:`TYPO3\CMS\Extbase\Property\PropertyMapper::convert()`
method.

How to use property mapper
--------------------------

The above example was a really simple one. Most of the time you will convert from an array to an
where some points must be considered. This example will show a simple conversion::

    $input = [
        'username' => 'This is the user name',
    ];

    $output = $this->objectManager->get(\TYPO3\CMS\Extbase\Property\PropertyMapper::class)
        ->convert(
            $input,
            'TYPO3\CMS\Extbase\Domain\Model\FrontendUser'
        );

The result will be a new instance of :php:`TYPO3\CMS\Extbase\Domain\Model\FrontendUser`
with defined property `username`.

.. note::
    The property mapper won't check validation rules. The result will be whatever the input is.

Allow mapping of sub-properties
-------------------------------

It's also possible to map to subtypes. In the above example, the `FrontendUser` has a sub-property
of type :php:`TYPO3\CMS\Extbase\Domain\Model\FrontendUserGroup`. If you wanna map an incoming id,
you have to configure the mapper as per default he won't map sub properties for security reasons::

    $input = [
        'username' => 'This is the user name',
        'usergroup' => [
            1,
        ],
    ];

    // Get property mapping configuration
    $mappingConfiguration = $this->objectManager
        ->get('TYPO3\CMS\Extbase\Property\PropertyMappingConfigurationBuilder')
        ->build();
    // Adjust configuration to allow mapping of sub property 'usergroup'
    $mappingConfiguration->forProperty('usergroup')
        ->allowAllProperties();

    $output = $this->objectManager->get(\TYPO3\CMS\Extbase\Property\PropertyMapper::class)
        ->convert(
            $input,
            'TYPO3\CMS\Extbase\Domain\Model\FrontendUser',
            $mappingConfiguration
        );
