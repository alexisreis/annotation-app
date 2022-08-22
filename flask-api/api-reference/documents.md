# 📖 Documents

## /`getDocuments`

{% swagger method="get" path="getDocuments" baseUrl="/" summary="Get all the stored documents" %}
{% swagger-description %}
Gets all the stored documents in the database in a JSON array
{% endswagger-description %}

{% swagger-parameter in="header" name="x-access-token" required="true" %}
User token
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="Documents list in a JSON array" %}
```json
{
    [
        [document_cote, document_name, document_date],
        [...]
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
{% endswagger %}

## `/getDocument/<document_cote>`

{% swagger method="get" path="getDocument/<document_cote>" baseUrl="/" summary="Get all the info about a document" %}
{% swagger-description %}
Gets all the information about a specific document identified by it's cote. It returns in a JSON object the image_id, stats and transcriptions of this document. 
{% endswagger-description %}

{% swagger-parameter in="header" name="x-access-token" required="true" %}
User token
{% endswagger-parameter %}

{% swagger-parameter in="query" name="<document_cote>" required="true" %}
Cote of the document
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="JSON Object" %}
```json
{
    'images' : [
                    [],
               ]
     'stats': 
     'transcriptions': 
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

