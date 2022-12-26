# Sample NodeJS REST Api 

## Deals with Movie Ratigs

### A movie object
    {
        name: string,
        rating: float,
        review: text
    }



# REST API

The REST API's in the project.




## Get all movies list

Add query parameter "search", "ratingGreaterThan" for detailed search

### Request

    `GET`
    http://localhost:3001/movies/

    http://localhost:3001/movies/?search=mass&ratingGreaterThan=8

### Response
    []





## Create a new Movie

### Request

`POST`

 http://localhost:3001/addMovie/

 #### RequestBody
 Movie parameter is compulsary
    {
        "movie":"Enemy",
        "rating": 8.6,
        "review": "A Pshyshological Thriller- Pshyc"
    }

### Response

    "Movie Added succesfully"





## Get a specific Movie

### Request

    `GET`

    http://localhost:3001/movie/:name

### Response

    {"name":"okkadu","rating":8.9,"review":"Mass"}





## Delete a Movie

### Request

    `DELETE`

    http://localhost:3001/delete/movie/:name

### Response

    "Successfully deleted"





## Update Movie

### Request

    `PATCH`

    http://localhost:7000/update/movie/:name

#### RequestBody
    {
        "rating":9.3,
        "review":""
    }

### Response

    "Updated Successfully"