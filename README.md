# COMP3322-Internet-Forum
An Internet forum built on HTML, CSS, JS, jQuery, AJAX, NodeJS, MongoDB


## Example website
http://34.80.155.28:3000/


## Environment
* jQuery: 3.5.1 <installed locally in /project/public/javascripts>
* Node.js: 15.0.1
* Express.js: 4.17.1
* MongoDB: 4.4.2 Community


## How to insert data into the MongoDB server and start the MongoDB and Node server
Special characters:
* T<number>: <number>-th terminal
* COMMAND{<string>}: types the command <string> to the terminal
* IN "<path>": navigate to the path <path> with COMMAND{cd}
* <number>: variable number
```
[Step 0]
Add "C:\Program Files\MongoDB\Server\4.4\bin" to PATH
if you install MongoDB 4.4.X Community
```

```
[Step 1]
T1:
IN "project"
COMMAND{ npm install }
COMMAND{ mkdir "data" }
COMMAND{ cd "data" }
COMMAND{ mongod --dbpath . }

DO NOT CLOSE T1
```

```
[Step 2]
T2:
IN "project"
COMMAND{ mongo }
COMMAND{ use project }

You should be in the MongoShell now with a ">" character on the left

COMMAND{ db.users.insert({'name':"Andy", 'email':"andy@test.hk", 'password':"pwd"}) }
COMMAND{ db.users.insert({'name':"Bob", 'email':"bob@test.hk", 'password':"pwd"}) }
COMMAND{ db.users.insert({'name':"Cindy", 'email':"cindy@test.hk", 'password':"pwd"}) }


COMMAND{ db.users.find() }, then
You should see the following string printed on the terminal, with the variables <1>, <2> and <3>
{ "_id" : ObjectId("<1>"), "name" : "Andy", "email" : "andy@test.hk", "password" : "pwd" }
{ "_id" : ObjectId("<2>"), "name" : "Bob", "email" : "bob@test.hk", "password" : "pwd" }
{ "_id" : ObjectId("<3>"), "name" : "Cindy", "email" : "cindy@test.hk", "password" : "pwd" }

Replace <1>, <2> and <3> below with the value you found in the text above
COMMAND{ db.answers.insert({'content':"1. JavaScript is used for Front End development while java is used for Back End Development; 2. Java Script is dynamically typed language and Java is Statically typed language; 3. Java Script is a scripting language while Java is a programming language; 4. Java and JavaScript are very different in their SYNTAX; 5. Both languages are Object Oriented but JavaScript is a Partial Object Oriented Language while Java is a fully Object Oriented Langauge.", 'uid':ObjectId("<2>"), 'time':new Date("2020-10-12")}) }
COMMAND{ db.answers.insert({'content':"They share some letters and they are both computer languages, just about everything else is different.", 'uid':ObjectId("<3>"), 'time':new Date("2020-10-11")}) }
COMMAND{ db.answers.insert({'content':"Stage 1: Get your math in place. Stage 2: Programming. Stage 3: Learn Machine Learning tools: You will have to learn certain common topics to build from. They are: Regression techniques. SVM. Classification Techniques. Clustering Techniques. Neural Nets. Decision making algorithms. Optimization Techniques. Stage 4: Build After you have learnt the tools. It is time you build something.", 'uid':ObjectId("<1>"), 'time':new Date("2020-10-15")}) }


COMMAND{ db.answers.find() }, then
You should see the following string printed on the terminal, with the variables <4>, <5> and <6>
{ "_id" : ObjectId("<4>"), "content" : "1. JavaScript is used for Front End development while java is used for Back End Development; 2. Java Script is dynamically typed language and Java is Statically typed language; 3. Java Script is a scripting language while Java is a programming language; 4. Java and JavaScript are very different in their SYNTAX; 5. Both languages are Object Oriented but JavaScript is a Partial Object Oriented Language while Java is a fully Object Oriented Langauge.", "uid" : ObjectId("5fbfd9ba7d2a4876d07fc96e"), "time" : ISODate("2020-10-12T00:00:00Z") }
{ "_id" : ObjectId("<5>"), "content" : "They share some letters and they are both computer languages, just about everything else is different.", "uid" : ObjectId("5fbfda977d2a4876d07fc96f"), "time" : ISODate("2020-10-11T00:00:00Z") }
{ "_id" : ObjectId("<6>"), "content" : "Stage 1: Get your math in place. Stage 2: Programming. Stage 3: Learn Machine Learning tools: You will have to learn certain common topics to build from. They are: Regression techniques. SVM. Classification Techniques. Clustering Techniques. Neural Nets. Decision making algorithms. Optimization Techniques. Stage 4: Build After you have learnt the tools. It is time you build something.", "uid" : ObjectId("5fbfd8817d2a4876d07fc96d"), "time" : ISODate("2020-10-15T00:00:00Z") }

Replace <1>, <2>, <3>, <4>, <5> and <6> below with the value you found in the text above
COMMAND{ db.questions.insert({'space':"Javascript", 'title':"What is the difference between Java and Javascript", 'content':"I am a newbie in programming, and I would like to know what is the difference between Java and Javascript", 'answer':[ObjectId("<5>"), ObjectId("<4>")], 'up':[ObjectId("<2>"), ObjectId("<3>")], 'time':new Date("2020-10-11"), 'creatorid':ObjectId("<1>")}) }
COMMAND{ db.questions.insert({'space':"Machine Learning", 'title':"How to learn Machine Learning", 'content':"This is a test problem in the space Machine Learning", 'answer':[ObjectId("<6>")], 'up':[ObjectId("<1>"), ObjectId("<3>")], 'time':new Date("2020-10-10"), 'creatorid':ObjectId("<2>")}) }
COMMAND{ db.questions.insert({'space':"Algorithm", 'title':"How to learn Algorithm", 'content':"I am wondering where I can find the resource to learn the algorithms", 'answer':[], 'up':[ObjectId("<1>"), ObjectId("<2>")], 'time':new Date("2020-10-09"), 'creatorid':ObjectId("<3>")}) }

You can close T2 by COMMAND{ exit } if you do not need to interact with the database directly
```

```
[Step 3]
Finish, please refer back to Readme for procedure of starting the DB and web server
```


## Procedure for starting the MongoDB and web server
```
[Step 0]
Add "C:\Program Files\MongoDB\Server\4.4\bin" to PATH
if you install MongoDB 4.4.X Community
```	

```
[Step 1] Install all the Node modules (if you have not done so when entering data)
T1:
IN "project"
COMMAND{ npm install }
```

```
[Step 2] Start the MongoDB database
T1:
IN "project"
COMMAND{ mongod --dbpath ./data }

DO NOT CLOSE T1
```

```
[Step 3, Optional] Start the MongoShell
T2:
IN "project"
COMMAND{ mongo }
COMMAND{ use project }
```

```
[Step 4] Start the Web server
T3:
IN "project"
COMMAND{ npm start }
		
DO NOT CLOSE T3
```

## Procedure of accessing the website
Use a browser and go to "http://localhost:3000"
You should be able to see the website

Some accounts to login:
(Email, Password)
* (andy@test.hk, pwd)
* (bob@test.hk, pwd)
* (cindy@test.hk, pwd)