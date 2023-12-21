import * as Yup from 'yup';
import { isValidName } from './funcs';
import 'yup-phone';

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const zipCodeRegExp = /\d{2}[ ]?\d{3}/;

export const signupSchema = Yup.object().shape({
  lastName: Yup.string()
    .required('Le nom est obligatoire')
    .max(50, 'Le nom ne doit pas dépasser 50 caractères')
    .test({
      name: 'isValidLastName',
      test: (value: string | undefined, context: Yup.TestContext) =>
        value && isValidName(value)
          ? true
          : context.createError({
              message: 'Le nom contient des caractères spéciaux non autorisés',
            }),
    }),
  firstName: Yup.string()
    .required('Le prénom est obligatoire')
    .max(50, 'Le prénom ne doit pas dépasser 50 caractères')
    .test({
      name: 'isValidFirstName',
      test: (value: string | undefined, context: Yup.TestContext) =>
        value && isValidName(value)
          ? true
          : context.createError({
              message: 'Le prénom contient des caractères spéciaux non autorisés',
            }),
    }),
  email: Yup.string().required("L'email est obligatoire").email("L'email n'est pas valide"),
  password: Yup.string()
    .required('Le mot de passe est obligatoire')
    .min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  confirmPassword: Yup.string()
    .required('Le mot de passe est obligatoire')
    .oneOf([Yup.ref('password')], 'Les mots de passe ne sont pas identiques'),
  photo: Yup.mixed()
    .nullable()
    .notRequired()
    .test(
      'FILE_SIZE',
      'Le fichier dépasse les 2 Mo',
      (value: Yup.Maybe<File[] | null | undefined | any>) => {
        if (!value || !value.length) return true;
        const size = value[0].size / 1024 / 1024;
        if (size <= 2) return true;
        return false;
      }
    )
    .test(
      'FILE_TYPE',
      'Le fichier doit être une image',
      (value: Yup.Maybe<File[] | null | undefined | any>) => {
        if (!value || !value.length) return true;
        const file = value[0];
        if (file.type.includes('image/') && !file.type.includes('svg')) return true;
        return false;
      }
    ),
});

export const updateUserSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Le prénom est obligatoire')
    .max(50, 'Le prénom ne doit pas dépasser 50 caractères')
    .test({
      name: 'isValidFirstName',
      test: (value: string | undefined, context: Yup.TestContext) =>
        value && isValidName(value)
          ? true
          : context.createError({
              message: 'Le prénom contient des caractères spéciaux non autorisés',
            }),
    }),
  lastName: Yup.string()
    .required('Le nom est obligatoire')
    .max(50, 'Le nom ne doit pas dépasser 50 caractères')
    .test({
      name: 'isValidLastName',
      test: (value: string | undefined, context: Yup.TestContext) =>
        value && isValidName(value)
          ? true
          : context.createError({
              message: 'Le nom contient des caractères spéciaux non autorisés',
            }),
    }),
  email: Yup.string().email("L'email n'est pas valide").required("L'email est obligatoire"),
  phone: Yup.string().test({
    name: 'phone',
    test: (value: string | undefined, context: Yup.TestContext) =>
      !value
        ? true
        : phoneRegExp.test(value)
        ? true
        : context.createError({ message: "Le numéro de téléphone n'est pas valide" }),
  }),
  address: Yup.string().max(400, "L'adresse ne doit pas dépasser 400 caractères"),
  zipCode: Yup.string().test({
    name: 'zipCode',
    test: (value: string | undefined, context: Yup.TestContext) =>
      !value
        ? true
        : zipCodeRegExp.test(value)
        ? true
        : context.createError({ message: "Le code postal n'est pas valide" }),
  }),
  city: Yup.string().max(100, 'La ville ne doit pas dépasser 100 caractères'),
  password: Yup.string().test({
    name: 'password',
    test: (value: string | undefined, context: Yup.TestContext) =>
      !value
        ? true
        : value.length >= 6
        ? true
        : context.createError({ message: 'Le mot de passe doit contenir au moins 6 caractères' }),
  }),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Les mots de passe ne sont pas identiques')
    .nullable()
    .transform((v, o) => (o === '' ? undefined : v)),
  photo: Yup.mixed()
    .nullable()
    .notRequired()
    .test(
      'FILE_SIZE',
      'Le fichier dépasse les 2 Mo',
      (value: Yup.Maybe<File[] | null | undefined | any>) => {
        if (!value || !value.length) return true;
        const size = value[0].size / 1024 / 1024;
        if (size <= 2) return true;
        return false;
      }
    )
    .test(
      'FILE_TYPE',
      'Le fichier doit être une image',
      (value: Yup.Maybe<File[] | null | undefined | any>) => {
        if (!value || !value.length) return true;
        const file = value[0];
        if (file.type.includes('image/') && !file.type.includes('svg')) return true;
        return false;
      }
    ),
});

export const bookSchema = Yup.object().shape({
  title: Yup.string().required('Le titre est obligatoire'),
  author: Yup.string().required("L'auteur est obligatoire"),
  description: Yup.string().required('La description est obligatoire'),
  year: Yup.number().required("L'année de parution du livre est obligatoire"),
  language: Yup.array().of(Yup.string()).required('La langue est obligatoire'),
  numberOfPages: Yup.number().required('Le nombre de pages est obligatoire'),
  edition: Yup.string().required("L'édition est obligatoire"),
  isbn: Yup.string().required("L'ISBN est obligatoire"),
  ean13: Yup.string().required('Le code EAN13 est obligatoire'),
  coverPhoto: Yup.mixed()
    .nullable()
    .required()
    .test(
      'FILE_SIZE',
      'Le fichier dépasse les 2 Mo',
      (value: Yup.Maybe<File[] | null | undefined | any>) => {
        if (!value || !value.length) return true;
        const size = value[0].size / 1024 / 1024;
        if (size <= 2) return true;
        return false;
      }
    )
    .test(
      'FILE_TYPE',
      'Le fichier doit être une image',
      (value: Yup.Maybe<File[] | null | undefined | any>) => {
        if (!value || !value.length) return true;
        const file = value[0];
        if (file.type.includes('image/')) return true;
        return false;
      }
    ),
});

export const stockSchema = Yup.object().shape({
  externalHu: Yup.string().required('Le HU externe est obligatoire'),
  // externalHu: Yup.string().required('Le HU externe est obligatoire'),
  onlyOnSiteConsultation: Yup.bool(),
  // book: Yup.string().required(),
  // mektaba: Yup.string().required(),
  status: Yup.string().required(),
  // createdBy: Yup.string().required(),
 
});