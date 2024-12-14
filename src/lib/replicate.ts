import Replicate from "replicate";

if (!process.env.REPLICATE_API_TOKEN) {
  throw new Error("REPLICATE_API_TOKEN is not set");
}

export const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN,
});
