# 🏢 BayFint - Laravel Payroll Service Platform

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-00000F?style=for-the-badge&logo=mysql&logoColor=white)

## 👋 About The Project
BayFint is a payroll service platform designed to simplify payroll processing for small to medium-sized businesses. The platform handles employee data management, salary calculations, and generates payslips with a focus on security and user experience.

---

## 🔑 Key Features
- **User Management**: Secure authentication and authorization for administrators and employees.
- **Employee Management**: CRUD operations for employee records including personal information, job details, and salary structures.
- **Payroll Processing**: Automated calculation of gross and net pay with support for various deductions and taxes.
- **Payslip Generation**: Generate and download payslips in PDF format.

---

## 🛠️ Tech Stack
- **Backend**: Laravel 13
- **Frontend**: React + Vite
- **Style**: Tailwind CSS
- **Database**: MySQL

---

## 💻 Installation (Local Development)

### Prerequisites
- Herd/XAMPP/Laragon
- DBNgin/Tableplus/PhpMyAdmin


### Environment Variables
Set the .env file:
```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=bayfint
DB_USERNAME=root
DB_PASSWORD=
```

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/FaishalFaiz/BayFint-Laravel-Payroll-Service
   cd BayFint-Laravel-Payroll-Service
   ```

2. Install the packages & DB Migrations:
   ```bash
   composer install
   npm install
   php artisan migrate
   ```

3. Run the application:
   ```bash
    php artisan serve
    npm run dev
   ```

