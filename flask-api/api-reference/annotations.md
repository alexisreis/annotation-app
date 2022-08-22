# 🔲 Annotations

## `/getImageAnnotations/<image_id>`

{% swagger method="get" path="getImageAnnotations/<image_id>" baseUrl="/" summary="Get the already stored annotations for an image" %}
{% swagger-description %}
Gets the annotations in a JSON format for Annotorious. 
{% endswagger-description %}

{% swagger-parameter in="header" name="x-access-token" required="true" %}
User token
{% endswagger-parameter %}

{% swagger-parameter in="query" name="<id>" required="true" %}
Id of the image
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="JSON object with all the annotations" %}
```json
[
  {
    "type": "Annotation",
    "body": [
      {
        "value": {
          "Son": {
            "type": ["producer"],
            "volume": "0"
          },
          "Vue": {
            "sense": "Vue"
          }
        },
        "purpose": "sense"
      },
      {
        "value": "jeux de Billards",
        "purpose": "transcription",
			},
		 	"creator": {
          "id": "id_user",
          "name": "user_name"
        },
        "created": "2022-07-12T10:26:57.607Z"
      }
    ],
    "target": {
      "source": "data:image/jpeg;base64..... OU mettre URL de l'image OU nom du fichier image (unique)",
      "selector": {
        "type": "FragmentSelector",
        "conformsTo": "http://www.w3.org/TR/media-frags/",
        "value": "xywh=pixel:324,174,411,106"
      }
    },
    "@context": "http://www.w3.org/ns/anno.jsonld",
    "id": "#a39cbd17-6d53-4c7b-8500-354f0dcb9cf4"
  },
  {
    "type": "Annotation",
    "body": [
      {
        "value": {
          "Vue": {
            "sense": "Vue"
          },
          "Son": {
            "type": [
              "producer"
            ],
            "volume": "42"
          }
        },
        "purpose": "sense"
      },
      {
        "value": "vendeurs de café",
        "purpose": "transcription"
			}
 		"creator": {
          "id": "alefi-20-20",
          "name": "Alexis"
        },
        "created": "2022-07-12T10:26:57.607Z"
      }
    ],
    "target": {
      "source": "data:image/jpeg;base64....",
      "selector": {
        	"type": "SvgSelector",
        	"value": "<svg><polygon points=\"544,12 749,111 776,27\" /></svg>"
      }
    },
    "@context": "http://www.w3.org/ns/anno.jsonld",
    "id": "#6fefe9fc-2543-40ad-9c0f-3147c7f26af0"
  }
]
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

## `/createAnnotation/<image_id>`

{% swagger method="post" path="createAnnotation/<image_id>" baseUrl="/" summary="Creates a new annotation" %}
{% swagger-description %}
`Creates`
{% endswagger-description %}

{% swagger-parameter in="header" name="x-access-token" required="true" %}
User token
{% endswagger-parameter %}

{% swagger-parameter in="query" name="<id>" required="true" %}
Id of the image
{% endswagger-parameter %}

{% swagger-parameter in="body" name="body" type="JSON" required="true" %}
Body of the annotation in the W3C Annotation format
{% endswagger-parameter %}

{% swagger-parameter in="body" name="zone_type" type="boolean" required="true" %}
Type of the zone (false: rectangle, true: polygon)
{% endswagger-parameter %}

{% swagger-parameter in="body" name="zone_coord" required="true" %}
Coordinates of the annotation in the image 
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="Annotation created" %}
```json
[
  {
    "type": "Annotation",
    "body": [
      {
        "value": {
          "Son": {
            "type": ["producer"],
            "volume": "0"
          },
          "Vue": {
            "sense": "Vue"
          }
        },
        "purpose": "sense"
      },
      {
        "value": "jeux de Billards",
        "purpose": "transcription",
			},
		 	"creator": {
          "id": "id_user",
          "name": "user_name"
        },
        "created": "2022-07-12T10:26:57.607Z"
      }
    ],
    "target": {
      "source": "data:image/jpeg;base64..... OU mettre URL de l'image OU nom du fichier image (unique)",
      "selector": {
        "type": "FragmentSelector",
        "conformsTo": "http://www.w3.org/TR/media-frags/",
        "value": "xywh=pixel:324,174,411,106"
      }
    },
    "@context": "http://www.w3.org/ns/anno.jsonld",
    "id": "#a39cbd17-6d53-4c7b-8500-354f0dcb9cf4"
  },
  {
    "type": "Annotation",
    "body": [
      {
        "value": {
          "Vue": {
            "sense": "Vue"
          },
          "Son": {
            "type": [
              "producer"
            ],
            "volume": "42"
          }
        },
        "purpose": "sense"
      },
      {
        "value": "vendeurs de café",
        "purpose": "transcription"
			}
 		"creator": {
          "id": "alefi-20-20",
          "name": "Alexis"
        },
        "created": "2022-07-12T10:26:57.607Z"
      }
    ],
    "target": {
      "source": "data:image/jpeg;base64....",
      "selector": {
        	"type": "SvgSelector",
        	"value": "<svg><polygon points=\"544,12 749,111 776,27\" /></svg>"
      }
    },
    "@context": "http://www.w3.org/ns/anno.jsonld",
    "id": "#6fefe9fc-2543-40ad-9c0f-3147c7f26af0"
  }
]
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

## `/deleteAnnotation`

{% hint style="danger" %}
**This request requiere the user to be an editor.**
{% endhint %}

