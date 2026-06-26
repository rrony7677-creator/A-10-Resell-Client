import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { jwt } from "better-auth/plugins";

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.AUTH_DB_NAME);

export const auth = betterAuth({
    emailAndPassword: { 
    enabled: true, 
  }, 
  database: mongodbAdapter(db, {
    client
  }),
user: {
  additionalFields: {
    role: {
      type: "string",
      defaultValue: "buyer",
      input: true, 
},
    phone: { type: "string", required: false, input: true },
    address: { type: "string", required: false, input: true },
    status: { type: "string", defaultValue: "active", input: false },
  },
},
plugins:[jwt()],
});