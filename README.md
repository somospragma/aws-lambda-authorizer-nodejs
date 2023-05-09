# AWS Lambda Authorizer NodeJS

Este proyecto contiene una función Lambda desarrollada en Node.js que actúa como autorizador para una API Gateway en AWS. La función valida el token de acceso JWT de un usuario de Amazon Cognito y verifica que el usuario tiene permiso para acceder al recurso solicitado a través de la API Gateway.

## Requerimientos

- Node.js 14.x
- npm
- AWS CLI

## Instalación

1. Clonar este repositorio:
   ```bash
   git clone https://github.com/usuario/lambda-autorizadora.git
   ```

2. Instalar las dependencias:
    ```bash
    npm install
    ```

3. Desplegar la función Lambda:
    ```bash
    serverless deploy
    Configurar la API Gateway:
    Agregar la función Lambda desplegada como autorizador para la API Gateway en AWS.
    Configurar el esquema de autorización en una tabla de DynamoDB.
    Configurar el campo del token a validar y el path de la API Gateway que requiere autorización.
    ```

## Uso

Enviar una solicitud a la API Gateway:
```bash
    curl -X GET https://mi-api-gateway.com/recurso-autorizado -H "Authorization: Bearer {token de acceso JWT}"
```

Si el token es válido y el usuario tiene permiso para acceder al recurso solicitado, la solicitud será procesada. De lo contrario, se devolverá un error.