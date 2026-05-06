// import { CreateAssistantDTO } from "@vapi-ai/web/dist/api";
// import { z } from "zod";

export const mappings = {
  // Existing Web mappings...
  "react.js": "react",
  reactjs: "react",
  react: "react",
  "next.js": "nextjs",
  nextjs: "nextjs",
  next: "nextjs",
  "vue.js": "vuejs",
  vuejs: "vuejs",
  vue: "vuejs",
  "express.js": "express",
  expressjs: "express",
  express: "express",
  "node.js": "nodejs",
  nodejs: "nodejs",
  node: "nodejs",
  mongodb: "mongodb",
  mongo: "mongodb",
  mongoose: "mongoose",
  mysql: "mysql",
  postgresql: "postgresql",
  postgres: "postgresql",
  sqlite: "sqlite",
  firebase: "firebase",
  docker: "docker",
  kubernetes: "kubernetes",
  k8s: "kubernetes",
  aws: "aws",
  azure: "azure",
  gcp: "googlecloud",
  digitalocean: "digitalocean",
  heroku: "heroku",
  photoshop: "photoshop",
  "adobe photoshop": "photoshop",
  html5: "html5",
  html: "html5",
  css3: "css3",
  css: "css3",
  sass: "sass",
  scss: "sass",
  less: "less",
  tailwindcss: "tailwindcss",
  tailwind: "tailwindcss",
  bootstrap: "bootstrap",
  jquery: "jquery",
  typescript: "typescript",
  ts: "typescript",
  javascript: "javascript",
  js: "javascript",
  "angular.js": "angularjs",
  angularjs: "angularjs",
  angular: "angularjs",
  nestjs: "nestjs",
  graphql: "graphql",
  "graph ql": "graphql",
  apollo: "apollo",
  webpack: "webpack",
  babel: "babel",
  npm: "npm",
  yarn: "yarn",
  git: "git",
  github: "github",
  gitlab: "gitlab",
  figma: "figma",
  prisma: "prisma",
  redux: "redux",
  redis: "redis",
  jest: "jest",
  "nuxt.js": "nuxtjs",
  nuxtjs: "nuxtjs",
  nuxt: "nuxtjs",
  vercel: "vercel",

  // --- AI / ML / Data Science ---
  python: "python",
  py: "python",
  pytorch: "pytorch",
  torch: "pytorch",
  tensorflow: "tensorflow",
  tf: "tensorflow",
  keras: "keras",
  scikit: "scikitlearn",
  sklearn: "scikitlearn",
  "scikit-learn": "scikitlearn",
  pandas: "pandas",
  numpy: "numpy",
  matplotlib: "matplotlib",
  opencv: "opencv",
  cv2: "opencv",
  huggingface: "huggingface",
  hf: "huggingface",
  langchain: "langchain",
  openai: "openai",
  jupyter: "jupyter",
  "jupyter notebook": "jupyter",
  anaconda: "anaconda",
  kaggle: "kaggle",
  pyspark: "pyspark",
  apachespark: "apachespark",
  spark: "apachespark",

  // --- Additional Backend & Languages ---
  go: "go",
  golang: "go",
  rust: "rust",
  java: "java",
  kotlin: "kotlin",
  swift: "swift",
  dart: "dart",
  flutter: "flutter",
  php: "php",
  laravel: "laravel",
  python: "python",
  django: "django",
  flask: "flask",
  fastapi: "fastapi",
  ruby: "ruby",
  rails: "rails",
  "ruby on rails": "rails",
  cplusplus: "cplusplus",
  "c++": "cplusplus",
  csharp: "csharp",
  "c#": "csharp",
  dotnet: "dotnet",
  ".net": "dotnet",

  // --- Database & Infrastructure ---
  supabase: "supabase",
  planetscale: "planetscale",
  neon: "neon",
  clerk: "clerk",
  auth0: "auth0",
  strapi: "strapi",
  postman: "postman",
  insomnia: "insomnia",
  nginx: "nginx",
  jenkins: "jenkins",
  ansible: "ansible",
  terraform: "terraform",
  prometheus: "prometheus",
  grafana: "grafana",
  linux: "linux",
  ubuntu: "ubuntu",
};

