---
description: >-
  How to quickly start the annotation-app on your machine. All the tools you
  will need, and manipulations you will have to do...
---

# 🏃♂ Quick start (for local usage)

{% hint style="info" %}
**Prerequisite:** your installation must have <mark style="color:red;">Python</mark> (version 3.10 is recommended as it was used for development). An IDE like IntelliJ is also recommended as it can boot the application with a few clicks once it is configured. &#x20;
{% endhint %}

{% embed url="https://github.com/alexisreis/annotation-app" %}
The repo to git clone
{% endembed %}

## Create a local database with <mark style="color:blue;">MAMP</mark>

In order to store all the annotations, documents and user infos, we used a MySQL DB in local with MAMP. To do so just install MAMP on your machine.

{% embed url="https://www.mamp.info/en/mamp/" %}
MAMP download page
{% endembed %}

When MAMP is installed, run it and click on the 'Start Server' button. An Apache server and a MySQL server should start-up and you should be able to go to the page [http://localhost/MAMP/](http://localhost/MAMP/)

Then go to _**TOOLS**_ and _**phpMyAdmin**_.

Once in phpMyAdmin press _**Import**_ on the top of the screen.

Upload this <mark style="color:red;">`.sql`</mark> file then press _**Go**_. e

{% file src=".gitbook/assets/annotation-app-database-setup.sql" %}
SQL scripts that creates the annotation-app database
{% endfile %}

This script creates a new database named <mark style="color:red;">`annotation-app`</mark> with all the tables and relations the application needs. The SQL schema is given below :

![annotation-app's database schema](<.gitbook/assets/drawSQL-export-2022-08-09\_11 08.png>)

That's it for the database part. Now we will configure the machine to run our Flask back-end locally.

## Install the <mark style="color:blue;">Flask</mark> API server&#x20;

To communicate to the database via the client we use an API. This API is coded in Python with the Flask library. This choice was motivated by the fact that our application may need to do some image processing using OpenCV. In order to do that, we needed a server running in Python so Flask was the easiest choice as it permits us to do some request to the DB and some image processing functions as well if needed.

### Installation

Once you have git cloned the annotation-app repo, go its directory in the terminal.

#### Create a Python Virtual Environnement

We will create a Python Virtual Environnement (venv) where we will install all the necessary libraries for our API.&#x20;

{% tabs %}
{% tab title="Bash" %}
```bash
# Go to the server directory
$ cd server
# Create a virtual environnement
$ python -m venv venv
```
{% endtab %}
{% endtabs %}

You will notice that a `venv` directory just appear in server. It is perfectly normal as you just duplicated all the files to run an unique version of Python specifically for the annotation-app. We will now add all the necessary librairies.

#### Install all the necessary libraries

Now that our venv is created, we neeed to activate it / access it so when we install our libraries, we know that they were installed for our venv (and not our global Python installation on our machine, that could cause some dependencies issues).

{% tabs %}
{% tab title="Windows" %}
```bash
# In the server directory
.\venv\Scripts\activate
```
{% endtab %}

{% tab title="Mac" %}

{% endtab %}

{% tab title="Linux" %}

{% endtab %}
{% endtabs %}

Now if everything works you should see (venv) written at the begging of the new terminal line meaning that we are now working in our virtual environment. We can now install the librairies.

{% tabs %}
{% tab title="Bash" %}
```bash
pip install flask flask_cors opencv-python flask_mysqldb PyJWT
```
{% endtab %}
{% endtabs %}

{% hint style="danger" %}
**Warning :** To Windows users, you may have a problem with pip not been recognized as a command. That means you have to add your Python installation directory to your environnement variables.
{% endhint %}

### Start the server

To start the server be sure that you start it up in the **`venv`** and run the <mark style="color:red;">`server.py`</mark> file.

{% tabs %}
{% tab title="Windows" %}
```bash
# Activate venv
.\venv\Scripts\activate
# Run python.py
python server.py
```
{% endtab %}

{% tab title="Mac" %}

{% endtab %}

{% tab title="Linux" %}

{% endtab %}
{% endtabs %}

The Flask server should be up and running. Good job !

## Start the client 🌐

Next and final step you can finally start the client.

If you just wish to start it just follow these steps.

If you wish to edit the client, you will need to start a NodeJS developpment server. All the intructions to edit and build are [here](client/start-the-client-in-development-mode.md).

Here you will just open the already builded version of the client. You can find it in <mark style="color:red;">`client/build.`</mark> Just copy this build folder on a server and you can access the app with the adress of the server.
