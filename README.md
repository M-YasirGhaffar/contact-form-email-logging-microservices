# Custom Form Backend

This repository hosts the backend for a custom contact form application, designed for robustness and scalability. The application supports both microservices and monolithic architectures, addressing various deployment preferences. Each architectural style is maintained in separate branches: `containers` (merged with `main`) for microservices using Docker and Kubernetes, and `heroku-single-service` for a simplified monolithic architecture suitable for deployment on Heroku.

## Branch Overview

- **containers**: Implements a microservices architecture with services containerized using Docker and orchestrated with Kubernetes. This setup is ideal for scalable and distributed environments.
- **heroku-single-service**: Features a monolithic architecture, streamlined for easy deployment on Heroku. This branch is well-suited for smaller-scale applications or for those who prefer simplicity in deployment and management.

## Microservices Description

- **ApiGateway**: Serves as the main entry point for all incoming requests and routes them to the appropriate services. It orchestrates interactions between other services to fulfill requests.
- **ApiValidationService**: Checks the validity of email addresses to ensure they are correctly formatted and actually exist.
- **MongoDBDataLoggingService**: Responsible for logging form submission data to MongoDB, providing a record of user interactions and requests.
- **EmailNotificationService**: Sends emails to the form owner and the user, confirming receipt of the submission and providing any necessary follow-up information.

## Getting Started

### Prerequisites

- Docker and Kubernetes (for the `containers` branch)
- Heroku CLI (for the `heroku-single-service` branch)
- Node.js (for local development and testing)
- Git (for version control management)

### Installation

Clone the repository and navigate to the desired branch:

```bash
git clone https://github.com/M-YasirGhaffar/custom-form-backend-azure-microservices-deploy
cd custom-form-backend-azure-microservices-deploy
git checkout <branch-name>  # Choose 'containers' for microservices or 'heroku-single-service' for monolithic backend.
```

### Local Development

Install dependencies:

```bash
npm install
```

Run the application:

```bash
npm start
```

## Deployment

### Using Docker and Kubernetes (`containers` branch)

Ensure you have set the necessary environment variables as outlined in the `.env.example` file.

1. **Build Docker Images**: Build Docker images using Azure Container Registry (ACR).
   ```bash
   az acr build --registry your-registry-name --image service-name:latest .
   ```
   
2. **Deploy on Kubernetes**: Deploy using Azure Kubernetes Service (AKS).
   ```bash
   kubectl apply -f deployments/kubernetes/
   ```

### Deploying on Heroku (`heroku-single-service` branch)

Set the necessary environment variables following the `.env.example` file.

1. **Create Heroku App**:
   ```bash
   heroku create
   ```

2. **Deploy Application**:
   ```bash
   git push heroku master
   ```

### Deployment Links

- **Heroku Live Link**: [Heroku Deployment](https://custom-form-backend-2c83413cc625.herokuapp.com/)
- **Kubernetes Live Link**: [AKS Deployment](http://51.8.223.197/)

## Using the API as a Frontend Developer

The backend provides several endpoints to manage form submissions, email validations, data logging, and notifications. Here’s how you can utilize these endpoints:

### General Form Submission (`containers` and `heroku-single-service` branches)

- **Endpoint**: `/submit`
- **Method**: `POST`
- **Description**: Handles user data submissions, including validation, logging, and notifications.
- **Request and Response Examples**:
  ```json
  // Request
  {
    "email": "user@example.com", //Email is compulsory
    "name": "John Doe",
    "message": "Your service is great!"
  }

  // Success Response
  {
    "status": "success",
    "message": "Form submitted successfully"
  }

  // Error Response
  {
    "status": "error",
    "message": "Invalid email provided"
  }
  ```
Frontend developers can interact with these endpoints using JavaScript's `fetch` API or libraries like `axios` to integrate these functionalities into their web applications.
