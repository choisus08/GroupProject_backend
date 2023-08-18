# Travel Diary 
**By:** Paul Bunda, Susie Gordon, Nicholas Smith

</br>

## TRAVEL DIARY
---
description

</br>

## Deployment
https://groupproject-travel.onrender.com/
</br>

## Technologies Used
- Javscript
- Express Framework
- MongoDB connections
</br>

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