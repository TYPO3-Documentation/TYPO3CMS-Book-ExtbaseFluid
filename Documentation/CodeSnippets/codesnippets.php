<?php
// https://github.com/TYPO3-Documentation/t3docs-codesnippets
// ddev exec vendor/bin/typo3  restructured_api_tools:php_domain public/fileadmin/TYPO3CMS-Book-ExtbaseFluid/Documentation/CodeSnippets/

return [
    [
        "action"=> "createPhpClassDocs",
        "class"=> \TYPO3\CMS\Extbase\Validation\Validator\ValidatorInterface::class,
        "targetFileName"=> "PhpDomain/ValidatorInterface.rst.txt",
        "withCode"=> false
    ],
];
