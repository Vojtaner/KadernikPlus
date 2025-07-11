erDiagram
    users {
        
        string id PK
        string name
        string email
        string password_hash
        string auth_provider
        datetime created_at
        datetime last_login
    }

    clients {
        string id PK
        string name
        string phone
        string email
        string note
        date birth_date
    }

    visits {
        string id PK
        string client_id FK
        string user_id FK
        date date
        string note
        decimal paid_price
    }

    services {
        string id PK
        string name
        decimal base_price
    }

    visit_services {
        string id PK
        string visit_id FK
        string service_id FK
        int minutes_performed
    }

    photos {
        string id PK
        string visit_id FK
        string url
        datetime uploaded_at
        string description
    }

    procedures {
        string id PK
        string visit_id FK
        int step_order
        string description
        string stockAllowanceId FK
        decimal grams_used
        int time_minutes
        string issue
        datetime created_at
    }

    stock_items {
        string id PK
        string name
        string unit
        int quantity
        int threshold
        boolean is_active
    }

    stock_allowances {
        string id PK
        string user_id FK
        string stock_id FK
        decimal quantity
        string procedure_id FK
        datetime created_at
    }

    clients ||--o{ visits : "has"
    users ||--o{ visits : "performs"
    visits ||--o{ visit_services : "includes"
    services ||--o{ visit_services : "provides"
    visits ||--o{ photos : "has"
    visits ||--o{ procedures : "details"
    procedures ||--o| stock_allowances : "uses_optional"
    users ||--o{ stock_allowances : "manages"
    stock_items ||--o{ stock_allowances : "allocates"