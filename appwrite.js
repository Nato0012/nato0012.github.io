import { Client, Account, Databases } from 'appwrite';

const client = new Client();

client
  .setEndpoint('https://nyc.cloud.appwrite.io/v1')  // Your Appwrite endpoint
  .setProject('68554b360036646491e2');               // Your project ID

const account = new Account(client);
const databases = new Databases(client);

export { client, account, databases };
