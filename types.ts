// types.ts
import { 
  ArgentineProvince, AustralianState, BrazilianState, CanadianProvince, GermanState,
  IndianState, ItalianRegion, JapanesePrefecture, MexicanState, RussianFederalSubject,
  SouthAfricanProvince, UKCountry, USState
} from './data/g20';

export enum Sentiment {
  Positive = 'Positive',
  Neutral = 'Neutral',
  Negative = 'Negative',
}

export interface Trend {
  name: string;
  summary: string;
  volume: number;
  sentiment: Sentiment;
  sentimentScore: number;
  change: number;
  sourceUrl: string;
  isTracked?: boolean;
}

export interface TrendHistoryData {
  time: string;
  averageSentiment?: number;
  [key: string]: number | string | undefined; // Allows for dynamic trend names and optional averageSentiment
}

export type Platform = 'All Platforms' | 'X' | 'Facebook' | 'Instagram' | 'Snapchat';

export type Category =
  | 'All'
  | 'Current Affairs'
  | 'Government'
  | 'Politics'
  | 'National Politics'
  | 'International Politics'
  | 'Education'
  | 'Health'
  | 'Economy'
  | 'Business'
  | 'Fashion'
  | 'Sport'
  | 'Entertainment'
  | 'Environment'
  | 'War'
  | 'Art & Culture'
  | 'Human & Society'
  | 'Animals';

export type Country =
  | 'Worldwide'
  | 'Afghanistan'
  | 'Albania'
  | 'Algeria'
  | 'Andorra'
  | 'Angola'
  | 'Antigua and Barbuda'
  | 'Argentina'
  | 'Armenia'
  | 'Australia'
  | 'Austria'
  | 'Azerbaijan'
  | 'Bahamas'
  | 'Bahrain'
  | 'Bangladesh'
  | 'Barbados'
  | 'Belarus'
  | 'Belgium'
  | 'Belize'
  | 'Benin'
  | 'Bhutan'
  | 'Bolivia'
  | 'Bosnia and Herzegovina'
  | 'Botswana'
  | 'Brazil'
  | 'Brunei'
  | 'Bulgaria'
  | 'Burkina Faso'
  | 'Burundi'
  | 'Cabo Verde'
  | 'Cambodia'
  | 'Cameroon'
  | 'Canada'
  | 'Central African Republic'
  | 'Chad'
  | 'Chile'
  | 'China'
  | 'Colombia'
  | 'Comoros'
  | 'Congo, Democratic Republic of the'
  | 'Congo, Republic of the'
  | 'Costa Rica'
  | "Cote d'Ivoire"
  | 'Croatia'
  | 'Cuba'
  | 'Cyprus'
  | 'Czech Republic'
  | 'Denmark'
  | 'Djibouti'
  | 'Dominica'
  | 'Dominican Republic'
  | 'Ecuador'
  | 'Egypt'
  | 'El Salvador'
  | 'Equatorial Guinea'
  | 'Eritrea'
  | 'Estonia'
  | 'Eswatini'
  | 'Ethiopia'
  | 'Fiji'
  | 'Finland'
  | 'France'
  | 'Gabon'
  | 'Gambia'
  | 'Georgia'
  | 'Germany'
  | 'Ghana'
  | 'Greece'
  | 'Grenada'
  | 'Guatemala'
  | 'Guinea'
  | 'Guinea-Bissau'
  | 'Guyana'
  | 'Haiti'
  | 'Honduras'
  | 'Hungary'
  | 'Iceland'
  | 'India'
  | 'Indonesia'
  | 'Iran'
  | 'Iraq'
  | 'Ireland'
  | 'Israel'
  | 'Italy'
  | 'Jamaica'
  | 'Japan'
  | 'Jordan'
  | 'Kazakhstan'
  | 'Kenya'
  | 'Kiribati'
  | 'Kuwait'
  | 'Kyrgyzstan'
  | 'Laos'
  | 'Latvia'
  | 'Lebanon'
  | 'Lesotho'
  | 'Liberia'
  | 'Libya'
  | 'Liechtenstein'
  | 'Lithuania'
  | 'Luxembourg'
  | 'Madagascar'
  | 'Malawi'
  | 'Malaysia'
  | 'Maldives'
  | 'Mali'
  | 'Malta'
  | 'Marshall Islands'
  | 'Mauritania'
  | 'Mauritius'
  | 'Mexico'
  | 'Micronesia'
  | 'Moldova'
  | 'Monaco'
  | 'Mongolia'
  | 'Montenegro'
  | 'Morocco'
  | 'Mozambique'
  | 'Myanmar'
  | 'Namibia'
  | 'Nauru'
  | 'Nepal'
  | 'Netherlands'
  | 'New Zealand'
  | 'Nicaragua'
  | 'Niger'
  | 'Nigeria'
  | 'North Korea'
  | 'North Macedonia'
  | 'Norway'
  | 'Oman'
  | 'Pakistan'
  | 'Palau'
  | 'Palestine State'
  | 'Panama'
  | 'Papua New Guinea'
  | 'Paraguay'
  | 'Peru'
  | 'Philippines'
  | 'Poland'
  | 'Portugal'
  | 'Qatar'
  | 'Romania'
  | 'Russia'
  | 'Rwanda'
  | 'Saint Kitts and Nevis'
  | 'Saint Lucia'
  | 'Saint Vincent and the Grenadines'
  | 'Samoa'
  | 'San Marino'
  | 'Sao Tome and Principe'
  | 'Saudi Arabia'
  | 'Senegal'
  | 'Serbia'
  | 'Seychelles'
  | 'Sierra Leone'
  | 'Singapore'
  | 'Slovakia'
  | 'Slovenia'
  | 'Solomon Islands'
  | 'Somalia'
  | 'South Africa'
  | 'South Korea'
  | 'South Sudan'
  | 'Spain'
  | 'Sri Lanka'
  | 'Sudan'
  | 'Suriname'
  | 'Sweden'
  | 'Switzerland'
  | 'Syria'
  | 'Taiwan'
  | 'Tajikistan'
  | 'Tanzania'
  | 'Thailand'
  | 'Timor-Leste'
  | 'Togo'
  | 'Tonga'
  | 'Trinidad and Tobago'
  | 'Tunisia'
  | 'Turkey'
  | 'Turkmenistan'
  | 'Tuvalu'
  | 'Uganda'
  | 'Ukraine'
  | 'United Arab Emirates'
  | 'UK'
  | 'USA'
  | 'Uruguay'
  | 'Uzbekistan'
  | 'Vanuatu'
  | 'Vatican City'
  | 'Venezuela'
  | 'Vietnam'
  | 'Yemen'
  | 'Zambia'
  | 'Zimbabwe';

export type Region = 
  | ''
  | ArgentineProvince
  | AustralianState
  | BrazilianState
  | CanadianProvince
  | GermanState
  | IndianState
  | ItalianRegion
  | JapanesePrefecture
  | MexicanState
  | RussianFederalSubject
  | SouthAfricanProvince
  | UKCountry
  | USState;