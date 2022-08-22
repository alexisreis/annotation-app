# First connection

The first time you launch the application you should login with an already created account.

This account has the admin privileges and should be deleted once you create your new account and grant it with the admin privileges.

## Create a new account

First, create a new account. This account will be the new admin account.&#x20;

Then login with the mail adress <mark style="color:red;">**`admin`**</mark>and password <mark style="color:red;">**`admin`**</mark>.

Go immediatly to the admin dashboard. You should see your new account in a list with the admin account. Grant your new account the admin privileges, log-off and log-on to your new admin account. Go back to the admin dashboard and delete the admin admin account.

## Initialise the database with some data

In the admin dashboard you can see a button 'Init Database'.&#x20;

What it does is that it take the excel sheet in `server/images` and it creates Documents in the database. Then for each of those document if the document cote has a directory in the `server/images/original` directory it will add all the images to the database and it will create for each of those imagea resized version in `server/images/resized`, those images will be used for previsualisation when you click on a Document.

If you wish to add a document, just add the information of it in the excel sheet and add the images in `/server/images/original/<PROJECT_NAME><document_cote>`.
