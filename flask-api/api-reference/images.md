# 🖼 Images

## `/getResizedImage/<cote>/<id>`

{% swagger method="get" path="getResizedImage/<document_cote>/<image_id>" baseUrl="/" summary="Get a resized image for previsualisation" %}
{% swagger-description %}
Gets a resized image for previsualisation in a Document page. All it needs is the 

`document_cote`

 and the 

`image_id`
{% endswagger-description %}

{% swagger-parameter in="header" name="x-access-token" required="true" %}
User token
{% endswagger-parameter %}

{% swagger-parameter in="query" name="<cote>" required="true" %}
Cote of the document
{% endswagger-parameter %}

{% swagger-parameter in="query" name="<id>" required="true" %}
Id of the imagge in the document
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="Image file (BLOB)" %}
```json
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

## `/getOriginalImage/<cote>/<id>`



{% swagger method="get" path="getOriginalImage/<document_cote>/<image_id>" baseUrl="/" summary="Get the original image to annotate" %}
{% swagger-description %}
Gets the image in its original format so it can be annotated. All it needs is the 

`document_cote`

 and the 

`image_id`
{% endswagger-description %}

{% swagger-parameter in="header" name="x-access-token" required="true" %}
User token
{% endswagger-parameter %}

{% swagger-parameter in="query" name="<cote>" required="true" %}
Cote of the document
{% endswagger-parameter %}

{% swagger-parameter in="query" name="<id>" required="true" %}
Id of the imagge in the document
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="Image file (BLOB)" %}
```json
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
