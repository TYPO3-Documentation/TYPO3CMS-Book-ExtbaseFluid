Test-Driven Development
===============================================

Every Developer has to test his software - for developers a not much liked 
theme, but one you cannot walk by. How work tests in the classic software 
development? Programmers in the first way construct a testcase by putting 
certain data into the database, write little programms to test or manipulate the 
url parameter in the browser. A big number of little functions are often 
implemented at one time, before they are tested (look at figure  2-7). After 
that, these steps are repeated in periodic steps, as often until the function 
you want to have is implemented. After this the next function is in line. But 
this way leads to problem: the tests are not made systematic, but selective. By 
following this way you are implementing failures into some routines by accident. 
Furthermore by a test is not only a little code fragment tested, but often a 
more complex routine.

.. figure:: /Images/2-BasicPrinciples/figure-2-7.png
	:align: center

	Figure 2-7: in the classic software development exist a strict isolation 
	between the Development- and the Testphase.

By using Test-Driven Development (TDD) these problems should be solved. Tests 
could be fast completed and reproducible. These increases the developers 
motivation to start the tests constantly and by this way to get faster a 
callback, if a failure is implemented into the existing functions.


.. note::

	Field report

	When Robert Lemke and other Coredevelopers suggested to make the development for 
	FLOW3 test driven, I was sceptic. Test-Driven Development sounded like a nice 
	concept, but I did not knew, how to test a framework this size reasonable. Also 
	in the internet there were often only very simple academic examples to find. 
	Until this time I had only a theoretical overview over TDD.
	Even when I started to test, when the Fluid development started. The first test 
	were not Unit- but Integrationtests. This means they tested Fluid in the view of 
	a user:
	There were not parsed little Template-Snippets and compared with the 
	expectations. The first tests took there time - it felt strange to test things, 
	which were not implemented at this time. But after the first test was written 
	and this test run through succesfully, I was able to make the following 
	development cycles extremly fast. Because of Test-Driven Development I was able 
	during a train ride to totally reconstruct the core of Fluid. Without tests, it 
	seriously would have took me days until all would have worked at the end. 
	Espciallly the feedback I got at once, I really appreciate. You click on a 
	button and after a few seconds you got your feedback.
	After this I am infected, learned about Mock- and Stubobjects, and today I do 
	not want to miss it.(In this chapter you will get an introduction into these concepts.)
	If you want to learn TDD, you will jump in at the deep end, and to 
	try it at the next project. Until the first Unit test is finished, it will take 
	a while and after this it will go really faster.
	– Sebastian Kurfürst

First test, then implementing
------------------------------

The goal of Test-Driven Development is to make test explicit and automatic 
repeatable. The workflow is different of the classic programming, seperated into 
very small iterations.

Using Test-Driven Development you write your Unit tests for your features before 
you write your features theirselves. Unit tests are automatically repeatable 
tests of methods, classes und little program parts. Even during the writing of 
the tests, you should seriously think about the desired functionality. When you 
are running your tests, they naturally will fail, because the tested 
functionality is not implemented yet. In the next step you will have to write 
the code which is minimal needed to run the test successfully (have a look at 
figure 2-8). A new started test will finish without a problem. In the next step 
you should begin to think about which functionality is missing. The reason is 
that you have only implemented the minimal necessary code. When you know, what 
you want to implement you will write a new Unit test, with which you can test 
this new functionality. In this way the process of testing an implementing 
starts over.

.. figure:: /Images/2-BasicPrinciples/figure-2-8.png
	:align: center

	Figure 2-8: with Test-Driven Development testing and development are 
	alternating

The fortune of this method is obviously. 

Because you are forced by writing of the tests to seperate big features into 
smaller pieces, you have during the implementation the possibility to fully 
concentrate on the functionality you have actually to implement. Furthermore 
these change of the point of view between Developer and User of a class is the 
reason for better code which does what it should. TDD is especially usefull for 
designing of api's: Because of the testing you as developer change your 
perspective into the one of the user of the api and so you are able to identify 
inconsistences and missing functionality much faster.  
In addition Unit tests are a kind of safety net against unrequested behaviour. 
In the case of destroying a functionality when you are programming, you are getting through the Unit tests feedback directly and are able to correct the bug 
at once. This is the reason why the chance of regressions (producing bugs same 
time you are correcting another) is furthermore decreasing. According to some 
studies Developers who are using TDD are fast at the same rate or even faster 
than developers who are coding the conventional style, although the first 
mentioned have not only to write the Implementation but also the according 
tests. Furthermore is the quality of the code in the Test-Driven Development 
clearly higher than in the conventional Programming.


Example
-------

Let us assume we want to model an onlineshop for a customer. These owns a name, 
which is transfered in the constructor. Through these tests we want to make sure 
that the name is correctly saved into the object. At first you have to install 
the phpunit-Extension from the TYPO3 Extension Repository (TER), because we will 
run the tests with this. The next step is to go to our own extension and create 
a folder "Tests/Unit/" in the main folder of the extension, if it not exists. 
This will contain later all our unit tests. Our customer objekt which we have to 
create, will be situated in Classes/Domain/Model/Customer.php because it is part 
of our Domainmodel in our extension.

Similarly we create the testclass in the file 
Tests/Unit/Domain/Model/CustomerTest.php. Now we create a minimal testcase with which we get used with PHPUnit.

//code

