import React from 'react'
import { Controller } from 'react-hook-form'
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"

function FormFeild({
  control,
  name,
  label,
  placeholder,
  type = "text",
}) {
    return (
        <Controller name = {name} control = {control} render = {({field})=>(
                <FormItem>
                    <FormLabel className="label">{label}</FormLabel>
                        <FormControl>
                            <Input className = "input" placeholder={placeholder} type = {type}{...field} />
                        </FormControl>
                        <FormDescription>
                            This is your public display name.
                        </FormDescription>
                    <FormMessage />
                </FormItem>

        )}
        />   
        
    )
}

export default FormFeild
