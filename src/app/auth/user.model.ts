export class User {
  constructor(
      public id: string | null,
      public email : string | null,
      private _token : string,
      private _tokenExpirationDate : Date
  ) {}

  public get token() {
      if(!this._tokenExpirationDate || new Date() > this._tokenExpirationDate ) {
          return null;
      }
      return this._token;
  } 
}