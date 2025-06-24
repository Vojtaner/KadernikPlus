Visit https://mermaid.live/edit and paste there this value to see diagram.

```

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
        date date
        string note
        decimal paid_price
        string user_id
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
        number minutes_performed
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
        string stock_allowance_id FK
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
        string procedure_id FK
        number quantity
    }

    clients ||--o{ visits : has
    visits ||--o{ visit_services : inscludes
    services ||--o{ visit_services : used_in
    visits ||--o{ photos : has
    visits ||--o{ procedures : has
    visits ||--o{ users : has
    stock_allowances ||--|| procedures : consumes
    users ||--o{ stock_allowances : takes_some_quantity
    stock_items ||--o{ stock_allowances : takes_some_quantity_from

```
