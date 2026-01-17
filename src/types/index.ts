import z from "zod";

export const SignupSchema = z.object({
    username:z.string(),
    password:z.string(),
    email:z.string().email(),
})

export const LoginSchema=z.object({
    username:z.string(),
    password:z.string()
})

export const addContentSchema=z.object({
    title:z.string(),
    body:z.string(),
    url:z.string().optional(),
    type:z.enum(["NOTE","LINK","TWEET","VIDEO"]),
})

export const deleteContentSchema=z.object({
    contentId:z.string(),
})

export const shareBrainSchema=z.object({
    share:z.boolean(),
})


export const openBrainSchema=z.object({
    hash:z.string(),
})

export const shareContentSchema=z.object({
    contentId:z.string(),
})

export const askBotSchema=z.object({
    message:z.string(),
})