// export const interviewer: CreateAssistantDTO = {
//   name: "Interviewer",
//   firstMessage:
//     "Hello! Thank you for taking the time to speak with me today. I'm excited to learn more about you and your experience.",
//   transcriber: {
//     provider: "deepgram",
//     model: "nova-2",
//     language: "en",
//   },
//   voice: {
//     provider: "11labs",
//     voiceId: "sarah",
//     stability: 0.4,
//     similarityBoost: 0.8,
//     speed: 0.9,
//     style: 0.5,
//     useSpeakerBoost: true,
//   },
//   model: {
//     provider: "openai",
//     model: "gpt-4",
//     messages: [
//       {
//         role: "system",
//         content: `You are a professional job interviewer conducting a real-time voice interview with a candidate. Your goal is to assess their qualifications, motivation, and fit for the role.

// Interview Guidelines:
// Follow the structured question flow:
// {{questions}}

// Engage naturally & react appropriately:
// Listen actively to responses and acknowledge them before moving forward.
// Ask brief follow-up questions if a response is vague or requires more detail.
// Keep the conversation flowing smoothly while maintaining control.
// Be professional, yet warm and welcoming:

// Use official yet friendly language.
// Keep responses concise and to the point (like in a real voice interview).
// Avoid robotic phrasing—sound natural and conversational.
// Answer the candidate’s questions professionally:

// If asked about the role, company, or expectations, provide a clear and relevant answer.
// If unsure, redirect the candidate to HR for more details.

// Conclude the interview properly:
// Thank the candidate for their time.
// Inform them that the company will reach out soon with feedback.
// End the conversation on a polite and positive note.


// - Be sure to be professional and polite.
// - Keep all your responses short and simple. Use official language, but be kind and welcoming.
// - This is a voice conversation, so keep your responses short, like in a real conversation. Don't ramble for too long.`,
//       },
//     ],
//   },
// };

// export const feedbackSchema = z.object({
//   totalScore: z.number(),
//   categoryScores: z.tuple([
//     z.object({
//       name: z.literal("Communication Skills"),
//       score: z.number(),
//       comment: z.string(),
//     }),
//     z.object({
//       name: z.literal("Technical Knowledge"),
//       score: z.number(),
//       comment: z.string(),
//     }),
//     z.object({
//       name: z.literal("Problem Solving"),
//       score: z.number(),
//       comment: z.string(),
//     }),
//     z.object({
//       name: z.literal("Cultural Fit"),
//       score: z.number(),
//       comment: z.string(),
//     }),
//     z.object({
//       name: z.literal("Confidence and Clarity"),
//       score: z.number(),
//       comment: z.string(),
//     }),
//   ]),
//   strengths: z.array(z.string()),
//   areasForImprovement: z.array(z.string()),
//   finalAssessment: z.string(),
// });

export const interviewCovers = [
  "/adobe.png",
  "/amazon.png",
  "/facebook.png",
  "/hostinger.png",
  "/pinterest.png",
  "/quora.png",
  "/reddit.png",
  "/skype.png",
  "/spotify.png",
  "/telegram.png",
  "/tiktok.png",
  "/yahoo.png",
];

export const dummyInterviews= [
  {
    id: "1",
    userId: "user1",
    role: "Frontend Developer",
    type: "Technical",
    techstack: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    level: "Junior",
    questions: ["What is React?"],
    finalized: false,
    createdAt: "2024-03-15T10:00:00Z",
  },
  {
    id: "2",
    userId: "user1",
    role: "Full Stack Developer",
    type: "Mixed",
    techstack: ["Node.js", "Express", "MongoDB", "React"],
    level: "Senior",
    questions: ["What is Node.js?"],
    finalized: false,
    createdAt: "2024-03-14T15:30:00Z",
  },
];


