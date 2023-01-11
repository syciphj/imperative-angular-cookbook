export interface AuthResponseData {
  idToken : string,
  email :string,
  refreshToken : 	string,
  expiresIn : string,
  localId : string,
  registered? : boolean
}

/** 
 * Instead of using an enum, it's simpler to use an object and cast as const. 
 * It will also help for later use with Object.keys (always strings) to use an index signature here as
 * {[key: string] : string}. See: https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums
 */
export const AuthResponseErrors : {[key: string] : string} = {
  EMAIL_EXISTS: 'This email exists already',
  OPERATION_NOT_ALLOWED: 'Password sign-in is disabled for this project.',
  TOO_MANY_ATTEMPTS_TRY_LATER: 'We have blocked all requests from this device due to unusual activity. Try again later.',
  EMAIL_NOT_FOUND: 'There is no user record corresponding to this identifier. The user may have been deleted.',
  INVALID_PASSWORD: 'The password is invalid or the user does not have a password.',
  USER_DISABLED: 'The user account has been disabled by an administrator.'
} as const