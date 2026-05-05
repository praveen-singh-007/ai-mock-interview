"use client"

import * as React from "react"

import { Slot } from "@radix-ui/react-slot"

import {
  Controller,
  FormProvider,
  useFormContext,
} from "react-hook-form"

import { cn } from "@/lib/utils"

const Form = FormProvider

const FormField = Controller

const FormItem = React.forwardRef(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn("space-y-2", className)}
      {...props}
    />
  )
)

FormItem.displayName = "FormItem"

const FormLabel = React.forwardRef(
  ({ className, ...props }, ref) => (
    <label
      ref={ref}
      className={cn(
        "text-sm font-medium leading-none",
        className
      )}
      {...props}
    />
  )
)

FormLabel.displayName = "FormLabel"

const FormControl = React.forwardRef(
  ({ ...props }, ref) => (
    <Slot
      ref={ref}
      {...props}
    />
  )
)

FormControl.displayName = "FormControl"

const FormDescription = React.forwardRef(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn(
        "text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
)

FormDescription.displayName = "FormDescription"

const FormMessage = React.forwardRef(
  ({ className, children, ...props }, ref) => {

    if (!children) return null

    return (
      <p
        ref={ref}
        className={cn(
          "text-sm font-medium text-red-500",
          className
        )}
        {...props}
      >
        {children}
      </p>
    )
  }
)

FormMessage.displayName = "FormMessage"

export {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
}