Uploaded to GitHub so that I can recover the project if I accidentally delete it on my computer.

Get a JSON file and fill it with accouunt information. Put the JSON file in the same directory as the binary file. Here is what the app requires for the JSON file.
```json
[
{
  "id": "Uuid", //optional
  "website": "String", //required
  "username": "String", //optional
  "password": "String", //required
  "password_hint": "String" //optional
  "questions": [    //optional
    ["question -> String", "answer -> String"],
    ["question -> String", "answer -> String"]
  ],
  "notes": "String" //optional
},
{
...
}
]
```
