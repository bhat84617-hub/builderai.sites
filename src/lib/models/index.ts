import mongoose, { Schema, type Model } from "mongoose"

export interface IUser {
  _id?: string
  name: string
  email: string
  password?: string
  image?: string
  plan: "FREE" | "STARTER" | "PRO" | "AGENCY"
  projects: IProject[]
  joinedAt: Date
  provider: "google" | "credentials"
}

export interface IProject {
  _id?: string
  name: string
  type: "LANDING_PAGE" | "WEBSITE"
  prompt: string
  status: "DRAFT" | "GENERATING" | "READY" | "FAILED"
  userId: string
  createdAt: Date
}

export interface ILLMConfig {
  providerId: string
  apiKey: string
  modelId: string
  baseUrl?: string
}

const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true },
  type: { type: String, enum: ["LANDING_PAGE", "WEBSITE"], default: "LANDING_PAGE" },
  prompt: { type: String, required: true },
  status: { type: String, enum: ["DRAFT", "GENERATING", "READY", "FAILED"], default: "READY" },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
})

const UserSchema = new Schema<IUser>({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String },
  image: { type: String },
  plan: { type: String, enum: ["FREE", "STARTER", "PRO", "AGENCY"], default: "FREE" },
  projects: { type: [ProjectSchema], default: [] },
  joinedAt: { type: Date, default: Date.now },
  provider: { type: String, enum: ["google", "credentials"], default: "credentials" },
})

const LLMConfigSchema = new Schema<ILLMConfig>({
  providerId: { type: String, required: true },
  apiKey: { type: String, required: true },
  modelId: { type: String, required: true },
  baseUrl: { type: String },
})

export const User: Model<IUser> = mongoose.models.User || mongoose.model("User", UserSchema)
export const LLMConfig: Model<ILLMConfig> = mongoose.models.LLMConfig || mongoose.model("LLMConfig", LLMConfigSchema)