All our testcasses are named after the same namescheme like normal classes and 
they must be extended with Tx_Extbase_BaseTestCase. One testclass can contain 
many testmethods. These have to be public and have to contain the annotation 
@test in their PHPDOC-Block, so they can be performed. Please keep in mind that 
the name of the testmethod should make clear which expectations the test should 
fullfill. Now we can run the test for the first time. Therefore go to the 
TYPO3-Backend to the modul PHPUnit which is to find under the Admin Tools. Then 
you can choose your extension and click on Run all tests. Now you should, like 
it is shown in the figure 2-9, see a (yellow) bar and the Error message Not yet 
implemented. Becaus you will work much with the PHPUnit Environment, you should 
familiarize yourself with this. Try to run the test for extbase and fluid and 
also try the different Display options. For example you can let show you all 
tests or only the failed tests. 


Now we know that our testcase is running, we can write our first usefull 
testcase. This should test, if a name which is specified in the constructor, can 
be accessed again.

//Code

// Code


.. figure:: /Images/2-BasicPrinciples/figure-2-9.png
	:align: center

	Figure 2-9: With the testrunner you are able to run easily the Unit tests 
	in the TYPO3-Backend.

When we run the testcase, we will be displayed a fatal error from PHP, because 
the class we want to test does not exist already. Now we are changing roles: We 
are not the user of the class anymore, but now we are the developer, who should 
implement the class. At first we create in the file 
Classes/Domain/Model/Customer.php an empty class with the needed methods to get 
rid of the fatal error:

//code


When we now let run the testsuite again there should not be a fatal error 
anymore but instead our Unit-Tests will fail because the getName() method returns 
the false value.
Now we are able, motivated by getting the red bar fast as possible into green, 
to start with implementing:

//code

Now the Unit-Tests are running without failure, the expected value is given out. 
At this time we are not satisfied at all - finally, now is always 'Sebastian 
Elector', as name returned. The next step is a refactoring phase: We clean up 
the code and always make sure that the unit tests continue successfully passed. 
After several iterations we arrive at the following code:

//code


h1. Page 48

The unit tests always run through yet, and we have the desired functionality
reached. Now we can once again slip into the role of the developer from the role of the user of the class and specify with other test cases additional functionality.


Test individual objects
-----------------------

Our first example about Unit-Tests was very simple. In this section we show you 
how to test classes that depend on other classes. Suppose we have a program 
which is writting log messages and they should be send per mail. For those there 
is a class EmailLogger that send the log data via e-mail. These class implements 
the potencial complex goal of the e-mail sending on is own, but is using another 
class which is called EmailService. EmailService uses, depending on the used 
configuration a SMTP-Server or the mail() function of PHP. This is shown in 
the figure 2-10: The email logger class has a reference on the email service.

.. figure:: /Images/2-BasicPrinciples/figure-2-10.png
	:align: center

	Figure 2-10: The EmailLogger uses for sending of the emails the EmailService.

We now want to test the class EmailLogger without using the EmailService. We do 
not want to send real emails with every test run. To reach that goal we need two 
subelements. Dependency Injection and the use of Mock objects. Both concepts we 
will introduce below.

Dependency Injection
--------------------

You often see classes that are constructed according to the following structure:

//code

The EmailLogger requires the EmailService to function correctly, and 
instantiated this in the constructor. However, this strongly coupled to these 
two classes together: When you create to test a new instance of the class 
EmailLogger, you automatically get an instance of an EmailService and this would 
implicitly be tested. In addition, it is not possible to exchange the 
EmailService at run time, without changing the source code. A solution to this dilemma is to use Dependency Injection:

This instantiates a class does not itself have dependencies but she gets from 
the outside passed. The EmailLogger gets a new method injectsEmailService, the 
EmailService in the class sets. This looks e.g. like this:

//code

Extbase offers currently not a framework support for Dependency Injection. 
Therefore, we recommend that the instantiation of classes and their Dependency 
Injection in respective factories to outsource. A possible Factory looks as 
follows from:

//code


.. note::

	FLOW3 offers first class Dependency Injection support. If you migrate your 
	extensions on FLOW3 later, this part is much simpler.

We can now operate in a test case from the outside, which the EmailService the 
EmailLogger gets. We could write a TestEmailService, for example, which simple 
does nothing (to avoid a fatal error), or we use the Mock objects that are shown 
below.


Mock-Objects
------------

Through the usage of Dependency Injection we are able to instantiate EmailLogger 
without its dependencies. Because the EmailLogger needs the EmailService to 
work, we must provide these in the tests.


But more than that: We also want to ensure that the EmailLogger really calls the 
method for sending the e-mail! Therefore we can use Mocks. Mocks are more or 
less "dummies" for real objects that emulate the behavior of objects. They are 
also help to ensure specific calls or parameters. A test that tests the 
EmailLogger that could be as follows:

//code

The procedure in detail: In line 6, the variable $message with our dummy message 
filled, we want to log. This message we need several more times, so it makes 
sense to store them in a variable. In lines 7 through 9, we instantiate the 
EmailLogger and initiate him a mock object of the EmailService.
In line 10 passes through the truly fascinating: We expect that in the 
EmailService an unique method call is sent, with the parameters 
'logging@domain.local ',' Message Log ', $message. Once we have specified our 
expectations, we can at line 11, the Nachicht
by email logger log. Once we have specified our expectations, we can at line 11 
let the EmailLogger log the message. At the end of the testcases our 
expectations are automatically controlled.
If the the method send was called exactly once or with the false parameter 
values, the test will fail with a detailed error message. What have we achieved? 
We have tested the EmailLogger without the use of Email-Service and still ensure 
that the Email-Service is called with the correct parameters.
Also, we had no separate "placeholder" class to write for Email-Service, because 
we used the mock-functionality from PHPUnit.


.. note

	You have to get used to the writing style for Mock objects; But it will go on 
	with the time in flesh and blood.
