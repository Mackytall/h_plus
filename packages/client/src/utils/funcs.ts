import { UserRole } from '../types/user';
import { CODE_LENGTHS } from '../constants';
import { PropertyPath } from '../hooks/useQuery';

import { CustomerTypes } from '../types/customer';

type GetReturnType<T> = T | undefined;
type ValueType = Record<string | number, unknown>;

export function get<T>(
  value: unknown,
  query: PropertyPath,
  defaultVal: GetReturnType<T> = undefined
): GetReturnType<T> {
  const splitQuery = Array.isArray(query)
    ? query
    : query
        //@ts-ignore
        .replace(/(\[(\d)\])/g, '.$2')
        .replace(/^\./, '')
        .split('.');

  if (!splitQuery.length || splitQuery[0] === undefined) return value as T;

  const key = splitQuery[0];

  if (
    typeof value !== 'object' ||
    value === null ||
    !(key in value) ||
    (value as ValueType)[key] === undefined
  ) {
    return defaultVal;
  }

  return get((value as ValueType)[key], splitQuery.slice(1), defaultVal);
}

export const isValidName = (name: string): boolean => {
  if (/\s{2}/.test(name)) {
    return false;
  }
  if (/[^-'a-zÀ-ÿ ]/gi.test(name)) {
    return false;
  }
  return true;
};

export const isValidEmail = (email: string): boolean =>
  // eslint-disable-next-line no-useless-escape
  /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );

export const capitalizeFirstLetter = ([first, ...rest]: string, locale = navigator.language) =>
  first === undefined ? '' : first.toLocaleUpperCase(locale) + rest.join('');

export const labelizeUserRole = (label: UserRole): string => {
  switch (label) {
    case UserRole.admin:
      return 'Administrateur';
    case UserRole.user:
      return 'Utilisateur';
    case UserRole.adherent:
      return 'Adhérent';
    case UserRole.student:
      return 'Étudiant';
    default:
      return 'Utilisateur';
  }
};

export const renderTime = (date: Date): string => {
  const time = date.toLocaleTimeString().split(':');
  return `${time[0]}h${time[1]}`;
};

export const stripHtml = (html: 'string'): string => {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
};

export const maskCard = (num: string): string => {
  return `${'*'.repeat(num.length - 4)}${num.substring(num.length - 4)}`;
};

/*
 * Returns true if the IBAN is valid
 * Returns FALSE if the IBAN's length is not as should be (for CY the IBAN Should be 28 chars long starting with CY )
 * Returns false (checksum) when the IBAN is invalid (check digits do not match)
 */
export const isValidIBANNumber = (input: string): boolean => {
  const iban = String(input)
    .toUpperCase()
    .replace(/[^A-Z0-9]/g, ''); // keep only alphanumeric characters
  const code = iban.match(/^([A-Z]{2})(\d{2})([A-Z\d]+)$/); // match and capture (1) the country code, (2) the check digits, and (3) the rest
  let digits;
  // check syntax and length
  if (!code || iban.length !== CODE_LENGTHS[code[1]]) {
    return false;
  }
  // rearrange country code and check digits, and convert chars to ints
  digits = (code[3] + code[1] + code[2]).replace(/[A-Z]/g, (letter: string): string => {
    return (letter.charCodeAt(0) - 55).toString();
  });
  // final check
  return mod97(digits) === 1;
};

const mod97 = (string: string): number => {
  let checksum = string.slice(0, 2) as unknown as number,
    fragment;
  for (var offset = 2; offset < string.length; offset += 7) {
    fragment = String(checksum) + string.substring(offset, offset + 7);
    checksum = (parseInt(fragment, 10) % 97) as number;
  }
  return checksum;
};

export const datesAreOnSameDay = (first: Date, second: Date) =>
  first.getFullYear() === second.getFullYear() &&
  first.getMonth() === second.getMonth() &&
  first.getDate() === second.getDate();

export const labelizeCustomerType = (status: CustomerTypes): string => {
  switch (status) {
    case CustomerTypes.restaurant:
      return 'Restaurant';
    case CustomerTypes.butcher:
      return 'Boucherie';
  }
};

