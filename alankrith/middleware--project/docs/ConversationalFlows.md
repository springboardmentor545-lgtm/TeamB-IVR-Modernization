# Conversational Flow Design

## Natural Language Use Cases

### 1. Account Balance Inquiry → ACS Service

**User Input Examples:**

- "Check balance"
- "What's my balance?"
- "Show my account balance"
- "Balance inquiry"
- "How much money do I have?"

**Intent:** `balance_inquiry`
**Service:** ACS (digit "1")
**Response:** Account balance information

### 2. Account Recharge → ACS Service

**User Input Examples:**

- "Recharge account"
- "Top up my account"
- "Add money"
- "Recharge my phone"
- "I want to recharge"

**Intent:** `recharge_account`
**Service:** ACS (digit "2")
**Response:** Recharge processing confirmation

### 3. Talk to Agent/Support → BAP Service

**User Input Examples:**

- "Talk to agent"
- "Speak to customer service"
- "I need help"
- "Connect me to support"
- "Human agent please"
- "Customer support"

**Intent:** `agent_support`
**Service:** BAP (digit "3")
**Response:** Agent connection or complaint registration

## Intent-to-Service Mapping Table

| Intent             | Keywords                                      | Service | Digit Equivalent | Description              |
| ------------------ | --------------------------------------------- | ------- | ---------------- | ------------------------ |
| `balance_inquiry`  | balance, check, account, money, show          | ACS     | "1"              | Check account balance    |
| `recharge_account` | recharge, top up, add money, reload           | ACS     | "2"              | Recharge account         |
| `agent_support`    | agent, support, help, human, customer service | BAP     | "3"              | Connect to agent/support |

## Conversational Flow Diagram

```
User Input (Natural Language)
        ↓
Keyword Matching & Intent Detection
        ↓
Intent Classification
        ↓
    ┌─────────────────┬─────────────────┬─────────────────┐
    ↓                 ↓                 ↓
balance_inquiry   recharge_account   agent_support
    ↓                 ↓                 ↓
ACS Service       ACS Service       BAP Service
(digit "1")       (digit "2")       (digit "3")
    ↓                 ↓                 ↓
Response to User  Response to User  Response to User
```

## API Endpoint Specification

**Endpoint:** `POST /ivr/conversation`

**Request Body:**

```json
{
  "sessionId": "string (required)",
  "query": "string (required) - Natural language input"
}
```

**Response:**

```json
{
  "sessionId": "string",
  "intent": "string",
  "response": "string"
}
```

**Example Request:**

```json
{
  "sessionId": "101",
  "query": "check balance"
}
```

**Example Response:**

```json
{
  "sessionId": "101",
  "intent": "balance_inquiry",
  "response": "ACS: Your account balance is $500."
}
```
