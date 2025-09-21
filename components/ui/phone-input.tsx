"use client"

import * as React from "react"
import { getCountries, getCountryCallingCode, getExampleNumber, parsePhoneNumber } from 'libphonenumber-js/max'
import examples from 'libphonenumber-js/mobile/examples'

import { cn } from "@/lib/utils"
import { Input } from "@/components/ui/input"
import { Combobox } from "@/components/ui/combobox"

// Country code to flag emoji mapping
const countryToFlag = (countryCode: string): string => {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

// Get country data with flags and calling codes
const getCountryData = () => {
  const countries = getCountries()

  return countries.map(country => {
    const callingCode = getCountryCallingCode(country)
    const flag = countryToFlag(country)

    // Get country name from Intl.DisplayNames
    const countryName = new Intl.DisplayNames(['en'], { type: 'region' }).of(country) || country

    return {
      value: country,
      label: countryName,
      flag: flag,
      callingCode: `+${callingCode}`,
      searchText: `${countryName} ${country} +${callingCode}`.toLowerCase()
    }
  }).sort((a, b) => a.label.localeCompare(b.label))
}

interface PhoneInputProps {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
  className?: string
  defaultCountry?: string
}

export function PhoneInput({
  value = "",
  onChange,
  placeholder = "Enter phone number",
  className,
  defaultCountry = "US"
}: PhoneInputProps) {
  const [countries] = React.useState(() => getCountryData())
  const [selectedCountry, setSelectedCountry] = React.useState(defaultCountry)
  const [phoneNumber, setPhoneNumber] = React.useState("")

  // Parse existing value on mount and when value changes
  React.useEffect(() => {
    if (value) {
      try {
        // Try to parse the phone number using libphonenumber-js
        const parsed = parsePhoneNumber(value)
        if (parsed && parsed.country) {
          setSelectedCountry(parsed.country)
          setPhoneNumber(parsed.nationalNumber)
        } else {
          // Fallback to manual parsing for international format
          if (value.startsWith('+')) {
            const country = countries.find(c => value.startsWith(c.callingCode))
            if (country) {
              setSelectedCountry(country.value)
              setPhoneNumber(value.substring(country.callingCode.length).trim())
            } else {
              setPhoneNumber(value)
            }
          } else {
            setPhoneNumber(value)
          }
        }
      } catch {
        // If parsing fails, try manual parsing or set as is
        if (value.startsWith('+')) {
          const country = countries.find(c => value.startsWith(c.callingCode))
          if (country) {
            setSelectedCountry(country.value)
            setPhoneNumber(value.substring(country.callingCode.length).trim())
          } else {
            setPhoneNumber(value)
          }
        } else {
          setPhoneNumber(value)
        }
      }
    } else {
      setPhoneNumber("")
    }
  }, [value, countries])

  const selectedCountryData = countries.find(c => c.value === selectedCountry)

  const handleCountryChange = (countryCode: string) => {
    setSelectedCountry(countryCode)
    const country = countries.find(c => c.value === countryCode)
    if (country && phoneNumber) {
      try {
        // Try to create a properly formatted international number
        const testNumber = `${country.callingCode}${phoneNumber.replace(/\D/g, '')}`
        const parsed = parsePhoneNumber(testNumber)
        if (parsed && parsed.isValid()) {
          onChange?.(parsed.format('E.164'))
        } else {
          const fullNumber = `${country.callingCode} ${phoneNumber}`.trim()
          onChange?.(fullNumber)
        }
      } catch {
        const fullNumber = `${country.callingCode} ${phoneNumber}`.trim()
        onChange?.(fullNumber)
      }
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const number = e.target.value.replace(/[^\d\s\-\(\)]/g, '') // Allow only digits and common phone formatting
    setPhoneNumber(number)

    if (selectedCountryData) {
      if (number) {
        try {
          // Try to create a properly formatted international number
          const testNumber = `${selectedCountryData.callingCode}${number.replace(/\D/g, '')}`
          const parsed = parsePhoneNumber(testNumber)
          if (parsed && parsed.isValid()) {
            onChange?.(parsed.format('E.164'))
          } else {
            const fullNumber = `${selectedCountryData.callingCode} ${number}`.trim()
            onChange?.(fullNumber)
          }
        } catch {
          const fullNumber = `${selectedCountryData.callingCode} ${number}`.trim()
          onChange?.(fullNumber)
        }
      } else {
        onChange?.("")
      }
    }
  }

  const getPlaceholder = () => {
    if (selectedCountryData) {
      try {
        const example = getExampleNumber(selectedCountry as keyof typeof examples, examples)
        if (example) {
          const national = example.formatNational()
          return national.replace(/^\d+\s/, '') // Remove country code from example
        }
      } catch {
        // Fallback if example fails
      }
    }
    return placeholder
  }

  return (
    <div className={cn("flex gap-1", className)}>
      <div className="w-28">
        <Combobox
          options={countries.map(country => ({
            value: country.value,
            label: `${country.callingCode}`,
            flag: country.flag,
            searchValue: country.searchText
          }))}
          value={selectedCountry}
          onValueChange={handleCountryChange}
          placeholder="Select country..."
          searchPlaceholder="Search countries..."
          emptyText="No country found."
          className="w-full"
        />
      </div>
      <div className="flex-1">
        <Input
          type="tel"
          value={phoneNumber}
          onChange={handlePhoneChange}
          placeholder={getPlaceholder()}
          className="w-full"
        />
      </div>
    </div>
  )
}