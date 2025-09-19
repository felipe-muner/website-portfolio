import { parsePhoneNumber } from 'libphonenumber-js/max'

// Country code to flag emoji mapping
export const countryToFlag = (countryCode: string): string => {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

// Get country name from country code
export const getCountryName = (countryCode: string): string => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode) || countryCode
  } catch {
    return countryCode
  }
}

// Parse phone number and return country info
export const getPhoneCountryInfo = (phoneNumber: string) => {
  if (!phoneNumber) {
    return null
  }

  try {
    // Parse the phone number using libphonenumber-js
    const parsed = parsePhoneNumber(phoneNumber)

    if (parsed && parsed.country) {
      return {
        country: parsed.country,
        flag: countryToFlag(parsed.country),
        countryName: getCountryName(parsed.country),
        formattedNumber: parsed.formatInternational(),
        nationalNumber: parsed.formatNational(),
        isValid: parsed.isValid()
      }
    }

    // Fallback for common country codes
    if (phoneNumber.startsWith('+')) {
      const commonCountries: Record<string, string> = {
        '+1': 'US',
        '+44': 'GB',
        '+33': 'FR',
        '+49': 'DE',
        '+39': 'IT',
        '+34': 'ES',
        '+81': 'JP',
        '+86': 'CN',
        '+91': 'IN',
        '+55': 'BR',
        '+61': 'AU',
        '+7': 'RU',
        '+52': 'MX',
        '+82': 'KR',
        '+65': 'SG',
        '+66': 'TH',
        '+60': 'MY',
        '+62': 'ID',
        '+63': 'PH',
        '+84': 'VN'
      }

      for (const [code, country] of Object.entries(commonCountries)) {
        if (phoneNumber.startsWith(code)) {
          return {
            country,
            flag: countryToFlag(country),
            countryName: getCountryName(country),
            formattedNumber: phoneNumber,
            nationalNumber: phoneNumber.substring(code.length).trim(),
            isValid: true
          }
        }
      }
    }

    return null
  } catch {
    return null
  }
}

// Get just the flag for a phone number
export const getPhoneFlag = (phoneNumber: string): string | null => {
  const info = getPhoneCountryInfo(phoneNumber)
  return info?.flag || null
}

// Format phone number with flag for display
export const formatPhoneWithFlag = (phoneNumber: string): string => {
  const info = getPhoneCountryInfo(phoneNumber)
  if (!info) {
    return phoneNumber || 'No phone number'
  }
  return `${info.flag} ${info.formattedNumber}`
}