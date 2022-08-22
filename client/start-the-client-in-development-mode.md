---
description: >-
  How to start a NodeJS developpment server in order to modify the user
  interface.
---

# 👨💻 Start the client in development mode

In this section, we will go through all the steps you need to follow in order to start a dev-server to edit the user interface. The client is a CRA (<mark style="color:red;">`create-react-app`</mark>), a web-app coded in <mark style="color:red;">`ReactJS`</mark>.

{% hint style="info" %}
**Prerequisite:** <mark style="color:red;">`NodeJS`</mark>with <mark style="color:red;">`npm`</mark> must be installed on your machine
{% endhint %}

{% hint style="info" %}
**Good advice:** once again using an adapted IDE is a must
{% endhint %}

## The first time

The first time you want to run in dev-mode you will need to install all the necessary dependencies to the client app.

```bash
# Go to the client directory
cd client
# Install all the dependencies
npm install
# Run the developement server
npm run start
```

## The other times

Once the dependencies are installed you should be able to just run the client.

```bash
npm run start
```

In case of an error just execute this command :&#x20;

```bash
npm update
```

This will update all the librairies, sometimes that helps, sometimes it doesn't...

## Edit the frontend

You can find all the pages and components of the annotation-app in the <mark style="color:red;">`src`</mark> folder (<mark style="color:red;">`client/src`</mark>).

The code is in [`ReactJS`](https://fr.reactjs.org/docs/getting-started.html) you may find some usefull documentation on React [here](https://app.gitbook.com/s/3DNUBSpTc7duRkOiy8g0/).

Once you have called `npm start` all your changes shall be visible on `localhost:5000.` (port may change).

