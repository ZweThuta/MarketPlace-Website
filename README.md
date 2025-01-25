<h1>Market Place website - frontend for REACT js and backend for PHP and Php my admin<h1/>
# React and PHP Project Setup Documentation

This README file provides all the necessary information to set up and run a web application built with **React** (frontend) and **PHP** (backend). Follow the guide below to ensure a smooth installation and resolve common issues.

---

## Table of Contents

1. [React Setup](#react-setup)
   - [Prerequisites](#prerequisites)
   - [Step-by-Step Installation Guide](#step-by-step-installation-guide)
   - [Fixing Get-ExecutionPolicy Error](#fixing-get-executionpolicy-error)
2. [PHP Setup](#php-setup)
   - [Prerequisites](#php-prerequisites)
   - [Setting up the PHP Backend](#setting-up-the-php-backend)
   - [Database Setup](#database-setup)
3. [Contributing](#contributing)
4. [License](#license)

---

## React Setup

### Prerequisites

Ensure the following tools are installed on your system:

- [Node.js](https://nodejs.org/) (LTS version recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Step-by-Step Installation Guide

1. Clone the repository:

   ```bash
   git clone https://github.com/ZweThuta/MarketPlace-Website.git
   cd client
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`.

### Fixing Get-ExecutionPolicy Error

If you encounter an error related to `Get-ExecutionPolicy`, follow these steps:

1. Open PowerShell as Administrator.
2. Check the current execution policy:
   ```powershell
   Get-ExecutionPolicy
   ```
3. If the policy is restrictive (e.g., `Restricted`), temporarily change it:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
   ```
4. Retry the failed command (e.g., `npm run dev`).
5. Revert the execution policy to its original state:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Restricted
   ```

---

## PHP Setup

### Prerequisites

Ensure the following are installed on your system:

- [PHP](https://www.php.net/) (version 7.4 or later)
- A web server like [Apache](https://httpd.apache.org/) (comes with XAMPP) or [Nginx](https://nginx.org/)

### Setting up the PHP Backend

1. Install the **PHP Server** extension in Visual Studio Code.
2. Navigate to the `backend` directory of the project.
3. Open any PHP file in VS Code.
4. Use the PHP Server extension to start the server by clicking **Run Server**.

### Database Setup

1. Start XAMPP and ensure Apache and MySQL are running.
2. Open **phpMyAdmin** from the XAMPP control panel.
3. Create a new database named `marketplace`.
4. Import the provided SQL file:
   - Locate the `marketplace.sql` file.
   - Go to the **Import** tab in phpMyAdmin.
   - Choose the file and click **Go** to complete the import.

---

## Contributing

We welcome contributions! To contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Submit a pull request with a detailed description of your changes.

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT). Feel free to use and modify the code as per the license terms.

---
