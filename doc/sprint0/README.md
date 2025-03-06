## EECS3311 Project - Sprint 0

### Team Information

- Course: EECS3311
- Semester: Winter 2025
- Project: Financial Track

### Contents

This directory contains Sprint 0 documentation including:

- Team Agreement
- Sprint Planning
- Initial Requirements
- Project Setup

### Getting Started

All documentation related to Sprint 0 can be found in this directory. Please refer to specific files for detailed information about each component.

### Team Members

| Full Name       | Student ID | Email                |
| --------------- | ---------- | -------------------- |
| Kwangmin Ryu    | 217233321  | danielry@my.yorku.ca |
| Jay Patel       | 217548207  | jaym2001@my.yorku.ca |
| Yashvir Singh   | 217637711  | yash0407@my.yorku.ca |
| Mathieu Johnson | 220794343  | matj10@my.yorku.ca   |
| Daniel Prilipko | 214286710  | prilipko@my.yorku.ca |

## Project Overview

Our Financial Track application is designed to help users manage their personal finances. Users can use our app to track income and expenses, monitor their budgets, and view analytics through our intuitive interface.
Some key features of our application:

- Transaction Logging
- Budget Management
- Expense Categorization
- Financial Reporting

## Motivation and Project Description

Managing personal finances can be overwhelming, especially for individuals with multiple income sources or fluctuating expenses. The Financial Track application aims to simplify financial tracking by providing a user-friendly platform for logging transactions, setting budgets, and analyzing financial habits. Our goal is to empower users to make informed financial decisions and improve their financial stability.

## Installation

Please ensure you have the following installed:

- [Node.js](https://nodejs.org) - Download and install
- [Git](https://git-scm.com/) - Download and install
- [Angular CLI](https://angular.dev/tools/cli/setup-local)

```
npm install -g @angular/cli
```

_To set up the project locally, follow these steps:_

1. Clone the repository

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

3. **Run the Application**

```bash
   ng serve
```

The application should now be accessible at http://localhost:4200/.

### Server

2. **Install dependencies:**

```bash
   cd FinancialTrack
   cd server
   npm install
```

3. **Run the Application**

```bash
   npm run db-seed # Add mock data to the database
   npm run dev
```

The application should now be accessible at http://localhost:3000/.

## Contribution to the Project

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

## Contact

For any questions regarding this sprint's documentation, please contact the team through the course's official channels or use any email of our [team](#team-members).
