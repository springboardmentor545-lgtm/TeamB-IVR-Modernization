# API Documentation: IVR Endpoints

## 1\. Overview

This document provides detailed documentation for the IVR (Interactive Voice Response) middleware API. This middleware, built with **Node.js** and **Express**, serves as the primary entry point for the IVR system. It is designed to handle user inputs—both DTMF digits and natural language voice commands—and route them to the appropriate backend service for processing.

The base URL for all endpoints is `http://localhost:3000`.

### Key Services:

  * **ACS:** Manages account-related queries.
      * **Digit "1"**: Handles requests for account balance.
      * **Digit "2"**: Handles requests for account recharges.
  * **BAP:** Manages call transfers to live agents.
      * **Digit "3"**: Handles requests to connect to a live agent.

-----

## 2\. Endpoints

### 2.1. Digit-Based Routing (`/ivr/request`)

This is the primary endpoint for receiving user inputs from a traditional IVR keypad. The routing logic is defined in `routes/ivrRoutes.js` and handled by the `controllers/ivrController.js`.

  * **Method:** `POST`
  * **URL:** `http://localhost:3000/ivr/request`
  * **Content-Type:** `application/json`
  * **Purpose:** Validates the incoming `sessionId` and `digit`, then forwards the request to the appropriate internal service (ACS or BAP).

#### Request Body

| Field       | Type   | Required | Description                                           |
| :---------- | :----- | :------- | :---------------------------------------------------- |
| `sessionId` | String | Yes      | A unique identifier for the user's call session.      |
| `digit`     | String | Yes      | The digit pressed by the user on the IVR ("1", "2", or "3"). |

**Example Request:**

```json
{
  "sessionId": "abc123",
  "digit": "1"
}
```

#### cURL Example

```bash
curl -X POST http://localhost:3000/ivr/request \
 -H "Content-Type: application/json" \
 -d '{"sessionId":"abc123", "digit":"1"}'
```

-----

### 2.2. Conversation-Based Routing (`/ivr/conversation`)

This endpoint is designed to handle natural language input from users, which is then translated into service calls using an intent detection model. The logic is defined in `routes/ivrRoutes.js` and handled by `controllers/conversationController.js`.

  * **Method:** `POST`
  * **URL:** `http://localhost:3000/ivr/conversation`
  * **Content-Type:** `application/json`
  * **Purpose:** Processes a natural language query, detects the user's intent using the `IntentDetector` service, and routes the request to the correct internal service.

#### Request Body

| Field       | Type   | Required | Description                               |
| :---------- | :----- | :------- | :---------------------------------------- |
| `sessionId` | String | Yes      | A unique identifier for the call session. |
| `query`     | String | Yes      | The natural language query from the user. |

**Example Request:**

```json
{
  "sessionId": "abc123",
  "query": "Can you check my account balance?"
}
```

#### Supported Intents

The intent detection logic in `services/intentService.js` maps user keywords to one of the following intents:

| Intent             | Example Queries                                          | Service | Digit | Description                |
| :----------------- | :------------------------------------------------------- | :------ | :---- | :------------------------- |
| `balance_inquiry`  | "check balance", "what's my balance?", "show my money"    | ACS     | 1     | Check account balance.     |
| `recharge_account` | "recharge account", "top up my phone", "add more credit" | ACS     | 2     | Recharge the user's account. |
| `agent_support`    | "talk to an agent", "I need help", "customer support"    | BAP     | 3     | Connect to a live agent.   |

#### cURL Example

```bash
curl -X POST http://localhost:3000/ivr/conversation \
 -H "Content-Type: application/json" \
 -d '{"sessionId":"abc123", "query":"check my account balance"}'
```

-----

## 3\. Responses

### 3.1. Success Responses

#### `/ivr/request` (Digit-Based)

  * **Balance Inquiry (Digit: "1")**
      * **Status:** `200 OK`
      * **Body:**
        ```json
        {
          "sessionId": "abc123",
          "response": "Your account balance is ₹500."
        }
        ```
  * **Recharge (Digit: "2")**
      * **Status:** `200 OK`
      * **Body:**
        ```json
        {
          "sessionId": "abc123",
          "response": "Your recharge has been processed successfully. ₹100 has been added to your account."
        }
        ```
  * **Agent Transfer (Digit: "3")**
      * **Status:** `200 OK`
      * **Body:**
        ```json
        {
          "sessionId": "abc123",
          "response": "Connecting you to a live agent. Please hold while we transfer your call. Your estimated wait time is 2 minutes."
        }
        ```

#### `/ivr/conversation` (Natural Language)

  * **Balance Inquiry**
      * **Status:** `200 OK`
      * **Body:**
        ```json
        {
          "sessionId": "abc123",
          "intent": "balance_inquiry",
          "response": "Your account balance is ₹500."
        }
        ```
### 3.2. Error Responses

  * **Missing Parameters (400 Bad Request)**

      * For `/ivr/request`:
        ```json
        {
          "error": "Missing sessionId or digit"
        }
        ```
      * For `/ivr/conversation`:
        ```json
        {
          "error": "Missing sessionId or query",
          "required": ["sessionId", "query"]
        }
        ```

  * **Invalid Input (400 Bad Request)**

      * For an invalid digit in `/ivr/request`:
        ```json
        {
          "error": "Invalid option selected"
        }
        ```
      * For an unrecognized query in `/ivr/conversation`:
        ```json
        {
          "error": "Unable to understand your request",
          "suggestion": "Try asking about 'check balance', 'recharge account', or 'talk to agent'"
        }
        ```

  * **Internal Server Error (500 Internal Server Error)**

      * This indicates a failure in one of the downstream services.
      * For `/ivr/request`:
        ```json
        {
          "error": "Failed to process request"
        }
        ```
      * For `/ivr/conversation`:
        ```json
        {
          "error": "Failed to process conversation request",
          "details": "<error_message_from_service>"
        }
        ```
