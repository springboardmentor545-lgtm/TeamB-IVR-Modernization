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
'''

### Explanation
The sequence diagram shows how the IVR system works:
1. The **User** calls and gives input to the **IVR**.
2. The **IVR** sends the input to the **Middleware**.
3. The **Middleware** processes the request by contacting the **Backend**.
4. The **Backend** sends back the response to the **Middleware**.
5. The **Middleware** returns the processed information to the **IVR**.
6. Finally, the **IVR** provides the response back to the **User**.

This flow ensures smooth communication between the user and backend through the IVR system.
