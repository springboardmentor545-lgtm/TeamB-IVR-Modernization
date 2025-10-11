# API Documentation: IVR Endpoints

## 1. Overview

This middleware serves as the main entry point for the IVR (Interactive Voice Response) system. It receives user inputs (digits or natural language) and routes them to the appropriate backend service for processing.

### ACS :

Handles requests for account balance (digit: "1") and agent transfers (digit: "2").

### BAP :

Handles requests for the payment service (digit: "3").

## 2. Endpoint: /ivr/request

This is the primary endpoint that receives all user digit inputs from the IVR system.

Method: POST
URL: http://localhost:3000/ivr/request
Content-Type: application/json

Purpose: It validates the incoming sessionId and digit, then forwards the request to either the ACS or BAP service based on the digit provided.

### 2.1 Request Body

```JSON
{
  "sessionId": "abc123",
  "digit": "1"
}
```

| Field       | Type   | Required | Description                                            |
| :---------- | :----- | :------- | :----------------------------------------------------- |
| `sessionId` | String | Yes      | A unique identifier for the user's call session.       |
| `digit`     | String | Yes      | The digit pressed by the user on the IVR (1, 2, or 3). |

### 2.2 cURL Example

`curl -X POST http://localhost:3000/ivr/request \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"abc123", "digit":"1"}'`

## 3. NEW: Endpoint: /ivr/conversation

This new endpoint handles natural language input from users and converts it to appropriate service calls using intent detection.

Method: POST
URL: http://localhost:3000/ivr/conversation
Content-Type: application/json

Purpose: It processes natural language queries, detects user intent, and routes to the appropriate service.

### 3.1 Request Body

```JSON
{
  "sessionId": "101",
  "query": "check balance"
}
```

| Field       | Type   | Required | Description                                      |
| :---------- | :----- | :------- | :----------------------------------------------- |
| `sessionId` | String | Yes      | A unique identifier for the user's call session. |
| `query`     | String | Yes      | Natural language input from the user.            |

### 3.2 Supported Intents

| Intent             | Example Queries                                               | Service | Description              |
| ------------------ | ------------------------------------------------------------- | ------- | ------------------------ |
| `balance_inquiry`  | "check balance", "what's my balance?", "show account balance" | ACS     | Check account balance    |
| `recharge_account` | "recharge account", "top up", "add money"                     | ACS     | Recharge account         |
| `agent_support`    | "talk to agent", "customer support", "I need help"            | BAP     | Connect to agent/support |

### 3.3 cURL Example

```bash
curl -X POST http://localhost:3000/ivr/conversation \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"101", "query":"check my account balance"}'
```

## 4. Responses

### 4.1 Success Responses (Digit-based /ivr/request)

The structure of a successful response includes the sessionId and the response message from the downstream service.

Case 1:
Digit = "1" (Balance Inquiry from ACS)
Status Code: 200 OK

```JSON
{
  "sessionId": "abc123",
  "response": "ACS: Your account balance is $500."
}
```

Case 2:
Digit = "2" (Agent Transfer from ACS)
Status Code: 200 OK

```JSON
{
  "sessionId": "abc123",
  "response": "ACS: Recharge processed successfully."
}
```

Case 3: Digit = "3" (Payment Service from BAP)
Status Code: 200 OK

```JSON
{
  "sessionId": "abc123",
  "response": "BAP: Your complaint has been registered."
}
```

### 4.2 Success Responses (Conversation-based /ivr/conversation)

The conversation endpoint returns additional fields including detected intent and confidence score.

Case 1: Balance Inquiry
Status Code: 200 OK

```JSON
{
  "sessionId": "101",
  "intent": "balance_inquiry",
  "confidence": 0.5,
  "response": "ACS: Your account balance is $500."
}
```

Case 2: Recharge Request
Status Code: 200 OK

```JSON
{
  "sessionId": "101",
  "intent": "recharge_account",
  "confidence": 0.6,
  "response": "ACS: Recharge processed successfully."
}
```

Case 3: Agent Support
Status Code: 200 OK

```JSON
{
  "sessionId": "101",
  "intent": "agent_support",
  "confidence": 0.4,
  "response": "BAP: Your complaint has been registered."
}
```

### 4.3 Error Responses

#### For /ivr/request endpoint:

Case 1: Missing Parameters
Status Code: 400 Bad Request

```JSON
{
  "error": "Missing sessionId or digit"
}
```

Case 2: Invalid Digit (Any digit other than 1, 2, or 3)
Status Code: 400 Bad Request

```JSON
{
  "error": "Invalid option selected"
}
```

#### For /ivr/conversation endpoint:

Case 1: Missing Parameters
Status Code: 400 Bad Request

```JSON
{
  "error": "Missing sessionId or query",
  "required": ["sessionId", "query"]
}
```

Case 2: Intent Not Recognized
Status Code: 400 Bad Request

```JSON
{
  "error": "Unable to understand your request",
  "suggestion": "Try asking about 'check balance', 'recharge account', or 'talk to agent'"
}
```

#### For both endpoints:

Case 3: Internal Server Error (If a downstream service fails)
Status Code: 500 Internal Server Error

```JSON
{
  "error": "Failed to process request"
}
```

Status Code: 200 OK

```JSON
{
  "sessionId": "abc123",
  "response": "Payment service is currently active"
}
```

### 3.2 Error Responses

Case 1: Missing Parameters
Status Code: 400 Bad Request

```JSON
{
  "error": "Missing sessionId or digit"
}
```

Case 2: Invalid Digit (Any digit other than 1, 2, or 3)
Status Code: 400 Bad Request

```JSON
{
  "error": "Invalid option selected"
}
```

![Invalid Digit Example](./screenshots/error.png)

Case 3: Internal Server Error (If a downstream service fails)

Status Code: 500 Internal Server Error

```JSON
{
  "error": "Something went wrong"
}
```
