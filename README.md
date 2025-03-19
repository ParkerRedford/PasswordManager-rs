Uploaded to GitHub so that I can recover the project if I accidentally delete it on my computer.

Frontend update so that the app displays information from a JSON file. Here is what you need.
```json
[
{
  "id": "Uuid", //optional
  "website": "String", //required
  "username": "String", //optional
  "password": "String", //required
  "password_hint": "String" //optional
  "questions": [    //optional
    ["question", "answer"],
    ["question", "answer"]
  ],
  "notes": "String" //optional
},
{
...
}
]
```

The app, so far, only has one working function (and tested) that randomly generates a password and returns a String variable. The get() function in the Metadata should work too, but it uses the linear search algorithm. I will eventually implement the B-Tree algorithm for faster queries.
