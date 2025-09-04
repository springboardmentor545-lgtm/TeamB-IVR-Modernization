# TeamB-IVR-Modernization
## Documentation
## Introduction
📌 Purpose of the Project
The purpose of this project is to modernize an IVR (Interactive Voice Response) system so that it becomes faster, smarter, and easier for users to interact with. A modern IVR helps businesses improve customer experience, reduce wait times, and handle requests more efficiently without needing human support every time.
The following section explains how different parts of the IVR system interact with each other.  
We use a **sequence diagram** to show the step-by-step flow of communication between:  

- **User** → the person making the call  
- **IVR** → the Interactive Voice Response system that takes input  
- **Middleware** → the layer that processes and forwards requests  
- **Backend** → the system that provides data and final responses  

### Sequence Diagram

```mermaid
sequenceDiagram
    participant User
    participant IVR
    participant Middleware
    participant Backend

    User->>IVR: Call and press a key (e.g., 1 for Balance)
    IVR->>Middleware: Send input
    Middleware->>Backend: Request account balance
    Backend-->>Middleware: Return balance details
    Middleware-->>IVR: Send processed balance info
    IVR-->>User: Play balance response

    alt Invalid Input
        IVR-->>User: Play error message (Invalid option)
        IVR-->>User: Ask to re-enter input
    end

```

### Explanation
The sequence diagram shows how the IVR system works:
1. The **User** calls and gives input to the **IVR**.
2. The **IVR** sends the input to the **Middleware**.
3. The **Middleware** processes the request by contacting the **Backend**.
4. The **Backend** sends back the response to the **Middleware**.
5. The **Middleware** returns the processed information to the **IVR**.
6. Finally, the **IVR** provides the response back to the **User**.

This flow ensures smooth communication between the user and backend through the IVR system.
