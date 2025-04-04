# Financial Track

Welcome to our project! This document provides an overview of the project, its features, installation instructions, and contribution guidelines.

## Table of Contents

1. [Features](#features)
2. [Installation](#installation)
3. [Team](#team)
4. [Contribution](#contribution)

## Features

Managing personal finances can be overwhelming, especially for individuals with multiple income sources or fluctuating expenses. The Financial Track application aims to simplify financial tracking by providing a user-friendly platform for logging transactions, setting budgets, and analyzing financial habits. Our goal is to empower users to make informed financial decisions and improve their financial stability.

### 1. Budget Management

Track your income and expenses, and create budgets to manage your finances effectively.
Custom Budget Categories:
   - Create personalized categories (e.g., Food, Entertainment)
   - Set monthly allocation amounts (e.g., $500 for Entertainment)

![Project Logo](https://github.com/hvpham-yorku/Financial-Track/blob/sprint2/doc/image/budget.png)

![Project Logo](https://github.com/hvpham-yorku/Financial-Track/blob/sprint2/doc/image/Byellow.png)

![Project Logo](https://github.com/hvpham-yorku/Financial-Track/blob/sprint2/doc/image/Bgreen.png)

### 2. Transaction Tracking

Log and categorize transactions to gain insights into your spending habits.
   - Smart Transaction Logging
      Detailed entry form with:
         Title - (Pizza)
         Amount - (100)
         Tag - (Food)
         Type (Income/Expense)
         Data tracking
     
![Project Logo](https://github.com/hvpham-yorku/Financial-Track/blob/sprint2/doc/image/trans.png)

### 3. User Authentication

Securely log in and manage your account with authentication features.
Login System:
   - Username/Password authentication
   - Secure password field (masked input)
Registration Flow:
   - Password confirmation
   - Success messaging ("Registration successful")

![Project Logo](https://github.com/hvpham-yorku/Financial-Track/blob/sprint2/doc/image/register.png)

![Project Logo](https://github.com/hvpham-yorku/Financial-Track/blob/sprint2/doc/image/login.png)

![Project Logo](https://github.com/hvpham-yorku/Financial-Track/blob/sprint2/doc/image/logout.png)


### 4. UI, Navigation, and Calender Integregation

Visual time-based financial management.
Interactive Calendar:
   - Weekly view with financial data
   - Month navigation (April 2025 shown)
   - Week numbering system (Wk 13-17)
Intuitive user experience:
   - Dual View Mode:
       Toggle between Monthly/Weekly perspectives
   - Action Menu:
      "See all transactions" option
      Contextual actions

![Project Logo](https://github.com/hvpham-yorku/Financial-Track/blob/sprint2/doc/image/month.png)

![Project Logo](https://github.com/hvpham-yorku/Financial-Track/blob/sprint2/doc/image/week.png)



## Installation

Please ensure you have the following installed:

- [Node.js](https://nodejs.org) - Download and install
- [Git](https://git-scm.com/) - Download and install
- [Angular CLI](https://angular.dev/tools/cli/setup-local)

```bash
npm install -g @angular/cli
```

To install and set up the project, follow these steps:

1. **Clone the repository:**

```bash
git clone https://github.com/hvpham-yorku/Financial-Track.git
cd Financial-Track
```

### Client

2. **Install dependencies:**

```bash
   cd FinancialTrack
   cd client
   npm install
```

3. **Run the Application:**

```bash
ng serve
```

The application should now be accessible at http://localhost:4200/.

### Server

4. **Install dependencies:**

```bash
   cd FinancialTrack
   cd server
   npm install
```

5. **Run the Application:**

```bash
npm run db-seed # Add mock data to the database
npm run dev
```

The application should now be accessible at [http://localhost:3000/](http://localhost:3000/).

## Team

| Full Name       | Student ID | Email                  |
| --------------- | ---------- | ---------------------- |
| Kwangmin Ryu    | 217233321  | <danielry@my.yorku.ca> |
| Jay Patel       | 217548207  | <jaym2001@my.yorku.ca> |
| Yashvir Singh   | 217637711  | <yash0407@my.yorku.ca> |
| Mathieu Johnson | 220794343  | <matj10@my.yorku.ca>   |
| Daniel Prilipko | 214286710  | <prilipko@my.yorku.ca> |

## Contribution

We welcome contributions to the Financial Track project! If you'd like to contribute, please follow these steps:

### 1. Fork the Repository

Start by forking the repository to your GitHub account. This allows you to make changes without affecting the original project.

```bash
git clone https://github.com/your-username/Financial-Track.git
cd Financial-Track
```

### 2. Create a Branch for Your Work

Create a new branch for the feature or bug fix you're working on. Use a descriptive name for the branch to help identify the purpose of your changes.

```bash
git checkout -b your-feature-branch
```

### 3. Make Changes and Commit

Work on your changes locally and make sure they follow the project’s coding standards. After making your changes, stage and commit them with a clear, concise commit message.

```bash
git add .
git commit -m "Brief description of the changes made"
```

### 4. Push Your Changes

Push your branch to your forked repository on GitHub.

```bash
git push origin your-feature-branch
```

### 5. Open a Pull Request

Once your changes are pushed, navigate to the original repository and open a pull request. Ensure that your pull request provides a clear description of what you’ve done and any relevant information.

**Guidelines for Pull Requests:**

- Ensure your code passes any existing tests or write new tests if applicable.
- Follow the project's code style and naming conventions.
- Provide a detailed explanation of what the pull request does, including any relevant issues it addresses.
