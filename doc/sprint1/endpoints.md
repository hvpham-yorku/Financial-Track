# API Endpoints

## Auth

### POST /auth/register

Client request:

```typescript
const res = fetch(BASE_URL + "/auth/register", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: { username: "username", password: "password" },
});
```

Server response:

```typescript
{
  data: string | null; // jwt_token
  error: string | null;
}
```

### POST /auth/login

Client request:

```typescript
const res = fetch(BASE_URL + "/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: { username: "username", password: "password" },
});
```

Server response:

```typescript
{
  data: string | null; // jwt_token
  error: string | null;
}
```

---

> Make sure you save the jwt_token in the browser (localstorage for example). It has the current logged in user's information. It is used to get protected information.

## Transactions

All /transactions endpoints are protected with JWT token. You need to pass the jwt_token you got from the /auth/login or /auth/register endpoints in the header as shown below:

```typescript
const res = fetch(TRANSACTIONS_URL, {
  headers: {
    Authorization: "Bearer <jwt_token>",
  },
});
```

### GET /transactions/all

Server response:

```typescript
{
  data: Transaction[];
  error: string | null;
}
```

### GET /transactions/all-split

Server response:

```typescript
{
  data: {income: Transaction[]; expense: Transaction[]};
  error: string | null;
}
```

### GET /transactions/expense

Server response:

```typescript
{
  data: Transaction[];
  error: string | null;
}
```

### GET /transactions/income

Server response:

```typescript
{
  data: Transaction[];
  error: string | null;
}
```

### GET /transactions/tags

Server response:

```typescript
{
  data: string[];
  error: string | null;
}
```

### POST /transactions/add

Client request:

```typescript
const res = fetch(BASE_URL + "/transactions/add", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer <jwt_token>",
  },
  body: { amount: number;
    title: string;
    tag?: string | null;
    type: "income" | "expense";
    createdAt?: Date; },
});
```

Server response:

```typescript
{
  data: Transaction | null; // created transaction
  error: string | null;
}
```

### PATCH /transactions/edit

Client request:

```typescript
const res = fetch(BASE_URL + "/transactions/edit", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer <jwt_token>",
  },
  body: { id: number;
    amount?: number;
    title?: string;
    tag?: string | null;
    type?: "income" | "expense";
    createdAt?: Date; },
});
```

Server response:

```typescript
{
  error: string | null;
}
```

### DELETE /transactions/delete

Client request:

```typescript
const res = fetch(BASE_URL + "/transactions/delete", {
  method: "DELETE",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer <jwt_token>",
  },
  body: { id: number; }
});
```

Server response:

```typescript
{
  error: string | null;
}
```

## Users

All /users endpoints are protected with JWT token. You need to pass the jwt_token you got from the /auth/login or /auth/register endpoints in the header as shown below:

```typescript
const res = fetch(USERS_URL, {
  headers: {
    Authorization: "Bearer <jwt_token>",
  },
});
```

### GET /users/budget

Server response:

```typescript
{
  data: {budget: number;} | null;
  error: string | null;
}
```