// To register your app and obtain the Firebase initialization code, you'll generally follow these steps for an Android application:
// First, navigate to the Firebase console. On the project overview page for your "PrepWise" project, click on the Android icon or the Add app button to begin the setup workflow.
// Next, you'll need to provide your app's Android package name . This is a unique identifier for your app on the device and in the Google Play Store, often referred to as an application ID. You can typically find this in your module-level Gradle file, usually app/build.gradle , by looking for applicationId . Remember that the package name is case-sensitive and cannot be changed after registration.
// Once you've entered the package name, click Register App .
// After registering, you'll be prompted to Download the google-services.json file . This file contains all the necessary configuration details for your Firebase project to connect with your Android app. Copy this google-services.json file into the app/ directory of your Android project.
// For client-side applications (like web or Flutter), the initialization code usually involves calling initializeApp from the Firebase SDK. This method takes an options object containing your project's configuration, which you can retrieve from the Firebase console after adding a web app, or it's implicitly used by the google-services.json for Android or firebase_options.dart for Flutter.
// Here are some follow-up questions you might consider:
// What are the differences in registering an iOS or web app compared to an Android app?
// How does the google-services.json file specifically initialize Firebase in an Android project?
// Where can I find the API key and other configuration options for a web application?

export const companyMappings = {
  // --- Big Tech / FAANG+ ---
  google: "google",
  alphabet: "google",
  amazon: "amazon",
  aws: "amazon",
  microsoft: "microsoft",
  msft: "microsoft",
  netflix: "netflix",
  meta: "meta",
  facebook: "meta",
  apple: "apple",

  // --- AI & Data ---
  openai: "openai",
  anthropic: "anthropic",
  nvidia: "nvidia",
  palantir: "palantir",
  databricks: "databricks",
  snowflake: "snowflake",
  mistral: "mistral",
  cohere: "cohere",

  // --- SaaS & Enterprise ---
  salesforce: "salesforce",
  adobe: "adobe",
  oracle: "oracle",
  sap: "sap",
  servicenow: "servicenow",
  atlassian: "atlassian",
  jira: "atlassian",
  confluence: "atlassian",
  slack: "slack",
  zoom: "zoom",
  hubspot: "hubspot",
  zendesk: "zendesk",
  shopify: "shopify",

  // --- FinTech & Payments ---
  stripe: "stripe",
  paypal: "paypal",
  square: "square",
  block: "square",
  robinhood: "robinhood",
  plaid: "plaid",
  coinbase: "coinbase",
  revolut: "revolut",
  visa: "visa",
  mastercard: "mastercard",
  goldmansachs: "goldmansachs",

  // --- Ride-sharing & Logistics ---
  uber: "uber",
  lyft: "lyft",
  doordash: "doordash",
  instacart: "instacart",
  grab: "grab",
  fedex: "fedex",

  // --- Infrastructure & DevTools ---
  cloudflare: "cloudflare",
  vercel: "vercel",
  netlify: "netlify",
  github: "github",
  gitlab: "gitlab",
  digitalocean: "digitalocean",
  mongodb: "mongodb",
  postman: "postman",
  datadog: "datadog",
  hashicorp: "hashicorp",
  docker: "docker",

  // --- Social & Content ---
  twitter: "twitter",
  x: "twitter",
  tiktok: "tiktok",
  bytedance: "tiktok",
  snapchat: "snapchat",
  pinterest: "pinterest",
  reddit: "reddit",
  spotify: "spotify",
  linkedin: "linkedin",

  // --- Hardware & Chips ---
  intel: "intel",
  amd: "amd",
  tesla: "tesla",
  samsung: "samsung",
  cisco: "cisco",
  hp: "hp",
  dell: "dell",

  // --- E-commerce & Travel ---
  ebay: "ebay",
  airbnb: "airbnb",
  booking: "booking",
  expedia: "expedia",
  walmart: "walmart",
  target: "target",
};