import React from 'react'
import { Avatar, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { TrashIcon } from '../ui/icons'

export function Product() {
  return (
        <div className="flex flex-col items-center space-x-4 mb-4 sm:flex-row">
              <Avatar>
                <AvatarImage alt="Organic Hass Avocados" src="/placeholder.svg?height=64&width=64" />
              </Avatar>
              <div>
                <div className="text-xl font-bold">Organic Hass Avocados, ea</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">$8.99</div>
              </div>
              <div className="flex items-center space-x-2 sm:ml-auto">
                <Button className="px-3 py-1" variant="secondary">
                  -
                </Button>
                <Input className="w-12 text-center" value="1" />
                <Button className="px-3 py-1" variant="secondary">
                  +
                </Button>
                <Button className="px-4 py-2" variant="destructive">
                  <TrashIcon className="h-5 w-5 mr-2" />
                  Delete
                </Button>
              </div>
            </div> 
  )
}

