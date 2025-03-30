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

### GET /transactions/month/[month]

Server response:

```typescript
{
  data: Transaction[];
  error: string | null;
}
```

### GET /transactions/week/[week]

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

### POST /transactions/week

Client request:

```typescript
const res = fetch(BASE_URL + "/transactions/week", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer <jwt_token>",
  },
  body: { date: Date | string };
```

Server response:

```typescript
{
  data: Transaction[];
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

## Budget

All /budget endpoints are protected with JWT token. You need to pass the jwt_token you got from the /auth/login or /auth/register endpoints in the header as shown below:

```typescript
const res = fetch(BUDGET_URL, {
  headers: {
    Authorization: "Bearer <jwt_token>",
  },
});
```

### GET /budget

Server response:

```typescript
{
  data: Budget[];
  error: string | null;
}
```

### GET /budget/[id]

Server response:

```typescript
{
  data: Budget | null;
  error: string | null;
}
```

### POST /budget

Client request:

```typescript
const res = fetch(BASE_URL + "/budget", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer <jwt_token>",
  },
  body: {
    amount: number;
    note: string;
    monthYear: Date;
   },
});
```

Server response:

```typescript
{
  data: Budget | null; // created budget
  error: string | null;
}
```

### PATCH /budget/edit

Client request:

```typescript
const res = fetch(BASE_URL + "/budget/edit", {
  method: "PATCH",
  headers: {
    "Content-Type": "application/json",
    Authorization: "Bearer <jwt_token>",
  },
  body: {
    id: number;
    amount?: number;
    note?: string;
    monthYear?: Date
    },
});
```

Server response:

```typescript
{
  error: string | null;
}
```

### DELETE /budget/delete

Client request:

```typescript
const res = fetch(BASE_URL + "/budget/delete", {
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

---

> Users endpoint does not exist anymore.
