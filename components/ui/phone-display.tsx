"use client"

import * as React from "react"
import { parsePhoneNumber } from 'libphonenumber-js/max'

import { cn } from "@/lib/utils"

// Country code to flag emoji mapping
const countryToFlag = (countryCode: string): string => {
  return countryCode
    .toUpperCase()
    .replace(/./g, char => String.fromCodePoint(127397 + char.charCodeAt(0)))
}

// Get country name from country code
const getCountryName = (countryCode: string): string => {
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(countryCode) || countryCode
  } catch {
    return countryCode
  }
}

interface PhoneDisplayProps {
  phoneNumber: string
  showFlag?: boolean
  showCountryName?: boolean
  className?: string
  flagSize?: 'sm' | 'md' | 'lg'
}

export function PhoneDisplay({
  phoneNumber,
  showFlag = true,
  showCountryName = false,
  className,
  flagSize = 'md'
}: PhoneDisplayProps) {
  const phoneInfo = React.useMemo(() => {
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

      // Fallback: try to extract country code manually
      if (phoneNumber.startsWith('+')) {
        const match = phoneNumber.match(/^\+(\d{1,4})/)
        if (match) {
          const callingCode = match[1]
          // Try to map common calling codes to countries
          const countryMap: Record<string, string> = {
            '1': 'US',
            '44': 'GB',
            '33': 'FR',
            '49': 'DE',
            '39': 'IT',
            '34': 'ES',
            '81': 'JP',
            '86': 'CN',
            '91': 'IN',
            '55': 'BR',
            '61': 'AU',
            '7': 'RU',
            '52': 'MX',
            '82': 'KR',
            '65': 'SG',
            '66': 'TH',
            '60': 'MY',
            '62': 'ID',
            '63': 'PH',
            '84': 'VN',
            '886': 'TW',
            '852': 'HK',
            '853': 'MO',
            '20': 'EG',
            '27': 'ZA',
            '212': 'MA',
            '213': 'DZ',
            '216': 'TN',
            '218': 'LY',
            '220': 'GM',
            '221': 'SN',
            '222': 'MR',
            '223': 'ML',
            '224': 'GN',
            '225': 'CI',
            '226': 'BF',
            '227': 'NE',
            '228': 'TG',
            '229': 'BJ',
            '230': 'MU',
            '231': 'LR',
            '232': 'SL',
            '233': 'GH',
            '234': 'NG',
            '235': 'TD',
            '236': 'CF',
            '237': 'CM',
            '238': 'CV',
            '239': 'ST',
            '240': 'GQ',
            '241': 'GA',
            '242': 'CG',
            '243': 'CD',
            '244': 'AO',
            '245': 'GW',
            '246': 'IO',
            '248': 'SC',
            '249': 'SD',
            '250': 'RW',
            '251': 'ET',
            '252': 'SO',
            '253': 'DJ',
            '254': 'KE',
            '255': 'TZ',
            '256': 'UG',
            '257': 'BI',
            '258': 'MZ',
            '260': 'ZM',
            '261': 'MG',
            '262': 'RE',
            '263': 'ZW',
            '264': 'NA',
            '265': 'MW',
            '266': 'LS',
            '267': 'BW',
            '268': 'SZ',
            '269': 'KM',
            '290': 'SH',
            '291': 'ER',
            '297': 'AW',
            '298': 'FO',
            '299': 'GL',
            '350': 'GI',
            '351': 'PT',
            '352': 'LU',
            '353': 'IE',
            '354': 'IS',
            '355': 'AL',
            '356': 'MT',
            '357': 'CY',
            '358': 'FI',
            '359': 'BG',
            '370': 'LT',
            '371': 'LV',
            '372': 'EE',
            '373': 'MD',
            '374': 'AM',
            '375': 'BY',
            '376': 'AD',
            '377': 'MC',
            '378': 'SM',
            '380': 'UA',
            '381': 'RS',
            '382': 'ME',
            '383': 'XK',
            '385': 'HR',
            '386': 'SI',
            '387': 'BA',
            '389': 'MK',
            '420': 'CZ',
            '421': 'SK',
            '423': 'LI',
            '43': 'AT',
            '45': 'DK',
            '46': 'SE',
            '47': 'NO',
            '48': 'PL',
            '501': 'BZ',
            '502': 'GT',
            '503': 'SV',
            '504': 'HN',
            '505': 'NI',
            '506': 'CR',
            '507': 'PA',
            '508': 'PM',
            '509': 'HT',
            '590': 'GP',
            '591': 'BO',
            '592': 'GY',
            '593': 'EC',
            '594': 'GF',
            '595': 'PY',
            '596': 'MQ',
            '597': 'SR',
            '598': 'UY',
            '599': 'CW',
            '670': 'TL',
            '672': 'NF',
            '673': 'BN',
            '674': 'NR',
            '675': 'PG',
            '676': 'TO',
            '677': 'SB',
            '678': 'VU',
            '679': 'FJ',
            '680': 'PW',
            '681': 'WF',
            '682': 'CK',
            '683': 'NU',
            '684': 'AS',
            '685': 'WS',
            '686': 'KI',
            '687': 'NC',
            '688': 'TV',
            '689': 'PF',
            '690': 'TK',
            '691': 'FM',
            '692': 'MH',
            '850': 'KP',
            '880': 'BD',
            '882': 'XV',
            '883': 'XV',
            '886': 'TW',
            '888': 'XV',
            '960': 'MV',
            '961': 'LB',
            '962': 'JO',
            '963': 'SY',
            '964': 'IQ',
            '965': 'KW',
            '966': 'SA',
            '967': 'YE',
            '968': 'OM',
            '970': 'PS',
            '971': 'AE',
            '972': 'IL',
            '973': 'BH',
            '974': 'QA',
            '975': 'BT',
            '976': 'MN',
            '977': 'NP',
            '992': 'TJ',
            '993': 'TM',
            '994': 'AZ',
            '995': 'GE',
            '996': 'KG',
            '998': 'UZ'
          }

          const country = countryMap[callingCode]
          if (country) {
            return {
              country,
              flag: countryToFlag(country),
              countryName: getCountryName(country),
              formattedNumber: phoneNumber,
              nationalNumber: phoneNumber,
              isValid: true
            }
          }
        }
      }

      return null
    } catch {
      return null
    }
  }, [phoneNumber])

  if (!phoneInfo) {
    // If we can't parse it, just show the phone number as-is
    return (
      <span className={cn("text-sm", className)}>
        {phoneNumber || "No phone number"}
      </span>
    )
  }

  const flagSizeClass = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg"
  }[flagSize]

  return (
    <div className={cn("flex items-center gap-2", className)}>
      {showFlag && (
        <span className={cn("font-emoji", flagSizeClass)} title={phoneInfo.countryName}>
          {phoneInfo.flag}
        </span>
      )}
      <span className="text-sm font-mono">
        {phoneInfo.formattedNumber}
      </span>
      {showCountryName && (
        <span className="text-xs text-muted-foreground">
          ({phoneInfo.countryName})
        </span>
      )}
    </div>
  )
}