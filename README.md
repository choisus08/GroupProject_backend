# Travel Diary 
**By:** Paul Bunda, Susie Gordon, Nicholas Smith

## TRAVEL DIARY
Travelog is a travel diary site where users can view, post, edit, and delete posts that include information about places they've traveled to. The data model for each post will be an "Entry", and each entry may include a place, a landmark, an image, and dates. Data for the app will be stored, retrieved from, added to, and deleted from the Mongo Database site connected via the Mongoose ODM library. The site is built using RESTFul routes architecture using JavaScript, a Node environment, Express framework, React library, and styled using SCSS and CSS.

</br>

## Link
[**Deployment**](https://groupproject-travel.onrender.com/)
</br>

## Technologies Used
- Postman
- Github
- Javascript
- Express framework

## Backend Endpoints

| Name | ENDPOINT | METHOD | PURPOSE |
|------|----------|--------|---------|
|INDEX| /travel | GET | return list of travel entries|
|DESTROY| /travel/:id | DELETE | delete travel entry from database |
|UPDATE| /travel/:id | PUT | receive info & update tavel entry in database |
|CREATE| /travel | POST | receive info from new form & create new travel entry in database |
|SHOW| /travel/:id | GET | render page with the travel entry|

## ERD

``` mermaid
erDiagram
    USER {
        signup string
        login string 
        password string 
    }
    USER ||--o{ HOME : accountPage
    HOME {
        location string 
        landmark string 
        image string 
        dates string 
    }
    HOME ||--|{ CREATE : createEntry
    CREATE {
        location string 
        landmark string 
        image string 
        dates string 
    }
    HOME ||--|{ EDIT : editEntry
    EDIT {
        location string 
        landmark string 
        image string 
        dates string 
    }
    HOME ||--|{ DELETE : deleteEntry
    DELETE {
        location string 
        landmark string 
        image string 
        dates string 
    }
    HOME ||--o{ LOGOUT : logoutUser
    LOGOUT {
        string LogoutMessage
    }
```

#### Notes for when we Return
- 