export class UserDto {
  exp: number;
  iat: number;
  jti: string;
  iss: string;
  sub: string;
  typ: string;
  azp: string;
  session_state: string;
  acr: string;
  scope: string;
  sid: string;
  email_verified: boolean;
  preferred_username: string;
  email?: string;
}
