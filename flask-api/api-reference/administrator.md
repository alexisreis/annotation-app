---
description: All the request only an authenticated admin user can query.
---

# 🧑💻 Administrator

These requests needs a JWT, a Java Web Token of an administrator passed in the header on the request in `x-access-token`.

## `/getUsersList`

{% swagger method="get" path="getUsersList" baseUrl="/" summary="Get all the users information in a array" %}
{% swagger-description %}
Select all the users information (hashed password excluded) an returns it in an array.
{% endswagger-description %}

{% swagger-parameter in="header" name="x-access-token" required="true" %}
Admin JWT
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="The list in JSON format" %}
```json
{
    [
        [user_id, user_name, user_mail, user_type], 
        [user_id, ...]
        ...
    ]
}
```
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="Token is missing or invalid" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="403: Forbidden" description="The user has no admin privileges" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="500: Internal Server Error" description="Server error, no users were found..." %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}

## `/editUserType`

{% swagger method="post" path="editUserType" baseUrl="/" summary="" %}
{% swagger-description %}

{% endswagger-description %}

{% swagger-parameter in="body" name="user_type" required="true" %}

{% endswagger-parameter %}

{% swagger-parameter in="body" name="user_id" required="true" %}

{% endswagger-parameter %}

{% swagger-response status="200: OK" description="Successful edit" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="Token is missing or invalid" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="403: Forbidden" description="The user has no admin privileges" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}

## `/deleteUser`

{% swagger method="post" path="deleteUser" baseUrl="/" summary="Deletes an user (admin)" %}
{% swagger-description %}
Delete an user from the database. Admin authentification is requiered. 
{% endswagger-description %}

{% swagger-parameter in="body" name="user_id" required="true" %}
The 

`user_id`

 you wish to delete
{% endswagger-parameter %}

{% swagger-parameter in="header" name="x-access-token" type="string" required="true" %}
JWT of an administrator is mandatory
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="Successful deletion" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="403: Forbidden" description="The user has no admin privileges" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="Token is missing or invalid" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}

