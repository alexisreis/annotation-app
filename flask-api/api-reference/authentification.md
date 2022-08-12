# 🔐 Authentification

## `/login`

{% swagger baseUrl="/" method="post" path="login" summary="Login the user" %}
{% swagger-description %}
Return a JWT if the user has already an account and the password and the mail correspond. 
{% endswagger-description %}

{% swagger-parameter in="body" name="mail" required="true" type="string" %}
The user email adress
{% endswagger-parameter %}

{% swagger-parameter in="body" name="password" required="true" type="string" %}
The user password
{% endswagger-parameter %}

{% swagger-response status="200" description="User successfully logged in " %}
```javascript
{
    "name"="Wilson",
    "owner": {
        "id": "sha7891bikojbkreuy",
        "name": "Samuel Passet",
    "species": "Dog",}
    "breed": "Golden Retriever",
}
```
{% endswagger-response %}

{% swagger-response status="403: Forbidden" description="User is not found or password is incorrect" %}
Return a JSON : `not_found` or `password`


{% endswagger-response %}
{% endswagger %}

## `/createNewUser`

{% swagger method="post" path="createNewUser" baseUrl="/" summary="Creates a new user in the database" %}
{% swagger-description %}
Creates a new user if the mail adress doesn't have already an account. By default it create a 

**Watcher user**

. That means the user is only able to see data and cannot modify or create anything.
{% endswagger-description %}

{% swagger-parameter in="body" name="name" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="mail" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="password" required="true" %}

{% endswagger-parameter %}

{% swagger-response status="201: Created" description="User successfully created" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="400: Bad Request" description="Blank body parameter(s) " %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="418: I'm a Teapot" description="The user has already an account with this email" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}