{% swagger method="get" path="deleteAnnotation" baseUrl="/" summary="Deletes" %}
{% swagger-description %}
Deletes 
{% endswagger-description %}

{% swagger-parameter in="header" name="x-access-token" required="true" %}
Editor user token
{% endswagger-parameter %}

{% swagger-parameter in="body" name="id" %}
annotation_id to delete
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="Annotation deleted" %}
```json
[
  {
    "type": "Annotation",
    "body": [
      {
        "value": {
          "Son": {
            "type": ["producer"],
            "volume": "0"
          },
          "Vue": {
            "sense": "Vue"
          }
        },
        "purpose": "sense"
      },
      {
        "value": "jeux de Billards",
        "purpose": "transcription",
			},
		 	"creator": {
          "id": "id_user",
          "name": "user_name"
        },
        "created": "2022-07-12T10:26:57.607Z"
      }
    ],
    "target": {
      "source": "data:image/jpeg;base64..... OU mettre URL de l'image OU nom du fichier image (unique)",
      "selector": {
        "type": "FragmentSelector",
        "conformsTo": "http://www.w3.org/TR/media-frags/",
        "value": "xywh=pixel:324,174,411,106"
      }
    },
    "@context": "http://www.w3.org/ns/anno.jsonld",
    "id": "#a39cbd17-6d53-4c7b-8500-354f0dcb9cf4"
  },
  {
    "type": "Annotation",
    "body": [
      {
        "value": {
          "Vue": {
            "sense": "Vue"
          },
          "Son": {
            "type": [
              "producer"
            ],
            "volume": "42"
          }
        },
        "purpose": "sense"
      },
      {
        "value": "vendeurs de café",
        "purpose": "transcription"
			}
 		"creator": {
          "id": "alefi-20-20",
          "name": "Alexis"
        },
        "created": "2022-07-12T10:26:57.607Z"
      }
    ],
    "target": {
      "source": "data:image/jpeg;base64....",
      "selector": {
        	"type": "SvgSelector",
        	"value": "<svg><polygon points=\"544,12 749,111 776,27\" /></svg>"
      }
    },
    "@context": "http://www.w3.org/ns/anno.jsonld",
    "id": "#6fefe9fc-2543-40ad-9c0f-3147c7f26af0"
  }
]
```
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="Token is missing or invalid" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="403: Forbidden" description="User is not allowed to delete" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}

## `/updateAnnotationCoord`

{% hint style="danger" %}
**This request requiere the user to be an editor.**
{% endhint %}

{% swagger method="get" path="updateAnnotationCoord" baseUrl="/" summary="Update the coordinates in the image" %}
{% swagger-description %}
Update
{% endswagger-description %}

{% swagger-parameter in="header" name="x-access-token" required="true" %}
User token
{% endswagger-parameter %}

{% swagger-parameter in="query" name="<id>" required="true" %}
Id of the image
{% endswagger-parameter %}

{% swagger-parameter in="body" name="id" required="true" %}
annotation_id to edit
{% endswagger-parameter %}

{% swagger-parameter in="body" name="zone_coord" required="true" %}
New coordinates in the image
{% endswagger-parameter %}

{% swagger-response status="200: OK" description="JSON object with all the annotations" %}
```json
[
  {
    "type": "Annotation",
    "body": [
      {
        "value": {
          "Son": {
            "type": ["producer"],
            "volume": "0"
          },
          "Vue": {
            "sense": "Vue"
          }
        },
        "purpose": "sense"
      },
      {
        "value": "jeux de Billards",
        "purpose": "transcription",
			},
		 	"creator": {
          "id": "id_user",
          "name": "user_name"
        },
        "created": "2022-07-12T10:26:57.607Z"
      }
    ],
    "target": {
      "source": "data:image/jpeg;base64..... OU mettre URL de l'image OU nom du fichier image (unique)",
      "selector": {
        "type": "FragmentSelector",
        "conformsTo": "http://www.w3.org/TR/media-frags/",
        "value": "xywh=pixel:324,174,411,106"
      }
    },
    "@context": "http://www.w3.org/ns/anno.jsonld",
    "id": "#a39cbd17-6d53-4c7b-8500-354f0dcb9cf4"
  },
  {
    "type": "Annotation",
    "body": [
      {
        "value": {
          "Vue": {
            "sense": "Vue"
          },
          "Son": {
            "type": [
              "producer"
            ],
            "volume": "42"
          }
        },
        "purpose": "sense"
      },
      {
        "value": "vendeurs de café",
        "purpose": "transcription"
			}
 		"creator": {
          "id": "alefi-20-20",
          "name": "Alexis"
        },
        "created": "2022-07-12T10:26:57.607Z"
      }
    ],
    "target": {
      "source": "data:image/jpeg;base64....",
      "selector": {
        	"type": "SvgSelector",
        	"value": "<svg><polygon points=\"544,12 749,111 776,27\" /></svg>"
      }
    },
    "@context": "http://www.w3.org/ns/anno.jsonld",
    "id": "#6fefe9fc-2543-40ad-9c0f-3147c7f26af0"
  }
]
```
{% endswagger-response %}

{% swagger-response status="401: Unauthorized" description="Token is missing or invalid" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}

{% swagger-response status="403: Forbidden" description="User is not allowed to edit" %}
```javascript
{
    // Response
}
```
{% endswagger-response %}
{% endswagger %}
