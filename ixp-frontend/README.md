# Technical Paper: InvoiceXpress

## Abstract

This technical paper provides an in-depth look into the architecture and functionalities of InvoiceXpress.

The product currently integrates xMoney Crypto with Fatture in Cloud, using the APIs exposed by both products. More information about them can be found at [Fatture in Cloud Docs](https://developers.fattureincloud.it) and at [xMoney Docs](https://docs.crypto.xmoney.com). Both products expose a Typescript library that is used to connect to the APIs.

This folder contains the Next.js project, which includes both the Frontend and the Backend used by InvoiceXpress.
We also use Google Firebase to store information about companies, handled invoices and the correlation between Fatture in Cloud's invoice ID and InvoiceXpress' ID.

## Directory Structure and File Content

### Directory: src/utils

A set of self-created helpers to integrate with external libraries and have a cleaner code in other parts of the project.

### Directory: src/pages

The main pages for InvoiceXpress:

-   The `index.tsx` presentation homepage
-   The `success.tsx` page where the user is redirected after the invoice is paid
-   The `payInvoice/[uuid].tsx` page where the user is sent from the invoice, that connects to the backend, generates the xMoney payment and redirects the user
-   The `oauth/fic/success.tsx` page where the user is redirected after he logs in Fatture in Cloud

### Directory: src/pages/api

The backend for InvoiceXpress:

-   `fic/oauth.ts` handles the Fatture in Cloud API authentication
-   `fic/handleNewInvoices.ts` handles the new invoices for each company in Fatture in Cloud and adds the link for the payment
    -   This script is called every minute by Vercel
-   `xmoney/createXMoneyOrder.ts` creates the xMoney Payment Order when the user clicks on the link on the invoice

## Pending Implementations

The main remaining implementations regard the oauth Fatture in Cloud integration, where the auth token needs to be stored and updated periodically, and refactoring the way both Fatture in Cloud and xMoney API codes are retreived: right now the codes are saved as environmental variables, they need to be stored in the database

Another missing part is a console for new users to add their API codes and set up their implementation
