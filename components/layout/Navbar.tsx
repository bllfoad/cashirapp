import React from 'react'
import { Button } from "@/components/ui/button"
import { SelectValue, SelectTrigger, SelectItem, SelectContent, Select } from "@/components/ui/select"
import { CircleHelpIcon } from '../ui/icons'

export function Navbar() {
  return (
    <div className="flex justify-between items-center p-4 border-b dark:border-gray-700">
    <h1 className="text-2xl font-bold">FreshFood</h1>
    <div className="flex items-center space-x-4">
      <Button className="hidden sm:flex" variant="ghost">
        <CircleHelpIcon className="h-5 w-5 mr-2" />
        Help
      </Button>
      <Select>
        <SelectTrigger className="w-[100px]">
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="light">Light</SelectItem>
          <SelectItem value="dark">Dark</SelectItem>
          <SelectItem value="system">System</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
  )
}

