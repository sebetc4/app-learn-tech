import { CreateUserDto } from '../types'
import { ObjectSchema, object, string } from 'yup'

const nameValidation = string()
    .required('Username is required')
    .min(3, 'Username must be at least 3 characters long')
    .max(20, 'Username must be at most 20 characters long')

export const createUserSchema: ObjectSchema<CreateUserDto> = object({
    name: nameValidation
})

export const updateUserSchema: ObjectSchema<CreateUserDto> = object({
    name: nameValidation
})
