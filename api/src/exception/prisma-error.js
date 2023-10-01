import { PrismaClientKnownRequestError, PrismaClientUnknownRequestError } from "@prisma/client/runtime/library"
import ApiBadRequestError from "./ApiBadRequestError"
import ApiErrorResponse from "./ApiErrorResponse"
import ApiInternalServerError from "./ApiInternalServerError"
import ApiNotFoundError from "./ApiNotFoundError"
import httpStatus from "http-status"
import db from "../config/db"
import { Prisma } from "@prisma/client"

const prismaError = (error, table) => {
  // console.log('error from prisma error', error)
  let err
  if (error instanceof PrismaClientKnownRequestError) {
    if (error.code === "P2025") err = new ApiErrorResponse(error.message, httpStatus.NOT_FOUND)
    if (error.code === "P2002") err = new ApiBadRequestError(`${error.meta.target} already exist`)

  } else if (error instanceof PrismaClientUnknownRequestError) err = new ApiInternalServerError(typeof error.message === "string" ? error.message : "unknown error")
  else err = new ApiErrorResponse(error.message, error.code)

  return err
}

export default prismaError