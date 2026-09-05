# CRM

A CRM system built with **.NET 8** on the backend and **Next.js** on the client side, following **Layered Architecture** and applying **DDD** and **SOLID** principles.

The system provides functionality for managing clients, orders, services, appointments, and companies. It also implements JWT-based authentication and multi-company data isolation.

## Features

* JWT-based authentication and authorization.
* Authentication by user or company.
* Multi-company architecture with complete data isolation between companies.
* Client management with CRUD operations, search, filtering, and caching.
* Order and service management.
* Order status management.
* Appointment scheduling, updating, completion, and cancellation.
* Email service for registration and token delivery.
* Background service for automatic subscription deactivation.
* Domain-level validation using FluentValidation and domain invariants.
* Application logging using `ILogger`.
* Caching for frequently accessed data.
* Swagger/OpenAPI documentation.

## Architecture

The backend follows a layered architecture with responsibilities separated across several layers.

### Domain

Contains the core business logic and domain entities.

Main entities include:

* `Client`
* `Order`
* `Service`
* `Appointment`
* `Company`

The domain layer holds business rules, validation, and methods responsible for changing entity state, such as:

* `Update`
* `Cancel`
* `Complete`

### Application

Contains application services and use-case logic.

Responsibilities include:

* Client, order, company, appointment, and other application services.
* DTOs and object mapping.
* Email service integration.
* Registration token delivery.
* Background subscription management.
* Authentication and authorization attributes.

Custom attributes such as `[LoginByUser]` and `[LoginByCompany]` are used to validate access tokens and determine the authentication context.

### Infrastructure

Responsible for external dependencies and data access.

Includes:

* Entity Framework Core.
* PostgreSQL database.
* Code First approach.
* Repository implementations.
* Caching configuration.
* Logging configuration.

### Shared

Contains components used across different layers, including:

* DTOs.
* Enumerations.
* Common application types.

## Multi-Company Architecture

The system supports multiple companies within a single application instance.

Company-specific data is isolated using the authenticated company's context. The company identifier is obtained from the authentication claims and is used to restrict access to the corresponding data.

This prevents users authenticated under one company from accessing data belonging to another company.

## Authentication

The API uses JWT tokens for authentication and authorization.

Two authentication contexts are supported:

* User authentication.
* Company authentication.

The application provides dedicated authorization attributes for validating the corresponding context.

## Subscription Management

The system includes subscription management for companies.

A background service periodically checks subscription expiration dates and automatically deactivates expired subscriptions.

## Data Access

PostgreSQL is used as the primary database.

Entity Framework Core is configured using the Code First approach, with migrations applied automatically on startup. Database entities and relationships are represented through the domain and infrastructure layers.

## Validation

Validation happens at multiple levels.

`FluentValidation` covers application input, while domain rules and invariants protect the consistency of domain entities.

## Caching

Caching reduces unnecessary database queries and improves response times for frequently requested data.

The project uses `DistributedCache` for cache management.

## Deployment

The project is containerized with Docker and runs on a self-hosted Ubuntu Server virtual machine.

* A base `docker-compose.yml` defines the services (API, PostgreSQL, Redis, client) with sensible defaults for local development.
* A `docker-compose.demo.yml` override enforces required secrets and configuration for the hosted environment, sourced from a `.env` file kept only on the server.
* Public access is provided through a **Cloudflare Tunnel**, which routes a custom domain to the containers without exposing any inbound ports on the host.
* Continuous deployment runs through **GitHub Actions**: on every push to `main`, the workflow temporarily joins the private network via **Tailscale**, connects to the server over SSH with a dedicated deploy key, pulls the latest code, and rebuilds the containers.

This setup keeps secrets off the repository, requires no open ports for remote management, and allows deployment without manual intervention on the server.

## Technologies

* .NET 8
* C#
* ASP.NET Core
* Entity Framework Core
* PostgreSQL
* FluentValidation
* AutoMapper
* JWT
* DistributedCache
* Swagger / OpenAPI
* ILogger
* Docker / Docker Compose
* GitHub Actions
* Cloudflare Tunnel
* Tailscale

## Project Structure

```text
Domain/
Application/
Infrastructure/
Shared/
Frontend/
```

The separation of layers keeps business logic independent from infrastructure concerns and improves maintainability and testability.

## Author

**Artur Muntyan Olegovich**

Email: [gera.gde.dom@list.ru](mailto:gera.gde.dom@list.ru)