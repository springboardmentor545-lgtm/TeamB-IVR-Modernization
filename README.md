# TeamB-IVR-Modernization
## Documentation

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant IVR
    participant Middleware
    participant Backend

    User->>IVR: Call and give input
    IVR->>Middleware: Send input
    Middleware->>Backend: Process request
    Backend-->>Middleware: Send response
    Middleware-->>IVR: Return processed info
    IVR-->>User: Provide response
