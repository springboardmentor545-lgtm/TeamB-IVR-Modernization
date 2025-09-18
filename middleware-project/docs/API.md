# API Documentation: IVR Endpoints

## 1\. Overview

This middleware serves as the main entry point for the IVR (Interactive Voice Response) system. It receives user inputs (digits or natural language) and routes them to the appropriate backend service for processing. The base URL for all endpoints is `http://localhost:3000`.

### ACS Service:

Handles requests for account balance (digit: "1") and account recharge (digit: "2").

### BAP Service:

Handles requests to connect to a live agent (digit: "3").

## 2\. Endpoint: /ivr/request

This is the primary endpoint that receives all user digit inputs from the IVR system. The router is defined in `ivrRoutes.js` and the controller logic is in `ivrController.js`.

**Method:** `POST`
**URL:** `http://localhost:3000/ivr/request`
**Content-Type:** `application/json`

**Purpose:** It validates the incoming `sessionId` and `digit`, then forwards the request to either the ACS or BAP service based on the digit provided.

### 2.1 Request Body

```json
{
  "sessionId": "abc123",
  "digit": "1"
}
```

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `sessionId` | String | Yes | A unique identifier for the user's call session. |
| `digit` | String | Yes | The digit pressed by the user on the IVR (1, 2, or 3). |

### 2.2 cURL Example

```bash
curl -X POST http://localhost:3000/ivr/request \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"abc123", "digit":"1"}'
```

## 3\. Endpoint: /ivr/conversation

This endpoint handles natural language input from users and converts it to appropriate service calls using intent detection. The router is defined in `ivrRoutes.js` and the controller logic is in `conversationController.js`.

**Method:** `POST`
**URL:** `http://localhost:3000/ivr/conversation`
**Content-Type:** `application/json`

**Purpose:** It processes natural language queries, detects user intent using the `IntentDetector` service, and routes to the appropriate service (`/acs/process` or `/bap/process`).

### 3.1 Request Body

```json
{
  "sessionId": "101",
  "query": "check balance"
}
```

| Field | Type | Required | Description |
| :--- | :--- | :--- | :--- |
| `sessionId` | String | Yes | A unique identifier for the user's call session. |
| `query` | String | Yes | Natural language input from the user. |

### 3.2 Supported Intents

The `intentService.js` file maps keywords to specific intents, services, and digits.

| Intent | Example Queries | Service | Digit | Description |
| :--- | :--- | :--- | :--- | :--- |
| `balance_inquiry` | "check balance", "what's my balance?", "show account balance" | ACS | 1 | Check account balance |
| `recharge_account` | "recharge account", "top up", "add money" | ACS | 2 | Recharge account |
| `agent_support` | "talk to agent", "customer support", "I need help" | BAP | 3 | Connect to agent/support |

### 3.3 cURL Example

```bash
curl -X POST http://localhost:3000/ivr/conversation \
  -H "Content-Type: application/json" \
  -d '{"sessionId":"101", "query":"check my account balance"}'
```

## 4\. Responses

### 4.1 Success Responses (Digit-based /ivr/request)

The structure of a successful response includes the `sessionId` and the `message` from the downstream service.

  * **Case 1: Digit = "1" (Balance Inquiry from ACS)**
      * **Status Code:** `200 OK`
      * **Response Body:**
        ```json
        {
          "sessionId": "abc123",
          "response": "Your account balance is ₹500."
        }
        ```
  * **Case 2: Digit = "2" (Recharge from ACS)**
      * **Status Code:** `200 OK`
      * **Response Body:**
        ```json
        {
          "sessionId": "abc123",
          "response": "Your recharge has been processed successfully. ₹100 has been added to your account."
        }
        ```
  * **Case 3: Digit = "3" (Agent Transfer from BAP)**
      * **Status Code:** `200 OK`
      * **Response Body:**
        ```json
        {
          "sessionId": "abc123",
          "response": "Connecting you to a live agent. Please hold while we transfer your call. Your estimated wait time is 2 minutes."
        }
        ```

### 4.2 Success Responses (Conversation-based /ivr/conversation)

The conversation endpoint returns additional fields including the detected `intent` and `confidence`.

  * **Case 1: Balance Inquiry**
      * **Status Code:** `200 OK`
      * **Response Body:**
        ```json
        {
          "sessionId": "101",
          "intent": "balance_inquiry",
          "confidence": "number",
          "response": "Your account balance is ₹500."
        }
        ```
  * **Case 2: Recharge Request**
      * **Status Code:** `200 OK`
      * **Response Body:**
        ```json
        {
          "sessionId": "101",
          "intent": "recharge_account",
          "confidence": "number",
          "response": "Your recharge has been processed successfully. ₹100 has been added to your account."
        }
        ```
  * **Case 3: Agent Support**
      * **Status Code:** `200 OK`
      * **Response Body:**
        ```json
        {
          "sessionId": "101",
          "intent": "agent_support",
          "confidence": "number",
          "response": "Connecting you to a live agent. Please hold while we transfer your call. Your estimated wait time is 2 minutes."
        }
        ```

### 4.3 Error Responses

  * **Case 1: Missing Parameters**
      * **For `/ivr/request`**
          * **Status Code:** `400 Bad Request`
          * **Response Body:**
            ```json
            {
              "error": "Missing sessionId or digit"
            }
            ```
      * **For `/ivr/conversation`**
          * **Status Code:** `400 Bad Request`
          * **Response Body:**
            ```json
            {
              "error": "Missing sessionId or query",
              "required": ["sessionId", "query"]
            }
            ```
  * **Case 2: Invalid Digit or Unrecognized Intent**
      * **For `/ivr/request`**
          * **Status Code:** `400 Bad Request`
          * **Response Body:**
            ```json
            {
              "error": "Invalid option selected"
            }
            ```
      * **For `/ivr/conversation`**
          * **Status Code:** `400 Bad Request`
          * **Response Body:**
            ```json
            {
              "error": "Unable to understand your request",
              "suggestion": "Try asking about 'check balance', 'recharge account', or 'talk to agent'"
            }
            ```
  * **Case 3: Internal Server Error**
      * **For `/ivr/request`**
          * **Status Code:** `500 Internal Server Error`
          * **Response Body:**
            ```json
            {
              "error": "Failed to process request"
            }
            ```
      * **For `/ivr/conversation`**
          * **Status Code:** `500 Internal Server Error`
          * **Response Body:**
            ```json
            {
              "error": "Failed to process conversation request",
              "details": "string"
            }
            ```
