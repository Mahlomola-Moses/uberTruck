# Customer feedback management  

## Overview  
This project is a **monolithic** web application built using:  
- **Backend:** Node.js with Express.js  
- **Frontend:** Angular  
- **Database:** MongoDB  
- **Containerization:** Docker Compose  
- **API Documentation:** Swagger  

### Why Monolithic Architecture?  
1. **Simplicity & Maintainability** – A single codebase makes it easier to develop and debug.  
2. **Performance** – Suitable for the current project scale without requiring microservices.  
3. **Deployment & Management** – Easier to deploy with **Docker Compose** instead of managing multiple services separately.  
4. **Data Consistency** – Using MongoDB as a single database ensures smooth transactions and integrity.  

---

## Running the Project  

### Prerequisites  
Ensure you have the following installed:  
- [Docker & Docker Compose](https://docs.docker.com/get-docker/)  
- [Angular CLI](https://angular.io/cli)  


### Steps to Run Using Docker Compose  
1. Clone the repository:  
   ```bash
   git clone https://github.com/Mahlomola-Moses/customer_feedback_management_sys/tree/dev
   cd your-repo
   ```  
2. Start all services using Docker Compose:  
   ```bash
   docker-compose build
   ```  
   ```bash
   docker-compose up -d
   ``` 
### Steps to Run Angular   
1. Start Angular

  ```bash
  cd frontend
  ng serve
  ```

 The backend will be available at `http://localhost:35050`  
 The frontend will be accessible at `http://localhost:4200` 
 
### Auto-generated user for the first login
 `Email: superadmin@yopmail.com`
 `Password: string`

### Customer feedback link
  `http://localhost:4200/feedback`

---

## API Documentation (Swagger)  
1. Once the backend is running, open:  
   ```
   http://localhost:35050/api-docs
   ```
2. Here, you can explore all available API endpoints and test them directly.
 

### **Authentication & Authorization**  
To access protected endpoints, you need to authenticate and obtain a token:  

#### **Login & Get Token**  
- **Endpoint:** `POST /auth/login`  
- **Body:**  
```json
{
 "email": "superadmin@yopmail.com",
 "password": "string"
}
```
- **Body:** 
```json
{
 "token": "your_jwt_token",
 
}
```
---

## Testing with Postman  
1. Open Postman and import the **API Collection** from `postman_collection.json` (if available).  
2. Set the **Base URL** to:  
   ```
   http://localhost:3000/api
   ```
3. Use Postman to send requests like:  
   - **POST /users** – Create a new user  
   - **GET /users** – Fetch all users  
   - **PUT /users/:id** – Update user details  
   - **DELETE /users/:id** – Remove a user  


